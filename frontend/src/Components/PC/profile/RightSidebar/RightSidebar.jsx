import React from 'react';
import UserProfile from './UserProfile/UserProfile';
import { Container, Row } from 'react-bootstrap';

function RightSidebar() {

    return (
        <Container>
            <Row style={{ marginTop: "1rem" }}>
                <UserProfile />
            </Row>
        </Container>
    );
}

export default RightSidebar;
