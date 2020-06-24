import { sign, verify } from "../token.service";

describe("Token Service", () => {
  const payload = { userId: "hello" };

  test("sign success", async () => {
    const token = sign(payload, 86400 * 260 * 10);
    expect(token.split(":")).toHaveLength(2);
  });

  test("verify success", () => {
    const token = "H-p9bSoes40SSTODIEqZZA:rNTbF7UgEVVwfjQjHiX33xgVRvJkKdJyUVU1YZbvs1jfxHx7M7yQnJ8PbzuKOOp-fMUYVT4MAW9AL7qz6BTgGA";
    const verified = verify(token);
    expect(verified).toStrictEqual({ userId: "hello" });
  });

  test("verify failed", () => {
    const token = "4qYhMCJeCQsbS2tPBqnvsQ:BNJh1LqMQsqGI0hQUl9DoM4-NgQGROQKc8kdzBMWTzPHSG6F4CHCi_z7EvidK0WkXrAPzlRVehsmLSABJQ_hyA";
    expect(() => verify(token)).toThrowError(new Error("Token is expired"));
  });
});
