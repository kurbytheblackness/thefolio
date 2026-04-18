import React from "react";

function EditProfileForm({ editForm, setEditForm, onSave, saving }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <section className="content-section edit-profile-form">
      <h2 className="section-title">Edit Profile</h2>
      <form onSubmit={submit} className="profile-edit-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" value={editForm.name} onChange={handleChange} placeholder="Name" />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input id="username" name="username" value={editForm.username} onChange={handleChange} placeholder="Username" />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={editForm.email} onChange={handleChange} placeholder="Email" />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" value={editForm.bio} onChange={handleChange} placeholder="Short bio..." rows={3} />
        </div>

        <div className="form-group">
          <label htmlFor="password">New Password (optional)</label>
          <input id="password" name="password" type="password" value={editForm.password} onChange={handleChange} placeholder="New password" />
        </div>

        <div className="form-group">
          <label htmlFor="avatar">Avatar URL (optional)</label>
          <input id="avatar" name="avatar" type="text" value={editForm.avatar} onChange={handleChange} placeholder="/uploads/abc.jpg or full URL" />
        </div>

        <button type="submit" className="btn-save-profile" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </section>
  );
}

export default EditProfileForm;
