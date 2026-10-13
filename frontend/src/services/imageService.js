const API_URL = "http://localhost:4000/api/master";

// single img

export const uploadImage = async (image) => {
  const formData = new FormData();

  formData.append("myimage", image);

  const response = await fetch(`${API_URL}/profileUpload`, {
    method: "POST",
    body: formData,
  });

  return response.json();
};

export const getImage = async (userId) => {
  const response = await fetch(`${API_URL}/getimage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
    }),
  });

  return response.json();
};

// multiple img

export const uploadMultipleImages = async (images) => {
  const formData = new FormData();

  images.forEach((image) => {
    formData.append("myimages", image);
  });

  const response = await fetch(`${API_URL}/multipleimages`, {
    method: "POST",
    body: formData,
  });

  return response.json();
};

export const getMultipleImages = async (uniqueId) => {
  const response = await fetch(`${API_URL}/getmultipleimages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uniqueId: uniqueId,
    }),
  });

  return response.json();
};

// upload multiple img with fields

export const uploadImagesWithFields = async (
  profileImage,
  aadharCard,
  panCard
) => {
  const formData = new FormData();

  formData.append("profileImage", profileImage);
  formData.append("aadharCard", aadharCard);
  formData.append("panCard", panCard);

  const response = await fetch(
    `${API_URL}/multipleimageswithfields`,
    {
      method: "POST",
      body: formData,
    }
  );

  return response.json();
};

export const getImagesWithFields = async (userId) => {
  const response = await fetch(
    `${API_URL}/getmultipleimageswithfields`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),
    }
  );

  return response.json();
};
