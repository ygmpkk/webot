import crypto from "crypto";
import config from "rob-config";
import { encode, decode } from "safe-base64";

const { secret } = config.get("security.jwt");
const key = Buffer.from(secret);
const CIPHER_ALGO = "aes-256-cbc";
const IV_LENGTH = 16;

export const sign = (payload: object, exp: number) => {
  const text = JSON.stringify({
    payload,
    exp: exp ? new Date().getTime() + exp * 1000 : undefined,
  });
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(CIPHER_ALGO, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${encode(iv)}:${encode(encrypted)}`;
};

export const verify = (token: string) => {
  const [iv, encryptedText] = token.split(":");
  console.log(iv, encryptedText);
  const decipher = crypto.createDecipheriv(CIPHER_ALGO, key, decode(iv));
  const decrypted = decipher.update(decode(encryptedText));
  const { payload, exp } = JSON.parse(
    Buffer.concat([decrypted, decipher.final()]).toString("utf-8")
  );
  if (exp) {
    const now = new Date().getTime();
    if (now > exp) {
      throw new Error("Token is expired");
    }
  }

  return payload;
};
