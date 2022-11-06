import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ResumeModal from '../../components/ResumeModal/resumeModal.component';
import InputField from '../../components/InputField/inputField.component';
import RadioButtonField from '../../components/RadioButton/radioButton.component';
import { FaPen } from 'react-icons/fa';
import './profile.scss';

export default function ProfileView() {
    const userInfo = useSelector((state) => state?.userData?.value);

    const [show, setShow] = useState(false);
    const [editPersonalInfo, setEditPersonalInfo] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const [inputValue, setInputValue] = useState({
        firstName: '',
        lastName: '',
        h1b: ''
    });

    const [inputValueValid, setInputValueValid] = useState({
        firstNameValid: true,
        lastNameValid: true,
        h1bValid: true
    });

    const { firstName, lastName, h1b } = inputValue;

    const { firstNameValid, lastNameValid, h1bValid } = inputValueValid;

    const setFunction = (name, value, type) => {
        if (type === 'input') {
            setInputValue((prev) => ({
                ...prev,
                [name]: value
            }));
        } else if (type === 'valid') {
            setInputValueValid((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    useEffect(() => {
        console.log('Change : ', userInfo);
        if (userInfo.firstName) {
            setFunction('firstName', userInfo.firstName, 'input');
            setFunction('lastName', userInfo.lastName, 'input');
            const h1b_req = userInfo.h1b_required === true ? 'Yes' : 'No';
            setFunction('h1b', h1b_req, 'input');
        }
    }, [userInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFunction(name, value, 'input');
    };

    const editPersonalTrue = () => setEditPersonalInfo(true);
    const editPersonalFalse = () => {
        setEditPersonalInfo(false);
        setFunction('firstName', userInfo.firstName, 'input');
        setFunction('lastName', userInfo.lastName, 'input');
        const h1b_req = userInfo.h1b_required === true ? 'Yes' : 'No';
        setFunction('h1b', h1b_req, 'input');
    };

    const editPersonal = () => {
        console.log(inputValue);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="main_content">
                    <Card>
                        <Card.Title className="profile-title" as="h3">
                            Personal Information
                            {!editPersonalInfo && (
                                <Button
                                    className="edit-button"
                                    variant="primary"
                                    onClick={editPersonalTrue}
                                >
                                    Edit{' '}
                                    <FaPen className="edit-icon" size={12} />
                                </Button>
                            )}
                            {editPersonalInfo && (
                                <Fragment>
                                    <Button
                                        className="cancel-button"
                                        variant="danger"
                                        onClick={editPersonalFalse}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="submit-button"
                                        variant="success"
                                        onClick={editPersonal}
                                    >
                                        Submit
                                    </Button>
                                </Fragment>
                            )}
                        </Card.Title>
                        <Card.Body>
                            <form className="form">
                                <table className="profile-table">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <InputField
                                                    type="text"
                                                    value={firstName}
                                                    placeholder="First Name"
                                                    label="First Name"
                                                    name="firstName"
                                                    onChange={handleChange}
                                                    valid={firstNameValid}
                                                    disabled={!editPersonalInfo}
                                                    validMessage="Use only alphabetic characters"
                                                    required
                                                />
                                            </td>
                                            <td>
                                                <InputField
                                                    type="text"
                                                    value={lastName}
                                                    placeholder="Last Name"
                                                    label="Last Name"
                                                    name="lastName"
                                                    onChange={handleChange}
                                                    valid={lastNameValid}
                                                    disabled={!editPersonalInfo}
                                                    validMessage="Use only alphabetic characters"
                                                    required
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <RadioButtonField
                                                    type="radio"
                                                    value={h1b}
                                                    label="Will you now or in the future require H1B sponsorship?"
                                                    options={['Yes', 'No']}
                                                    name="h1b"
                                                    onChange={handleChange}
                                                    valid={h1bValid}
                                                    disabled={!editPersonalInfo}
                                                    validMessage="Select atleast one of the above options"
                                                    required
                                                />
                                            </td>
                                            <td>
                                                <InputField
                                                    type="email"
                                                    value={
                                                        userInfo.email
                                                            ? userInfo.email
                                                            : ''
                                                    }
                                                    placeholder="Enter email"
                                                    label="Email Address"
                                                    name="email"
                                                    disabled={true}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </Card.Body>
                    </Card>
                    {/* <Button variant="primary" onClick={handleShow}>
                        Resume Upload
                    </Button>
                    {show && (
                        <ResumeModal show={show} handleClose={handleClose} />
                    )} */}
                </div>
            </div>
        </div>
    );
}
