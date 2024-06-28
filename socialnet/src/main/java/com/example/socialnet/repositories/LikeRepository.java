package com.example.socialnet.repositories;

import com.example.socialnet.Models.LikesModel;
import com.example.socialnet.Models.PostModel;
import com.example.socialnet.Models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends CrudRepository<LikesModel, Long> {

    Optional<LikesModel> findByUserAndPost(UserModel user, PostModel post);

    List<LikesModel> findAllByUser(UserModel user);

    long countByPost(PostModel post);
}
