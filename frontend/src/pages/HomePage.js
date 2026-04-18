import QuotesSection from "../components/QuotesSection";
import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";
import API from "../api/axios";

function HomePage({ isLoggedIn }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  
  console.log("TOKEN:", localStorage.getItem("token"));
  // 📦 SAMPLE POSTS (ready for backend later)
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("/posts")
      .then(res => {
        console.log(res.data); // debug
        setPosts(res.data);
      })
      .catch(err => console.log(err));
    }, []);

    const handleDeletePost = (id) => {
      setPosts(prevPosts => prevPosts.filter(post => post._id !== id));
    };

    const handleUpdatePost = (updatedPost) => {
      if (!updatedPost || !updatedPost._id) return; // 🔥 FIX

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post?._id === updatedPost._id
            ? { ...post, ...updatedPost }
            : post
        )
      );
    };

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">

          <div className="hero-text">
            <h1>Hi, I'm Kurby 👋</h1>
            <p>
              Frontend Developer | Future MERN Developer
            </p>
          </div>

          <div className="hero-image">
            <img src="/assets/profile.jpg" alt="profile" />
          </div>

        </div>
      </section>


      {/* QUOTES SECTION */}
      <QuotesSection />


      {/* POSTS SECTION (MAIN FEATURE NA 🔥) */}
      <section className="posts">
        <h2>Latest Posts</h2>

        <div className="posts-grid">

          {posts.length === 0 ? (
            <p>No posts yet</p>
          ) : (
            posts.map(post => (
              <PostCard 
                key={post._id}
                post={post}
                isLoggedIn={isLoggedIn}
                role={role} // 🔥 ADD THIS
                onDelete={handleDeletePost}
                onUpdate={handleUpdatePost}
              />
            ))
          )}

        </div>
      </section>

    </>
  );
}

export default HomePage;