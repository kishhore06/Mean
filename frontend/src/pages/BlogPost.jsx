import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPost = useCallback(async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error("Error fetching post", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await api.get(`/comments/post/${id}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id, fetchPost, fetchComments]);

  const handleLike = async () => {
    if (!user) return alert("Please sign in to like posts");
    try {
      await api.post(`/likes/post/${id}`);
      setPost(prev => ({
        ...prev,
        likedByCurrentUser: !prev.likedByCurrentUser,
        likesCount: prev.likedByCurrentUser ? prev.likesCount - 1 : prev.likesCount + 1
      }));
    } catch (error) {
      console.error("Error toggling like", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please sign in to comment");
    if (!newComment.trim()) return;

    try {
      const response = await api.post('/comments', {
        content: newComment,
        postId: id
      });
      setComments([response.data, ...comments]);
      setNewComment('');
      setPost(prev => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
    } catch (error) {
      console.error("Error posting comment", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (error) {
      console.error("Error deleting post", error);
      alert("Failed to delete post");
    }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto px-6 py-20 animate-pulse">
      <div className="h-12 bg-gray-100 rounded w-3/4 mb-6"></div>
      <div className="h-4 bg-gray-100 rounded w-1/4 mb-10"></div>
      <div className="aspect-video bg-gray-100 rounded-lg mb-10"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-100 rounded w-full"></div>
        <div className="h-4 bg-gray-100 rounded w-5/6"></div>
        <div className="h-4 bg-gray-100 rounded w-full"></div>
      </div>
    </div>
  );

  if (!post) return <div className="text-center py-20">Post not found.</div>;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <article>
        {/* Post header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {post.mainCategory.name}
            </span>
            {post.subCategories.map(sub => (
              <span key={sub.id} className="text-gray-500 text-xs px-2 py-1">
                #{sub.name}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight text-black mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-gray-100">
            <div className="flex items-center space-x-3">
              <img 
                src={post.author.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + post.author.name} 
                alt={post.author.name} 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-sm">
                <p className="font-bold text-black">{post.author.name}</p>
                <p className="text-gray-500">
                  {format(new Date(post.createdAt), 'MMM d, yyyy')} · {Math.ceil(post.content.length / 1000)} min read
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-gray-400">
              {user && post.author.email === user.email && (
                <div className="flex items-center space-x-2 mr-4 pr-4 border-r border-gray-100">
                  <Link 
                    to={`/edit/${id}`}
                    className="flex items-center space-x-1 text-sm font-bold text-gray-500 hover:text-black transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>
                  <button 
                    onClick={handleDelete}
                    className="flex items-center space-x-1 text-sm font-bold text-red-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
              <button className="hover:text-black transition-colors"><Share2 className="w-5 h-5" /></button>
              <button className="hover:text-black transition-colors"><Bookmark className="w-5 h-5" /></button>
              <button className="hover:text-black transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <figure className="mb-12">
            <img 
              src={post.featuredImage} 
              alt={post.title} 
              className="w-full rounded-lg shadow-sm"
            />
          </figure>
        )}

        {/* Post content */}
        <div 
          className="prose prose-lg max-w-none mb-16"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Interactions */}
        <section className="flex items-center justify-between py-6 border-y border-gray-100 mb-16">
          <div className="flex items-center space-x-6">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${post.likedByCurrentUser ? 'text-red-500' : 'text-gray-500 hover:text-black'}`}
            >
              <Heart className={`w-6 h-6 ${post.likedByCurrentUser ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likesCount}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-500 hover:text-black">
              <MessageCircle className="w-6 h-6" />
              <span className="text-sm font-medium">{post.commentsCount}</span>
            </button>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <span className="text-sm">{post.viewsCount} views</span>
          </div>
        </section>

        {/* Comment section */}
        <section id="comments">
          <h3 className="text-xl font-bold font-sans mb-8">Comments ({post.commentsCount})</h3>
          
          <form onSubmit={handleCommentSubmit} className="mb-12">
            <textarea
              placeholder="What are your thoughts?"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg focus:ring-1 focus:ring-black outline-none transition-all resize-none min-h-[120px]"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button 
                type="submit"
                disabled={!newComment.trim()}
                className="btn btn-primary px-6 disabled:opacity-50"
              >
                Respond
              </button>
            </div>
          </form>

          <div className="space-y-10">
            {comments.map(comment => (
              <div key={comment.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={comment.user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user.name}`} 
                      alt={comment.user.name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-black">{comment.user.name}</p>
                      <p className="text-gray-500">{format(new Date(comment.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-800 font-sans leading-relaxed">{comment.content}</p>
                <div className="flex items-center space-x-4 text-xs font-medium text-gray-500">
                  <button className="flex items-center space-x-1 hover:text-black">
                    <Heart className="w-4 h-4" />
                    <span>{comment.likesCount}</span>
                  </button>
                  <button className="hover:text-black">Reply</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
};

export default BlogPost;
