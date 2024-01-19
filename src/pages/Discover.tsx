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

    const breakpointColumnsObj = {
        default: 3, // Standardmäßig 3 Spalten
        1100: 2,   // Bei Bildschirmbreiten unter 1100px 2 Spalten
        700: 1     // Unter 700px 1 Spalte
    };

    return (
        <div className="discover-container">
            <h2>Entdecken</h2>
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
        </div>
    );
};

export default Discover;
