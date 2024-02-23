import { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext, defaultAuth } from '../context/AuthProvider';
import http from '../utils/http';
import Masonry from 'react-masonry-css';

interface PostType {
    id: number;
    title: string;
    description: string;
    image_path: string;
}

const Profile = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const [userPosts, setUserPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState(true); 
    const { state } = useLocation();
    const message = state?.message;
    const BASE_URL = 'http://localhost';

    const getInitialAuth = async () => {
        try {
            const response = await http.get('/auth/user');
            setAuth({ ...response.data });
        } catch {}
    };

    useEffect(() => void getInitialAuth(), []);

    useEffect(() => {
        const fetchUserPosts = async () => {
            setIsLoading(true); 
            try {
                const response = await http.get(`/users/${auth.id}/posts`);
                setUserPosts(response.data.posts);
            } catch (err) {
                console.error('Fehler beim Laden der Posts', err);
            } finally {
                setIsLoading(false); 
            }
        };

        if (auth.id) {
            fetchUserPosts();
        }
    }, [auth.id]);


    const handleLogout = async () => {
        try {
            await http.get('/auth/logout');
            setAuth(defaultAuth);
        } catch {}
    };

    // Breakpoints für das Masonry-Layout
    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };

    return (
        <div className="form-container">
            
            <div className="profile-container">
            {message && <div className="success">{message}</div>}
            <div className="link-to-edit-container">
                    <div className="profile-user">
                    <img src={auth.profile_image ? `${BASE_URL}/${auth.profile_image}` : '/src/images/no-profile-image-icon.svg'} alt="Profilbild" className="profile-profile-image" />
                        <h2>{auth.username}</h2>
                    </div>
                    <Link className="link-to-edit" to="/edit-profile"><img src="./src/images/edit.svg" /></Link>    
                </div>
                <div className="mobile-profile-logout">
                {
                auth.id ? (
                        <button onClick={handleLogout} className="sign-out-btn">Ausloggen</button>
                    ) : (
                        <></>
                    )
                }
                </div>
                <div>
                    <h2>Meine Posts</h2>
                    {isLoading ? (
                        <div className="loader-container">
                            <div className="loader"></div>
                        </div>
                    ) : userPosts.length > 0 ? (
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-posts-container"
                            columnClassName="masonry-grid_column"
                        >
                            {userPosts.map((post) => (
                                <Link key={post.id} to={`/posts/${post.id}`} className="post-link-btn">
                                    <div className="all-user-post">
                                        <h3 className="show-user-posts-title">{post.title}</h3>
                                        <img className="show-all-posts-image" src={`${BASE_URL}/${post.image_path}`} alt={post.title} />
                                    </div>
                                    <Link to={`/edit-post/${post.id}`} className="link-btn">Bearbeiten</Link>
                                </Link>
                            ))}
                        </Masonry>
                    ) : (
                        <div className="no-posts">
                            <p>Noch keine Posts.</p>
                            <Link className="link-btn" to="/create-post">Erstelle deinen ersten Post</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
