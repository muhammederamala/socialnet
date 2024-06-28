import React, { useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import axios from 'axios';

import styles from './UserProfileForm.module.css'

const UserProfileForm = ({ editToggle, responseObject }) => {
    const [formData, setFormData] = useState({
        dateOfBirth: `${responseObject.userProfile.dateOfBirth ? responseObject.userProfile.dateOfBirth : ""}`,
        nationality: `${responseObject.userProfile.nationality ? responseObject.userProfile.nationality : ""}`,
        phoneNumber: `${responseObject.userProfile.phoneNumber ? responseObject.userProfile.phoneNumber : ""}`,
        gender: `${responseObject.userProfile.gender ? responseObject.userProfile.gender : ""}`,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const noEditToggler = () => {
        editToggle("noedit")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/update-profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            noEditToggler();
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Form.Group controlId="formDateOfBirth" className="mt-3">
                <Form.Control type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} placeholder="Date of Birth" />
            </Form.Group>

            <Form.Group controlId="formNationality" className="mt-3">
                <Form.Control type="text" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Nationality" />
            </Form.Group>

            <Form.Group controlId="formPhoneNumber" className="mt-3">
                <Form.Control type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
            </Form.Group>

            <Form.Group controlId="formGender" className="mt-3">
                <Form.Control as="select" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </Form.Control>
            </Form.Group>

            <button onClick={noEditToggler} className={`btn mt-3 mx-2 ${styles.cancelButton}`}>
                Cancel
            </button>

            <button type="submit" className={`btn mt-3 mx-2 ${styles.submitButton}`}>
                {loading ? <Spinner /> : "Submit"}
            </button>
        </Form>
    );
};

export default UserProfileForm;
