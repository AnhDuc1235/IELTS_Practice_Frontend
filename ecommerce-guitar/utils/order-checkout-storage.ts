export const LATEST_ORDER_STORAGE_KEY = "latest_checkout_order";

export interface LatestCheckoutOrderSnapshot {
  orderId: string;
  paymentMethod: string;
  qrUrl: string | null;
  totalAmount: string;
}

export function readLatestCheckoutOrder(): LatestCheckoutOrderSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(LATEST_ORDER_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as LatestCheckoutOrderSnapshot;
    if (!parsed.orderId || !parsed.paymentMethod) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeLatestCheckoutOrder(snapshot: LatestCheckoutOrderSnapshot): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(LATEST_ORDER_STORAGE_KEY, JSON.stringify(snapshot));
}
