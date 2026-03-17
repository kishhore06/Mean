package com.blog.mean.dto;


import lombok.Data;

@Data
public class CreatePostRequest {
    private String title;
    private String content;
    private String excerpt;
    private String featuredImage;
    private Long authorId;
}
