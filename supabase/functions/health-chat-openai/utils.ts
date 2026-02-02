import { parsePhoneNumberFromString } from "https://esm.sh/libphonenumber-js@1.9.51";
import nlp from "https://esm.sh/compromise@13.12.0";
import peoplePlugin from "https://esm.sh/compromise-people@0.1.1";

nlp.extend(peoplePlugin);

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

// Luhn algorithm to validate credit card numbers
export function luhnCheck(cc: string) {
  const sanitized = cc.replace(/[^0-9]/g, "");
  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

// Enhanced PII scrubber using libphonenumber-js for better phone detection and Luhn for card validation
export function scrubPII(text: string) {
  let out = String(text || "");

  // redact emails
  out = out.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]");

  // redact SSN-like patterns
  out = out.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[REDACTED_SSN]");

  // redact common date-of-birth patterns (MM/DD/YYYY, M/D/YY, YYYY-MM-DD)
  out = out.replace(/\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}-\d{2}-\d{2})\b/g, "[REDACTED_DOB]");

  // redact MRN-like tokens (e.g., MRN: 123456)
  out = out.replace(/\bMRN[:\s]*\d+\b/gi, "[REDACTED_MRN]");


  // redact phone numbers using libphonenumber-js (handles international formats)
  try {
    // Simple approach: find groups of characters that could be phone numbers and test
    const possiblePhones = out.match(/(?:\+?\d[\d\s\-()]{6,}\d)/g) || [];
    // candidates found by regex
    for (const p of possiblePhones) {
      const parsed = parsePhoneNumberFromString(p);
      if (parsed && typeof parsed.isValid === "function" && parsed.isValid() && parsed.number) {
        out = out.replace(p, "[REDACTED_PHONE]");
      }
    }
  } catch (e) {
    // fallback: noop
    console.warn("phone detection failed", e);
  }

  // Additional fallback: redact digit groups that look like phone numbers (7-15 digits), allow leading + or 00
  // Fallback: find any candidate substring of separators/digits/paren and redact if digit count between 7 and 15
  const phoneFallbacks = out.match(/[\d\-\s()+]{7,}/g) || [];
  for (const p of phoneFallbacks) {
    const digitsOnly = p.replace(/[^0-9]/g, "");
    if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
      out = out.replace(p, "[REDACTED_PHONE]");
    }
  }

  // redact credit card numbers using Luhn + regex to find candidate sequences
  const ccCandidates = out.match(/\b(?:\d[ \-]?){13,19}\b/g) || [];
  for (const candidate of ccCandidates) {
    const sanitized = candidate.replace(/[^0-9]/g, "");
    if (sanitized.length >= 13 && sanitized.length <= 19 && luhnCheck(sanitized)) {
      out = out.replace(candidate, "[REDACTED_CREDIT_CARD]");
    }
  }

  // Use compromise NLP to detect people and places and redact them (best-effort)
  try {
    const doc = nlp(out);
    const people = doc.people().out('array');
    for (const p of people) {
      if (p && p.trim()) out = out.replace(p, "[REDACTED_NAME]");
    }

    // places (cities, addresses) — compromise places tends to find named places
    const places = doc.places().out('array');
    for (const pl of places) {
      if (pl && pl.trim()) out = out.replace(pl, "[REDACTED_LOCATION]");
    }
  } catch (e) {
    console.warn('NLP PII detection failed', e);
  }

  // redact passport-like tokens (alphanumeric 6-9 chars) but only if contains a digit (heuristic)
  out = out.replace(/\b[A-Z0-9]{6,9}\b/g, (match) => ( /\d/.test(match) ? "[REDACTED_ID]" : match ));

  return out;
}


export function simulateHipaaEncrypt(plaintext: string) {
  // This simulates encryption for a PoC: DO NOT use for real PHI
  return btoa(unescape(encodeURIComponent(plaintext)));
}
