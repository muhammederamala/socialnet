import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faArrowUpRightFromSquare, faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';

import styles from './PostsGrid.module.css'

const PostsGrid = ({ height, userPosts, isLiked, likeHandler, handlePostClick, handleCommentClick }) => {
    return (
        <Container className={styles.containerWithCustomScrollbar} style={{ overflow: "auto", height: "90vh" }}>
            <h4>Posts</h4>
            {userPosts.map((post, index) => (
                index % 3 === 0 && (
                    <Row className='mt-2' key={index}>
                        {userPosts.slice(index, index + 3).map((postItem, postIndex) => (
                            <Col onClick={() => handlePostClick(postItem.id)} className='p-1' key={postIndex} md={4}>
                                <div className={styles.postContainer}>
                                    <div className={styles.imageContainer} style={{ height: height === "full" ? "16rem" : "10rem" }}>
                                        <img
                                            src={postItem.imageUrl}
                                            className={styles.postImage}
                                            alt={`Post ${postItem.id}`}
                                        />
                                    </div>
                                    <div className={styles.iconContainer}>
                                        <FontAwesomeIcon
                                            onClick={(e) => likeHandler(postItem.id, e)}
                                            icon={isLiked(postItem.id) ? solidHeart : regularHeart}
                                            className={`${isLiked(postItem.id) ? styles.likedHeart : styles.icon}`}
                                        />
                                        <FontAwesomeIcon onClick={(e) => { handleCommentClick(e, postItem.id) }} icon={faComment} className={styles.icon} />
                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className={styles.icon} />
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )
            ))}
        </Container>
    );
};

export default PostsGrid;
