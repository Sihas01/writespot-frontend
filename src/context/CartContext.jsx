import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { addCartItem, fetchCartItems, removeCartItem } from "../services/cartService";

const CartContext = createContext(null);

const buildAuthorName = (book) => {
  const first = book?.author?.firstName || book?.authorFirstName || "";
  const last = book?.author?.lastName || book?.authorLastName || "";
  const combined = `${first} ${last}`.trim();
  return combined || "Unknown Author";
};

const normalizeCartItems = (list = []) =>
  list.map((item) => {
    const book = item?.book || item?.bookDetails || item?.bookInfo || item;
    const bookId = item?.bookId || book?._id || book?.id || item?._id || item?.id;

    return {
      id: item?._id || item?.id || bookId,
      bookId,
      title: book?.title || "Untitled",
      authorName: buildAuthorName(book),
      price: Number(book?.price ?? item?.price ?? 0),
      coverUrl: book?.coverUrl || book?.coverImage || book?.cover || "",
      purchased: Boolean(book?.purchased || book?.isPurchased),
      raw: item,
    };
  });

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [selectedIds, setSelectedIds] = useState([]);

  const cartCount = items.length;

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => (selectedIds.includes(item.bookId) ? sum + Number(item.price || 0) : sum),
        0
      ),
    [items, selectedIds]
  );

  const loadCart = async () => {
    setLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const list = await fetchCartItems();
      const normalized = normalizeCartItems(list);
      setItems(normalized);
      setSelectedIds(normalized.map((item) => item.bookId).filter(Boolean));
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Unable to load cart" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const openCartPanel = async () => {
    setPanelOpen(true);
    if (!items.length) {
      await loadCart();
    }
  };

  const closeCartPanel = () => setPanelOpen(false);

  const addToCart = async ({ bookId, book, purchased }) => {
    setFeedback({ type: "", message: "" });
    if (!bookId) {
      const message = "Missing book id";
      setFeedback({ type: "error", message });
      return { ok: false, message };
    }

    if (purchased) {
      const message = "You already own this book";
      setFeedback({ type: "error", message });
      return { ok: false, message };
    }

    if (items.some((item) => item.bookId === bookId)) {
      const message = "Book already in cart";
      setFeedback({ type: "error", message });
      return { ok: false, alreadyInCart: true, message };
    }

    try {
      setActionLoading(true);
      await addCartItem(bookId);
      const updated = await fetchCartItems();
      const normalized = normalizeCartItems(updated);
      setItems(normalized);
      setSelectedIds(normalized.map((item) => item.bookId).filter(Boolean));

      const message = "Book added to cart";
      setFeedback({ type: "success", message });
      return { ok: true, message };
    } catch (err) {
      const message = err.message || "Unable to add to cart";
      setFeedback({ type: "error", message });
      return { ok: false, message };
    } finally {
      setActionLoading(false);
    }
  };

  const removeFromCart = async (bookId) => {
    if (!bookId) return;
    setFeedback({ type: "", message: "" });
    try {
      setActionLoading(true);
      const updated = await removeCartItem(bookId);
      const normalized = normalizeCartItems(updated);
      setItems(normalized);
      setSelectedIds((prev) => prev.filter((id) => id !== bookId));
      setFeedback({ type: "success", message: "Item removed" });
    } catch (err) {
      setFeedback({ type: "error", message: err.message || "Unable to remove item" });
    } finally {
      setActionLoading(false);
    }
  };

  const toggleSelection = (bookId) => {
    setSelectedIds((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const selectAll = () => setSelectedIds(items.map((item) => item.bookId));
  const clearSelection = () => setSelectedIds([]);

  const proceedToCheckout = () => {
    setFeedback({
      type: "info",
      message: "Proceed to checkout coming soon. Selected items saved.",
    });
  };

  const clearFeedback = () => setFeedback({ type: "", message: "" });

  const value = {
    items,
    cartCount,
    panelOpen,
    loading,
    actionLoading,
    feedback,
    selectedIds,
    subtotal,
    openCartPanel,
    closeCartPanel,
    loadCart,
    addToCart,
    removeFromCart,
    toggleSelection,
    selectAll,
    clearSelection,
    proceedToCheckout,
    clearFeedback,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};

