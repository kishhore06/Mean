package com.blog.mean.service.serviceimpl;


import com.blog.mean.dto.PostDTO;
import com.blog.mean.dto.CreatePostRequest;
import com.blog.mean.entity.Post;
import com.blog.mean.entity.User;
import com.blog.mean.exception.ResourceNotFoundException;
import com.blog.mean.repository.PostRepository;
import com.blog.mean.repository.UserRepository;
import com.blog.mean.service.PostService;
import com.blog.mean.util.MapperUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final MapperUtil mapperUtil;
    
    @Override
    public PostDTO createPost(CreatePostRequest request) {
        User author = userRepository.findById(request.getAuthorId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAuthorId()));
        
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setFeaturedImage(request.getFeaturedImage());
        post.setAuthor(author);
        
        Post savedPost = postRepository.save(post);
        return mapperUtil.mapToPostDTO(savedPost);
    }
    
    @Override
    public PostDTO getPostById(Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        return mapperUtil.mapToPostDTO(post);
    }
    
    @Override
    public List<PostDTO> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(mapperUtil::mapToPostDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<PostDTO> getPostsByAuthor(Long authorId) {
        User author = userRepository.findById(authorId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + authorId));
        
        return postRepository.findByAuthorOrderByCreatedAtDesc(author).stream()
            .map(mapperUtil::mapToPostDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    public PostDTO updatePost(Long id, CreatePostRequest request) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setFeaturedImage(request.getFeaturedImage());
        
        Post updatedPost = postRepository.save(post);
        return mapperUtil.mapToPostDTO(updatedPost);
    }
    
    @Override
    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        postRepository.delete(post);
    }
}
