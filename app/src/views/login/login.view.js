import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthHeader from '../../components/AuthHeader/authHeader.component';
import InputField from '../../components/InputField/inputField.component';
import './login.scss';

export default function LoginView() {
    const [inputValue, setInputValue] = useState({ email: '', password: '' });
    const { email, password } = inputValue;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const login = () => {
        console.log('Email : ', email);
        console.log('Password : ', password);
    };

    return (
        <Fragment>
            <AuthHeader />
            <div className="auth-form">
                <h3>Sign In</h3>
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
                    <button
                        className="btn btn-primary btn-block"
                        onClick={(e) => {
                            login();
                            e.preventDefault();
                        }}
                    >
                        Log In
                    </button>
                    <p className="alt-auth">
                        Not registered{' '}
                        <Link className="alt-link" to="/register">
                            sign up?
                        </Link>
                    </p>
                </form>
            </div>
        </Fragment>
    );
}
