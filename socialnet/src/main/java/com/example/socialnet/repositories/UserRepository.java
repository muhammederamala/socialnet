package com.example.socialnet.repositories;

import com.example.socialnet.Models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<UserModel, Long> {
    boolean existsByEmail(String email);
    Optional<UserModel> findByEmail(String email);

    List<UserModel> findByUsernameContainingIgnoreCase(String searchTerm);
}
