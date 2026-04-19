import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import API, { API_BASE } from "../api/axios";
import "../styles/MyProfile.css";

function MyProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    password: "",
    avatar: "",
    avatarFile: null
  });
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUser = useCallback(async () => {
    try {
      const res = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setEditForm({
        name: res.data.name || "",
        username: res.data.username || "",
        email: res.data.email || "",
        bio: res.data.bio || "",
        avatar: res.data.avatar || "",
        password: "",
        avatarFile: null
      });
    } catch (err) {
      console.error("PROFILE ERROR:", err);
      setError("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchMyPosts = useCallback(async () => {
    try {
      const res = await API.get("/users/me/posts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data);
    } catch (err) {
      console.error("POSTS ERROR:", err);
      // Don't set error for posts, just log it
    }
  }, [token]);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();

      // Add text fields
      formData.append("name", editForm.name);
      formData.append("username", editForm.username);
      formData.append("email", editForm.email);
      formData.append("bio", editForm.bio);

      if (editForm.password) {
        formData.append("password", editForm.password);
      }

      // Handle avatar file upload
      if (editForm.avatarFile) {
        formData.append("avatar", editForm.avatarFile);
      }

      const res = await API.put("/users/me", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setIsEditing(false);
      setSaving(false);
      alert("Profile updated successfully!");
    } catch (err) {
      setSaving(false);
      console.error("UPDATE ERROR:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await API.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts((prev) => prev.filter((post) => post._id !== postId));
      alert("Post deleted successfully");
    } catch (err) {
      console.error("DELETE POST ERROR:", err);
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm({
        ...editForm,
        avatarFile: file
      });
    }
  };

  useEffect(() => {
    if (!token) {
      setError("No authentication token found. Please login again.");
      setLoading(false);
      return;
    }

    fetchUser();
    fetchMyPosts();
  }, [fetchUser, fetchMyPosts, token]);

  const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);

  // Helper function to check if user owns a post
  const isPostOwner = (post) => {
    return user && post.userId && (
      (post.userId._id === user._id) ||
      (post.userId === user._id) ||
      (typeof post.userId === 'string' && post.userId === user._id)
    );
  };

  if (loading) {
    return (
      <div className="my-profile-page">
        <div className="profile-container">
          <div className="loading-state">
            <h2>Loading your profile...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-profile-page">
        <div className="profile-container">
          <div className="error-state">
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="my-profile-page">
        <div className="profile-container">
          <div className="error-state">
            <h2>No user data found</h2>
            <p>Please try logging in again.</p>
          </div>
        </div>
      </div>
    );
  }

  const avatarSource = user?.avatar
    ? `${user.avatar.startsWith("http") ? "" : API_BASE}${user.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username || "User")}&background=007bff&color=fff&size=120`;

  return (
    <div className="my-profile-page">
      <div className="profile-container">
        <div className="profile-banner" />
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={avatarSource} alt="Profile Avatar" />
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{user.name || user.username || "User"}</h1>
            <p className="profile-email">{user.email}</p>
            <span className="profile-role">{user.role}</span>

            <p className="profile-bio">{user.bio || "No bio yet. Add a short description in edit mode."}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{posts.length}</span>
                <span className="stat-label">Total Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{totalLikes}</span>
                <span className="stat-label">Total Likes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Following</span>
              </div>
            </div>

            <div className="profile-actions">
              <button
                className="btn-edit-profile"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </button>

              <Link to="/create-post" className="btn-create-post">
                Create Post
              </Link>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <div className="content-section">
            <h2 className="section-title">Edit Profile</h2>
            <form onSubmit={handleEditProfile}>
              <div style={{ display: "grid", gap: "1rem", maxWidth: "500px" }}>
                <div>
                  <label className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={editForm.username}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Tell us about yourself"
                  />
                </div>

                <div>
                  <label className="form-label">
                    New Password (optional)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={editForm.password}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="form-label">
                    Profile Picture
                  </label>

                  {/* Current avatar preview */}
                  {editForm.avatar && !editForm.avatarFile && (
                    <div style={{ marginBottom: "1rem" }}>
                      <img
                        src={editForm.avatar.startsWith("http") ? editForm.avatar : `${API_BASE}${editForm.avatar}`}
                        alt="Current avatar"
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid #ddd"
                        }}
                      />
                    </div>
                  )}

                  {/* File upload */}
                  <div style={{ marginBottom: "1rem" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="form-file-input"
                    />
                    <small className="form-help-text">
                      Upload a new profile picture (max 5MB, JPG/PNG/GIF only)
                    </small>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="form-submit-btn"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Posts Section */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">My Posts</h2>
            <Link to="/create-post" className="btn-create-post">
              + New Post
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="empty-state">
              <h3>No posts yet</h3>
              <p>Share your thoughts and create your first post!</p>
              <Link to="/create-post" className="btn-create-post">
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map(post => (
                <div key={post._id} className="post-card">
                  {post.image && (
                    <img
                      src={post.image.startsWith("http") ? post.image : `${API_BASE}${post.image}`}
                      alt={post.title || "Post"}
                      className="post-image"
                    />
                  )}
                  <div className="post-content">
                    <h3 className="post-title">{post.title || "Untitled"}</h3>
                    <p className="post-text">{post.content}</p>
                    <div className="post-meta">
                      <span className="post-date">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span>{post.likes?.length || 0} likes</span>
                    </div>
                    <div className="post-actions">
                      <Link to={`/edit-post/${post._id}`} className="btn-post-edit">
                        Edit
                      </Link>
                      {(isPostOwner(post) || user.role === 'admin') && (
                        <button
                          className="btn-post-delete"
                          type="button"
                          onClick={() => handleDeletePost(post._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;