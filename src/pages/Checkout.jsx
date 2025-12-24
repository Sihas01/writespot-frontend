import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { items, subtotal, loading, loadCart } = useCart();
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const hasItems = useMemo(() => items.length > 0, [items]);

  useEffect(() => {
    if (!items.length) {
      loadCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const createAndSubmitForm = (params) => {
    const actionUrl = params.sandbox
      ? "https://sandbox.payhere.lk/pay/checkout"
      : "https://www.payhere.lk/pay/checkout";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = actionUrl;
    form.style.display = "none";

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handlePayNow = async () => {
    setError("");

    if (!hasItems) {
      setError("Your cart is empty. Please add a book before checkout.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to continue.");
      navigate("/login");
      return;
    }

    setPayLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { payhereParams, order } = res.data || {};

      if (!payhereParams?.merchant_id || !payhereParams?.hash) {
        throw new Error("Missing payment parameters from server.");
      }

      const origin = window.location.origin;
      const resolvedOrderId = order?.orderId || payhereParams.order_id;

      const params = {
        ...payhereParams,
        return_url:
          payhereParams.return_url ||
          `${origin}/reader/dashboard/thank-you?order_id=${resolvedOrderId || ""}`,
        cancel_url:
          payhereParams.cancel_url || `${origin}/reader/dashboard/payment-failed`,
      };

      if (resolvedOrderId) {
        sessionStorage.setItem("lastOrderId", resolvedOrderId);
      }

      createAndSubmitForm(params);
    } catch (err) {
      setError(err?.response?.data?.msg || err.message || "Unable to start payment.");
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="max-w-5xl mx-auto px-4 lg:px-0">
        <div className="flex items-center justify-between pt-10 pb-6">
          <div>
            <p className="text-sm font-nunito text-[#5A7C65] mb-1">Home / Checkout</p>
            <h1 className="text-3xl font-extrabold text-[#5A7C65] font-nunito">Checkout</h1>
            <p className="text-gray-600 mt-2 font-nunito">
              Review your books and continue to PayHere to complete the purchase.
            </p>
          </div>
          <button
            type="button"
            className="text-sm text-[#5A7C65] font-semibold hover:underline"
            onClick={() => navigate("/reader/dashboard/store")}
          >
            Continue shopping
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 font-nunito">
                  Order Summary
                </h2>
                {loading && <p className="text-sm text-gray-500 font-nunito">Loading cart...</p>}
              </div>

              <div className="divide-y divide-gray-100">
                {!items.length ? (
                  <div className="p-5 text-gray-600 font-nunito">
                    Your cart is empty. Add a book to proceed to checkout.
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.bookId} className="p-5 flex items-center gap-4">
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        className="w-16 h-20 object-contain rounded-md bg-gray-50 border"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 font-nunito">{item.title}</p>
                        <p className="text-sm text-gray-600 font-nunito">{item.authorName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800 font-nunito">
                          LKR {Number(item.price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 font-nunito">Payment</h3>
              <div className="flex items-center justify-between text-sm text-gray-700 font-nunito">
                <span>Subtotal</span>
                <span>LKR {Number(subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-700 font-nunito">
                <span>Currency</span>
                <span>LKR</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <span className="text-base font-semibold text-gray-800 font-nunito">Total</span>
                <span className="text-xl font-bold text-gray-900 font-nunito">
                  LKR {Number(subtotal || 0).toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={handlePayNow}
                disabled={!hasItems || payLoading || loading}
                className="w-full bg-[#5A7C65] text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {payLoading ? "Redirecting to PayHere..." : "Pay Now with PayHere"}
              </button>
              <p className="text-xs text-gray-500 font-nunito">
                You will be redirected to PayHere (sandbox) to securely complete your payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

