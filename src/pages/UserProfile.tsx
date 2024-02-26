import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import http from '../utils/http'; 
import Masonry from 'react-masonry-css';
import FollowButton from '../components/FollowButtonComponent';
import { AuthContext } from '../context/AuthProvider';

interface PostType {
    id: number;
    title: string;
    description: string;
    image_path: string;
}

const UserProfile = () => {
    const { userId } = useParams<{ userId: string }>();
    const [userPosts, setUserPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<{username?: string, profile_image?: string} | null>(null);
    const { auth } = useContext(AuthContext); 

    const BASE_URL = 'http://localhost'; 

    useEffect(() => {
        const fetchUserPosts = async () => {
            setIsLoading(true);
            try {
                const response = await http.get(`/users/${userId}/posts`);
                setUser(response.data.user);
                setUserPosts(response.data.posts);
                setIsLoading(false);
            } catch (err) {
                console.error('Fehler beim Laden der Posts:', err);
                setIsLoading(false);
            }
        };

        fetchUserPosts();

        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const userResponse = await http.get(`/user/${userId}`);
                setUser({
                    username: userResponse.data.username,
                    profile_image: userResponse.data.profile_image
                });
                setIsLoading(false);
            } catch (err) {
                console.error('Fehler beim Laden der Benutzerdaten:', err);
                setIsLoading(false);
            }
        };
    
        fetchUserData();
    }, [userId]);
    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };

    return (
        <div className="form-container">
            <div className="profile-container">
            {isLoading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            ) : (
                <div>
                    <div className="user-profile-headline-container">
                        <h2 className="user-profile-headline">Profil von</h2>
                        <div className="user-profile-user-container"><img src={`${BASE_URL}/${user?.profile_image}`} alt="Profilbild" className="profile-profile-image" /><h2>{user?.username}</h2></div>
                        { auth.id ? (
                        <FollowButton profileUserId={userId} />
                        ) : (null) }
                    </div>
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
                </div>
            )}
            </div>
        </div>
    );
};

export default UserProfile;
