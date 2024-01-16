import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import http from '../utils/http';

interface PostType {
  id: number;
  title: string;
  description: string;
  image_path: string;
  // ... andere Eigenschaften, die ein Post haben könnte
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
        <div>
            <h2>Profil von {auth.username}</h2><Link to="/edit-profile">bearbeiten</Link>
            <div>
                <h3>Meine Posts</h3>
                {userPosts.map((post) => (
                  <Link to={`/posts/${post.id}`} className="post-link-btn">
                      <div key={post.id} className="user-post">
                          <h3 className="show-user-posts-title">{post.title}</h3>
                          <img className="show-user-posts-image" src={`${BASE_URL}/${post.image_path}`} alt={post.title} />
                      </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
export default Profile;