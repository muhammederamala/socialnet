import React, { useState } from 'react';
import { Form, Button, Container, Col, Row, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [errorValue, setErrorValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const errorElement = (
    <Row md={12} className='d-flex justify-content-center align-items-center mt-2'>
      <div className="alert alert-danger" role="alert">
        {errorValue}
      </div>
    </Row>
  )

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorValue("");
    setLoading(true)
    if (formData.password !== formData.confirmPassword) {
      setError(true);
      setErrorValue("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/signup`, formData);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      console.error('Error:', JSON.stringify(error));
      setError(true);
      setErrorValue(error.response.data.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <Container className='d-flex justify-content-center align-items-center' style={{ height: "100vh" }}>
      <Col md={4} className='d-flex justify-content-center align-items-center'>
        <Container>
          <Row>
            <Col md={12} className='d-flex justify-content-center align-items-center'>
              <h4>SIGN UP</h4>
            </Col>
          </Row>
          <Row>
            <Col md={12} className='d-flex justify-content-center align-items-center'>
              <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <Form.Group controlId="formBasicUsername">
                  <Form.Control
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="mb-2"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mb-2"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="mb-2"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicConfirmPassword">
                  <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="mb-2"
                  />
                </Form.Group>

                <Button style={{ width: "100%", fontWeight: "bold" }} variant="success" type="submit">
                  {loading ? <Spinner style={{ fontSize: "0.5rem", height: "1rem", width: "1rem" }} /> : "SIGN UP"}
                </Button>
              </Form>
            </Col>
          </Row>
          {error && errorElement}
          <Row>
            <Col md={12} className='d-flex justify-content-center align-items-center mt-2'>
              <p>Don't have an account? <Link to="/login">Log In</Link></p>
            </Col>
          </Row>
        </Container>
      </Col>
    </Container>
  );
};

export default SignUpForm;
