import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Bookmark, Clock, MoreHorizontal, Share2, 
  Edit3, Trash2, User as UserIcon 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toggleBookmark, isPostBookmarked } from '../services/bookmarkService';

const BlogCard = ({ post }) => {
  const { 
    id, title, content, featuredImage, author, 
    createdAt, mainCategory, viewsCount, likesCount 
  } = post;

  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(isPostBookmarked(id));
  const [showMenu, setShowMenu] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  const isAuthor = user && author && user.id === author.id;

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/blog/${id}`;
    navigator.clipboard.writeText(url);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 2000);
  };

  const onBookmarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleBookmark(post);
    setIsBookmarked(newState);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/profile');
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await api.delete(`/posts/${id}`);
        window.location.reload();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <article className="flex flex-col md:flex-row gap-8 py-10 border-b border-gray-100 last:border-0 group relative">
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <img 
              src={author.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.name}`} 
              alt={author.name} 
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="font-medium text-black cursor-pointer hover:underline" onClick={handleProfileClick}>
              {author.name}
            </span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">{format(new Date(createdAt), 'MMM d, yyyy')}</span>
          </div>

          <Link to={`/blog/${id}`} className="block group-hover:opacity-80 transition-opacity">
            <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-black line-clamp-2">
              {title}
            </h2>
          </Link>

          <p className="text-gray-600 font-serif leading-snug line-clamp-3 text-base">
            {content.replace(/<[^>]*>/g, '').substring(0, 160)}...
          </p>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-4 text-xs font-medium text-gray-500">
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {mainCategory.name}
            </span>
            <span>{viewsCount} views</span>
            <span>{likesCount} likes</span>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-400">
            <div className="relative">
              <button onClick={handleShare} className="hover:text-black transition-colors" title="Share link">
                <Share2 className="w-5 h-5" />
              </button>
              {shareFeedback && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded">
                  Copied!
                </span>
              )}
            </div>

            <button 
              onClick={onBookmarkToggle}
              className={`transition-colors ${isBookmarked ? 'text-black fill-black' : 'hover:text-black'}`}
              title="Save story"
            >
              <Bookmark className="w-5 h-5" />
            </button>

            <div className="relative">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu); }}
                className="hover:text-black transition-colors"
                onBlur={() => setTimeout(() => setShowMenu(false), 200)}
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              {showMenu && (
                <div 
                  className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl py-1 z-10 overflow-hidden"
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking menu container
                >
                   <button 
                    onMouseDown={handleShare}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center space-x-2"
                   >
                      <Share2 className="w-4 h-4" /> <span>Share Story</span>
                   </button>
                   <button 
                    onMouseDown={onBookmarkToggle}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center space-x-2"
                   >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-black' : ''}`} /> 
                      <span>{isBookmarked ? 'Remove Bookmark' : 'Save Story'}</span>
                   </button>
                   <button 
                    onMouseDown={handleProfileClick}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center space-x-2"
                   >
                      <UserIcon className="w-4 h-4" /> <span>View Profile</span>
                   </button>
                   
                   {isAuthor && (
                     <>
                        <div className="border-t border-gray-50 my-1"></div>
                        <button 
                          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/edit/${id}`); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <Edit3 className="w-4 h-4" /> <span>Edit Story</span>
                        </button>
                        <button 
                          onMouseDown={handleDelete}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" /> <span>Delete Story</span>
                        </button>
                     </>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {featuredImage && (
        <Link to={`/blog/${id}`} className="md:w-52 h-36 shrink-0 group-hover:opacity-90 transition-opacity order-first md:order-last">
          <img src={featuredImage} alt={title} className="w-full h-full object-cover rounded-md bg-gray-50 shadow-sm" />
        </Link>
      )}
    </article>
  );
};

export default BlogCard;
