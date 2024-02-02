import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import http from '../utils/http';
import { AuthContext } from '../context/AuthProvider';
import { formatDistanceToNow, parseISO } from 'date-fns';


interface UserType {
    id: number;
    username: string;
    profile_image: string;
}

interface CommentType {
    id: number;
    body: string;
    user: UserType;
    created_at: string;
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
    comments: CommentType[];
}

const formatCommentDate = (dateString: string) => {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
};


const ShowPost = () => {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<PostType | null>(null);
    const [comments, setComments] = useState<CommentType[] | null>(null);
    const [newComment, setNewComment] = useState('');
    const [isLoadingPost, setIsLoadingPost] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [error, setError] = useState('');

    const BASE_URL = 'http://localhost';
    const { auth } = useContext(AuthContext); 

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await http.get(`/posts/${postId}`);
                const fetchedPost = response.data.post;
                console.log('Fetched Post:', fetchedPost);
                if (typeof fetchedPost === 'object' && fetchedPost !== null && typeof fetchedPost.id === 'number') {
                    setPost({ ...fetchedPost, comments: fetchedPost.comments || [] });
                    setIsLoadingPost(false);
                } else {
                    setError('Fehler beim Laden des Posts: Ungültige Daten');
                    setIsLoadingPost(false);
                }
            } catch (err) {
                console.error('Fehler beim Laden des Posts', err);
                setError('Fehler beim Laden des Posts');
                setIsLoadingPost(false);
            }
        };

        fetchPost();
    }, [postId]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await http.get(`/posts/${postId}/comments`);
                const fetchedComments = response.data.comments;
                console.log('Fetched Comments:', fetchedComments);
                setComments(fetchedComments || []); 
                setIsLoadingComments(false);
            } catch (err) {
                console.error('Fehler beim Laden der Kommentare', err);
                setIsLoadingComments(false);
            }
        };

        fetchComments();
    }, [postId]);

    const handleCommentSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await http.post(`/posts/${postId}/comments`, { body: newComment });
            setNewComment('');
            
        } catch (error) {
            console.error('Fehler beim Senden des Kommentars', error);
        }
    };

    if (isLoadingPost || isLoadingComments) {
        return <div className="loading-container">
                    <div className="loader"></div>
               </div>
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {post ? (
                <div className="show-post-container">
                    <h1>{post.title}</h1>
                    <div className="profile-user">
                        <img src={`${BASE_URL}/${post.user.profile_image}`} alt="Profilbild" className="comment-profile-image" />
                        {post.user.username}
                    </div>
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

            {auth.id ? ( 
                <div className="comments-section">
                    <h2>Kommentare</h2>
                    <form className="comment-form" onSubmit={handleCommentSubmit}>
                        <div className="comment-form-container">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Schreiben Sie einen Kommentar..." 
                            />
                            <button className="submit-btn" type="submit">Kommentar absenden</button>
                        </div>
                    </form>
                    <div className="comment-section">
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <div className="comment-user">
                                <img src={`${BASE_URL}/${comment.user.profile_image}`} alt="Profilbild" className="comment-profile-image" />    
                                <p><strong>{comment.user.username}</strong></p>    
                            </div>        
                            <p>{comment.body}</p>    
                            <p><span className="comment-date">{formatCommentDate(comment.created_at)}</span></p>
                          
                        </div>
                    ))}
                </div>
                </div>
            ) : (
                <div>Du musst angemeldet sein, um die Kommentare zu sehen.</div>
            )}
            </div>            
    );
};

export default ShowPost;