import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import http from '../utils/http';
import { AuthContext } from '../context/AuthProvider';
import { formatDistanceToNow, parseISO } from 'date-fns';


interface UserType {
    id: number | null;
    username: string | null;
    profile_image: string | null;
}

interface CommentType {
    id: number | null;
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
    const { state } = useLocation();
    const message = state?.message;
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
        if (!auth.id || !newComment.trim()) {
            // Hier könntest du eine Benachrichtigung anzeigen, dass der Benutzer angemeldet sein muss
            // oder dass der Kommentartext nicht leer sein darf.
            return;
        }
    
        try {
            // Simuliere das Hinzufügen eines neuen Kommentars mit einer temporären ID und dem aktuellen Datum
            // und aktualisiere den Zustand, um den neuen Kommentar direkt anzuzeigen.
            const tempComment = {
                id: Date.now(), // Temporäre ID, idealerweise vom Backend ersetzen lassen
                body: newComment,
                user: {
                    id: auth.id,
                    username: auth.username,
                    profile_image: auth.profile_image,
                },
                created_at: new Date().toISOString(), // Aktuelles Datum im ISO-Format
            };
    
            // Füge den temporären Kommentar zur Liste der Kommentare hinzu
            setComments((prevComments) => [...(prevComments || []), tempComment]);
            setNewComment(''); // Setze das Kommentarfeld zurück
    
            // Sende den neuen Kommentar an das Backend
            await http.post(`/posts/${postId}/comments`, { body: newComment });
            // Optional: Kommentare vom Server neu abrufen, um sicherzustellen, dass die Ansicht aktuell ist
            // und um die temporäre ID durch eine echte ID zu ersetzen
        } catch (error) {
            console.error('Fehler beim Senden des Kommentars', error);
            // Hier könntest du eine Fehlermeldung anzeigen
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
            {message && <div className="success">{message}</div>}
            {post ? (
                <div className="show-post-container">
                    <h1>{post.title}</h1>

                    <div className="post-user">
                        <img src={`${BASE_URL}/${post.user.profile_image}`} alt="Profilbild" className="comment-profile-image" />
                        {post.user.username}
                    </div>

                    <div className="image-and-camera-container">

                        <img className="post-image" src={`${BASE_URL}/${post.image_path}`} alt={post.title} />

                        <div className="camera-settings-section">
                            <div className="camera-setting">
                                <div className="camera-setting-title">
                                    <img src="/src/images/posticons/camera-icon.svg"/>
                                    <p><strong>Kamera:</strong></p>
                                </div>
                                {post.camera && <p className="camera-setting-text">{post.camera}</p>}
                            </div>
                            <div className="camera-setting">
                                <div className="camera-setting-title">
                                    <img src="/src/images/posticons/lens-icon.svg"/>
                                    <p><strong>Objektiv:</strong></p>
                                </div>
                                {post.lens && <p className="camera-setting-text">{post.lens}</p>}
                            </div>
                            <div className="camera-setting">
                                <div className="camera-setting-title">
                                    <img src="/src/images/posticons/filter-icon.svg"/>
                                    <p><strong>Filter:</strong></p>
                                </div>
                                {post.filter && <p className="camera-setting-text">{post.filter}</p>}
                            </div>
                            <div className="camera-setting">
                                <div className="camera-setting-title">
                                    <img src="/src/images/posticons/tripod-icon.svg"/>
                                    <p><strong>Stativ:</strong></p>
                                </div>
                                {post.tripod && <p className="camera-setting-text">{post.tripod}</p>}
                            </div>
                        </div>
                        <div className="post-description-section">
                            <h3 className="desc-title">Beschreibung</h3>
                            <p className="post-description">{post.description}</p>
                        </div>
                    </div>
                  

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