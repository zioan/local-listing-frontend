import React from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { getCloudinaryImageUrl } from "../../../lib/cloudinaryUtil";

const ImageUpload = ({ existingImages, newImages, onExistingImageRemove, onNewImageAdd, onNewImageRemove }) => {
  return (
    <div>
      {existingImages && existingImages.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Images</label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {existingImages.map((image) => (
              <div key={image.id} className="relative">
                <img src={getCloudinaryImageUrl(image.image)} alt="Listing" className="object-cover w-full h-32 rounded" />
                <button
                  type="button"
                  onClick={() => onExistingImageRemove(image.id)}
                  className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <label htmlFor="new-images" className="block text-sm font-medium text-gray-700">
          {existingImages && existingImages.length > 0 ? "Add New Images" : "Images"}
        </label>
        <input
          type="file"
          id="new-images"
          multiple
          onChange={onNewImageAdd}
          className="block w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {newImages && newImages.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-2">
            {newImages.map((image, index) => (
              <div key={index} className="relative">
                <img src={URL.createObjectURL(image)} alt={`New upload ${index + 1}`} className="object-cover w-full h-32 rounded" />
                <button
                  type="button"
                  onClick={() => onNewImageRemove(index)}
                  className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
