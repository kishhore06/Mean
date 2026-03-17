package com.blog.mean.service;

import com.blog.mean.dto.CommentDTO;
import com.blog.mean.dto.CreateCommentRequest;
import java.util.List;

public interface CommentService {
    CommentDTO createComment(CreateCommentRequest request);
    List<CommentDTO> getCommentsByPost(Long postId);
    CommentDTO updateComment(Long id, String content);
    void deleteComment(Long id);
}
