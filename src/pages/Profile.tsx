import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import http from '../utils/http';
import Masonry from 'react-masonry-css';

interface PostType {
    id: number;
    title: string;
    description: string;
    image_path: string;
}

const Profile = () => {
    const { auth } = useContext(AuthContext);
    const [userPosts, setUserPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState(true); 
    const BASE_URL = 'http://localhost';

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

    // Breakpoints für das Masonry-Layout
    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };

    return (
        <div className="form-container">
            <div className="profile-container">
            <div className="link-to-edit-container">
                    <div className="profile-user">
                        <img src={`${BASE_URL}/${auth.profile_image}`} alt="Profilbild" className="profile-profile-image" />
                        <h2>{auth.username}</h2>
                    </div>
                    <Link className="link-to-edit" to="/edit-profile"><img src="./src/images/edit.svg" /></Link>
                    
                </div>
                <div>
                    <h2>Meine Posts</h2>
                    {isLoading ? (
                        <div className="profile-loading-container">
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
