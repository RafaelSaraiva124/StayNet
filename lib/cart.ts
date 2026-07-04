export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  const cartData = sessionStorage.getItem("cart");
  if (!cartData) return [];

  try {
    return JSON.parse(cartData);
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("cart", JSON.stringify(items));

  window.dispatchEvent(new Event("cartUpdated"));
}

export function addToCart(item: Omit<CartItem, "id" | "addedAt">): CartItem {
  const cart = getCart();

  const newItem: CartItem = {
    ...item,
    id: `${item.roomId}-${Date.now()}`,
    addedAt: Date.now(),
  };

  cart.push(newItem);
  saveCart(cart);

  return newItem;
}

export function removeFromCart(itemId: string): void {
  const cart = getCart();
  const filtered = cart.filter((item) => item.id !== itemId);
  saveCart(filtered);
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("cart");
  window.dispatchEvent(new Event("cartUpdated"));
}

export function getCartTotal(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + parseFloat(item.totalPrice), 0);
}

export function getCartCount(): number {
  return getCart().length;
}
