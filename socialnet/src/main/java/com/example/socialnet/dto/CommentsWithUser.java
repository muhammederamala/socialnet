package com.example.socialnet.dto;

public class CommentsWithUser {
    private Long id;
    private String content;
    private String username;
    private String profileImageUrl;

    // Constructor
    public CommentsWithUser(Long id, String content, String username, String profileImageUrl) {
        this.id = id;
        this.content = content;
        this.username = username;
        this.profileImageUrl = profileImageUrl;
    }

    // Getters and setters (You can generate these using your IDE or write them manually)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
}
