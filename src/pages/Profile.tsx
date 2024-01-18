import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import http from '../utils/http';

interface PostType {
  id: number;
  title: string;
  description: string;
  image_path: string;
}


const Profile = () => {
    const { auth } = useContext(AuthContext);
    const [userPosts, setUserPosts] = useState<PostType[]>([]);

    const BASE_URL = 'http://localhost'; 

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await http.get(`/users/${auth.id}/posts`);
                setUserPosts(response.data.posts);
            } catch (err) {
                console.error('Fehler beim Laden der Posts', err);
            }
        };

        if (auth.id) {
            fetchUserPosts();
        }
    }, [auth.id]);

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
                    <h3>Meine Posts</h3>
                    <div className="my-posts-container">
                    {userPosts.map((post) => (
                        <Link key={post.id} to={`/posts/${post.id}`} className="post-link-btn">
                            <div className="user-post">
                                <h3 className="show-user-posts-title">{post.title}</h3>
                                <img className="show-user-posts-image" src={`${BASE_URL}/${post.image_path}`} alt={post.title} />
                            </div>
                        </Link>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Profile;