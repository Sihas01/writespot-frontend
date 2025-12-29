import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const SUPPORTED_TYPES = ["image/jpeg", "image/png"];
const BIO_MAX = 500;

const initialState = {
  bio: "",
  profileImageKey: "",
  profileImageThumbKey: "",
  website: "",
  twitter: "",
  facebook: "",
  instagram: "",
  linkedin: "",
};

const validateUrl = (url) => {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const createThumbnail = (file, size = 200) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }

        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create thumbnail"));
              return;
            }
            const thumbFile = new File([blob], `thumb-${file.name}`, { type: "image/jpeg" });
            resolve(thumbFile);
          },
          "image/jpeg",
          0.9
        );
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AuthorProfileForm = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [profileFile, setProfileFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!SUPPORTED_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Only JPG and PNG are supported." }));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((prev) => ({ ...prev, image: "Max file size is 5MB." }));
      return;
    }
    setErrors((prev) => ({ ...prev, image: "" }));
    setProfileFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const fetchProfile = async () => {
    if (!token) {
      setInitialLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/author-profiles/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profile = res.data?.profile || {};
      setForm({
        bio: profile.bio || "",
        profileImageKey: profile.profileImageKey || "",
        profileImageThumbKey: profile.profileImageThumbKey || "",
        website: profile.website || "",
        twitter: profile.socialLinks?.twitter || "",
        facebook: profile.socialLinks?.facebook || "",
        instagram: profile.socialLinks?.instagram || "",
        linkedin: profile.socialLinks?.linkedin || "",
      });
      const resolvedImage =
        profile.profileImageThumbUrl ||
        profile.profileImageUrl ||
        profile.profileImageMainUrl ||
        "";
      if (resolvedImage) {
        setPreviewUrl(resolvedImage);
      }
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.msg || "Failed to load profile" });
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const completeness = useMemo(() => {
    const imagePresent = Boolean(form.profileImageKey || form.profileImageThumbKey || previewUrl);
    const bioPresent = Boolean(form.bio?.trim());
    const linksPresent = Boolean(
      form.website?.trim() ||
        form.twitter?.trim() ||
        form.facebook?.trim() ||
        form.instagram?.trim() ||
        form.linkedin?.trim()
    );
    const total = 3;
    const score = [imagePresent, bioPresent, linksPresent].filter(Boolean).length;
    return Math.round((score / total) * 100);
  }, [form, previewUrl]);

  const hasBlockingErrors = useMemo(
    () => Boolean(form.bio.length > BIO_MAX || Object.values(errors).some(Boolean)),
    [errors, form.bio.length]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const validationErrors = {};
      if (form.bio.length > BIO_MAX) {
        validationErrors.bio = `Bio must be ${BIO_MAX} characters or fewer.`;
      }

      const urlFields = ["website", "twitter", "facebook", "instagram", "linkedin"];
      urlFields.forEach((field) => {
        if (!validateUrl(form[field])) {
          validationErrors[field] = "Enter a valid URL starting with http or https.";
        }
      });

      if (Object.keys(validationErrors).length) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }
      setErrors({});

      let profileImageKey = form.profileImageKey;
      let profileImageThumbKey = form.profileImageThumbKey;

      if (profileFile) {
        const thumbFile = await createThumbnail(profileFile, 200);

        const presignResponse = await fetch(
          "https://h4urlwkjgd.execute-api.us-east-1.amazonaws.com/generate-upload-url",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: profileFile.name,
              fileType: profileFile.type,
              fileField: "profileImage",
              userRole: "author",
            }),
          }
        );

        if (!presignResponse.ok) {
          throw new Error("Failed to get upload URL for profile image");
        }

        const { uploadUrl, key } = await presignResponse.json();

        const uploadResult = await fetch(uploadUrl, {
          method: "PUT",
          body: profileFile,
          headers: {
            "Content-Type": profileFile.type,
          },
        });

        if (!uploadResult.ok) {
          throw new Error("Failed to upload profile image");
        }

        profileImageKey = key;

        const presignThumbResponse = await fetch(
          "https://h4urlwkjgd.execute-api.us-east-1.amazonaws.com/generate-upload-url",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: thumbFile.name,
              fileType: thumbFile.type,
              fileField: "profileImageThumb",
              userRole: "author",
            }),
          }
        );

        if (!presignThumbResponse.ok) {
          throw new Error("Failed to get upload URL for profile thumbnail");
        }

        const { uploadUrl: thumbUploadUrl, key: thumbKey } = await presignThumbResponse.json();

        const uploadThumbResult = await fetch(thumbUploadUrl, {
          method: "PUT",
          body: thumbFile,
          headers: {
            "Content-Type": thumbFile.type,
          },
        });

        if (!uploadThumbResult.ok) {
          throw new Error("Failed to upload profile thumbnail");
        }

        profileImageThumbKey = thumbKey;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/author-profiles`,
        {
          bio: form.bio,
          profileImageKey,
          profileImageThumbKey,
          website: form.website,
          socialLinks: {
            twitter: form.twitter,
            facebook: form.facebook,
            instagram: form.instagram,
            linkedin: form.linkedin,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: "success", text: "Profile saved successfully." });
      setForm((prev) => ({ ...prev, profileImageKey, profileImageThumbKey }));
      if (profileFile) {
        setProfileFile(null);
      }
      // Refresh resolved image after save
      const refreshed = await axios.get(`${import.meta.env.VITE_API_URL}/author-profiles/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const refreshedProfile = refreshed.data?.profile || {};
      const refreshedImage =
        refreshedProfile.profileImageThumbUrl ||
        refreshedProfile.profileImageUrl ||
        refreshedProfile.profileImageMainUrl ||
        "";
      if (refreshedImage) {
        setPreviewUrl(refreshedImage);
        localStorage.setItem("profileImageUrl", refreshedImage);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.msg || "Failed to save profile",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-600 font-nunito">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-xl p-6 md:p-8 border border-gray-100">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#074B03] font-nunito">Author Profile</h1>
          <p className="text-gray-600 font-nunito mt-1">
            Share your bio, links, and image so readers can learn about you.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-[#5A7C65] transition-all"
                style={{ width: `${completeness}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 font-nunito">
              {completeness}%
            </span>
          </div>
        </div>

        {message.text && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg border font-nunito ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <label className="font-semibold text-gray-800 font-nunito">Profile Image</label>
            <div
              className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center gap-3 bg-gray-50 hover:border-[#5A7C65] transition cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                handleFileSelect(file);
              }}
              onClick={() => document.getElementById("profile-image-input")?.click()}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-nunito">
                  Add Image
                </div>
              )}
              <p className="text-sm text-gray-600 font-nunito text-center">
                Drag and drop or click to select a profile picture (JPG/PNG, up to 5MB)
              </p>
              {errors.image && (
                <p className="text-sm text-red-600 font-nunito">{errors.image}</p>
              )}
              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  handleFileSelect(file);
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-800 font-nunito">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A7C65] font-nunito"
              placeholder="Tell readers about yourself..."
            />
            <div className="flex items-center justify-between text-sm font-nunito">
              <span className="text-gray-500">Share a short intro about yourself.</span>
              <span
                className={`${
                  form.bio.length > BIO_MAX ? "text-red-600" : "text-gray-600"
                }`}
              >
                {form.bio.length}/{BIO_MAX}
              </span>
            </div>
            {errors.bio && <p className="text-sm text-red-600 font-nunito">{errors.bio}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800 font-nunito">Website</label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => handleChange("website", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A7C65] font-nunito"
                placeholder="https://yourwebsite.com"
              />
              {errors.website && <p className="text-sm text-red-600 font-nunito">{errors.website}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800 font-nunito">Twitter</label>
              <input
                type="url"
                value={form.twitter}
                onChange={(e) => handleChange("twitter", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A7C65] font-nunito"
                placeholder="https://twitter.com/username"
              />
              {errors.twitter && <p className="text-sm text-red-600 font-nunito">{errors.twitter}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800 font-nunito">Facebook</label>
              <input
                type="url"
                value={form.facebook}
                onChange={(e) => handleChange("facebook", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A7C65] font-nunito"
                placeholder="https://facebook.com/username"
              />
              {errors.facebook && <p className="text-sm text-red-600 font-nunito">{errors.facebook}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800 font-nunito">Instagram</label>
              <input
                type="url"
                value={form.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A7C65] font-nunito"
                placeholder="https://instagram.com/username"
              />
              {errors.instagram && <p className="text-sm text-red-600 font-nunito">{errors.instagram}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-800 font-nunito">LinkedIn</label>
              <input
                type="url"
                value={form.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A7C65] font-nunito"
                placeholder="https://linkedin.com/in/username"
              />
              {errors.linkedin && <p className="text-sm text-red-600 font-nunito">{errors.linkedin}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || hasBlockingErrors}
              className="bg-[#5A7C65] text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 disabled:opacity-70 font-nunito"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthorProfileForm;

