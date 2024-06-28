package com.example.socialnet.controllers;

import com.cloudinary.Cloudinary;
import com.example.socialnet.Models.UserProfileModel;
import com.example.socialnet.repositories.UserProfileRepository;
import com.example.socialnet.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import com.cloudinary.utils.ObjectUtils;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.example.socialnet.Models.UserModel;
import com.example.socialnet.services.UserServiceImpl;
import com.example.socialnet.util.JwtUtil;
import com.example.socialnet.dto.LoginRequest;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private Cloudinary cloudinary;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest user) {
        Map<String, Object> response = new HashMap<>();
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // get user model from database using given email
            UserModel userModel = userRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String email = userDetails.getUsername();

            // generate jwt using id
            String jwt = jwtUtil.generateToken(email, String.valueOf(userModel.getId()));

            response.put("message", "Logged in successfully");
            response.put("token", jwt);
            response.put("status", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Invalid username or password");
            response.put("status", HttpStatus.UNAUTHORIZED.value());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody UserModel user) {
        Map<String, Object> response = new HashMap<>();
        try {
            userService.createUser(user);
            String jwt = jwtUtil.generateToken(user.getEmail(), String.valueOf(user.getId()));
            response.put("message", "Signed up successfully");
            response.put("token", jwt);
            response.put("status", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", e.getMessage());
            response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String,Object>> profile(HttpServletRequest request)
    {
        Map<String, Object> response = new HashMap<>();
        try {
            String stringUserId = (String) request.getAttribute("userId");
            Long userId = Long.parseLong(stringUserId);
            if (userId == null) {
                response.put("error", "User ID not found in request");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // Fetch the user details from the database
            Optional<UserModel> optionalUser = userRepository.findById(userId);
            if (!optionalUser.isPresent()) {
                response.put("error", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            UserModel user = optionalUser.get();

            response.put("username", user.getUsername());
            response.put("email",user.getEmail());

            // Check if the corresponding UserProfileModel exists
            Optional<UserProfileModel> optionalProfile = userProfileRepository.findByUser(user);
            if (optionalProfile.isPresent()) {
                UserProfileModel userProfile = optionalProfile.get();
                response.put("userProfile", userProfile);
            } else {
                response.put("userProfile", false);
            }

            return ResponseEntity.ok(response);
        }
        catch (Exception e)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/update-profile")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody UserProfileModel updatedProfile, HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
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

            // Check if a UserProfile exists for the user
            UserProfileModel userProfile = existingUser.getUserProfileModel();
            if (userProfile == null) {
                // Create a new UserProfile if it doesn't exist
                userProfile = new UserProfileModel();
                userProfile.setUser(existingUser);
            }

            // Update the UserProfile with the new information
            userProfile.setDateOfBirth(updatedProfile.getDateOfBirth());
            userProfile.setNationality(updatedProfile.getNationality());
            userProfile.setPhoneNumber(updatedProfile.getPhoneNumber());
            userProfile.setGender(updatedProfile.getGender());

            // Save the updated UserProfile back to the database
            userProfileRepository.save(userProfile);

            response.put("message", "Profile updated successfully");
            response.put("status", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/upload-profile-image")
    public ResponseEntity<Map<String, Object>> uploadProfileImage(@RequestParam("image") MultipartFile imageFile, HttpServletRequest request)
    {
        Map<String, Object> response = new HashMap<>();
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

            // Check if a UserProfile exists for the user
            UserProfileModel userProfile = existingUser.getUserProfileModel();
            if (userProfile == null) {
                // Create a new UserProfile if it doesn't exist
                userProfile = new UserProfileModel();
                userProfile.setUser(existingUser);
            }
            else {
                // if a profile image already exists, delete it from Cloudinary
                String oldImageUrl = userProfile.getProfileImageUrl();
                if (oldImageUrl != null) {
                    String publicId = oldImageUrl.substring(oldImageUrl.lastIndexOf('/') + 1, oldImageUrl.lastIndexOf('.'));
                    cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                }
            }

            String originalFilename = imageFile.getOriginalFilename();
            String fileTypeExtension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            String imageName = userId + fileTypeExtension;

            Map uploadResult = cloudinary.uploader().upload(imageFile.getBytes(), ObjectUtils.asMap("public_id", imageName));

            // Get the image URL from Cloudinary's response
            String imageUrl = (String) uploadResult.get("url");

            // Set the image URL in UserProfileModel
            userProfile.setProfileImageUrl(imageUrl);

            // Save UserProfileModel to the database
            userProfileRepository.save(userProfile);

            response.put("message", "Profile image uploaded successfully");
            response.put("status", HttpStatus.OK.value());
            return ResponseEntity.ok(response);
        }
        catch(Exception e)
        {
            response.put("error", "Failed to upload profile image");
            response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
