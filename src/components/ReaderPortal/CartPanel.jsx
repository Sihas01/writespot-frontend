import { useEffect, useRef } from "react";
import { FiX, FiTrash2 } from "react-icons/fi";
import { useCart } from "../../context/CartContext";

const CartPanel = () => {
  const {
    items,
    panelOpen,
    loading,
    actionLoading,
    feedback,
    selectedIds,
    subtotal,
    closeCartPanel,
    removeFromCart,
    toggleSelection,
    proceedToCheckout,
    selectAll,
    clearSelection,
  } = useCart();

  if (!panelOpen) return null;

  const allSelected = items.length > 0 && selectedIds.length === items.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < items.length;
  const selectAllRef = useRef(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected]);

  const renderFeedback = () => {
    if (!feedback?.message) return null;
    const color =
      feedback.type === "error"
        ? "text-red-700 bg-red-50 border-red-200"
        : feedback.type === "success"
        ? "text-green-700 bg-green-50 border-green-200"
        : "text-blue-700 bg-blue-50 border-blue-200";

    return (
      <div className={`border ${color} rounded-lg px-3 py-2 text-sm font-nunito`}>
        {feedback.message}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeCartPanel}
        aria-label="Close cart overlay"
      />

      <aside className="relative h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        <header className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <p className="text-sm font-nunito text-gray-500">Your Cart</p>
            <h3 className="text-xl font-semibold text-gray-800 font-nunito">
              {items.length} item{items.length === 1 ? "" : "s"}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeCartPanel}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close cart"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </header>

        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {renderFeedback()}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-nunito text-gray-700">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allSelected}
                onChange={() => (allSelected ? clearSelection() : selectAll())}
                className="h-4 w-4 accent-[#5A7C65] align-middle"
              />
              Select all
            </label>
            <span className="text-xs text-gray-500 font-nunito">
              {selectedIds.length}/{items.length} selected
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="h-5 w-5 bg-gray-100 rounded"></div>
                  <div className="h-20 w-16 bg-gray-100 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center text-gray-500 font-nunito py-10">
              Your cart is empty.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 border border-gray-100 rounded-lg p-3 shadow-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.bookId)}
                  onChange={() => toggleSelection(item.bookId)}
                  className="mt-0.5 h-4 w-4 accent-[#5A7C65] align-middle"
                  aria-label="Select for checkout"
                />

                <div className="w-16 h-20 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                  {item.coverUrl ? (
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-nunito">
                      No cover
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 font-nunito truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 font-nunito truncate">{item.authorName}</p>
                  <p className="text-sm font-semibold text-[#2E8B57] mt-1">
                    {item.price ? `LKR ${item.price}` : "Free"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.bookId)}
                  disabled={actionLoading}
                  className="p-2 rounded-full hover:bg-red-50 text-red-600 disabled:opacity-60"
                  aria-label="Remove from cart"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 p-4 space-y-3 bg-white">
          <div className="flex items-center justify-between font-nunito text-gray-800">
            <span>Subtotal ({selectedIds.length} selected)</span>
            <span className="font-semibold text-lg">
              {subtotal ? `LKR ${subtotal.toFixed(2)}` : "LKR 0.00"}
            </span>
          </div>

          <button
            type="button"
            onClick={proceedToCheckout}
            disabled={!selectedIds.length || actionLoading}
            className="w-full bg-[#5A7C65] text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60"
          >
            Proceed to Checkout
          </button>
        </div>
      </aside>
    </div>
  );
};

export default CartPanel;

