import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import PostCard from '../components/PostCard';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await userService.getUserById(id);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await postService.getPostsByAuthor(id);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await userService.deleteUser(id);
        if (user && user.id === parseInt(id)) {
          localStorage.removeItem('user');
          navigate('/');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center">Profile not found</div>;
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-info">
          <h1 className="profile-name">{profile.username}</h1>
          <p className="profile-email">{profile.email}</p>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          <p className="profile-stats">Posts: {posts.length}</p>
          
          {user && user.id === profile.id && (
            <div className="profile-actions">
              <button
                onClick={() => navigate('/create-post')}
                className="profile-button profile-button-primary"
              >
                Write New Post
              </button>
              <button
                onClick={handleDeleteAccount}
                className="profile-button profile-button-danger"
              >
                Delete Account
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-posts">
        <h2 className="profile-posts-title">
          {profile.username}'s Posts
        </h2>
        <div className="posts-list">
          {posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="text-center">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;