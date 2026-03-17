package com.blog.mean.util;

import com.blog.mean.dto.CommentDTO;
import com.blog.mean.dto.PostDTO;
import com.blog.mean.dto.UserDTO;
import com.blog.mean.entity.Comment;
import com.blog.mean.entity.Post;
import com.blog.mean.entity.User;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class MapperUtil {
    
    public UserDTO mapToUserDTO(User user) {
        if (user == null) return null;
        
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setBio(user.getBio());
        return dto;
    }
    
    public PostDTO mapToPostDTO(Post post) {
        if (post == null) return null;
        
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setExcerpt(post.getExcerpt());
        dto.setFeaturedImage(post.getFeaturedImage());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setAuthor(mapToUserDTO(post.getAuthor()));
        
        if (post.getComments() != null) {
            dto.setComments(post.getComments().stream()
                .map(this::mapToCommentDTO)
                .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    public CommentDTO mapToCommentDTO(Comment comment) {
        if (comment == null) return null;
        
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUser(mapToUserDTO(comment.getUser()));
        
        return dto;
    }
}
