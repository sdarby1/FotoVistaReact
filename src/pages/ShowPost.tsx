import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../utils/http';

interface UserType {
    id: number;
    username: string; 
}

interface PostType {
    id: number;
    title: string;
    description: string;
    image_path: string;
    user: UserType;
    camera?: string;
    lens?: string;
    filter?: string;
    tripod?: string;
}

const ShowPost = () => {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<PostType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const BASE_URL = 'http://localhost'; 

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await http.get(`/posts/${postId}`);
                setPost(response.data.post);
                setIsLoading(false);
            } catch (err) {
                setError('Fehler beim Laden des Posts');
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    if (isLoading) {
        return <div>Laden...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {post ? (
                <div>
                    <h1>{post.title}</h1>
                    <p>Post by: {post.user.username}</p>
                    <p>{post.description}</p>
                    <img className="post-image" src={`${BASE_URL}/${post.image_path}`} alt={post.title} />
                    {post.camera && <p>Kamera: {post.camera}</p>}
                    {post.lens && <p>Objektiv: {post.lens}</p>}
                    {post.filter && <p>Filter: {post.filter}</p>}
                    {post.tripod && <p>Stativ: {post.tripod}</p>}
        </div>
        ) : (
        <div>Post nicht gefunden.</div>
        )}
        </div>
    );
};

export default ShowPost;