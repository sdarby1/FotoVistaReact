import { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext, defaultAuth } from '../context/AuthProvider';
import http from '../utils/http';


const MobileNav = () => {
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
        <nav className="mobile-nav">
            <ul>
                <li><NavLink to="/">
                    <img src="/src/images/navicons/home-icon.svg" />
                    Home
                </NavLink></li>
                <li><NavLink to="/discover">
                    <img src="/src/images/navicons/discover-icon.svg" />
                    Entdecken
                </NavLink></li>
                {auth.id && <li><NavLink to="/create-post">
                <img src="/src/images/navicons/create-post-icon.svg" />
                    Post erstellen
                </NavLink></li>}
                <li><NavLink to="/profile">
                    {auth.id &&  <img src={`${BASE_URL}/${auth.profile_image}`} alt="Profilbild" className="mobile-profile-image" />}
                    Profil
                </NavLink></li>
            </ul>
        </nav>
    </>
  )
}

export default MobileNav