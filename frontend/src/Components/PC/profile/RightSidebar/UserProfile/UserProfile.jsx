import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import styles from './UserProfile.module.css'
import UserProfileForm from './ProfileForm/UserProfileForm';
import UserProfileDetails from './UserProfileDetails/UserProfileDetails';

import UserProfileImage from './UserProfileImage/UserProfileImage';
import { useSelector } from 'react-redux';

function UserProfile() {
    const [responeObject, setResponseObject] = useState({ username: "", email: "", userProfile: {} });
    const [edit, setEdit] = useState(false);
    const editProfileImage = useSelector((state) => state.modal.userProfileUpload)

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const res = {
                    email: response.data.email,
                    username: response.data.username,
                    userProfile: response.data.userProfile
                }
                setResponseObject(res);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [edit, editProfileImage]);

    const editToggle = (value) => {
        if (value === "edit") {
            setEdit(true);
        }
        if (value === "noedit") {
            setEdit(false);
        }
    }

    return (
        <Container className={styles.containerWithCustomScrollbar} style={{ height: "85vh", overflow: "auto" }}>
            <Row style={{ marginTop: "1rem" }}>
                <Col md={12} className='d-flex justify-content-center align-items-center'>
                    <UserProfileImage responseObject={responeObject} />
                </Col>
            </Row>
            <Row style={{ marginTop: "1rem" }}>
                <Col md={12} className='d-flex justify-content-center align-items-center'>
                    <p style={{ fontWeight: "800" }}>{responeObject.username}</p>
                </Col>
            </Row>
            <Row style={{ marginTop: "1rem" }}>
                <Col md={12} className='d-flex justify-content-center align-items-center'>
                    {!edit && <UserProfileDetails responseObject={responeObject} editToggle={editToggle} />}
                    {edit && <UserProfileForm responseObject={responeObject} editToggle={editToggle} />}
                </Col>
            </Row>
        </Container>
    )
}

export default UserProfile
