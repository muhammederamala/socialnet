package com.example.socialnet.repositories;

import com.example.socialnet.Models.CommentsModel;
import com.example.socialnet.dto.CommentsWithUser;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends CrudRepository<CommentsModel, Long> {
    List<CommentsModel> findByPostId(Long postId);

    @Query("SELECT new com.example.socialnet.dto.CommentsWithUser(c.id, c.content, u.username, up.profileImageUrl) FROM CommentsModel c JOIN c.user u JOIN u.userProfileModel up WHERE c.post.id = :postId")
    List<CommentsWithUser> findCommentsWithUserInfoByPostId(@Param("postId") Long postId);
}
