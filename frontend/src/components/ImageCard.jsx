function ImageCard({ image, onDelete }) {
  return (
    <div className="rounded-lg border p-3">
      <img
        src={image}
        alt="Uploaded"
        className="h-40 w-full rounded-lg object-cover"
      />

      <button
        onClick={onDelete}
        className="mt-3 w-full rounded-lg bg-red-500 px-4 py-2 text-white"
      >
        Delete
      </button>
    </div>
  );
}

export default ImageCard;