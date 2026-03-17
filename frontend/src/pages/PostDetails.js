import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import CommentSection from '../components/CommentSection';
import './PostDetails.css';

const PostDetails = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postService.getPostById(id);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center">Post not found</div>;
  }

  return (
    <div className="post-details">
      <article className="post-article">
        {post.featuredImage && (
          <img src={post.featuredImage} alt={post.title} className="post-image" />
        )}
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <Link to={`/profile/${post.author.id}`} className="post-author">
            By {post.author.username}
          </Link>
          <span className="post-date">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="post-content">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        {user && user.id === post.author.id && (
          <div className="post-actions">
            <button onClick={() => navigate(`/edit-post/${post.id}`)} className="post-edit">
              Edit
            </button>
            <button onClick={handleDelete} className="post-delete">
              Delete
            </button>
          </div>
        )}
      </article>

      <CommentSection postId={post.id} />
    </div>
  );
};

export default PostDetails;