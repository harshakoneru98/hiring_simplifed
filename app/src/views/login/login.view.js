import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';
import AuthContext from '../../context/auth-context';
import InputField from '../../components/InputField/inputField.component';
import './login.scss';

const QUERY_LOGIN = gql`
    query tokenGeneration($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
        }
    }
`;

export default function LoginView() {
    let navigate = useNavigate();
    let contextType = useContext(AuthContext);

    const [inputValue, setInputValue] = useState({ email: '', password: '' });
    const [inputCheck, setInputCheck] = useState(false);
    const { email, password } = inputValue;

    const [
        fetchLogin,
        { data: loginData, loading: loginLoading, error: loginError }
    ] = useLazyQuery(QUERY_LOGIN);

    useEffect(() => {
        if (loginData) {
            if (loginData?.login?.token) {
                contextType.login(
                    loginData.login.token,
                    loginData.login.userId,
                    loginData.login.tokenExpiration
                );
            }
            navigate(`/dashboard`);
        }
    }, [loginData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const login = () => {
        if (email !== '' || password !== '') {
            fetchLogin({
                variables: {
                    email: email,
                    password: password
                }
            });
            setInputCheck(false);
        } else {
            setInputCheck(true);
        }
    };

    return (
        <Fragment>
            <div className="auth-form">
                <h3>Sign In</h3>
                <form className="form sign-in">
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
                    {!inputCheck && loginError && (
                        <label className="error">{loginError?.message}</label>
                    )}
                    {inputCheck && (
                        <label className="error">Invalid Credentials</label>
                    )}
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
