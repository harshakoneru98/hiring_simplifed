import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeView from './views/home/home.view';
import LoginView from './views/login/login.view';
import RegisterView from './views/register/register.view';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<HomeView />} />
                <Route path="/login" element={<LoginView />} />
                <Route path="/register" element={<RegisterView />} />
            </Routes>
        </Router>
    );
}

export default App;
