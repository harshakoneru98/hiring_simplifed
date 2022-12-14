import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { gql, useMutation, useQuery } from '@apollo/client';
import { userDataByID } from '../../reduxSlices/userDataSlice';
import { refreshWindow } from '../../reduxSlices/refreshSlice';
import ResumeModal from '../../components/ResumeModal/resumeModal.component';
import InputField from '../../components/InputField/inputField.component';
import RadioButtonField from '../../components/RadioButton/radioButton.component';
import { FaPen } from 'react-icons/fa';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './profile.scss';

const UPDATE_USER_DATA_MUTATION = gql`
    mutation updateUserProfile($input: updateProfileInput!) {
        updateUserProfile(input: $input) {
            status
            message
        }
    }
`;

const QUERY_USER_DATA = gql`
    query getUserByID($userId: ID!) {
        getUserDataById(userId: $userId) {
            firstName
            lastName
            h1b_required
            email
            skills
            resume_uploaded
            cluster
            job_recommendations
            top_similarities
        }
    }
`;

const QUERY_SKILLS = gql`
    query Skills {
        skills(options: { sort: [{ name: ASC }] }) {
            name
        }
    }
`;

export default function ProfileView() {
    const dispatch = useDispatch();
    const animatedComponents = makeAnimated();

    const userInfo = useSelector((state) => state?.userData?.value);
    const refreshNeeded = useSelector((state) => state?.refresh?.value);

    const userId = localStorage.getItem('userId');
    const resume_url =
        'https://parse-job-resumes.s3.amazonaws.com/' + userId + '.pdf';

    const [show, setShow] = useState(false);
    const [skillOptions, setSkillOptions] = useState([]);
    const [iframeKey, setIframeKey] = useState(0);
    const [totalSkills, setTotalSkills] = useState([]);

    const [editPersonalInfo, setEditPersonalInfo] = useState(false);
    const [editSkillsInfo, setEditSkillsInfo] = useState(false);

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

    const nameRegrex = /^[a-zA-Z ]+$/;

    const {
        data: userData,
        loading: userLoading,
        error: userError,
        refetch
    } = useQuery(QUERY_USER_DATA, {
        variables: { userId }
    });

    const {
        data: skillsData,
        loading: skillsLoading,
        error: skillsError,
        refetchSkills
    } = useQuery(QUERY_SKILLS);

    const [
        updateUserProfile,
        {
            data: updateUserData,
            loading: updateUserLoading,
            error: updateUserError
        }
    ] = useMutation(UPDATE_USER_DATA_MUTATION);

    useEffect(() => {
        if (updateUserData) {
            dispatch(userDataByID(userData.getUserDataById));
        }
    }, [updateUserData]);

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
        if (userInfo.firstName) {
            setFunction('firstName', userInfo.firstName, 'input');
            setFunction('lastName', userInfo.lastName, 'input');
            const h1b_req = userInfo.h1b_required === true ? 'Yes' : 'No';
            setFunction('h1b', h1b_req, 'input');
        }
    }, [userInfo]);

    useEffect(() => {
        if (userInfo?.skills) {
            const options = skillsToOptions(userInfo?.skills, 'DynamoDB');
            setSkillOptions(options);
        }
    }, [userData, userInfo]);

    useEffect(() => {
        if (skillsData) {
            const fullSkills = [];
            const options = skillsToOptions(skillsData?.skills, 'Neo4j');
            setTotalSkills(options);
        }
    }, [skillsData]);

    useEffect(() => {
        if (refreshNeeded) {
            dispatch(refreshWindow(false));
            setShow(false);
            setIframeKey(iframeKey + 1);
        }
    }, [refreshNeeded]);

    const skillsToOptions = (userSkills, type) => {
        const options = [];
        if (type == 'DynamoDB') {
            userSkills?.map((skill) => {
                options.push({ value: skill, label: skill });
            });
        } else {
            userSkills?.map((skill) => {
                options.push({ value: skill.name, label: skill.name });
            });
        }

        return options;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFunction(name, value, 'input');
    };

    const editPersonalTrue = () => setEditPersonalInfo(true);
    const editSkillsTrue = () => setEditSkillsInfo(true);
    const editPersonalFalse = () => {
        setEditPersonalInfo(false);
        setFunction('firstName', userInfo.firstName, 'input');
        setFunction('lastName', userInfo.lastName, 'input');
        const h1b_req = userInfo.h1b_required === true ? 'Yes' : 'No';
        setFunction('h1b', h1b_req, 'input');
        setFunction('firstNameValid', true, 'valid');
        setFunction('lastNameValid', true, 'valid');
        setFunction('h1bValid', true, 'valid');
    };

    const editSkillsFalse = () => {
        setEditSkillsInfo(false);
        const options = skillsToOptions(userInfo.skills, 'DynamoDB');
        setSkillOptions(options);
    };

    const editPersonal = () => {
        if (nameRegrex.test(firstName)) {
            setFunction('firstNameValid', true, 'valid');
        } else {
            setFunction('firstNameValid', false, 'valid');
        }

        if (nameRegrex.test(lastName)) {
            setFunction('lastNameValid', true, 'valid');
        } else {
            setFunction('lastNameValid', false, 'valid');
        }

        if (h1b !== '') {
            setFunction('h1bValid', true, 'valid');
        } else {
            setFunction('h1bValid', false, 'valid');
        }

        const resume_uploaded = true;
        const skills = userInfo?.skills;

        if (
            nameRegrex.test(firstName) &&
            nameRegrex.test(lastName) &&
            h1b !== ''
        ) {
            const h1b_required = h1b === 'Yes' ? true : false;
            const cluster = userInfo?.cluster;
            const job_recommendations = userInfo?.job_recommendations;
            const top_similarities = userInfo?.top_similarities;
            updateUserProfile({
                variables: {
                    input: {
                        userId,
                        firstName,
                        lastName,
                        h1b_required,
                        resume_uploaded,
                        skills,
                        cluster,
                        job_recommendations,
                        top_similarities
                    }
                }
            })
                .then((data) => {
                    refetch();
                })
                .catch((err) => {
                    console.log(err);
                });
            setEditPersonalInfo(false);
        }
    };

    const editSkills = () => {
        const skills = [];
        skillOptions?.map((skill) => {
            skills.push(skill.value);
        });

        const {
            firstName,
            lastName,
            h1b_required,
            resume_uploaded,
            cluster,
            job_recommendations,
            top_similarities
        } = userInfo;
        updateUserProfile({
            variables: {
                input: {
                    userId,
                    firstName,
                    lastName,
                    h1b_required,
                    resume_uploaded,
                    skills,
                    cluster,
                    job_recommendations,
                    top_similarities
                }
            }
        })
            .then((data) => {
                refetch();
            })
            .catch((err) => {
                console.log(err);
            });
        setEditSkillsInfo(false);
    };

    const handleSkillChange = (skills) => {
        setSkillOptions(skills);
    };

    const openResume = () => {
        window.open(resume_url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="container">
            <div className="row">
                <div className="main_content">
                    <Card className="personal-card">
                        <Card.Title className="profile-title" as="h3">
                            Personal Information
                        </Card.Title>
                        <Card.Body>
                            <form className="form">
                                <table className="profile-table">
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td>
                                                {!editPersonalInfo && (
                                                    <Button
                                                        className="edit-button"
                                                        variant="primary"
                                                        onClick={
                                                            editPersonalTrue
                                                        }
                                                    >
                                                        Edit{' '}
                                                        <FaPen
                                                            className="edit-icon"
                                                            size={12}
                                                        />
                                                    </Button>
                                                )}
                                                {editPersonalInfo && (
                                                    <Fragment>
                                                        <Button
                                                            className="cancel-button"
                                                            variant="danger"
                                                            onClick={
                                                                editPersonalFalse
                                                            }
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            className="submit-button"
                                                            variant="success"
                                                            onClick={
                                                                editPersonal
                                                            }
                                                        >
                                                            Submit
                                                        </Button>
                                                    </Fragment>
                                                )}
                                            </td>
                                        </tr>
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
                    <Card className="personal-card skills-card">
                        <Card.Title className="profile-title" as="h3">
                            Skills Information
                        </Card.Title>
                        <Card.Body>
                            <form className="form">
                                <table className="profile-table">
                                    <tbody>
                                        <tr>
                                            <td>
                                                {!editSkillsInfo && (
                                                    <Button
                                                        className="edit-skills-button"
                                                        variant="primary"
                                                        onClick={editSkillsTrue}
                                                    >
                                                        Edit{' '}
                                                        <FaPen
                                                            className="edit-icon"
                                                            size={12}
                                                        />
                                                    </Button>
                                                )}
                                                {editSkillsInfo && (
                                                    <Fragment>
                                                        <Button
                                                            className="edit-cancel-button"
                                                            variant="danger"
                                                            onClick={
                                                                editSkillsFalse
                                                            }
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            className="edit-submit-button"
                                                            variant="success"
                                                            onClick={editSkills}
                                                        >
                                                            Submit
                                                        </Button>
                                                    </Fragment>
                                                )}
                                            </td>
                                            <td>
                                                <Fragment>
                                                    <Button
                                                        className="resume-upload-button"
                                                        variant="danger"
                                                        onClick={handleShow}
                                                    >
                                                        Upload
                                                    </Button>
                                                    <Button
                                                        className="resume-preview-button"
                                                        variant="success"
                                                        onClick={openResume}
                                                    >
                                                        Preview
                                                    </Button>
                                                </Fragment>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Select
                                                    closeMenuOnSelect={false}
                                                    components={
                                                        animatedComponents
                                                    }
                                                    isClearable={false}
                                                    value={skillOptions}
                                                    isDisabled={!editSkillsInfo}
                                                    onChange={handleSkillChange}
                                                    isMulti
                                                    options={totalSkills}
                                                />
                                            </td>
                                            <td>
                                                <Card>
                                                    <Card.Body className="resume-body">
                                                        <iframe
                                                            key={iframeKey}
                                                            src={resume_url}
                                                        ></iframe>
                                                    </Card.Body>
                                                </Card>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </Card.Body>
                    </Card>

                    {show && (
                        <ResumeModal show={show} handleClose={handleClose} />
                    )}
                </div>
            </div>
        </div>
    );
}
