import React, { useState } from 'react';
import { Form, Button, Container, Col, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LoginComponent = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [errorValue, setErrorValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const errorElement = (
        <Row md={4} className='d-flex justify-content-center align-items-center mt-2'>
            <div className="alert alert-danger" role="alert">
                {errorValue}
            </div>
        </Row>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        setErrorValue("");
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/login`, formData);
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            navigate("/")
        } catch (error) {
            console.error(error);
            setError(true);
            let errorMsg = error.response ? error.response.data.message : "Network error";
            setErrorValue(errorMsg);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Container className='d-flex justify-content-center align-items-center' style={{ height: "100vh" }}>
            <Col md={12} xs={12} className='d-flex justify-content-center align-items-center'>
                <Container>
                    <Row className='d-flex justify-content-center align-items-center'>
                        <Col md={4} className='d-flex justify-content-center align-items-center'>
                            <h4>LOGIN</h4>
                        </Col>
                    </Row>
                    <Row className='d-flex justify-content-center align-items-center'>
                        <Col md={4} className='d-flex justify-content-center align-items-center'>
                            <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
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

                                <Button style={{ width: "100%", fontWeight: "bold" }} variant="success" type="submit">
                                    {loading ? <Spinner style={{ fontSize: "0.5rem", height: "1rem", width: "1rem" }} /> : "LOGIN"}
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                    {error && errorElement}
                    <Row className='d-flex justify-content-center align-items-center'>
                        <Col md={4} className='d-flex justify-content-center align-items-center mt-2'>
                            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                        </Col>
                    </Row>
                </Container>
            </Col>
        </Container>
    );
};

export default LoginComponent;
