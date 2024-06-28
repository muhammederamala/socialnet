import React, { useState } from 'react';
import { Row, Col, Spinner, Container } from 'react-bootstrap';
import axios from 'axios';

import styles from './AddPost.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleXmark } from '@fortawesome/free-regular-svg-icons';
import { faRepeat } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';

function AddPost() {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false)

    const handleImageUpload = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const imageUrl = URL.createObjectURL(selectedFile);
            setImage(imageUrl);
        }
    };

    const cancelHandler = () => {
        setFile(null);
        setImage(null);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token");
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts/upload-photo`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Image uploaded successfully:', response.data);
            navigate("/profile")
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setLoading(false);
        }
    }

    const uploaded = (
        <img
            src={image}
            className={`${styles.image}`}
            alt="Uploaded Profile"
        />
    )

    const notUploaded = (
        <>
            <input
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: "none" }}
                id="imageInput"
            />
            <label htmlFor="imageInput" className={styles.uploadBox}>
                Click here to upload an image
            </label>
        </>
    )

    return (
        <Container>
            <Row>
                <Col md={2}></Col>
                <Col md={8}>
                    {!file && <h2>Add New Post</h2>}
                    {file ? uploaded : notUploaded}
                </Col>
                <Col md={2}></Col>
            </Row>
            {file && <Row>
                <Col md={2}></Col>
                <Col md={8}>
                    <Row className='my-4'>
                        <Col md={3}></Col>
                        <Col md={2}>
                            <FontAwesomeIcon onClick={cancelHandler} className={`${styles.cancelButton}`} icon={faRectangleXmark} />
                        </Col>
                        <Col md={2}>
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="repeatInput"
                            />
                            <button onClick={() => document.getElementById('repeatInput').click()}
                                className={`btn ${styles.changeButton}`}>
                                <FontAwesomeIcon icon={faRepeat} />
                            </button>
                        </Col>
                        <Col md={2}>
                            <button onClick={handleSubmit} className={`btn ${styles.submitButton}`}>
                                {loading ? <Spinner /> : "Confirm"}
                            </button>
                        </Col>
                    </Row>
                </Col>
            </Row>}
        </Container>
    );
}

export default AddPost;
