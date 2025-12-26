import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const currencyFormatter = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  minimumFractionDigits: 2,
});

const formatCurrency = (value) => currencyFormatter.format(value || 0);

const Toast = ({ message, type }) => {
  if (!message) return null;
  const base =
    "fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg transition-all";
  const tone =
    type === "error"
      ? "bg-red-100 text-red-800 border border-red-200"
      : "bg-green-100 text-green-800 border border-green-200";
  return <div className={`${base} ${tone}`}>{message}</div>;
};

const AuthorRevenue = () => {
  const [summary, setSummary] = useState(null);
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    accountNumber: "",
    bankName: "",
    holderName: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const token = localStorage.getItem("token");
  const apiBase = import.meta.env.VITE_API_URL;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type }), 3000);
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/revenue/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to load summary", "error");
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/revenue/by-book`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data?.data || []);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to load earnings by book", "error");
    }
  };

  const fetchTransactions = async (page = 1, append = false) => {
    try {
      if (append) setHistoryLoading(true);
      const res = await axios.get(`${apiBase}/api/revenue/history?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = res.data?.data || [];
      setTransactions((prev) => (append ? [...prev, ...list] : list));
      if (res.data?.pagination) {
        setPagination({
          page: res.data.pagination.page,
          totalPages: res.data.pagination.totalPages,
        });
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to load transactions", "error");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchSummary(), fetchBooks(), fetchTransactions(1, false)]);
      setLoading(false);
    };
    load();
  }, []);

  const canWithdraw = useMemo(() => {
    if (!summary) return false;
    return Number(summary.currentBalance || 0) >= 1000;
  }, [summary]);

  const openWithdraw = () => {
    if (!canWithdraw) {
      showToast("Minimum balance not reached", "error");
      return;
    }
    setModalOpen(true);
  };

  const closeWithdraw = () => {
    setModalOpen(false);
    setWithdrawForm({
      amount: "",
      accountNumber: "",
      bankName: "",
      holderName: "",
      notes: "",
    });
    setFormErrors({});
  };

  const validateWithdraw = () => {
    const errors = {};
    const amountNumber = Number(withdrawForm.amount);

    if (!withdrawForm.amount || Number.isNaN(amountNumber)) {
      errors.amount = "Amount is required";
    } else if (amountNumber < 1000) {
      errors.amount = "Amount must be at least LKR 1,000";
    } else if (summary && amountNumber > summary.currentBalance) {
      errors.amount = "Amount exceeds available balance";
    }

    if (!withdrawForm.accountNumber.trim()) errors.accountNumber = "Account number is required";
    if (!withdrawForm.bankName.trim()) errors.bankName = "Bank name is required";
    if (!withdrawForm.holderName.trim()) errors.holderName = "Account holder name is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitWithdraw = async (e) => {
    e.preventDefault();
    if (!validateWithdraw()) return;
    setWithdrawLoading(true);
    try {
      await axios.post(
        `${apiBase}/api/revenue/withdraw`,
        {
          amount: Number(withdrawForm.amount),
          bankDetails: {
            accountNumber: withdrawForm.accountNumber,
            bankName: withdrawForm.bankName,
            holderName: withdrawForm.holderName,
            notes: withdrawForm.notes,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Withdrawal requested successfully");
      closeWithdraw();
      await Promise.all([fetchSummary(), fetchTransactions(1, false)]);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to submit withdrawal", "error");
    } finally {
      setWithdrawLoading(false);
    }
  };

  const renderBookRow = (book) => (
    <tr key={book.bookId} className="border-b last:border-b-0">
      <td className="px-4 py-3">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-12 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
            No Cover
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="font-semibold text-gray-800">{book.title}</div>
        {book.author && (
          <div className="text-sm text-gray-500">{book.author}</div>
        )}
      </td>
      <td className="px-4 py-3 text-center text-gray-700">{book.totalQuantity || 0}</td>
      <td className="px-4 py-3 text-right text-gray-800 font-semibold">
        {formatCurrency(book.totalEarnings)}
      </td>
    </tr>
  );

  const renderTransaction = (tx) => {
    const isCredit = tx.type === "CREDIT";
    return (
      <div
        key={tx._id}
        className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex justify-between items-start shadow-sm"
      >
        <div>
          <p className="text-gray-800 font-semibold">{tx.description || "Transaction"}</p>
          <p className="text-sm text-gray-500">
            {new Date(tx.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className={`font-semibold ${isCredit ? "text-green-600" : "text-red-500"}`}>
          {isCredit ? "+" : "-"} {formatCurrency(tx.amount)}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 lg:px-32 py-6">
        <p className="text-gray-600">Loading revenue data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 lg:px-32 py-6 space-y-10">
      <Toast message={toast.message} type={toast.type} />

      <header>
        <h2 className="text-2xl md:text-3xl font-nunito font-semibold text-[#5A7C65]">
          Revenue Dashboard
        </h2>
      </header>

      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Current Available Balance</p>
            <p className="text-3xl md:text-4xl font-semibold text-gray-900">
              {formatCurrency(summary?.currentBalance)}
            </p>
          </div>
          <button
            onClick={openWithdraw}
            className="self-start md:self-center bg-[#074B03] text-white px-5 py-2 rounded-md hover:bg-[#063b02] transition disabled:opacity-60"
            disabled={!canWithdraw}
          >
            Withdraw Funds
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center">
          <div className="border border-gray-200 rounded-xl py-4">
            <p className="text-gray-500 text-sm">Total Earnings</p>
            <p className="text-xl font-semibold text-gray-900">
              {formatCurrency(summary?.totalEarnings)}
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl py-4">
            <p className="text-gray-500 text-sm">Total Withdrawn</p>
            <p className="text-xl font-semibold text-gray-900">
              {formatCurrency(summary?.totalWithdrawn)}
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl py-4">
            <p className="text-gray-500 text-sm">This Month</p>
            <p className="text-xl font-semibold text-gray-900">
              {formatCurrency(summary?.thisMonthEarnings)}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 font-nunito">Earning By Book</h3>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr className="text-gray-600 text-sm">
                  <th className="px-4 py-3 font-medium">Cover Page</th>
                  <th className="px-4 py-3 font-medium">Details</th>
                  <th className="px-4 py-3 font-medium text-center">Total Sold</th>
                  <th className="px-4 py-3 font-medium text-right">Earnings</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {books.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                      No earnings data yet.
                    </td>
                  </tr>
                )}
                {books.map(renderBookRow)}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 font-nunito">Transaction History</h3>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 space-y-3">
          {transactions.length === 0 && (
            <p className="text-gray-500 text-center py-4">No transactions yet.</p>
          )}
          {transactions.map(renderTransaction)}
        </div>
        {pagination.page < pagination.totalPages && (
          <div className="text-center">
            <button
              onClick={() => fetchTransactions(pagination.page + 1, true)}
              disabled={historyLoading}
              className="text-[#074B03] font-medium hover:underline disabled:opacity-60"
            >
              {historyLoading ? "Loading..." : "View More"}
            </button>
          </div>
        )}
      </section>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
            <button
              onClick={closeWithdraw}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Withdraw Funds</h3>
            <p className="text-sm text-gray-500 mb-4">
              Minimum amount LKR 1,000. Available: {formatCurrency(summary?.currentBalance)}
            </p>
            <form className="space-y-4" onSubmit={submitWithdraw}>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Amount (LKR)</label>
                <input
                  type="number"
                  min="0"
                  value={withdrawForm.amount}
                  onChange={(e) =>
                    setWithdrawForm((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A7C65] ${
                    formErrors.amount ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="1500"
                />
                {formErrors.amount && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={withdrawForm.accountNumber}
                  onChange={(e) =>
                    setWithdrawForm((prev) => ({ ...prev, accountNumber: e.target.value }))
                  }
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A7C65] ${
                    formErrors.accountNumber ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="1234567890"
                />
                {formErrors.accountNumber && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.accountNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={withdrawForm.bankName}
                    onChange={(e) =>
                      setWithdrawForm((prev) => ({ ...prev, bankName: e.target.value }))
                    }
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A7C65] ${
                      formErrors.bankName ? "border-red-400" : "border-gray-200"
                    }`}
                    placeholder="Sample Bank"
                  />
                  {formErrors.bankName && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.bankName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={withdrawForm.holderName}
                    onChange={(e) =>
                      setWithdrawForm((prev) => ({ ...prev, holderName: e.target.value }))
                    }
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A7C65] ${
                      formErrors.holderName ? "border-red-400" : "border-gray-200"
                    }`}
                    placeholder="Author Name"
                  />
                  {formErrors.holderName && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.holderName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={withdrawForm.notes}
                  onChange={(e) =>
                    setWithdrawForm((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-[#5A7C65]"
                  placeholder="Any additional information..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeWithdraw}
                  className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={withdrawLoading}
                  className="px-5 py-2 rounded-md bg-[#074B03] text-white hover:bg-[#063b02] transition disabled:opacity-60"
                >
                  {withdrawLoading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorRevenue;

