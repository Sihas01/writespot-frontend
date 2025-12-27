import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-xl w-full p-8">
        <h1 className="text-3xl font-extrabold text-red-700 font-nunito mb-3">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 font-nunito mb-6">
          Your payment was not completed. If this was a mistake, you can return to the store and
          retry checkout.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate("/reader/dashboard/store")}
            className="flex-1 bg-[#5A7C65] text-white py-3 rounded-lg font-semibold hover:opacity-90"
          >
            Return to Store
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 border border-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-50"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;

