package com.example.socialnet.repositories;

import com.example.socialnet.Models.PostModel;
import com.example.socialnet.Models.UserModel;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends CrudRepository<PostModel, Long> {
    List<PostModel> findByUser(UserModel user);
}
