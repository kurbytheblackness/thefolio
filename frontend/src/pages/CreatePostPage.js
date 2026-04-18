import { useState } from "react";
import API from "../api/axios";

function CreatePostPage() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);

      const res = await API.post(
        "/posts/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      alert(res.data.message || "Post created successfully ✅");
      setContent("");
      setImage(null);

    } catch (err) {
      console.log(err.response);
      alert(err.response?.data?.message || "Error creating post");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Post</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something..."
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          style={{ maxWidth: "200px", marginTop: "10px" }}
        />
      )}

      <button type="submit">Post</button>
    </form>
  );
}

export default CreatePostPage;