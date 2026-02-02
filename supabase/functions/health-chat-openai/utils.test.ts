import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { scrubPII, detectRedFlags, simulateHipaaEncrypt } from "./utils.ts";

Deno.test("scrubPII redacts emails, phones, SSN, DOB, credit cards, and MRN-like tokens", async () => {
  const text = "Contact: john.doe@example.com / +1 (555) 123-4567 / SSN 123-45-6789 / DOB 02/14/1985 / Card 4111 1111 1111 1111 / MRN: 987654";
  const scrubbed = await scrubPII(text);
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

Deno.test("phone detection handles various international formats", async () => {
  const samples = [
    "+44 7700 900123",
    "+1 (212) 555-0123",
    "0044 7700 900123",
    "(212)5550123",
  ];
  for (const s of samples) {
    const scrubbed = await scrubPII("Contact: " + s);
    if (!scrubbed.includes("[REDACTED_PHONE]")) {
      throw new Error(`Failed to redact phone sample: "${s}" -> "${scrubbed}"`);
    }
  }
});

Deno.test("NLP-based name and place redaction", async () => {
  const text = "Patient name: John Doe. Lives in Seattle.";
  const scrubbed = await scrubPII(text);
  if (!scrubbed.includes("[REDACTED_NAME]") || !scrubbed.includes("[REDACTED_LOCATION]")) {
    throw new Error("NLP PII redaction failed: " + scrubbed);
  }
});

Deno.test("Google DLP integration (mocked)", async () => {
  // Mock DLP env and response
  Deno.env.set("GOOGLE_DLP_API_KEY", "testkey");
  Deno.env.set("GOOGLE_PROJECT_ID", "proj-1");

  // Mock fetch to emulate Google DLP response
  // @ts-ignore
  globalThis.fetch = async () => new Response(JSON.stringify({ result: { findings: [ { quote: "Alice Smith", infoType: { name: "PERSON_NAME" }, likelihood: "VERY_LIKELY" } ] } }), { status: 200 });

  const text = "Patient: Alice Smith reported dizziness";
  const scrubbed = await scrubPII(text);
  if (!scrubbed.includes("[REDACTED_NAME]")) {
    throw new Error("DLP-based name redaction failed: " + scrubbed);
  }
});

Deno.test("credit card candidates are validated with Luhn and redacted only if valid", async () => {
  const valid = "My card is 4111 1111 1111 1111"; // valid Visa test number
  const invalid = "Number 1234 5678 9012 3456"; // fails Luhn
  assertEquals((await scrubPII(valid)).includes("[REDACTED_CREDIT_CARD]"), true);
  assertEquals((await scrubPII(invalid)).includes("[REDACTED_CREDIT_CARD]"), false);
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
