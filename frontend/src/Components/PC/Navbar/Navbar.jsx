import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import styles from './Navbar.module.css';
import { useLocation, useNavigate } from 'react-router';


function Navbar() {
    const navigate = useNavigate()
    const location = useLocation();
    const [currUrl, setCurrUrl] = useState(location.pathname)

    useEffect(() => {
        setCurrUrl(location.pathname);
    }, [location.pathname])

    const handleIconClick = (url) => {
        setCurrUrl(url);
        navigate(url);
    };

    return (
        <Row>
            <Col md={2} className='m-0 p-0'></Col>
            <Col md={6} className='m-0 p-0'></Col>
            <Col md={4} className='m-0 p-0'>
                <Row style={{ marginTop: "1rem" }}>
                    <Col md={3} className={`${styles.iconContainer}`} onClick={() => handleIconClick('/add-post')}>
                        <FontAwesomeIcon
                            className={currUrl === '/add-post' ? styles.clickedIcon : styles.icon}
                            icon={faSquarePlus}
                        />
                    </Col>
                    <Col md={3} className={`${styles.iconContainer}`} onClick={() => handleIconClick('search')}>
                        <FontAwesomeIcon
                            className={currUrl === 'search' ? styles.clickedIcon : styles.icon}
                            icon={faMagnifyingGlass}
                        />
                    </Col>
                    <Col md={3} className={`${styles.iconContainer}`} onClick={() => handleIconClick('/')}>
                        <FontAwesomeIcon
                            className={currUrl === '/' ? styles.clickedIcon : styles.icon}
                            icon={faHouse}
                        />
                    </Col>
                    <Col md={3} className={`${styles.iconContainer}`} onClick={() => handleIconClick('/profile')}>
                        <FontAwesomeIcon
                            className={currUrl === '/profile' ? styles.clickedIcon : styles.icon}
                            icon={faUser}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default Navbar
