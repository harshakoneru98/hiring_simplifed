import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import HomeView from './views/home/home.view';
import LoginView from './views/login/login.view';
import RegisterView from './views/register/register.view';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const client = new ApolloClient({
        cache: new InMemoryCache(),
        uri: 'http://localhost:4000/graphql'
    });
    return (
        <ApolloProvider client={client}>
            <Router>
                <Routes>
                    <Route exact path="/" element={<HomeView />} />
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/register" element={<RegisterView />} />
                </Routes>
            </Router>
        </ApolloProvider>
    );
}

export default App;
