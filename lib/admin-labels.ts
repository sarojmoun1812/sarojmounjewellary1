/**
 * Hinglish labels for the admin panel.
 *
 * The status columns used to print the raw database value — PENDING, SHIPPED,
 * QUALIFIED — which tells the shop owner nothing about what she is meant to do
 * next. Every screen also spelled out its own wording and colour, so the same
 * status appeared differently on the list and the detail page.
 *
 * Keep the phrasing action-oriented: "Bhej diya" says what happened, where
 * "Shipped" is a category name.
 */

export interface StatusLabel {
  label: string;
  /** Tailwind classes for the badge. */
  className: string;
}

const FALLBACK: StatusLabel = {
  label: "—",
  className: "bg-charcoal-100 text-charcoal-700",
};

const ORDER_STATUS: Record<string, StatusLabel> = {
  PENDING: {
    label: "Confirm karna hai",
    className: "bg-amber-100 text-amber-800",
  },
  CONFIRMED: { label: "Confirm ho gaya", className: "bg-cyan-100 text-cyan-800" },
  PROCESSING: { label: "Ban raha hai", className: "bg-purple-100 text-purple-800" },
  SHIPPED: { label: "Bhej diya", className: "bg-blue-100 text-blue-800" },
  DELIVERED: { label: "Pahunch gaya", className: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancel ho gaya", className: "bg-red-100 text-red-800" },
};

const PAYMENT_STATUS: Record<string, StatusLabel> = {
  PENDING: { label: "Paisa aana hai", className: "bg-amber-100 text-amber-800" },
  PAID: { label: "Paisa mil gaya", className: "bg-green-100 text-green-800" },
  FAILED: { label: "Payment fail", className: "bg-red-100 text-red-800" },
  REFUNDED: { label: "Paisa wapas kiya", className: "bg-charcoal-100 text-charcoal-700" },
};

const LEAD_STATUS: Record<string, StatusLabel> = {
  NEW: { label: "Naya — baat karni hai", className: "bg-amber-100 text-amber-800" },
  CONTACTED: { label: "Baat ho gayi", className: "bg-sky-100 text-sky-800" },
  QUALIFIED: { label: "Interested hai", className: "bg-purple-100 text-purple-800" },
  CONVERTED: { label: "Order kar diya", className: "bg-green-100 text-green-800" },
  LOST: { label: "Baat nahi bani", className: "bg-charcoal-100 text-charcoal-700" },
};

/** Where an enquiry came from. */
const LEAD_SOURCE: Record<string, string> = {
  CONTACT_FORM: "Contact form",
  PRODUCT_INQUIRY: "Product ke baare mein poocha",
  EXIT_INTENT: "Website chhodte waqt",
  POPUP: "Website popup",
  NEWSLETTER: "Newsletter",
  CALLBACK_REQUEST: "Call back maanga",
  WHATSAPP: "WhatsApp order",
  WEBSITE: "Website",
};

const PAYMENT_METHOD: Record<string, string> = {
  WHATSAPP: "WhatsApp par",
  COD: "Delivery par cash",
  UPI: "UPI",
  BANK_TRANSFER: "Bank transfer",
};

export function orderStatusLabel(status: string): StatusLabel {
  return ORDER_STATUS[status] ?? { ...FALLBACK, label: status };
}

export function paymentStatusLabel(status: string): StatusLabel {
  return PAYMENT_STATUS[status] ?? { ...FALLBACK, label: status };
}

export function leadStatusLabel(status: string): StatusLabel {
  return LEAD_STATUS[status] ?? { ...FALLBACK, label: status };
}

/** Unknown values fall through unchanged rather than showing a blank cell. */
export function leadSourceLabel(source: string): string {
  return LEAD_SOURCE[source] ?? source;
}

export function paymentMethodLabel(method: string): string {
  return PAYMENT_METHOD[method] ?? method;
}

/** The options offered when changing an order's status, in workflow order. */
export const ORDER_STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

/** The options offered when changing an enquiry's status. */
export const LEAD_STATUS_OPTIONS = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "LOST",
] as const;

/**
 * Sources the site actually writes, so the filter dropdown can only offer
 * values that exist. Keep in step with the `source` fields in app/api/*.
 */
export const LEAD_SOURCE_OPTIONS = [
  "CONTACT_FORM",
  "PRODUCT_INQUIRY",
  "EXIT_INTENT",
  "POPUP",
  "CALLBACK_REQUEST",
  "NEWSLETTER",
  "WHATSAPP",
] as const;
