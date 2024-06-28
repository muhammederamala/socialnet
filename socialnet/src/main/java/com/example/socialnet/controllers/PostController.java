package com.example.socialnet.controllers;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.socialnet.Models.LikesModel;
import com.example.socialnet.Models.PostModel;
import com.example.socialnet.Models.UserModel;
import com.example.socialnet.Models.UserProfileModel;
import com.example.socialnet.repositories.LikeRepository;
import com.example.socialnet.repositories.PostRepository;
import com.example.socialnet.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    Cloudinary cloudinary;

    @Autowired
    PostRepository postRepository;

    @Autowired
    LikeRepository likeRepository;

    @PostMapping("/upload-photo")
    public ResponseEntity<Map<String,Object>> uploadPost(@RequestParam("image") MultipartFile imageFile, HttpServletRequest request)
    {
        Map<String,Object> response = new HashMap<>();

        try
        {
            String stringUserId = (String) request.getAttribute("userId");
            if (stringUserId == null) {
                response.put("error", "User ID not found in request");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            Long userId = Long.parseLong(stringUserId);

            // fetch the user details from db
            Optional<UserModel> optionalUser = userRepository.findById(userId);
            if(optionalUser == null)
            {
                response.put("error", "User ID not found in request");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            UserModel currUser = optionalUser.get();

            PostModel post = new PostModel();
            post.setUser(currUser);

            PostModel savedPost = postRepository.save(post);

            String originalFilename = imageFile.getOriginalFilename();
            String fileTypeExtension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            String imageName = savedPost.getId() + fileTypeExtension;

            Map uploadResult = cloudinary.uploader().upload(imageFile.getBytes(), ObjectUtils.asMap("public_id", imageName));

            // Get the image URL from Cloudinary's response
            String imageUrl = (String) uploadResult.get("url");

            savedPost.setImageUrl(imageUrl);
            postRepository.save(savedPost);
            response.put("message", "Post uploaded successfully");
            response.put("status", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        }
        catch(Exception e)
        {
            response.put("error", "Failed to upload Post image");
            response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/user-posts")
    public ResponseEntity<Map<String,Object>> getUserPosts(HttpServletRequest request)
    {
        Map<String,Object> response = new HashMap<>();
        try
        {
            String stringUserId = (String) request.getAttribute("userId");
            Long userId = Long.parseLong(stringUserId);
            if (userId == null) {
                response.put("error", "User ID not found in request");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            Optional<UserModel> optionalUser = userRepository.findById(userId);
            if (!optionalUser.isPresent()) {
                response.put("error", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            UserModel user = optionalUser.get();

            // Fetch all posts of the user
            List<PostModel> userPosts = postRepository.findByUser(user);
            response.put("userPosts", userPosts);

            //fetch all the posts the user liked
            List<LikesModel> userLikes = likeRepository.findAllByUser(user);
            response.put("userLikes", userLikes);

            return ResponseEntity.ok().body(response);
        }
        catch (Exception e)
        {
            response.put("error", "Invalid User ID format");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/postId={postId}")
    public ResponseEntity<Map<String,Object>> postById(@PathVariable Long postId)
    {
        Map<String,Object> response = new HashMap<>();
        try
        {
            Optional<PostModel> optionalPost = postRepository.findById(postId);
            if (!optionalPost.isPresent()) {
                response.put("error", "Post not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            PostModel post = optionalPost.get();

            UserModel user = post.getUser();
            String name = user.getUsername();

            UserProfileModel profile = user.getUserProfileModel();
            String profileImage = profile.getProfileImageUrl();

            response.put("post",post);
            response.put("username",name);
            response.put("profileImage",profileImage);
            return ResponseEntity.ok(response);
        }
        catch (Exception e)
        {
            response.put("error", "Could not fetch post");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/like")
    public ResponseEntity<Map<String,Object>> likePost (@RequestBody Map<String,Long> requestBody, HttpServletRequest request)
    {
        Map<String,Object> response = new HashMap<>();
        try{
            String stringUserId = (String) request.getAttribute("userId");
            if (stringUserId == null) {
                response.put("error", "User ID not found in request");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            Long userId = Long.parseLong(stringUserId);

            // Fetch the existing user details from the database
            Optional<UserModel> optionalUser = userRepository.findById(userId);
            if (!optionalUser.isPresent()) {
                response.put("error", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            UserModel existingUser = optionalUser.get();

            Optional<PostModel> optionalPost = postRepository.findById(requestBody.get("postId"));
            if (!optionalPost.isPresent()) {
                response.put("error", "Post not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            PostModel post = optionalPost.get();
            UserModel user = optionalUser.get();

            // Check if the like already exists
            Optional<LikesModel> existingLike = likeRepository.findByUserAndPost(user, post);

            if (existingLike.isPresent()) {
                // If like exists, remove it (unlike)
                likeRepository.delete(existingLike.get());
                response.put("isLiked", false);
            } else {
                // If like does not exist, create it
                LikesModel like = new LikesModel(user, post);
                likeRepository.save(like);
                response.put("isLiked", true);
            }

            long likesCount = likeRepository.countByPost(post);
            response.put("likesCount", likesCount);

            return ResponseEntity.ok(response);

        }
        catch (Exception e)
        {
            response.put("error", "Invalid User ID format"+e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
