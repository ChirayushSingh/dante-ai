import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHealthChat } from "./useHealthChat";

// Mock supabase
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({ insert: () => ({ then: () => ({ catch: () => {} }) }) }),
  },
}));

// Mock useAuth
vi.mock("./useAuth", () => ({ useAuth: () => ({ user: { id: "user-1" } }) }));

describe("useHealthChat", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // @ts-ignore
    global.fetch = vi.fn();
  });

  it("routes to OpenAI PoC when useOpenAIPoC is true", async () => {
    const fakeStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("Hello from AI"));
        controller.close();
      },
    });

    // @ts-ignore
    global.fetch.mockResolvedValue({ ok: true, body: fakeStream });

    const { result } = renderHook(() => useHealthChat());

    await act(async () => {
      await result.current.sendMessage("Test message", { useOpenAIPoC: true });
    });

    expect((global.fetch as any).mock.calls.length).toBeGreaterThanOrEqual(1);
    const calledUrl = (global.fetch as any).mock.calls[0][0];
    expect(calledUrl.endsWith("health-chat-openai")).toBeTruthy();
    // final message appended
    expect(result.current.messages.some(m => m.role === "assistant")).toBeTruthy();
  });

  it("saves assistant messages when backend fails and falls back to simulation", async () => {
    // Force fetch to fail
    // @ts-ignore
    global.fetch.mockResolvedValue({ ok: false });

    const { result } = renderHook(() => useHealthChat());

    await act(async () => {
      await result.current.sendMessage("I have a headache");
    });

    expect(result.current.messages.some(m => m.role === "assistant")).toBeTruthy();
  });
});
