import React from "react";
import { Link } from "react-router-dom";

function ProfileHeader({ user, stats, isEditing, toggleEditing }) {
  const avatarSrc = user?.avatar
    ? `${process.env.REACT_APP_API_BASE || "http://localhost:5000"}${user.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username || "User")}&background=007bff&color=fff&rounded=true&size=128`;

  return (
    <section className="profile-hero">
      <div className="profile-cover" />
      <div className="profile-avatar-wrap">
        <img className="profile-avatar-img" src={avatarSrc} alt="avatar" />
      </div>
      <div className="profile-main">
        <h1>{user.name || user.username || "User"}</h1>
        <p className="profile-bio">{user.bio || "No bio set yet. Add a short bio to introduce yourself."}</p>
        <p className="profile-subline">{user.email} • {user.role}</p>

        <div className="profile-stats">
          <span>{stats.totalPosts} Posts</span>
          <span>{stats.totalLikes} Likes</span>
          <span>0 Followers</span>
          <span>0 Following</span>
        </div>

        <div className="profile-actions">
          <button className="btn-edit-profile" onClick={toggleEditing}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
          <Link className="btn-create-post" to="/create-post">
            New Post
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProfileHeader;
