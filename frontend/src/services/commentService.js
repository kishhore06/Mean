import api from './api';

export const commentService = {
  createComment: (commentData) => api.post('/comments', commentData),
  getCommentsByPost: (postId) => api.get(`/comments/post/${postId}`),
  updateComment: (id, content) => api.put(`/comments/${id}`, content),
  deleteComment: (id) => api.delete(`/comments/${id}`),
};