import { NavLink} from 'react-router-dom';


const MobileNav = () => {
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
                <li><NavLink to="/profile">
                    <img src="" />
                    Profil
                </NavLink></li>
            </ul>
        </nav>
    </>
  )
}

export default MobileNav