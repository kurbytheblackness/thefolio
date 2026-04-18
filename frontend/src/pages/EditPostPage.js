import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/posts/${id}`);
        const post = res.data;
        setTitle(post.title || "");
        setContent(post.content || "");
      } catch (err) {
        console.error(err);
        alert("Unable to fetch post data.");
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      await API.put(`/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      alert("Post updated successfully.");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update post.");
    }
  };

  if (loading) return <p>Loading post data...</p>;

  return (
    <section className="content-section">
      <h2 className="section-title">Edit Post</h2>
      <form onSubmit={handleSubmit} className="profile-edit-form">
        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} />
        </div>
        <div className="form-group">
          <label>Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <button type="submit" className="btn-save-profile">Save Changes</button>
      </form>
    </section>
  );
}

export default EditPostPage;
