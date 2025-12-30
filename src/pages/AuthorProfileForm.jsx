import { useCallback, useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import {
  fetchProfileStatus,
  saveAuthorProfile,
} from "../services/authorService";

const MAX_BIO = 300;

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (error) => reject(error));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.9
    );
  });
};

const uploadToS3 = async (file) => {
  const presignResponse = await fetch(
    "https://h4urlwkjgd.execute-api.us-east-1.amazonaws.com/generate-upload-url",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileField: "profileImage",
        userRole: "author",
      }),
    }
  );

  if (!presignResponse.ok) {
    throw new Error("Failed to get upload URL");
  }

  const { uploadUrl, key } = await presignResponse.json();

  const uploadResult = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadResult.ok) {
    throw new Error("Failed to upload image");
  }

  return key;
};

const AuthorProfileForm = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState("");
  const [success, setSuccess] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [imageKey, setImageKey] = useState("");
  const [followersCount, setFollowersCount] = useState(0);

  const [formData, setFormData] = useState({
    bio: "",
    twitter: "",
    facebook: "",
    instagram: "",
    newsletterUrl: "",
  });

  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setAlert("");
      try {
        const res = await fetchProfileStatus();
        if (res?.hasProfile && res.profile) {
          setHasProfile(true);
          setFormData({
            bio: res.profile.bio || "",
            twitter: res.profile.socialLinks?.twitter || "",
            facebook: res.profile.socialLinks?.facebook || "",
            instagram: res.profile.socialLinks?.instagram || "",
            newsletterUrl: res.profile.newsletterUrl || "",
          });
          setExistingImageUrl(res.profile.profileImageUrl || "");
          setImageKey(res.profile.profileImage || "");
          setFollowersCount(res.profile.followersCount || 0);
        }
      } catch (err) {
        setAlert(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleImageSelect = (file) => {
    if (!file) return;
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setShowCropper(true);
  };

  const openCropperFromExisting = () => {
    if (existingImageUrl) {
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setPreviewUrl(existingImageUrl);
      setShowCropper(true);
    } else {
      document.getElementById("author-profile-image")?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleImageSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleImageSelect(file);
  };

  const handleSaveCrop = async () => {
    if (!previewUrl || !croppedAreaPixels) return;
    setUploadingImage(true);
    setAlert("");
    try {
      const blob = await getCroppedImg(previewUrl, croppedAreaPixels);
      const file = new File([blob], `profile-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      const key = await uploadToS3(file);
      setImageKey(key);
      setExistingImageUrl(URL.createObjectURL(blob));
      setShowCropper(false);
    } catch (err) {
      setAlert(err.message || "Failed to save image");
    } finally {
      setUploadingImage(false);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert("");
    setSuccess("");
    try {
      await saveAuthorProfile({
        bio: formData.bio.slice(0, MAX_BIO),
        profileImage: imageKey,
        socialLinks: {
          twitter: formData.twitter,
          facebook: formData.facebook,
          instagram: formData.instagram,
        },
        newsletterUrl: formData.newsletterUrl,
      });
      setHasProfile(true);
      setSuccess("Profile saved successfully");
    } catch (err) {
      setAlert(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const resetImage = () => {
    setImageKey("");
    setExistingImageUrl("");
    setSelectedImage(null);
    setPreviewUrl("");
  };

  const heroImage = useMemo(() => existingImageUrl, [existingImageUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700 font-nunito">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white shadow-sm rounded-xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500 font-nunito">
                {hasProfile ? "Edit your profile" : "Create your author profile"}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-[#074B03] font-nunito">
                Author Profile
              </h1>
            </div>
            <div className="text-sm text-gray-600 font-nunito">
              Followers: <span className="font-semibold text-gray-800">{followersCount}</span>
            </div>
          </div>

          {(alert || success) && (
            <div
              className={`mb-4 rounded-lg px-4 py-3 border ${
                alert
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-green-50 border-green-200 text-green-700"
              }`}
            >
              {alert || success}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-8">
            {/* Image uploader */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3 font-nunito">
                Profile Image
              </label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex items-center gap-4"
              >
                <div
                  className="w-28 h-28 rounded-full bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer relative"
                  onClick={openCropperFromExisting}
                >
                  {heroImage ? (
                    <img
                      src={heroImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-gray-500 text-center px-2">
                      Upload / Drag & Drop
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-nunito">
                    Use a clear square image. Click avatar to edit / crop.
                  </p>
                  <div className="flex gap-3">
                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#074B03] text-white text-sm cursor-pointer">
                      Upload Image
                      <input
                        id="author-profile-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    {heroImage && (
                      <button
                        type="button"
                        onClick={resetImage}
                        className="text-sm text-red-600 hover:text-red-700 font-nunito"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2 font-nunito">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bio: e.target.value.slice(0, MAX_BIO),
                  }))
                }
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#074B03]/50 font-nunito"
                placeholder="Share a short bio about your writing journey..."
              />
              <div className="text-xs text-gray-500 text-right mt-1 font-nunito">
                {formData.bio.length}/{MAX_BIO}
              </div>
            </div>

            {/* Social links */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 font-nunito">
                  X (Twitter)
                </label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3">
                  <FaXTwitter className="text-gray-500" />
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, twitter: e.target.value }))
                    }
                    className="w-full py-3 focus:outline-none font-nunito"
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 font-nunito">
                  Facebook
                </label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3">
                  <FaFacebook className="text-gray-500" />
                  <input
                    type="url"
                    value={formData.facebook}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        facebook: e.target.value,
                      }))
                    }
                    className="w-full py-3 focus:outline-none font-nunito"
                    placeholder="https://facebook.com/username"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 font-nunito">
                  Instagram
                </label>
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3">
                  <FaInstagram className="text-gray-500" />
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        instagram: e.target.value,
                      }))
                    }
                    className="w-full py-3 focus:outline-none font-nunito"
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 font-nunito">
                  Newsletter (optional)
                </label>
                <input
                  type="url"
                  value={formData.newsletterUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newsletterUrl: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#074B03]/50 font-nunito"
                  placeholder="https://substack.com/@you"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="px-6 py-3 rounded-lg bg-[#074B03] text-white font-semibold hover:opacity-90 disabled:opacity-70"
              >
                {saving ? "Saving..." : hasProfile ? "Update Profile" : "Create Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showCropper && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 font-nunito">
                Adjust your photo
              </h3>
              <button
                type="button"
                onClick={() => setShowCropper(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-[320px] bg-gray-100">
              <Cropper
                image={previewUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="text-sm text-gray-600 font-nunito">Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-[#074B03]"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCropper(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-nunito"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCrop}
                  disabled={uploadingImage}
                  className="px-5 py-2 rounded-lg bg-[#074B03] text-white font-semibold hover:opacity-90 disabled:opacity-70"
                >
                  {uploadingImage ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorProfileForm;

