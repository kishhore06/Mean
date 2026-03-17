package com.blog.mean.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blog.mean.entity.Post;
import com.blog.mean.entity.User;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByAuthorOrderByCreatedAtDesc(User author);
    List<Post> findAllByOrderByCreatedAtDesc();
}
