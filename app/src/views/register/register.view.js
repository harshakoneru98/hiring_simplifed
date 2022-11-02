import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import InputField from '../../components/InputField/inputField.component';
import RadioButtonField from '../../components/RadioButton/radioButton.component';
import './register.scss';

const CREATE_USER_MUTATION = gql`
    mutation CreateUser($input: createUserInput!) {
        createUser(input: $input) {
            status
            message
        }
    }
`;

export default function RegisterView() {
    let navigate = useNavigate();

    const [inputValue, setInputValue] = useState({
        firstName: '',
        lastName: '',
        h1b: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [inputValueValid, setInputValueValid] = useState({
        firstNameValid: true,
        lastNameValid: true,
        h1bValid: true,
        emailValid: true,
        passwordValid: true,
        passwordMatchValid: true
    });

    const { firstName, lastName, h1b, email, password, confirmPassword } =
        inputValue;

    const {
        firstNameValid,
        lastNameValid,
        h1bValid,
        emailValid,
        passwordValid,
        passwordMatchValid
    } = inputValueValid;

    const nameRegrex = /^[a-zA-Z ]+$/;
    const emailRegrex =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordRegrex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const [
        createUser,
        { data: userData, loading: userLoading, error: userError }
    ] = useMutation(CREATE_USER_MUTATION);

    if (userError) {
        console.log(userError);
    }

    useEffect(() => {
        if (userData) {
            navigate(`/login`);
        }
    }, [userData]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFunction(name, value, 'input');
    };

    const register = () => {
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

        if (emailRegrex.test(email)) {
            setFunction('emailValid', true, 'valid');
        } else {
            setFunction('emailValid', false, 'valid');
        }

        if (passwordRegrex.test(password)) {
            setFunction('passwordValid', true, 'valid');
        } else {
            setFunction('passwordValid', false, 'valid');
        }

        if (password === confirmPassword) {
            setFunction('passwordMatchValid', true, 'valid');
        } else {
            setFunction('passwordMatchValid', false, 'valid');
        }

        if (
            nameRegrex.test(firstName) &&
            nameRegrex.test(lastName) &&
            h1b !== '' &&
            emailRegrex.test(email) &&
            passwordRegrex.test(password) &&
            password === confirmPassword
        ) {
            const h1b_required = h1b === 'Yes' ? true : false;
            createUser({
                variables: {
                    input: {
                        firstName,
                        lastName,
                        h1b_required,
                        email,
                        password
                    }
                }
            });
        }
    };

    return (
        <Fragment>
            <div className="auth-form sign-up-form">
                <h3>Sign Up</h3>
                <form className="form">
                    <InputField
                        type="text"
                        value={firstName}
                        placeholder="First Name"
                        label="First Name"
                        name="firstName"
                        onChange={handleChange}
                        valid={firstNameValid}
                        validMessage="Use only alphabetic characters"
                        required
                    />
                    <InputField
                        type="text"
                        value={lastName}
                        placeholder="Last Name"
                        label="Last Name"
                        name="lastName"
                        onChange={handleChange}
                        valid={lastNameValid}
                        validMessage="Use only alphabetic characters"
                        required
                    />
                    <RadioButtonField
                        type="radio"
                        value={h1b}
                        label="Will you now or in the future require H1B sponsorship?"
                        options={['Yes', 'No']}
                        name="h1b"
                        onChange={handleChange}
                        valid={h1bValid}
                        validMessage="Select atleast one of the above options"
                        required
                    />
                    <InputField
                        type="email"
                        value={email}
                        placeholder="Enter email"
                        label="Email Address"
                        name="email"
                        onChange={handleChange}
                        valid={emailValid}
                        validMessage="Enter valid email address"
                        required
                    />
                    <InputField
                        type="password"
                        value={password}
                        placeholder="Enter password"
                        label="Password"
                        name="password"
                        onChange={handleChange}
                        valid={passwordValid}
                        validMessage="Enter 8 minimum characters. Atleast 1 UpperCase, 1 LowerCase, 1 Number and 1 Special Character"
                        required
                    />
                    <InputField
                        type="password"
                        value={confirmPassword}
                        placeholder="Confirm password"
                        label="Confirm Password"
                        name="confirmPassword"
                        onChange={handleChange}
                        valid={passwordMatchValid}
                        validMessage="Passwords doesn't match"
                        required
                    />
                    {userError?.message === 'Email already exists' && (
                        <label className="error">{userError?.message}</label>
                    )}
                    <button
                        className="btn btn-primary btn-block"
                        onClick={(e) => {
                            register();
                            e.preventDefault();
                        }}
                    >
                        Register
                    </button>

                    <p className="alt-auth">
                        Already registered{' '}
                        <Link className="alt-link" to="/login">
                            sign in?
                        </Link>
                    </p>
                </form>
            </div>
        </Fragment>
    );
}
