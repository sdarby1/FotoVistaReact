import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import http from '../utils/http';
import Masonry from 'react-masonry-css';

interface PostType {
  id: number;
  title: string;
  description: string;
  image_path: string;
  likes_count: number;
}

const Discover = () => {
    const [allPosts, setAllPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState(true); 
    const BASE_URL = 'http://localhost';
    const { state } = useLocation();
    const message = state?.message; // Zugriff auf die Nachricht
    const [sortOrder, setSortOrder] = useState('newest'); // Standardmäßig auf "neueste zuerst" gesetzt


    useEffect(() => {
        const fetchAllPosts = async () => {
            setIsLoading(true); 
            try {
                const response = await http.get(`/post/sort?order=${sortOrder}`); // Verwende die neue Route
                setAllPosts(response.data.posts);
            } catch (err) {
                console.error('Fehler beim Laden der Posts', err);
            } finally {
                setIsLoading(false); 
            }
        };
    
        fetchAllPosts();
    }, [sortOrder]); // Füge sortOrder zu den Abhängigkeiten hinzu
    

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };

    return (
        <div className="discover-container">
            {message && <div className="success">{message}</div>}
            <h2>Entdecken</h2>
            <div className="sort-container">
                <label htmlFor="sortOrder">Sortieren nach:</label>
                <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="newest">Neueste zuerst</option>
                <option value="oldest">Älteste zuerst</option>
                <option value="most_liked">Meiste Likes</option>
                <option value="least_liked">Wenigste Likes</option>
                </select>
            </div>

            {isLoading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            ) : (
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="all-posts-container"
                    columnClassName="masonry-grid_column"
                >
                    {allPosts.map((post) => (
                        <Link key={post.id} to={`/posts/${post.id}`} className="post-link">
                            <div className="all-user-post">
                                <h3 className="show-user-posts-title">{post.title}</h3>
                                <img className="show-all-posts-image" src={`${BASE_URL}/${post.image_path}`} alt={post.title} />
                                <p className="show-all-posts-like">{post.likes_count} Likes</p>
                            </div>
                        </Link>
                    ))}
                </Masonry>
            )}
        </div>
    );
};

export default Discover;
