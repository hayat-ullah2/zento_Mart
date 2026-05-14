import { v2 as cloudinary } from "cloudinary";

const requiredEnv = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const getMissing = () =>
  requiredEnv.filter((key) => !process.env[key] || process.env[key].trim() === "");

export const isCloudinaryConfigured = () => getMissing().length === 0;

export const assertCloudinaryConfigured = () => {
  const missing = getMissing();
  if (missing.length) {
    const err = new Error(`Cloudinary is not configured. Missing: ${missing.join(", ")}`);
    err.statusCode = 500;
    throw err;
  }
};

// Configure the SDK lazily on first use so that dotenv has populated process.env.
let _configured = false;
const getCloudinary = () => {
  if (_configured) return cloudinary;
  assertCloudinaryConfigured();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  _configured = true;
  return cloudinary;
};

export const cloudinaryConfig = {
  get cloudName() { return process.env.CLOUDINARY_CLOUD_NAME; },
};

// Cloudinary's upload_stream is the only API that accepts a Buffer directly.
// Wrap it in a promise so callers can `await` like the rest of the codebase.
export const uploadBuffer = (buffer, { publicId, folder, tags = [] } = {}) => {
  const cld = getCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        tags,
        unique_filename: false,
        overwrite: false,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export const deleteByPublicId = async (publicId) => {
  const cld = getCloudinary();
  return cld.uploader.destroy(publicId, { resource_type: "image" });
};
