import React from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../api/axios";

function UserPosts({ posts, onDelete, userRole, onRefresh }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // Helper function to check if user owns a post
  const isPostOwner = (post) => {
    return user && post.userId && (
      (post.userId._id === user._id) ||
      (post.userId === user._id) ||
      (typeof post.userId === 'string' && post.userId === user._id)
    );
  };
  if (!posts.length) {
    return (
      <div className="empty-state enhanced-empty">
        <h3>No posts yet</h3>
        <p>Your story starts now. Create your first post to engage with the community.</p>
        <Link to="/create-post" className="btn-create-post">
          Create Your First Post
        </Link>
      </div>
    );
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2 className="section-title">My Posts</h2>
        <button className="btn-refresh" onClick={onRefresh}>Refresh</button>
      </div>

      <div className="posts-grid">
        {posts.map((post) => (
          <article key={post._id} className="post-card">
            {post.image && <img className="post-image" src={post.image.startsWith("http") ? post.image : `${API_BASE}${post.image}`} alt={post.title || "Post image"} />}
            <div className="post-content">
              <h3 className="post-title">{post.title || "Untitled"}</h3>
              <p className="post-text">{post.content}</p>
              <div className="post-meta">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>{post.likes?.length || 0} Likes</span>
              </div>
              <div className="post-actions">
                <Link to={`/edit-post/${post._id}`} className="btn-post-edit">
                  Edit
                </Link>

                {(userRole === "admin" || isPostOwner(post)) && (
                  <button className="btn-post-delete" onClick={() => onDelete(post._id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default UserPosts;
