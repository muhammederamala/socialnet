import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { modalActions } from '../../../../redux/modalSlice';

import PostsGrid from '../../postGrid/PostsGrid';

function UserPosts() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userPosts, setUserPosts] = useState([]);
    const [userLikes, setUserLikes] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/user-posts`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setUserPosts(response.data.userPosts);
                setUserLikes(response.data.userLikes);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        }

        fetchPosts();
    }, []);

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
        <PostsGrid
            userPosts={userPosts}
            isLiked={isLiked}
            likeHandler={likeHandler}
            handlePostClick={handlePostClick}
            handleCommentClick={handleCommentClick}
        />
    );
}

export default UserPosts;
