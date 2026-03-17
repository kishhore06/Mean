package com.blog.mean.service.serviceimpl;

import com.blog.mean.dto.CommentDTO;
import com.blog.mean.dto.CreateCommentRequest;
import com.blog.mean.entity.Comment;
import com.blog.mean.entity.Post;
import com.blog.mean.entity.User;
import com.blog.mean.exception.ResourceNotFoundException;
import com.blog.mean.repository.CommentRepository;
import com.blog.mean.repository.PostRepository;
import com.blog.mean.repository.UserRepository;
import com.blog.mean.util.MapperUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import com.blog.mean.service.CommentService;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final MapperUtil mapperUtil;
    
    @Override
    public CommentDTO createComment(CreateCommentRequest request) {
        Post post = postRepository.findById(request.getPostId())
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + request.getPostId()));
        
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setPost(post);
        comment.setUser(user);
        
        Comment savedComment = commentRepository.save(comment);
        return mapperUtil.mapToCommentDTO(savedComment);
    }
    
    @Override
    public List<CommentDTO> getCommentsByPost(Long postId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        
        return commentRepository.findByPostOrderByCreatedAtDesc(post).stream()
            .map(mapperUtil::mapToCommentDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public CommentDTO updateComment(Long id, String content) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));
        
        comment.setContent(content);
        Comment updatedComment = commentRepository.save(comment);
        return mapperUtil.mapToCommentDTO(updatedComment);
    }
    
    @Override
    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));
        commentRepository.delete(comment);
    }
}
