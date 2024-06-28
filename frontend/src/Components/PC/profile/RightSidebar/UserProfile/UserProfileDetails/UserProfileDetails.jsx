import React from 'react'
import { Container, Row, Col, } from 'react-bootstrap'

import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './UserProfileDetails.module.css';

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const day = date.getDate();
    const suffix = (day === 1 || day === 21 || day === 31) ? 'st' : (day === 2 || day === 22) ? 'nd' : (day === 3 || day === 23) ? 'rd' : 'th';
    return formattedDate.replace(/\b\d{1,2}\b/, `${day}${suffix}`);
}

function UserProfileDetails({ editToggle, responseObject }) {
    const editToggler = () => {
        editToggle("edit")
    }

    const incompleteProfile = (
        <div className='d-flex justify-content-center align-items-center' style={{ minHeight: "12rem" }}>
            <button onClick={editToggler} className={`btn ${styles.updateProfileBtn}`}>
                Complete Profile
            </button>
        </div>
    )

    const completeProfile = (
        <>
            <Row>
                <Col md={10}></Col>
                <Col md={2}><FontAwesomeIcon className={styles.editIcon} onClick={editToggler} icon={faPenToSquare} /></Col>
            </Row>
            <Row>
                <Col md={3}>
                    <p className={`${styles.label}`}>{`DOB: `}</p>
                </Col>
                <Col md={4}>
                    <p className={`${styles.content}`}>{formatDate(responseObject.userProfile.dateOfBirth)}</p>
                </Col>
            </Row>
            <Row>
                <Col md={3}>
                    <p className={`${styles.label}`}>{`Nationality: `}</p>
                </Col>
                <Col md={4}>
                    <p className={`${styles.content}`}>{`${responseObject.userProfile.nationality}`}</p>
                </Col>
            </Row>
            <Row>
                <Col md={3}>
                    <p className={`${styles.label}`}>{`phone: `}</p>
                </Col>
                <Col md={4}>
                    <p className={`${styles.content}`}>{`${responseObject.userProfile.phoneNumber}`}</p>
                </Col>
            </Row>
            <Row>
                <Col md={3}>
                    <p className={`${styles.label}`}>{`Gender: `}</p>
                </Col>
                <Col md={4}>
                    <p className={`${styles.content}`}>{`${responseObject.userProfile.gender}`}</p>
                </Col>
            </Row>
        </>
    )

    return (
        <Container>
            {!responseObject.userProfile ? incompleteProfile : completeProfile}
        </Container>
    )
}

export default UserProfileDetails
