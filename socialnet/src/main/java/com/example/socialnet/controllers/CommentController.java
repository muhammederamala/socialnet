package com.example.socialnet.controllers;

import com.example.socialnet.Models.CommentsModel;
import com.example.socialnet.Models.PostModel;
import com.example.socialnet.Models.UserModel;
import com.example.socialnet.Models.UserProfileModel;
import com.example.socialnet.dto.CommentsWithUser;
import com.example.socialnet.repositories.CommentRepository;
import com.example.socialnet.repositories.PostRepository;
import com.example.socialnet.repositories.UserProfileRepository;
import com.example.socialnet.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/comments")
public class CommentController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserProfileRepository userProfileRepository;

    @Autowired
    PostRepository postRepository;

    @Autowired
    CommentRepository commentRepository;

    @PostMapping("/add-comment")
    public ResponseEntity<Map<String, Object>> addComment(@RequestParam("postId") Long postId, @RequestBody Map<String, String> requestMap, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String stringUserId = (String) request.getAttribute("userId");
            if (stringUserId == null) {
                response.put("error", "User ID not found in request");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            Long userId = Long.parseLong(stringUserId);

            Optional<UserModel> optionalUser = userRepository.findById(userId);
            if (!optionalUser.isPresent()) {
                response.put("error", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            Optional<PostModel> optionalPost = postRepository.findById(postId);
            if (!optionalPost.isPresent()) {
                response.put("error", "Post not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            UserModel user = optionalUser.get();
            PostModel post = optionalPost.get();

            Optional<UserProfileModel> optionalProfile = userProfileRepository.findByUser(user);
            if (!optionalProfile.isPresent()) {
                response.put("error", "UserProfile not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            UserProfileModel userProfile = optionalProfile.get();

            String commentContent = requestMap.get("commentContent");
            CommentsModel comment = new CommentsModel(commentContent, user, post);
            commentRepository.save(comment);

            response.put("message", "Comment added successfully");
            response.put("comment", comment);
            response.put("username",user.getUsername());
            response.put("profileImageUrl",userProfile.getProfileImageUrl());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("error", "An error occurred while adding the comment");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/all-comments")
    public ResponseEntity<Map<String, Object>> getCommentsByPost(@RequestParam("postId") Long postId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<PostModel> optionalPost = postRepository.findById(postId);
            if (!optionalPost.isPresent()) {
                response.put("error", "Post not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            List<CommentsWithUser> comments = commentRepository.findCommentsWithUserInfoByPostId(postId);
            response.put("comments", comments);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            response.put("error", "An error occurred while retrieving the comments");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
