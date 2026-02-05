import { useState } from "react";
import { submitReport } from "../services/reportService";

// Reason options by target type
const REPORT_REASONS = {
  Author: ["Impersonation", "Fake Profile", "Hate Speech", "Spam"],
  Book: [
    "Copyright Violation / Plagiarism",
    "Inappropriate / Offensive Content",
    "Privacy Violation / Doxxing",
    "Encouraging Dangerous or Illegal Acts",
  ],
  Review: ["Harassment", "Spoilers", "Spam", "Hate Speech"],
};

const ReportModal = ({ isOpen, onClose, targetId, targetType }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Map frontend targetType to backend targetModel
  const getTargetModel = (type) => {
    switch (type) {
      case "Author":
        return "User";
      case "Book":
        return "Book";
      case "Review":
        return "Review";
      default:
        return type;
    }
  };

  const handleSubmit = async () => {
    if (!reason) {
      setError("Please select a reason for your report");
      return;
    }

    setLoading(true);
    setError("");

    const result = await submitReport(
      targetId,
      getTargetModel(targetType),
      reason,
      details
    );

    setLoading(false);

    if (result.success) {
      // Reset form and close
      setReason("");
      setDetails("");
      onClose();
      // Show success feedback
      alert("Report submitted successfully. Thank you for your feedback.");
    } else {
      // Handle specific errors
      if (result.error === "You have already reported this") {
        setError("You have already reported this.");
      } else if (result.error?.includes("purchased")) {
        setError("You can only report books you have purchased.");
      } else {
        setError(result.error || "Failed to submit report. Please try again.");
      }
    }
  };

  const handleClose = () => {
    setReason("");
    setDetails("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  const reasons = REPORT_REASONS[targetType] || [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-gray-800 font-nunito">
          Report {targetType}
        </h3>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-nunito">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="report-reason"
            className="block text-sm font-medium text-gray-700 mb-2 font-nunito"
          >
            Reason for Report <span className="text-red-500">*</span>
          </label>
          <select
            id="report-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5A7C65] font-nunito text-gray-800"
          >
            <option value="">Select a reason...</option>
            {reasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="report-details"
            className="block text-sm font-medium text-gray-700 mb-2 font-nunito"
          >
            Additional Details <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            id="report-details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Provide any additional context that might help us review this report..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5A7C65] min-h-[100px] resize-none font-nunito text-gray-800"
            maxLength={1000}
          />
          <p className="text-xs text-gray-400 mt-1 font-nunito">
            {details.length}/1000 characters
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-nunito font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !reason}
            className="px-4 py-2 bg-[#5A7C65] text-white rounded-lg hover:bg-[#4a6b55] font-nunito font-medium disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
