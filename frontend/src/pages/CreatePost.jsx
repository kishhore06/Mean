import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Editor from '../components/Editor';
import { ChevronLeft, Image as ImageIcon, Send } from 'lucide-react';

const CreatePost = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featuredImage: '',
    mainCategoryId: '',
    subCategoryIds: [],
    status: 'PUBLISHED'
  });

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/categories/main');
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching categories", error);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleMainCategoryChange = async (e) => {
    const id = e.target.value;
    setFormData({ ...formData, mainCategoryId: id, subCategoryIds: [] });
    if (id) {
      try {
        const response = await api.get(`/categories/sub/${id}`);
        setSubCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching subcategories", error);
        setSubCategories([]);
      }
    } else {
      setSubCategories([]);
    }
  };

  const handleSubCategoryToggle = (id) => {
    const current = [...formData.subCategoryIds];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    setFormData({ ...formData, subCategoryIds: current });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.mainCategoryId) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await api.post('/posts', formData);
      navigate('/');
    } catch (error) {
      console.error("Error creating post", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-500 hover:text-black mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <form onSubmit={handleSubmit} className="space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-sans tracking-tight">Create your story</h1>
          <div className="flex items-center space-x-4">
            <button 
              type="button"
              onClick={() => setFormData({ ...formData, status: 'DRAFT' })}
              className="text-sm font-medium text-gray-500 hover:text-black"
            >
              Save Draft
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="btn btn-primary px-6 py-2.5 flex items-center space-x-2"
            >
              {loading ? 'Publishing...' : (
                <>
                  <span>Publish</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </header>

        <div className="space-y-6">
          <input
            type="text"
            placeholder="Title"
            className="w-full text-4xl md:text-5xl font-bold font-sans border-none focus:ring-0 placeholder:text-gray-200"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Main Category</label>
              <select
                required
                className="w-full bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-black"
                value={formData.mainCategoryId}
                onChange={handleMainCategoryChange}
              >
                <option value="">Select a category</option>
                {Array.isArray(categories) && categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-[2] min-w-[300px]">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Featured Image URL</label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="Paste an image URL..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-black"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                />
                <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          {subCategories.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Sub-topics</label>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(subCategories) && subCategories.map(sub => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSubCategoryToggle(sub.id)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                      formData.subCategoryIds.includes(sub.id)
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <Editor 
              value={formData.content} 
              onChange={(html) => setFormData({ ...formData, content: html })} 
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
