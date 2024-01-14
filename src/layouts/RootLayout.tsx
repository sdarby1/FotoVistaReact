import { NavLink, Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <>
        <header>
            <div className="logo-container"></div>
            
            <nav>
                <ul>
                    <li><NavLink to="/" className="header-nav-btn">Home</NavLink></li>
                    <li><NavLink to="/discover" className="header-nav-btn">Entdecken</NavLink></li>
                </ul>
            </nav>

            <li><NavLink to="/login" className="sign-in-btn">Login</NavLink></li>
        </header>
        <main>
            <Outlet />
        </main>
        <footer></footer>
    </>
  )
}

export default RootLayout