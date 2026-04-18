import { useEffect, useState, useCallback } from "react";
import API, { API_BASE } from "../api/axios";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("contacts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const token = localStorage.getItem("token");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [contactsRes, usersRes, postsRes] = await Promise.all([
        API.get("/contacts", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        API.get("/users/all", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        API.get("/posts", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setContacts(contactsRes.data);
      setUsers(usersRes.data);
      setPosts(postsRes.data);
    } catch (err) {
      console.error("FETCH DATA ERROR:", err);
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMarkAsRead = async (contactId) => {
    try {
      await API.put(`/contacts/${contactId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setContacts(contacts.map(contact =>
        contact._id === contactId ? { ...contact, isRead: true } : contact
      ));
    } catch (err) {
      console.error("MARK READ ERROR:", err);
      alert("Failed to mark as read");
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await API.delete(`/contacts/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setContacts(contacts.filter(contact => contact._id !== contactId));
      alert("Message deleted successfully");
    } catch (err) {
      console.error("DELETE CONTACT ERROR:", err);
      alert("Failed to delete message");
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      await API.put(`/users/${userId}/status`, {
        isActive: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(users.map(user =>
        user._id === userId ? { ...user, isActive: !currentStatus } : user
      ));

      alert(`User ${action}d successfully`);
    } catch (err) {
      console.error("TOGGLE USER STATUS ERROR:", err);
      alert(err.response?.data?.message || `Failed to ${action} user`);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await API.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPosts(posts.filter(post => post._id !== postId));
      alert("Post deleted successfully");
    } catch (err) {
      console.error("DELETE POST ERROR:", err);
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  const openPostModal = (post) => {
    setSelectedPost(post);
    setEditTitle(post.title || "");
    setEditContent(post.content || "");
    setEditImage(null);
    setEditMode(false);
    setIsModalOpen(true);
  };

  const closePostModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    setEditMode(false);
    setEditTitle("");
    setEditContent("");
    setEditImage(null);
  };

  const handleSavePost = async () => {
    if (!selectedPost) return;

    if (!editTitle.trim() || !editContent.trim()) {
      alert("Title and content are required");
      return;
    }

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("content", editContent);
      if (editImage) formData.append("image", editImage);

      const response = await API.put(
        `/posts/${selectedPost._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPosts(posts.map(post =>
        post._id === selectedPost._id ? response.data : post
      ));
      
      alert("Post updated successfully");
      setEditMode(false);
    } catch (err) {
      console.error("SAVE POST ERROR:", err);
      alert(err.response?.data?.message || "Failed to update post");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-state">
          <h2>Loading admin dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "contacts" ? "active" : ""}`}
            onClick={() => setActiveTab("contacts")}
          >
            Contact Messages ({contacts.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            User Management ({users.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            Manage Posts ({posts.length})
          </button>
        </div>

        {activeTab === "contacts" && (
          <div className="contacts-section">
            <h2>Contact Messages</h2>
            {contacts.length === 0 ? (
              <div className="empty-state">
                <p>No contact messages yet.</p>
              </div>
            ) : (
              <div className="contacts-list">
                {contacts.map(contact => (
                  <div key={contact._id} className={`contact-card ${contact.isRead ? "read" : "unread"}`}>
                    <div className="contact-header">
                      <div className="contact-info">
                        <h3>{contact.name}</h3>
                        <p className="contact-email">{contact.email}</p>
                        <p className="contact-date">
                          {new Date(contact.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="contact-actions">
                        {!contact.isRead && (
                          <button
                            className="btn-mark-read"
                            onClick={() => handleMarkAsRead(contact._id)}
                          >
                            Mark as Read
                          </button>
                        )}
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteContact(contact._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="contact-message">
                      <p>{contact.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-section">
            <h2>User Management</h2>
            <div className="users-list">
              {users.map(user => (
                <div key={user._id} className={`user-card ${user.isActive ? "active" : "inactive"}`}>
                  <div className="user-info">
                    <div className="user-avatar">
                      <img
                        src={user.avatar ? `${API_BASE}${user.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username)}&background=007bff&color=fff`}
                        alt="Avatar"
                      />
                    </div>
                    <div className="user-details">
                      <h3>{user.name || user.username}</h3>
                      <p className="user-email">{user.email}</p>
                      <span className={`user-role ${user.role}`}>{user.role}</span>
                      <span className={`user-status ${user.isActive ? "active" : "inactive"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <div className="user-actions">
                    {user.role !== "admin" && (
                      <button
                        className={`btn-toggle-status ${user.isActive ? "deactivate" : "activate"}`}
                        onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "posts" && (
          <div className="posts-section">
            <h2>Manage Posts</h2>
            {posts.length === 0 ? (
              <div className="empty-state">
                <p>No posts yet.</p>
              </div>
            ) : (
              <div className="posts-list">
                {posts.map(post => (
                  <div key={post._id} className="post-card-minimal">
                    <div className="post-header-minimal">
                      <h3 
                        className="post-title-link"
                        onClick={() => openPostModal(post)}
                      >
                        {post.title || "Untitled"}
                      </h3>
                      <span className="post-date-small">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="post-meta-minimal">
                      <span className="post-author">By: {post.userId?.username || "Unknown"}</span>
                      <span className="post-likes">{post.likes?.length || 0} likes</span>
                    </div>
                    <button
                      className="btn-post-delete"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isModalOpen && selectedPost && (
          <div className="modal-overlay" onClick={closePostModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Post Details</h2>
                <button className="modal-close" onClick={closePostModal}>&times;</button>
              </div>

              <div className="modal-body">
                {editMode ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Post title"
                        disabled={isSaving}
                      />
                    </div>

                    <div className="form-group">
                      <label>Content</label>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={6}
                        placeholder="Post content"
                        disabled={isSaving}
                      />
                    </div>

                    <div className="form-group">
                      <label>Image (optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditImage(e.target.files[0])}
                        disabled={isSaving}
                      />
                      {selectedPost.image && !editImage && (
                        <p className="image-note">Current image will be kept if no new image is selected</p>
                      )}
                    </div>

                    <div className="modal-actions">
                      <button
                        className="btn-save"
                        onClick={handleSavePost}
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => setEditMode(false)}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {selectedPost.image && (
                      <div className="modal-image">
                        <img
                          src={`${API_BASE}${selectedPost.image}`}
                          alt={selectedPost.title || "Post"}
                        />
                      </div>
                    )}
                    
                    <div className="post-detail-content">
                      <h3>{selectedPost.title || "Untitled"}</h3>
                      <div className="post-detail-meta">
                        <span className="author">By: {selectedPost.userId?.username || "Unknown"}</span>
                        <span className="date">
                          {new Date(selectedPost.createdAt).toLocaleString()}
                        </span>
                        <span className="likes">{selectedPost.likes?.length || 0} likes</span>
                      </div>
                      <p className="post-detail-text">{selectedPost.content}</p>
                    </div>

                    <div className="modal-actions">
                      <button
                        className="btn-edit"
                        onClick={() => setEditMode(true)}
                      >
                        Edit Post
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => {
                          closePostModal();
                          handleDeletePost(selectedPost._id);
                        }}
                      >
                        Delete Post
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;