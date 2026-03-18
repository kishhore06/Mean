import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Bookmark, Clock, MoreHorizontal } from 'lucide-react';

const BlogCard = ({ post }) => {
  const { 
    id, 
    title, 
    content, 
    featuredImage, 
    author, 
    createdAt, 
    mainCategory, 
    viewsCount, 
    likesCount 
  } = post;

  // Simple reading time calculation
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.ceil(words / 200);

  return (
    <article className="flex flex-col md:flex-row gap-8 py-10 border-b border-gray-100 last:border-0 group">
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <img 
              src={author.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + author.name} 
              alt={author.name} 
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="font-medium text-black">{author.name}</span>
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
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {readingTime} min read
            </span>
            <span>{viewsCount} views</span>
            <span>{likesCount} likes</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-400">
            <button className="hover:text-black transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="hover:text-black transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {featuredImage && (
        <Link to={`/blog/${id}`} className="md:w-52 h-36 shrink-0 group-hover:opacity-90 transition-opacity order-first md:order-last">
          <img 
            src={featuredImage} 
            alt={title} 
            className="w-full h-full object-cover rounded-md bg-gray-50"
          />
        </Link>
      )}
    </article>
  );
};

export default BlogCard;
