import ImageKit, { toFile } from "@imagekit/nodejs";

const requiredEnv = ["IMAGEKIT_PRIVATE_KEY", "IMAGEKIT_URL_ENDPOINT"];

const getMissingImageKitEnv = () =>
  requiredEnv.filter((key) => !process.env[key] || process.env[key].trim() === "");

// Read env at access time, not at import time. ESM hoists imports above
// dotenv.config(), so any value captured at import would be `undefined`.
export const imageKitConfig = {
  get publicKey() { return process.env.IMAGEKIT_PUBLIC_KEY; },
  get privateKey() { return process.env.IMAGEKIT_PRIVATE_KEY; },
  get urlEndpoint() { return process.env.IMAGEKIT_URL_ENDPOINT; },
  get imageKitId() { return process.env.IMAGEKIT_ID; },
};

export const isImageKitConfigured = () => getMissingImageKitEnv().length === 0;

export const assertImageKitConfigured = () => {
  const missing = getMissingImageKitEnv();
  if (missing.length) {
    const err = new Error(`ImageKit is not configured. Missing: ${missing.join(", ")}`);
    err.statusCode = 500;
    throw err;
  }
};

let _imageKit = null;
const getImageKit = () => {
  if (_imageKit) return _imageKit;
  assertImageKitConfigured();
  _imageKit = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY });
  return _imageKit;
};

// Proxy so existing `imageKit.files.upload(...)` calls still work — but the
// underlying client is created lazily on first property access, after dotenv
// has populated process.env.
export const imageKit = new Proxy({}, {
  get(_target, prop) {
    return Reflect.get(getImageKit(), prop);
  },
});

export const bufferToImageKitFile = async (buffer, fileName) => toFile(buffer, fileName);
