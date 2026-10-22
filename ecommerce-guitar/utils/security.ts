import DOMPurify from "dompurify";

const ALLOWED_HTML_TAGS = [
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "span",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
];

const ALLOWED_HTML_ATTR = ["href", "src", "alt", "title", "target", "rel", "class", "style"];

export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) {
    return "";
  }

  if (typeof window === "undefined") {
    return rawHtml.replace(/<\s*(script|iframe|object|embed|link|meta|style)\b[\s\S]*?<\/\s*\1\s*>/gi, "");
  }

  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ALLOWED_HTML_TAGS,
    ALLOWED_ATTR: ALLOWED_HTML_ATTR,
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus"],
    ALLOW_DATA_ATTR: false,
  });
}

export function isSafeRedirectPath(value: string | null | undefined): boolean {
  if (!value || typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return false;
  }

  return !/^\s*javascript:/i.test(trimmed);
}

export function safeRedirectPathOrFallback(value: string | null | undefined, fallback = "/"): string {
  return isSafeRedirectPath(value) ? value!.trim() : fallback;
}

export function clampString(value: string, maxLength: number): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

export function stripControlCharacters(value: string): string {
  if (typeof value !== "string") {
    return "";
  }
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001F\u007F]/g, "");
}

export function sanitizeUserInput(value: string, maxLength: number): string {
  return clampString(stripControlCharacters(value).trim(), maxLength);
}
