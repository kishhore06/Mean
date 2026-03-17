import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { postService } from '../services/postService';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postService.getAllPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="home">
      <h1 className="home-title">Latest Posts</h1>
      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="text-center">No posts yet. Be the first to write one!</p>
        )}
      </div>
    </div>
  );
};

export default Home;