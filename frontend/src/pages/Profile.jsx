import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  User as UserIcon, Settings, AtSign, FileText, 
  ChevronLeft, LogOut, Bookmark 
} from 'lucide-react';
import { getBookmarks } from '../services/bookmarkService';
import BlogCard from '../components/BlogCard';

const Profile = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ postsCount: 0, totalViews: 0 });
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfileData = useCallback(async () => {
    try {
      const postsRes = await api.get('/posts/my-posts');
      const posts = Array.isArray(postsRes.data) ? postsRes.data : [];
      setStats({
        postsCount: posts.length,
        totalViews: posts.reduce((sum, p) => sum + (p.viewsCount || 0), 0)
      });
      setBookmarks(getBookmarks());
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-500 hover:text-black mb-12 group"
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-16 gap-12 border-b border-gray-100 pb-16 mb-16">
        <div className="relative group">
          <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 shadow-xl shadow-black/5 ring-4 ring-white ring-offset-2 hover:ring-offset-0 transition-all">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserIcon className="w-16 h-16 text-gray-300" />
              </div>
            )}
          </div>
          <button className="absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50">
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="text-4xl font-bold font-sans tracking-tight mb-2">{user.name}</h1>
              <span className="flex items-center justify-center md:justify-start text-gray-500 text-sm">
                <AtSign className="w-3.5 h-3.5 mr-1.5" />{user.email}
              </span>
            </div>
            <Link 
              to="/edit-profile"
              className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-all flex items-center space-x-2 shadow-lg shadow-black/5"
            >
              <Settings className="w-4 h-4 mr-1.5" />
              <span>Edit Profile</span>
            </Link>
          </div>
          <p className="text-gray-600 font-serif text-lg leading-relaxed max-w-2xl mb-8">
            {user.bio || "No bio written yet. Share a bit about yourself with the world!"}
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-12">
            <div>
              <span className="block text-2xl font-bold text-black">{stats.postsCount}</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stories</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-black">{stats.totalViews}</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reads</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Link to="/my-blogs" className="group flex items-center justify-between p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-2xl hover:shadow-black/5 border border-transparent hover:border-gray-100 transition-all">
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:bg-gray-50 transition-colors shadow-sm">
              <FileText className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Your Stories</h3>
              <p className="text-sm text-gray-500">Manage your posts</p>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-300 rotate-180 group-hover:text-black group-hover:translate-x-1 transition-all" />
        </Link>

        <button onClick={logout} className="group flex items-center justify-between p-8 bg-red-50/30 rounded-2xl hover:bg-white hover:shadow-2xl hover:shadow-black/5 border border-transparent hover:border-red-100 transition-all">
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:bg-red-50 transition-colors shadow-sm">
              <LogOut className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-left leading-tight">
              <h3 className="text-lg font-bold text-red-600">Sign Out</h3>
              <p className="text-sm text-red-400">Safely exit</p>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-red-200 rotate-180 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      <section>
        <div className="flex items-center space-x-2 mb-8 border-b border-gray-100 pb-4">
          <Bookmark className="w-5 h-5 text-black" />
          <h2 className="text-2xl font-bold font-sans tracking-tight">Saved Stories</h2>
        </div>
        
        {bookmarks.length > 0 ? (
          <div className="space-y-4">
            {bookmarks.map(post => <BlogCard key={post.id} post={post} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
             <Bookmark className="w-10 h-10 text-gray-200 mx-auto mb-4" />
             <p className="text-gray-400 font-serif italic">Your reading list is empty. Save some stories to read them later!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
