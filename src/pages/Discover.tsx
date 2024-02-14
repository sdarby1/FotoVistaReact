import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../utils/http';
import Masonry from 'react-masonry-css';

interface PostType {
  id: number;
  title: string;
  description: string;
  image_path: string;
}

const Discover = () => {
    const [allPosts, setAllPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState(true); 
    const BASE_URL = 'http://localhost';

    useEffect(() => {
        const fetchAllPosts = async () => {
            setIsLoading(true); 
            try {
                const response = await http.get('/posts'); 
                setAllPosts(response.data.posts);
            } catch (err) {
                console.error('Fehler beim Laden der Posts', err);
            } finally {
                setIsLoading(false); 
            }
        };

        fetchAllPosts();
    }, []);

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };

    return (
        <div className="discover-container">
            <h2>Entdecken</h2>
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
                            </div>
                        </Link>
                    ))}
                </Masonry>
            )}
        </div>
    );
};

export default Discover;
