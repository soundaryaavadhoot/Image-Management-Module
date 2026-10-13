import { useState } from "react";
import {
  uploadMultipleImages,
  getMultipleImages,
} from "../services/imageService";

function MultipleImages() {
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uniqueId, setUniqueId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // select imgs
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setError("");
    setMessage("");

    // max 4 imgs

    if (images.length + files.length > 4) {
      setError("You can select maximum 4 images.");
      return;
    }

    // check duplicate imgs

    for (const file of files) {
      const duplicate = images.some(
        (image) =>
          image.name === file.name && image.size === file.size
      );

      if (duplicate) {
        setError("Duplicate images are not allowed.");
        return;
      }
    }

    // Check file type & size

    for (const file of files) {
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/webp"
      ) {
        setError("Only JPG, PNG and WEBP images are allowed.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Each image should be less than 5 MB.");
        return;
      }
    }

    setImages([...images, ...files]);
  };

  // upload imgs
  const handleUpload = async () => {
    setError("");
    setMessage("");

    if (images.length === 0) {
      setError("Please select images first.");
      return;
    }

    try {
      setLoading(true);

      const result = await uploadMultipleImages(images);

      console.log("Upload response:", result);

      if (result.data && result.data.length > 0) {
        setUniqueId(result.data[0].uniqueId);
        setMessage("Images uploaded successfully.");
      }
    } catch (error) {
      console.log(error);
      setError("Images upload failed.");
    }

    setLoading(false);
  };

  // get imgs
  const handleGetImages = async () => {
    setError("");
    setMessage("");

    if (!uniqueId) {
      setError("Please upload images first.");
      return;
    }

    try {
      setLoading(true);

      const result = await getMultipleImages(uniqueId);

      console.log("Get images response:", result);

      if (result.length > 0) {
        setUploadedImages(result);
        setMessage("Images fetched successfully.");
      }
    } catch (error) {
      console.log(error);
      setError("Unable to get images.");
    }

    setLoading(false);
  };

  // delete 
  const handleDelete = () => {
    setImages([]);
    setUploadedImages([]);
    setUniqueId(null);
    setError("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Multiple Images Upload</h1>

        {/* img show when user click get img */}

        {uploadedImages.length > 0 && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            {uploadedImages.map((image, index) => (
              <img
                key={index}
                src={image.imgPath}
                alt="Uploaded"
                className="h-40 w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        {/* select imgs */}

        <label className="mb-4 block">
          <span className="mb-2 block font-medium text-gray-700">Select Multiple Images</span>

          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleImageChange}
            className="block w-full rounded-lg border border-gray-300 p-2 text-sm"
          />
        </label>

        {/* error */}
        {error && (
          <p className="mb-4 text-sm text-red-500">
            {error}
          </p>
        )}

        {/* success */}
        {message && (
          <p className="mb-4 text-sm text-green-600">
            {message}
          </p>
        )}

        {/* btn */}
        <div className="flex gap-3">

          <button
            type="button"
            onClick={handleUpload}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

          <button
            type="button"
            onClick={handleGetImages}
            disabled={loading}
            className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
          >
            Get Images
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
}

export default MultipleImages;