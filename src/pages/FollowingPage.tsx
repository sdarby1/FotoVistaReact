import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider'; // Pfad entsprechend anpassen
import http from '../utils/http';
import FollowButtonComponent from '../components/FollowButtonComponent';

interface User {
  id: number;
  username: string;
  profile_image?: string; // Optional, wenn nicht jeder Benutzer ein Bild hat
}

const FollowingPage = () => {
    const { auth } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [followingUsers, setFollowingUsers] = useState<User[]>([]);
    const BASE_URL = 'http://localhost';

    useEffect(() => {
        const fetchFollowingUsers = async () => {
            setIsLoading(true);
            try {
                const response = await http.get(`/users/me/following`); // Verwendet die auth.id
                setFollowingUsers(response.data.following);
            } catch (error) {
                console.error('Fehler beim Laden der gefolgten Benutzer', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (auth.id) {
            fetchFollowingUsers();
        }
    }, [auth.id]);

    return (
        <div className="following-container">
            <h2>Folge ich</h2>
            {isLoading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            ) : followingUsers.length > 0 ? (
                <ul className="following-list">
                    {followingUsers.map(user => (
                        <li key={user.id}>
                            <Link to={`/user/${user.id}`}>
                                <div className="search-user-container">
                                    <img src={user.profile_image ? `${BASE_URL}/${user.profile_image}` : '/src/images/no-profile-image-icon.svg'} alt="Profilbild" className="profile-profile-image" />
                                    {user.username}
                                </div>                          
                            </Link>
                            <FollowButtonComponent profileUserId={user.id} />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-following">Du folgst momentan niemandem. Finde neue Beitrage und Nutzer <Link to="/discover" className="link-btn">hier</Link></p>
            )}
        </div>
    );
};

export default FollowingPage;
