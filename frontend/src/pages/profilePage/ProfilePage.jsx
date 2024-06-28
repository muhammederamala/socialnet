import React from 'react'
import { Row, Col } from 'react-bootstrap'

import UserPosts from '../../Components/PC/profile/UserPost/UserPosts'
import RightSidebar from '../../Components/PC/profile/RightSidebar/RightSidebar'

function ProfilePage() {
  return (
    <Row>
      <Col md={1} className='m-0 p-0'></Col>
      <Col md={7} className='mx-4 p-0'><UserPosts /></Col>
      <Col md={3} className='m-0 p-0'><RightSidebar /></Col>
    </Row>
  )
}

export default ProfilePage
