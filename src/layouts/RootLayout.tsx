import { useContext, useEffect } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { AuthContext, defaultAuth } from '../context/AuthProvider';
import http from '../utils/http';

const RootLayout = () => {
    const { auth, setAuth } = useContext(AuthContext);

    const getInitialAuth = async () => {
        try {
            const response = await http.get('/auth/user');
            setAuth({ ...response.data, role: 'user' });
        } catch {}
    };

    useEffect(() => void getInitialAuth(), []);

    const handleLogout = async () => {
        try {
            await http.get('/auth/logout');
            setAuth(defaultAuth);
        } catch {}
    };
    

  return (
    <>
        <header>
            <div className="logo-container"><img src="/src/images/logo.svg"></img></div>

            <nav>
                <ul>
                    <li><NavLink to="/" className="header-nav-btn">Home</NavLink></li>
                    <li><NavLink to="/discover" className="header-nav-btn">Entdecken</NavLink></li>
                    <li><NavLink to="/profile" className="header-nav-btn">Profil</NavLink></li>
                    <li><NavLink to="/posts/2" className="header-nav-btn">Post 2</NavLink></li>
                    {auth.id && <li><NavLink to="/create-post" className="header-nav-btn">Post erstellen</NavLink></li>}
                </ul>
            </nav>

            <li>
                {
                    auth.id ? (
                    <div className="user-container">
                        {auth.profileImageUrl && <img src={auth.profileImageUrl} alt="Profilbild" className="profile-image" />}
                        <p>{auth.username}</p> 
                        <button onClick={handleLogout} className="sign-out-btn">Ausloggen</button>
                    </div>
                    ) : ( <div className="user-container">
                        <Link to="/login" className="sign-in-btn">Einloggen</Link> 
                    </div> )
                }
            </li>
        </header>
        <main>
            <Outlet />
        </main>
        <footer></footer>
    </>
  )
}

export default RootLayout