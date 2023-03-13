import { v4 } from "uuid";
import context from "../context";

jest.mock("uuid", () => ({
  v4: jest.fn()
}));

describe("context", () => {
  let requestId: string;
  let testContextValue: string;

  const next = (): any => {
    requestId = context.getRequestId();
    testContextValue = context.get("test");
  };

  describe("execute().with()", () => {
    it("adds passed RequestId parameter to local context", () => {
      const definedRequestId = "defined-request-id-2222";
      context.execute(next).with({ 'X-Request-ID': definedRequestId });
      expect(requestId).toEqual(definedRequestId);
    });

    it("adds any passed arg to local context", () => {
      context.execute(next).with({ test: "test value" });
      expect(testContextValue).toEqual("test value");
    });

    it("generates and set new RequestId to local context", () => {
      const definedRequestId = "defined-request-id-1111";
      (v4 as jest.Mock).mockReturnValue(definedRequestId);
      context.execute(next).with({});
      expect(requestId).toEqual(definedRequestId);
    });
  });
});
