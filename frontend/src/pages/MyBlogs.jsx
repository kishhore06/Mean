import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import BlogCard from '../components/BlogCard';
import { PenSquare, ChevronLeft, Layout } from 'lucide-react';

const MyBlogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyPosts = useCallback(async () => {
    try {
      const response = await api.get('/posts/my-posts');
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching my posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-gray-500 hover:text-black mb-4 group"
          >
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <h1 className="text-4xl font-bold font-sans tracking-tight">Your Stories</h1>
          <p className="text-gray-500 mt-2">Manage and view all your published and draft posts.</p>
        </div>
        
        <Link 
          to="/create" 
          className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors self-start md:self-center shadow-lg shadow-black/5"
        >
          <PenSquare className="w-4 h-4" />
          <span>Write a Story</span>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                <div className="h-8 bg-gray-100 rounded w-3/4"></div>
                <div className="h-20 bg-gray-100 rounded w-full"></div>
              </div>
              <div className="md:w-52 h-36 bg-gray-100 rounded-md"></div>
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="relative group">
               <BlogCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
          <Layout className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No stories yet</h3>
          <p className="text-gray-500 mt-2 max-w-xs mx-auto">
            You haven't written any stories on BlogHub yet. Start sharing your ideas today!
          </p>
          <Link 
            to="/create" 
            className="mt-8 inline-block text-black font-bold uppercase tracking-widest text-xs border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
          >
            Write your first story
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
