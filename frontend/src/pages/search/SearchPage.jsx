import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';


import SearchComponent from '../../Components/PC/searchPage/SearchComponent';
import styles from './SearchPage.module.css';
import defaultUserImage from "../../assets/images/userDefaultProfile.jpg"
import axios from 'axios';

function SearchPage() {
    const navigate = useNavigate();
    const initialSearchResults = [
        { username: 'user1@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user2@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user3@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user4@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user5@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user6@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user7@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user8@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user9@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user10@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user11@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user12@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user13@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user14@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user15@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user16@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user17@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user18@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user19@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
        { username: 'user20@example.com', userProfileImageUrl: 'https://via.placeholder.com/150' },
    ];

    const [searchResults, setSearchResults] = useState([]);
    
    const visitUserProfileHandler = (email) => {
        navigate(`/user-profile/${email}`);
    }

    return (
        <>
            <SearchComponent setSearchResults={setSearchResults} />
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <div className={styles.containerWithCustomScrollbar}>
                            <ul className="list-unstyled">
                                {searchResults.map((result, index) => (
                                    <li onClick={() => visitUserProfileHandler(result.email)} key={index} className={`mb-3 ${styles.userListItem}`}>
                                        <img src={result.userProfileImageUrl ? result.userProfileImageUrl : defaultUserImage} alt="Profile" width="50" height="50" className="rounded-circle" />
                                        <span className="mx-3">{result.username}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default SearchPage;
