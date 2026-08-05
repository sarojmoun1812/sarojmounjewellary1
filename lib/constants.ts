/**
 * Her real contact details, in one place.
 *
 * These were previously copied into half a dozen components, so changing the
 * shop's phone number meant finding every one of them. Client and server code
 * can both import from here — this file must stay free of server-only imports.
 */

/** Digits only, including the country code, as wa.me requires. */
export const WHATSAPP_NUMBER = "918168790171";

/** E.164, for tel: links. */
export const PHONE_NUMBER = "+918168790171";

/** Spaced for display next to a "call us" label. */
export const PHONE_DISPLAY = "+91 81687 90171";

export const CONTACT_EMAIL = "sarojmounjewellary@gmail.com";

export const BUSINESS_NAME = "Saroj Moun Jewellery";

export const ADDRESS_LINES = [
  "B-90 Police Colony",
  "Jind, Haryana 126102",
  "India",
] as const;

export const ADDRESS_ONE_LINE = "B-90 Police Colony, Jind, Haryana 126102, India";

/**
 * Opening hours. The about page and contact page used to state two different
 * sets of hours; these are the contact page's, which are the ones she gave us.
 */
export const STORE_HOURS = [
  { days: "Monday – Friday", hours: "10:00 AM – 6:00 PM" },
  { days: "Saturday", hours: "10:00 AM – 4:00 PM" },
  { days: "Sunday", hours: "Closed" },
] as const;
