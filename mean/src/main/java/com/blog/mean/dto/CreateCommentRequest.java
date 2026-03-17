package com.blog.mean.dto;

import lombok.Data;

@Data
public class CreateCommentRequest {
    private String content;
    private Long userId;
    private Long postId;
}
