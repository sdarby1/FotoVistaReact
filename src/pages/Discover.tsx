import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../utils/http';

interface PostType {
  id: number;
  title: string;
  description: string;
  image_path: string;
}

const Discover = () => {
    const [allPosts, setAllPosts] = useState<PostType[]>([]);

    const BASE_URL = 'http://localhost';

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const response = await http.get('/posts'); 
                setAllPosts(response.data.posts);
            } catch (err) {
                console.error('Fehler beim Laden der Posts', err);
            }
        };

        fetchAllPosts();
    }, []);

    return (
        <div>
            <h2>Discover</h2>
            <div className="my-posts-container">
                {allPosts.map((post) => (
                    <Link key={post.id} to={`/posts/${post.id}`} className="post-link">
                        <div className="user-post">
                            <h3 className="show-user-posts-title">{post.title}</h3>
                            <img className="show-user-posts-image" src={`${BASE_URL}/${post.image_path}`} alt={post.title} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Discover;
