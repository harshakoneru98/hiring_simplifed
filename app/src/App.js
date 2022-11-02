import React, { useState, useEffect, Fragment } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';
import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    ApolloProvider
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AuthContext from './context/auth-context';
import Header from './components/Header/header.component';
import HomeView from './views/home/home.view';
import LoginView from './views/login/login.view';
import RegisterView from './views/register/register.view';
import DashboardView from './views/dashboard/dashboard.view';
import ProfileView from './views/profile/profile.view';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const ls_token = localStorage.getItem('token');

    const httpLink = createHttpLink({
        uri: 'http://localhost:4000/graphql'
    });

    const authLink = setContext((_, { headers }) => {
        // get the authentication token from local storage if it exists
        const token = localStorage.getItem('token');
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                Authorization: token ? `Bearer ${token}` : ''
            }
        };
    });

    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    });

    let login = (token, userId, tokenExpiration) => {
        setToken(token);
        setUserId(userId);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
    };

    let logout = () => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
        }
        if (localStorage.getItem('userId')) {
            setUserId(localStorage.getItem('userId'));
        }
    }, [localStorage]);

    return (
        <ApolloProvider client={client}>
            <Router>
                <Fragment>
                    <AuthContext.Provider
                        value={{
                            token: token,
                            userId: userId,
                            login: login,
                            logout: logout
                        }}
                    >
                        <Header />
                        <Routes>
                            {!ls_token && (
                                <Fragment>
                                    <Route
                                        exact
                                        path="/"
                                        element={<HomeView />}
                                    />
                                    <Route
                                        exact
                                        path="/login"
                                        element={<LoginView />}
                                    />
                                    <Route
                                        exact
                                        path="/register"
                                        element={<RegisterView />}
                                    />
                                </Fragment>
                            )}

                            {ls_token && (
                                <Fragment>
                                    <Route
                                        exact
                                        path="/"
                                        element={<Navigate to="/dashboard" />}
                                    />
                                    <Route
                                        path="/login"
                                        element={<Navigate to="/dashboard" />}
                                    />
                                    <Route
                                        path="/register"
                                        element={<Navigate to="/dashboard" />}
                                    />
                                    <Route
                                        path="/dashboard"
                                        exact
                                        element={<DashboardView />}
                                    />
                                    <Route
                                        path="/profile"
                                        exact
                                        element={<ProfileView />}
                                    />
                                </Fragment>
                            )}

                            <Route
                                path="/*"
                                element={<Navigate to="/login" />}
                            />
                        </Routes>
                    </AuthContext.Provider>
                </Fragment>
            </Router>
        </ApolloProvider>
    );
}

export default App;
