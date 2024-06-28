import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Row, Col } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import profileImageDefault from '../../assets/images/userDefaultProfile.jpg'
import defaultImage from "../../assets/images/defaultPostImage.webp"
import Post from '../../Components/PC/post/Post';
import styles from './Post.module.css'

function PostPage() {
    const navigate = useNavigate()
    const { postId } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search)
    const isLiked = searchParams.get("isLiked")

    const initialResponse = {
        post: {
            id: "",
            imageUrl: defaultImage,
        },
        profileImage: profileImageDefault,
        username: "",
    }
    const [response, setResponse] = useState(initialResponse)

    useEffect(() => {
        const fetchPost = async () => {
            const token = localStorage.getItem("token")
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/postId=${postId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setResponse(response.data)
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchPost();
    }, [])

    const backButtonHandler = () => {
        navigate("/profile", { replace: true })
    }

    return (
        <>
            <Row>
                <Col className='d-flex justify-content-end' md={2}>
                    <FontAwesomeIcon icon={faArrowLeft} className={`${styles.backArrow}`} onClick={backButtonHandler} />
                </Col>
            </Row>
            <Row className='mt-5'>
                <Col md={2}></Col>
                <Col className='d-flex justify-content-center align-items-center' md={8}>
                    <Post responseObject={response} isLiked={isLiked} />
                </Col>
            </Row>
        </>
    )
}

export default PostPage
