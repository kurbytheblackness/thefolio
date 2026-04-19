import { useState, useEffect, useRef } from "react"; // ✅ add useRef
import API, { API_BASE } from "../api/axios";
import '../styles/PostCard.css';

function PostCard({ post, isLoggedIn, role, onDelete, onUpdate }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const commentInputRef = useRef(); // ✅ ref for input focus

  const user = JSON.parse(localStorage.getItem("user"));

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await API.delete(
        `/posts/${post._id}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      // Remove from UI immediately
      setComments(comments.filter(c => c._id !== commentId));

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to delete comment");
    }
  };

  // 🔹 Fetch comments on mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await API.get(`/posts/${post._id}/comments`);
        setComments(res.data);
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    };
    fetchComments();
  }, [post._id]);

  // 👍 LIKE
  const isLiked = post.likes?.some(
    id => id === user?._id || id?._id === user?._id
  );

  const handleLike = async () => {
    if (!isLoggedIn) return alert("Login to like posts");

    try {
      const res = await API.put(
        `/posts/${post._id}/like`,
        {},
        { headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        } }
      );
      onUpdate?.(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // 💬 COMMENT
  const handleComment = async () => {
    if (!isLoggedIn) return alert("Login to comment");
    if (!comment.trim()) return;

    try {
      const res = await API.post(
        `/posts/${post._id}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        
      );

      // ✅ add comment to UI
      setComments([...comments, res.data]);
      setComment(""); // clear input
      commentInputRef.current.focus(); // refocus input

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to post comment");
    }
  };

  // ✏️ UPDATE POST
  const [editing, setEditing] = useState(false);
  const [newContent, setNewContent] = useState(post.content);
  const handleUpdate = async () => {
    try {
      const res = await API.put(
        `/posts/${post._id}`,
        { content: newContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}` // ✅ FIXED
          }
        }
      );

      setEditing(false);
      onUpdate?.(res.data);

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Update failed (maybe not owner)");
    }
  };

  // ✏️ DELETE POST
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      onDelete?.(post._id);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Delete failed (Admins only)");
    }
  };

  return (
    <div className="post-card">
      <h3>{post.title}</h3>

      {editing ? (
        <>
          <input
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button onClick={handleUpdate}>Save</button>
        </>
      ) : (
        <>
          <p>{post.content}</p>

          {post.image && (
            <img
              src={post.image.startsWith("http") ? post.image : `${API_BASE}${post.image}`}
              alt="Post"
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "cover",
                marginTop: "10px",
                borderRadius: "10px"
              }}
            />
          )}
        </>
      )}

      <button onClick={handleLike}>
        {isLiked ? "💙" : "🤍"} {post.likes?.length || 0}
      </button>

      {role === "admin" && (
        <>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}

      <div className="comments">
        <h4>Comments:</h4>

        {comments.map((c) => {
          const commenter = c.userId?.username || "Unknown";
          const commenterId = c.userId?._id || c.userId || null;

          return (
            <p key={c._id || `${post._id}-${Math.random()}`}>
              <strong>{commenter}:</strong> {c.text}
              {(role === "admin" || commenterId === user?._id) && (
                <button 
                  onClick={() => handleDeleteComment(c._id)} 
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Delete
                </button>
              )}
            </p>
          );
        })}

        {isLoggedIn ? (
          <>
            <input
              type="text"
              ref={commentInputRef}
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()} // optional: Enter to post
            />
            <button onClick={handleComment}>Post</button>
          </>
        ) : (
          <p style={{ color: "gray" }}>Login to write a comment</p>
        )}
      </div>
    </div>
  );
}

export default PostCard;