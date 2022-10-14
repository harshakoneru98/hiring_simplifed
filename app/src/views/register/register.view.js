import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthHeader from '../../components/AuthHeader/authHeader.component';
import InputField from '../../components/InputField/inputField.component';
import './register.scss';

export default function RegisterView() {
    const [inputValue, setInputValue] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { email, password, confirmPassword } = inputValue;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const register = () => {
        console.log('Email : ', email);
        console.log('Password : ', password);
        console.log('Confirm Password : ', confirmPassword);
    };

    return (
        <Fragment>
            <AuthHeader />
            <div className="auth-form">
                <h3>Sign Up</h3>
                <form className="form">
                    <InputField
                        type="email"
                        value={email}
                        placeholder="Enter email"
                        label="Email Address"
                        name="email"
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        type="password"
                        value={password}
                        placeholder="Enter password"
                        label="Password"
                        name="password"
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        type="password"
                        value={confirmPassword}
                        placeholder="Confirm password"
                        label="Confirm Password"
                        name="confirmPassword"
                        onChange={handleChange}
                        required
                    />

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
