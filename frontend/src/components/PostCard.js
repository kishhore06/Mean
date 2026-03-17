import React from 'react';
import { Link } from 'react-router-dom';
import './PostCard.css';

const PostCard = ({ post }) => {
  const openInNewTab = () => {
    window.open(`/post/${post.id}`, '_blank');
  };

  return (
    <div className="post-card" onClick={openInNewTab}>
      <div className="post-card-content">
        <h2 className="post-card-title">{post.title}</h2>
        <p className="post-card-excerpt">{post.excerpt || post.content.substring(0, 150)}...</p>
        <div className="post-card-meta">
          <Link to={`/profile/${post.author.id}`} className="post-card-author" onClick={(e) => e.stopPropagation()}>
            By {post.author.username}
          </Link>
          <span className="post-card-date">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;