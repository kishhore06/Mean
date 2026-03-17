package com.blog.mean.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class PostDTO {
    private Long id;
    private String title;
    private String content;
    private String excerpt;
    private String featuredImage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserDTO author;
    private List<CommentDTO> comments;
}
