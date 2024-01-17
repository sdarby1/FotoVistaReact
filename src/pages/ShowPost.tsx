import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../utils/http';

interface UserType {
    id: number;
    username: string;
}

interface CommentType {
    id: number;
    body: string;
    user: UserType;
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

const ShowPost = () => {
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<PostType | null>(null);
    const [comments, setComments] = useState<CommentType[] | null>(null);
    const [newComment, setNewComment] = useState('');
    const [isLoadingPost, setIsLoadingPost] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(true);
    const [error, setError] = useState('');

    const BASE_URL = 'http://localhost';

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
                setComments(fetchedComments || []); // Hier wird sicherheitsshalber ein leeres Array gesetzt, wenn fetchedComments null ist
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
            // Optional: Kommentarliste aktualisieren
        } catch (error) {
            console.error('Fehler beim Senden des Kommentars', error);
        }
    };

    if (isLoadingPost || isLoadingComments) {
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

            <div className="comments-section">
                <h2>Kommentare</h2>
                <form onSubmit={handleCommentSubmit}>
                    <div className="comment-form-container">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Schreiben Sie einen Kommentar..."
                    />
                    <button className="submit-btn" type="submit">Kommentar absenden</button>
                    </div>
                </form>
                {comments.map((comment) => (
                    <div key={comment.id} className="comment">
                        {comment.user && comment.user.username ? (
                            <p><strong>{comment.user.username}:</strong> {comment.body}</p>
                        ) : (
                            <p><strong>Unbekannter Benutzer:</strong> {comment.body}</p>
                        )}
                    </div>
                ))}     
            </div>
        </div>
    );
};

export default ShowPost;