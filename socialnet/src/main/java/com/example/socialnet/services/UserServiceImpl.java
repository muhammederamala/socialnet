package com.example.socialnet.services;

import com.example.socialnet.Models.UserModel;
import com.example.socialnet.config.SecurityConfig;
import com.example.socialnet.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecurityConfig passwordEncoder;

    @Override
    public void createUser(UserModel user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // encrypt the password
        user.setPassword(passwordEncoder.hashPassword(user.getPassword()));

        userRepository.save(user);
    }
}
