package com.example.socialnet.repositories;

import com.example.socialnet.Models.UserProfileModel;
import com.example.socialnet.Models.UserModel;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserProfileRepository extends CrudRepository<UserProfileModel, Long> {
    Optional<UserProfileModel> findByUser(UserModel user);
}
