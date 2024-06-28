package com.example.socialnet.controllers;

import com.example.socialnet.Models.LikesModel;
import com.example.socialnet.Models.UserModel;
import com.example.socialnet.Models.UserProfileModel;
import com.example.socialnet.repositories.LikeRepository;
import com.example.socialnet.repositories.UserProfileRepository;
import com.example.socialnet.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/search")
public class SearchController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserProfileRepository userProfileRepository;

    @Autowired
    LikeRepository likeRepository;

    @GetMapping("/search-user")
    public ResponseEntity<Map<String, Object>> getSearchUserResults(HttpServletRequest request, @RequestParam String searchTerm) {
        Map<String, Object> response = new HashMap<>();
        try {
            String stringUserId = (String) request.getAttribute("userId");
            if (stringUserId == null) {
                response.put("error", "User ID not found in request");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            if (searchTerm == null || searchTerm.isEmpty()) {
                response.put("error", "Search term is missing");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            List<UserModel> users = userRepository.findByUsernameContainingIgnoreCase(searchTerm);
            List<Map<String, Object>> simplifiedUsers = new ArrayList<>();

            for (UserModel user : users) {
                Map<String, Object> simplifiedUser = new HashMap<>();
                simplifiedUser.put("username", user.getUsername());
                simplifiedUser.put("email",user.getEmail());

                if (user.getUserProfileModel() != null) {
                    simplifiedUser.put("userProfileImageUrl", user.getUserProfileModel().getProfileImageUrl());
                } else {
                    simplifiedUser.put("userProfileImageUrl", "");
                }

                simplifiedUsers.add(simplifiedUser);
            }

            response.put("users", simplifiedUsers);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "An error occurred while searching for users");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/visit-user-profile")
    public ResponseEntity<Map<String, Object>> visitUserProfile(HttpServletRequest request, @RequestParam String email)
    {
        Map<String,Object> response = new HashMap<>();
        try
        {
            Optional<UserModel> optionalUser = userRepository.findByEmail(email);
            if (!optionalUser.isPresent()) {
                response.put("error", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            UserModel user = optionalUser.get();

            //fetch all the posts the user liked
            List<LikesModel> userLikes = likeRepository.findAllByUser(user);
            response.put("userLikes", userLikes);

            response.put("email",user.getEmail());
            response.put("username",user.getUsername());
            response.put("posts",user.getPosts());
            response.put("profile",user.getUserProfileModel());

            return ResponseEntity.ok(response);
        }
        catch(Exception e)
        {
            response.put("error", "An error occurred");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
