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

// Basic PII scrubber - demo only (expanded)
export function scrubPII(text: string) {
  let out = String(text || "");
  // redact emails
  out = out.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]");
  // redact phone numbers (simple heuristic)
  out = out.replace(/\+?\d[\d\s\-()]{7,}\d/g, "[REDACTED_PHONE]");
  // redact SSN-like patterns
  out = out.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[REDACTED_SSN]");

  // redact common date-of-birth patterns (MM/DD/YYYY, M/D/YY, YYYY-MM-DD)
  out = out.replace(/\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}-\d{2}-\d{2})\b/g, "[REDACTED_DOB]");

  // redact long digit sequences likely to be credit cards (13-16 digits, allow spaces/dashes)
  out = out.replace(/\b(?:\d[ \-]?){13,16}\b/g, "[REDACTED_CREDIT_CARD]");

  // redact MRN-like tokens (e.g., MRN: 123456)
  out = out.replace(/\bMRN[:\s]*\d+\b/gi, "[REDACTED_MRN]");

  // redact passport-like tokens (alphanumeric 6-9 chars, heuristic)
  out = out.replace(/\b[A-Z0-9]{6,9}\b/g, (match) => {
    // avoid clobbering short words like 'MED' etc - only redact if contains a digit
    return /\d/.test(match) ? "[REDACTED_ID]" : match;
  });

  return out;
}


export function simulateHipaaEncrypt(plaintext: string) {
  // This simulates encryption for a PoC: DO NOT use for real PHI
  return btoa(unescape(encodeURIComponent(plaintext)));
}
