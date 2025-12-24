import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const terminalStatuses = ["COMPLETED", "FAILED", "CANCELED"];

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialOrderId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("order_id") || sessionStorage.getItem("lastOrderId") || "";
  }, [location.search]);

  const [orderId] = useState(initialOrderId);
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(Boolean(initialOrderId));
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("Missing order reference. Please try your purchase again.");
      return;
    }

    let active = true;
    let currentStatus = "PENDING";

    const pollStatus = async (count = 0) => {
      if (!active) return;
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please log in to view your order.");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/payments/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const nextStatus = res.data?.order?.status || currentStatus;
        currentStatus = nextStatus;
        setStatus(nextStatus);
        setAttempts(count);

        if (terminalStatuses.includes(nextStatus)) {
          setLoading(false);
          return;
        }
      } catch (err) {
        setError(err?.response?.data?.msg || err.message || "Unable to fetch order status.");
      }

      if (count < 8) {
        setTimeout(() => pollStatus(count + 1), 1800);
      } else {
        setLoading(false);
      }
    };

    pollStatus(0);

    return () => {
      active = false;
    };
  }, [orderId]);

  const isSuccess = status === "COMPLETED";
  const isFailure = status === "FAILED" || status === "CANCELED";

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-xl w-full p-8">
        <h1 className="text-3xl font-extrabold text-[#5A7C65] font-nunito mb-2">
          {isSuccess ? "Payment Successful" : "Processing Payment"}
        </h1>
        <p className="text-gray-600 font-nunito mb-6">
          Order ID: {orderId || "Unavailable"}
        </p>

        {loading && (
          <div className="mb-4 text-sm text-gray-600 font-nunito">
            Confirming your payment with PayHere...
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {isSuccess && (
          <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-lg border border-green-200">
            Your books are being added to your library. A receipt will be emailed shortly.
          </div>
        )}

        {isFailure && (
          <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-200">
            Payment did not complete. You can retry from the store.
          </div>
        )}

        {!loading && !isSuccess && !isFailure && (
          <div className="mb-6 bg-yellow-50 text-yellow-800 px-4 py-3 rounded-lg border border-yellow-200">
            Still waiting for confirmation... Attempts {attempts + 1}/9
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate("/reader/dashboard/store")}
            className="flex-1 bg-[#5A7C65] text-white py-3 rounded-lg font-semibold hover:opacity-90"
          >
            Back to Store
          </button>
          <button
            type="button"
            onClick={() => navigate("/reader/dashboard")}
            className="flex-1 border border-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-50"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;

