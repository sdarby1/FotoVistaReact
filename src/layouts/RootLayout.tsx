import { useContext, useEffect } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import http from '../utils/http';
import MobileNav from '../components/MobileNav';
import SearchComponent from '../components/SearchComponent';



const RootLayout = () => {
    const { auth, setAuth } = useContext(AuthContext);

    const getInitialAuth = async () => {
        try {
            const response = await http.get('/auth/user');
            setAuth({ ...response.data });
        } catch {}
    };
    

    useEffect(() => void getInitialAuth(), []);

    
    const BASE_URL = 'http://localhost'; 

  return (
    <>
        <header>
            <a href="/"><div className="logo-container"><img src="/src/images/logo.svg"></img></div></a>

            <nav>
                <ul>
                    <li><NavLink to="/" className="header-nav-btn">Home</NavLink></li>
                    <li><NavLink to="/discover" className="header-nav-btn">Entdecken</NavLink></li>
                    <li><NavLink to="/profile" className="header-nav-btn">Profil</NavLink></li>
                    {auth.id && <li><NavLink to="/create-post" className="header-nav-btn">Post erstellen</NavLink></li>}
                </ul>
            </nav>

            <li>
                {
                    auth.id ? (
                    <div className="user-container">
                        <SearchComponent />
                        <img src={auth.profile_image ? `${BASE_URL}/${auth.profile_image}` : '/src/images/no-profile-image-icon.svg'} alt="Profilbild" className="profile-image" />
                        <p className="username">{auth.username}</p> 
                    </div>
                    ) : ( <div className="user-container">
                        <Link to="/login" className="sign-in-btn">Einloggen</Link> 
                    </div> )
                }
            </li>
        </header>
        <MobileNav />
        <main>
            <Outlet />
        </main>
        <footer>
            Copyright © 2024 FotoVista Alle Rechte vorbehalten.
            <div className="footer-links">
                <a href="http://">Impressum</a>
                |
                <a href="http://">Datenschutzrichtlinien</a>
                |
                <a href="http://">Cookies</a>
            </div>
        </footer>
    </>
  )
}

export default RootLayout