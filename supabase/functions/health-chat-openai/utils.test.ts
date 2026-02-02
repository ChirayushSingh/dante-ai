import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { scrubPII, detectRedFlags, simulateHipaaEncrypt } from "./utils.ts";

Deno.test("scrubPII redacts emails, phones, and SSN-like strings", () => {
  const text = "Contact me at john.doe@example.com or +1 (555) 123-4567. My SSN is 123-45-6789.";
  const scrubbed = scrubPII(text);
  console.log(scrubbed);
  if (scrubbed.includes("john.doe@example.com") || scrubbed.includes("+1 (555) 123-4567") || scrubbed.includes("123-45-6789")) {
    throw new Error("PII not redacted");
  }
  assertEquals(scrubbed.includes("[REDACTED_EMAIL]"), true);
  assertEquals(scrubbed.includes("[REDACTED_PHONE]"), true);
  assertEquals(scrubbed.includes("[REDACTED_SSN]"), true);
});

Deno.test("detectRedFlags finds known keywords", () => {
  const content = "I have chest pain and difficulty breathing";
  const found = detectRedFlags(content);
  assertEquals(found.length >= 1, true);
  assertEquals(found.includes("chest pain"), true);
});

Deno.test("simulateHipaaEncrypt returns non-empty base64 string", () => {
  const enc = simulateHipaaEncrypt("hello world");
  assertEquals(typeof enc, "string");
  assertEquals(enc.length > 0, true);
});
