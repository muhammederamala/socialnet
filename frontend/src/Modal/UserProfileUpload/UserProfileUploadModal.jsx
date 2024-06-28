import React, { useState } from "react";
import { Modal, Container, Row, Col, Spinner } from "react-bootstrap";
import ModalPortal from "../ModalPortal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { modalActions } from "../../redux/modalSlice";
import axios from "axios";
import styles from "./UserProfileUploadModal.module.css";

function UserProfileUploadModal() {
    const dispatch = useDispatch();
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const showModal = useSelector((state) => state.modal.userProfileUpload)

    const handleImageUpload = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const imageUrl = URL.createObjectURL(selectedFile);
            setImage(imageUrl);
        }
    };

    const handleSubmit = async () => {
        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            const token = localStorage.getItem("token");
            setLoading(true);
            try {
                const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/upload-profile-image`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                dispatch(modalActions.hideUserProfileUpload())
            } catch (error) {
                console.error("Error uploading image:", error);
            }
            finally {
                setLoading(false)
            }
        }
    };

    const onHideHandler = () => {
        setImage(null);
        setFile(null);
        dispatch(modalActions.hideUserProfileUpload());
    };

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
                <div style={{ fontSize: "24px", marginBottom: "10px" }}>
                    <FontAwesomeIcon icon={faPlus} />
                </div>
                Click here to upload an image
            </label>
        </>
    )

    const uploaded = (
        <img
            src={image}
            alt="Uploaded Profile"
            style={{ width: "250px", maxHeight: "250px" }}
        />
    )

    return (
        <ModalPortal>
            <Modal show={showModal} onHide={onHideHandler} size="lg">
                <Container>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Profile Photo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="justify-content-center">
                            <Col className="d-flex justify-content-center aligh-items-center" xs={12} sm={6}>
                                {!image && notUploaded}
                                {image && uploaded}
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Row className="justify-content-center">
                            {!image && (
                                <Col xs="auto">
                                    <button className={`btn ${styles.cancelButton}`} onClick={onHideHandler}>
                                        Cancel
                                    </button>
                                </Col>
                            )}
                            {image && (
                                <>
                                    <Col xs="auto">
                                        <button
                                            className={`btn ${styles.cancelButton}`}
                                            onClick={() => {
                                                setImage(null);
                                                setFile(null);
                                            }}
                                        >
                                            Change Photo
                                        </button>
                                    </Col>
                                    <Col xs="auto">
                                        <button className={`btn ${styles.submitButton}`} onClick={handleSubmit}>
                                            {loading ? <Spinner /> : "Confirm"}
                                        </button>
                                    </Col>
                                </>
                            )}
                        </Row>
                    </Modal.Footer>
                </Container>
            </Modal>
        </ModalPortal>
    );
}

export default UserProfileUploadModal;
