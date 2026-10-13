import { useState } from "react";
import {
  uploadImagesWithFields,
  getImagesWithFields,
} from "../services/imageService";

function MultipleImageWithFields() {
  const [profileImage, setProfileImage] = useState(null);
  const [aadharCard, setAadharCard] = useState(null);
  const [panCard, setPanCard] = useState(null);

  const [userId, setUserId] = useState(null);
  const [uploadedImages, setUploadedImages] = useState(null);

  const [error, setError] = useState("");

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    setError("");

    if (!file) {
      return;
    }

    // check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed.");
      return;
    }

    // check file size
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5 MB.");
      return;
    }

    if (type === "profile") {
      setProfileImage(file);
    }

    if (type === "aadhar") {
      setAadharCard(file);
    }

    if (type === "pan") {
      setPanCard(file);
    }
  };

  const handleAdd = async () => {
    setError("");

    // check all fields
    if (!profileImage || !aadharCard || !panCard) {
      setError("All images are required.");
      return;
    }

    try {
      const result = await uploadImagesWithFields(
        profileImage,
        aadharCard,
        panCard
      );

      console.log("Upload response:", result);

      if (result.data) {
        setUserId(result.data._id);
        alert("All images are uploaded.");
      }
    } catch (error) {
      console.log(error);
      setError("Images upload failed.");
    }
  };

  const handleGetImage = async () => {
    setError("");

    if (!userId) {
      setError("Please upload images first.");
      return;
    }

    try {
      const result = await getImagesWithFields(userId);

      console.log("Get image response:", result);

      if (result.data && result.data.length > 0) {
        setUploadedImages(result.data[0]);
      }
    } catch (error) {
      console.log(error);
      setError("Unable to get images.");
    }
  };

  const handleDelete = () => {
    setProfileImage(null);
    setAadharCard(null);
    setPanCard(null);
    setUploadedImages(null);
    setUserId(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-md">

        <h1 className="mb-6 text-2xl font-bold text-gray-800">Multiple Images with Fields</h1>

        {/* profile img */}

        <label className="mb-4 block">

          <span className="mb-2 block font-medium text-gray-700">Profile Image</span>

          <input
            type="file"
            accept=".jpg, .jpeg, .png, .webp"
            onChange={(e) => handleImageChange(e, "profile")}
            className="block w-full rounded-lg border border-gray-300 p-2 text-sm"
          />

        </label>

        {/* aadhaar card */}

        <label className="mb-4 block">

          <span className="mb-2 block font-medium text-gray-700">Aadhaar Card</span>

          <input
            type="file"
            accept=".jpg, .jpeg, .png, .webp"
            onChange={(e) => handleImageChange(e, "aadhar")}
            className="block w-full rounded-lg border border-gray-300 p-2 text-sm"
          />

        </label>

        {/* pan card */}

        <label className="mb-4 block">

          <span className="mb-2 block font-medium text-gray-700">PAN Card</span>

          <input
            type="file"
            accept=".jpg, .jpeg, .png, .webp"
            onChange={(e) => handleImageChange(e, "pan")}
            className="block w-full rounded-lg border border-gray-300 p-2 text-sm"
          />

        </label>

        {/* imgs */}

        {uploadedImages && (
          <div className="my-6 grid grid-cols-3 gap-4">

            <div>
              <p className="mb-2 font-medium text-gray-700">Profile Image</p>

              <img
                src={uploadedImages.profileimgPath}
                alt="Profile"
                className="h-40 w-full rounded-lg object-cover"
              />
            </div>

            <div>
              <p className="mb-2 font-medium text-gray-700">Aadhaar Card</p>

              <img
                src={uploadedImages.aadharCardimgPath}
                alt="Aadhaar"
                className="h-40 w-full rounded-lg object-cover"
              />
            </div>

            <div>
              <p className="mb-2 font-medium text-gray-700">PAN Card</p>

              <img
                src={uploadedImages.panCardimgPath}
                alt="PAN"
                className="h-40 w-full rounded-lg object-cover"
              />
            </div>

          </div>
        )}

        {/* error */}

        {error && (
          <p className="mb-4 text-sm text-red-500">
            {error}
          </p>
        )}

        {/* btn */}

        <div className="flex gap-3">

          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Add
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

export default MultipleImageWithFields;