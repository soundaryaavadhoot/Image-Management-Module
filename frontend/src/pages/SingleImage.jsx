import { useState } from "react";
import { uploadImage, getImage } from "../services/imageService";

function SingleImage() {
  const [image, setImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setError("");
    setMessage("");

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5 MB.");
      return;
    }

    setImage(file);
  };

  // upload img

  const handleUpload = async () => {
    setError("");
    setMessage("");

    if (!image) {
      setError("Please choose an image first.");
      return;
    }

    try {
      const result = await uploadImage(image);

      console.log("Upload response:", result);

      if (result.data) {
        setImageId(result.data._id);
        setMessage("Image uploaded successfully.");
      }
    } catch (error) {
      console.log(error);
      setError("Image upload failed.");
    }
  };

  // get img
  const handleGetImage = async () => {
    setError("");
    setMessage("");

    if (!imageId) {
      setError("Please upload an image first.");
      return;
    }

    try {
      const result = await getImage(imageId);

      console.log("Get image response:", result);

      if (result.length > 0) {
        setUploadedImage(result[0].imgPath);
        setMessage("Image fetched successfully.");
      }
    } catch (error) {
      console.log(error);
      setError("Unable to get image.");
    }
  };

  // delete
  const handleDelete = () => {
    setImage(null);
    setUploadedImage(null);
    setImageId(null);
    setError("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-md">

        <h1 className="mb-6 text-2xl font-bold text-gray-800">Single Image Upload</h1>

        {/* img */}

        {uploadedImage && (
          <div className="mb-6 flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="h-full max-w-full rounded-lg object-contain"
            />
          </div>
        )}

        {/* choose img */}

        <label className="mb-4 block">

          <span className="mb-2 block font-medium text-gray-700">
            Choose Image
          </span>

          <input
            type="file"
            accept=".jpg, .jpeg, .png, .webp"
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
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Upload
          </button>

          <button
            type="button"
            onClick={handleGetImage}
            className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
          >
            Get Image
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

export default SingleImage;