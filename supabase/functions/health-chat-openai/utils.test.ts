import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { scrubPII, detectRedFlags, simulateHipaaEncrypt } from "./utils.ts";

Deno.test("scrubPII redacts emails, phones, SSN, DOB, credit cards, and MRN-like tokens", () => {
  const text = "Contact: john.doe@example.com / +1 (555) 123-4567 / SSN 123-45-6789 / DOB 02/14/1985 / Card 4111 1111 1111 1111 / MRN: 987654";
  const scrubbed = scrubPII(text);
  console.log(scrubbed);
  if (scrubbed.includes("john.doe@example.com") || scrubbed.includes("+1 (555) 123-4567") || scrubbed.includes("123-45-6789") || scrubbed.includes("02/14/1985") || scrubbed.includes("4111 1111 1111 1111") || scrubbed.includes("MRN: 987654")) {
    throw new Error("PII not redacted");
  }
  assertEquals(scrubbed.includes("[REDACTED_EMAIL]"), true);
  assertEquals(scrubbed.includes("[REDACTED_PHONE]"), true);
  assertEquals(scrubbed.includes("[REDACTED_SSN]"), true);
  assertEquals(scrubbed.includes("[REDACTED_DOB]"), true);
  assertEquals(scrubbed.includes("[REDACTED_CREDIT_CARD]"), true);
  assertEquals(scrubbed.includes("[REDACTED_MRN]"), true);
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
