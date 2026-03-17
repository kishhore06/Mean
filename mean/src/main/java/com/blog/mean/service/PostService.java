package com.blog.mean.service;

import com.blog.mean.dto.PostDTO;
import com.blog.mean.dto.CreatePostRequest;
import java.util.List;

public interface PostService {
    PostDTO createPost(CreatePostRequest request);
    PostDTO getPostById(Long id);
    List<PostDTO> getAllPosts();
    List<PostDTO> getPostsByAuthor(Long authorId);
    PostDTO updatePost(Long id, CreatePostRequest request);
    void deletePost(Long id);
}
