import { useContext } from "react"
import { NavLink, Outlet, Link } from 'react-router-dom';
import { AuthContext, defaultAuth } from "../context/AuthProvider";


const RootLayout = () => {
    const {auth, setAuth} = useContext(AuthContext);

    const handleLogout = () => {
        setAuth(defaultAuth)
        } 
    

  return (
    <>
        <header>
            <div className="logo-container"></div>

            <nav>
                <ul>
                    <li><NavLink to="/" className="header-nav-btn">Home</NavLink></li>
                    <li><NavLink to="/discover" className="header-nav-btn">Entdecken</NavLink></li>
                    <li><NavLink to="/profile" className="header-nav-btn">Profil</NavLink></li>

                </ul>
            </nav>

            <li>
                {
                    auth.id ? (
                    <div className="user-container">
                        <p>{auth.username}</p> 
                        <button onClick={handleLogout} className="sign-out-btn">Ausloggen</button>
                    </div>
                    ) : ( <Link to="/login" className="sign-in-btn">Einloggen</Link> )
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