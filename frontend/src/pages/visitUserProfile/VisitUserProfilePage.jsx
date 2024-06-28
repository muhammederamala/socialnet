import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import defaultUserImage from "../../assets/images/userDefaultProfile.jpg";
import styles from './VisitUserProfilePage.module.css';
import PostsGrid from "../../Components/PC/postGrid/PostsGrid"

import { modalActions } from '../../redux/modalSlice';

function VisitUserProfilePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { email } = useParams();
    const [userProfile, setUserProfile] = useState({
        username: "",
        profile: {},
        posts: [],
    });
    const [userLikes, setUserLikes] = useState([])
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/search/visit-user-profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        email: email
                    }
                });
                const responseObject = {
                    username: response.data.username,
                    profile: response.data.profile,
                    posts: response.data.posts || [],
                }
                setUserLikes(response.data.userLikes);
                setUserProfile(responseObject);
            } catch (e) {
                setError("Failed to load user profile");
                console.log(e);
            }
        };

        fetchUserProfile();
    }, [email]);

    const likeHandler = async (postId, e) => {
        e.stopPropagation();
        const token = localStorage.getItem("token");
        const payload = {
            postId: postId
        }

        setUserLikes(prevLikes => {
            const isAlreadyLiked = prevLikes.some(like => like.post.id === postId);
            if (isAlreadyLiked) {
                return prevLikes.filter(like => like.post.id !== postId);
            } else {
                return [...prevLikes, { post: { id: postId } }];
            }
        });

        try {
            const response = axios.post(`${process.env.REACT_APP_BASE_URL}/posts/like`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data)
        }
        catch (err) {
            console.log(err);
        }
    }

    const isLiked = (postId) => {
        return userLikes.some(item => item.post.id === postId);
    }

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}?isLiked=${isLiked(postId) ? true : false}`, { replace: true })
    }

    const handleCommentClick = (e, postId) => {
        e.stopPropagation();
        dispatch(modalActions.showCommentsModal({ postId: postId }));
    }

    return (
        <Container className={styles.profileContainer}>
            <Row>
                <Col xs={4} md={4} lg={4}>
                    <Image src={userProfile.profile.profileImageUrl || defaultUserImage} roundedCircle className={styles.profileImage} />
                </Col>
                <Col xs={6}>
                    <Row>
                        <Col md={4}>
                            <h4>{userProfile.username}</h4>
                        </Col>
                        <Col md={3}>
                            <button className={`btn ${styles.followButton}`}>Follow</button>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col md={4}>
                            <strong>{userProfile.posts.length}</strong>
                            <span>Posts</span>
                        </Col>
                        <Col md={4}>
                            <strong>14.9m</strong>
                            <span>Followers</span>
                        </Col>
                        <Col md={4}>
                            <strong>1,028</strong>
                            <span>Following</span>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className='mt-5'>
                <PostsGrid
                    height={"full"}
                    userPosts={userProfile.posts}
                    isLiked={isLiked}
                    likeHandler={likeHandler}
                    handlePostClick={handlePostClick}
                    handleCommentClick={handleCommentClick}
                />
            </Row>
        </Container>
    );
}

export default VisitUserProfilePage;
