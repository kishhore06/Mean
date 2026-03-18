import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Camera, User, Mail, FileText, Save } from 'lucide-react';
import api from '../services/api';

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Assuming there's a PUT /api/v1/users/profile or similar endpoint
      // Adjusting based on standard patterns if not sure
      const response = await api.put('/users/profile', formData);
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-gray-500 hover:text-black mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Profile
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
        <h1 className="text-3xl font-bold font-sans tracking-tight mb-2">Edit Profile</h1>
        <p className="text-gray-500 mb-10">Update your personal information and how others see you.</p>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-600 text-sm rounded-xl">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4 mb-2">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 ring-4 ring-gray-50 ring-offset-2">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-300" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors shadow-lg">
                <Camera className="w-4 h-4" />
                <input 
                  type="text" 
                  className="hidden" 
                  name="profileImage"
                  placeholder="Image URL"
                  onChange={(e) => setFormData({...formData, profileImage: e.target.value})}
                />
              </label>
            </div>
            <p className="text-xs text-gray-400">Click camera to set image URL</p>
            <div className="w-full">
               <input 
                type="text"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="Profile Image URL"
                className="w-full px-4 py-2 text-xs bg-gray-50 border border-gray-100 rounded-lg focus:ring-1 focus:ring-black outline-none"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-2" /> Full Name
              </label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <Mail className="w-4 h-4 mr-2" /> Email Address
              </label>
              <input 
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-100 rounded-xl text-gray-400 cursor-not-allowed"
              />
              <p className="text-[10px] text-gray-400 ml-1">Email cannot be changed currently.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center">
                <FileText className="w-4 h-4 mr-2" /> Short Bio
              </label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all resize-none"
                placeholder="Write a short bio about yourself..."
              ></textarea>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-black text-white font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
