const CLOUDINARY_BASE_URL = process.env.REACT_APP_CLOUDINARY_BASE_URL;

export const getCloudinaryImageUrl = (partialUrl) => {
  if (!partialUrl) return null;
  return `${CLOUDINARY_BASE_URL}${partialUrl}`;
};
