package com.example.socialnet.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "likes")
public class LikesModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id", nullable = false)
    private UserModel user;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private PostModel post;

    public LikesModel() {}

    public LikesModel(UserModel user, PostModel post) {
        this.user = user;
        this.post = post;
    }
}
