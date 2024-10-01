const CLOUDINARY_BASE_URL = process.env.REACT_APP_CLOUDINARY_BASE_URL;

/**
 * Constructs the full Cloudinary image URL from a partial URL.
 *
 * @param {string} partialUrl - The partial URL of the image.
 * @returns {string|null} The full Cloudinary image URL or null if the partial URL is not provided.
 */
export const getCloudinaryImageUrl = (partialUrl) => {
  if (!partialUrl) return null;
  return `${CLOUDINARY_BASE_URL}${partialUrl}`;
};
