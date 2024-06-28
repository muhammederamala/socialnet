import React, { useState, useEffect } from "react";
import { Container, Spinner, Form, Button, ListGroup } from "react-bootstrap";
import axios from "axios";
import styles from "./CommentsSection.module.css";

function CommentsSection({ postId }) {
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const token = localStorage.getItem("token")

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/comments/all-comments`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    postId: postId
                }
            });
            setComments(response.data.comments);
        } catch (error) {
            console.error("Error fetching comments", error);
        }
        setLoading(false);
    };

    const addCommentHandler = async () => {
        if (newComment.trim() === "") return;
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/comments/add-comment`,
                {
                    commentContent: newComment
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        postId: postId
                    }
                });
                console.log(response.data)
            setComments((prevComments) => [...prevComments, response.data]);
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <Container>
            <div style={{ minHeight: "65vh", overflow: "auto" }}>
                {loading && <Spinner animation="border" />}
                {!loading && (
                    <ListGroup className={styles.commentsList}>
                        {comments.map((comment) => (
                            <ListGroup.Item key={comment.id} className={styles.commentItem}>
                                <img src={comment.profileImageUrl} alt="User Profile" className={styles.profileImage} />
                                <div className={styles.commentContent}>
                                    <strong>{comment.username}</strong> {comment.content}
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </div>
            <div className={styles.footer}>
                <Form className={styles.commentForm} onSubmit={(e) => {
                    e.preventDefault();
                    addCommentHandler();
                }}>
                    <Form.Control
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className={styles.commentInput}
                    />
                    <button type="submit" className={`btn ${styles.submitButton}`} disabled={loading}>
                        {loading ? <Spinner as="span" animation="border" size="sm" /> : "Post"}
                    </button>
                </Form>
            </div>
        </Container>
    );
}

export default CommentsSection;
