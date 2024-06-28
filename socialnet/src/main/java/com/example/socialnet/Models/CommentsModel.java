package com.example.socialnet.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "comments")
public class CommentsModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id")
    private UserModel user;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "post_id")
    private PostModel post;

    public CommentsModel() {}

    public CommentsModel(String content, UserModel user, PostModel post) {
        this.content = content;
        this.user = user;
        this.post = post;
    }
}
