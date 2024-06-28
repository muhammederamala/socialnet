import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faComment } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';

import styles from './Post.module.css';
import { useParams } from 'react-router';

import { modalActions } from "../../../redux/modalSlice"
import { useDispatch } from 'react-redux';

function Post({ responseObject, isLiked }) {
  const dispatch = useDispatch()
  const { postId } = useParams()

  const [liked, setLiked] = useState(isLiked == "true" ? true : false)

  const likeHandler = async () => {
    const token = localStorage.getItem("token");
    liked ? setLiked(false) : setLiked(true);
    const payload = {
      postId: postId
    }

    try {
      const response = axios.post(`${process.env.REACT_APP_BASE_URL}/posts/like`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
    catch (err) {
      console.log(err);
    }
  }

  const handleCommentClick = (e) => {
    e.stopPropagation();
    dispatch(modalActions.showCommentsModal({ postId: postId }));
  }

  return (
    <div className={styles.container}>
      <Row className={`${styles.userInfo}`}>
        <Col xs="auto">
          <img src={responseObject.profileImage} className={styles.profileImage} alt="Profile" />
        </Col>
        <Col className='p-0'>
          <span className={styles.username}>{responseObject.username}</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className={styles.imageContainer}>
            <img src={responseObject.post.imageUrl} className={styles.image} alt="Post" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div>
            <FontAwesomeIcon onClick={() => { likeHandler() }} icon={liked ? faHeartSolid : faHeartRegular} className={`${liked ? styles.likedHeart : styles.icon}`} />
            <FontAwesomeIcon onClick={(e) => { handleCommentClick(e) }} icon={faComment} className={styles.icon} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Post;
