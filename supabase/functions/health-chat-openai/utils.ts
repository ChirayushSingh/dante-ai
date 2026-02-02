export const RED_FLAG_KEYWORDS = [
  "chest pain",
  "severe shortness of breath",
  "difficulty breathing",
  "heavy bleeding",
  "unconscious",
  "passing out",
  "suicide",
  "severe allergic",
  "unable to breathe",
  "severe abdominal pain",
];

export function detectRedFlags(text: string) {
  const lower = (text || "").toLowerCase();
  return RED_FLAG_KEYWORDS.filter((k) => lower.includes(k));
}

// Basic PII scrubber - demo only
export function scrubPII(text: string) {
  let out = String(text || "");
  // redact emails
  out = out.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]");
  // redact phone numbers (simple heuristic)
  out = out.replace(/\+?\d[\d\s\-()]{7,}\d/g, "[REDACTED_PHONE]");
  // redact SSN-like patterns
  out = out.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[REDACTED_SSN]");
  return out;
}

export function simulateHipaaEncrypt(plaintext: string) {
  // This simulates encryption for a PoC: DO NOT use for real PHI
  return btoa(unescape(encodeURIComponent(plaintext)));
}
