import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import http from '../utils/http';
import { AuthContext } from '../context/AuthProvider';
import { formatDistanceToNow, parseISO } from 'date-fns';
import DeletePostButton from '../components/AdminDeletePosts';
import DeleteCommentButton from '../components/AdminDeleteComments';
import ReplyComponent from '../components/ReplyComponent';
import DeleteReplyButton from '../components/AdminDeleteReply';
import LikesComponent from '../components/LikesComponent';


interface UserType {
    id: number | null;
    username: string | null;
    profile_image: string | null;
}

interface ReplyType {
    id: number;
    commentId: number;
    parentId: number | null;
    comment: CommentType;
    body: string;
    user: UserType;
    created_at: string;
    replies?: ReplyType[];
}

interface CommentType {
    id: number;
    body: string;
    user: UserType;
    created_at: string;
    showReply?: boolean; 
    replies?: ReplyType[];
    showReplies?: boolean; // Neues Feld hinzugefügt
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
    const [comments, setComments] = useState<CommentType[]>([]);
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

    const fetchComments = async () => {
        try {
            const response = await http.get(`/posts/${postId}/comments`);
            const fetchedComments = response.data.comments.map(comment => ({
                ...comment,
                showReplies: false, // Initialisiere showReplies als false
                replies: comment.replies ? comment.replies.map(reply => ({
                    ...reply,
                    // Hier könntest du weitere Initialisierungen durchführen, falls nötig
                })) : []
            }));
            setComments(fetchedComments);
            setIsLoadingComments(false);
        } catch (err) {
            console.error('Fehler beim Laden der Kommentare', err);
            setIsLoadingComments(false)
        }
    };
    

    // Schritt 2: Rufe `fetchComments` innerhalb des useEffect Hooks auf
    useEffect(() => {
        fetchComments();
    }, [postId]); // Abhängigkeiten für useEffect



    const handleCommentSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!auth.id || !newComment.trim()) {
            return;
        }
    
        try {

            const tempComment = {
                id: Date.now(), 
                body: newComment,
                user: {
                    id: auth.id,
                    username: auth.username,
                    profile_image: auth.profile_image,
                },
                created_at: new Date().toISOString(), 
            };
    
            setComments((prevComments) => [...(prevComments || []), tempComment]);
            setNewComment(''); 
    
            await http.post(`/posts/${postId}/comments`, { body: newComment });

        } catch (error) {
            console.error('Fehler beim Senden des Kommentars', error);
        }
    };
    

    const [successMessage, setSuccessMessage] = useState('');


    const handleCommentDeleted = (commentId: number) => {
        setComments(currentComments => currentComments?.filter(comment => comment.id !== commentId));
        setSuccessMessage('✅ Kommentar erfolgreich gelöscht.');
        setTimeout(() => setSuccessMessage(''), 5000); 
    };

    const handleReplyDeleted = (deletedReplyId: number) => {
        setComments(comments.map(comment => ({
            ...comment,
            replies: comment.replies?.filter(reply => reply.id !== deletedReplyId)
        })));
        setSuccessMessage('✅ Antwort erfolgreich gelöscht.');
        setTimeout(() => setSuccessMessage(''), 5000); 
    }; 
    


    const toggleReplyField = (commentId: number) => {
        setComments(comments.map(comment => 
            comment.id === commentId ? { ...comment, showReply: !comment.showReply } : comment
        ));
    };


    const toggleRepliesVisibility = (commentId: number) => {
        setComments(comments.map(comment => 
            comment.id === commentId ? { ...comment, showReplies: !comment.showReplies } : comment
        ));
    };

    const findParentUsername = (parentId, allComments) => {
        for (const comment of allComments) {
          if (comment.id === parentId) {
            return comment.user.username; 
          }
          for (const reply of comment.replies || []) {
            if (reply.id === parentId) {
              return reply.user.username; 
            }
          }
        }
        return null; // Falls keine Übereinstimmung gefunden wurde
      };

    
    
    if (isLoadingPost || isLoadingComments) {
        return <div className="loader-container">
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
                    <div className="post-title-container">
                        <h1 className="post-headline">{post.title}</h1>
                        <LikesComponent postId={post.id} />
                    </div>
                    <Link to={`/user/${post.user.id}`} className="post-link-btn">
                        <div className="post-user">
                        <img src={post.user.profile_image ? `${BASE_URL}/${post.user.profile_image}` : '/src/images/no-profile-image-icon.svg'} alt="Profilbild" className="profile-image" />
                            {post.user.username}
                        </div>
                    </Link>
                        <DeletePostButton postId={post?.id} postTitle={post?.title} />
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
                    {successMessage && <div className="success">{successMessage}</div>}
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
                            <div className="comment-content">
                                <Link to={`/user/${comment.user.id}`} className="post-link-btn">
                                    <div className="comment-user">
                                        <img src={comment.user.profile_image ? `${BASE_URL}/${comment.user.profile_image}` : '/src/images/no-profile-image-icon.svg'} alt="Profilbild" className="comment-profile-image" />
                                        <p><strong>{comment.user.username}</strong></p>    
                                    </div>   
                                </Link>     
                                <p>{comment.body}</p>    
                                <p><span className="comment-date">{formatCommentDate(comment.created_at)}</span></p>
                                <DeleteCommentButton commentId={comment.id} onCommentDeleted={handleCommentDeleted} />
                                <button className="reply-btn" onClick={() => toggleReplyField(comment.id)}>Antworten</button>
                            </div>   

                            <button className="show-replies-btn" onClick={() => toggleRepliesVisibility(comment.id)}>
                                {comment.showReplies ? "Antworten ausblenden" : `Antworten anzeigen (${comment.replies?.length || 0})`}
                            </button>  

                            {comment.showReply && <ReplyComponent commentId={comment.id} onReplyAdded={() => fetchComments()}/>}
                                {comment.replies && comment.showReplies && comment.replies.length > 0 && ( 
                                    <div className="replies">
                                    {comment.replies?.map((reply) => (
                                      <div key={reply.id} className="reply">
                                        <Link to={`/user/${reply.user.id}`} className="post-link-btn">
                                          <div className="comment-user">
                                            <img src={reply.user.profile_image ? `${BASE_URL}/${reply.user.profile_image}` : '/src/images/no-profile-image-icon.svg'} alt="Profilbild" className="comment-profile-image" />
                                            <p><strong>{reply.user.username}</strong></p>
                                          </div>
                                        </Link>
                                        {reply.parentId && (
                                          <p className="reply-to">Antwort auf {findParentUsername(reply.parentId, comments)}</p>
                                        )}
                                        <p><Link to= {`/user/${comment.user.id}`} className='link-btn'>@{comment.user.username}</Link> {reply.body}</p>
                                        <p><span className="comment-date">{formatCommentDate(reply.created_at)}</span></p>
                                        <DeleteReplyButton  replyId={reply.id} onReplyDeleted={handleReplyDeleted} />
                                      </div>
                                    ))}
                                  </div>
                                    
)}
</div>
))}

                </div>
                </div>
            ) : (
                <div>
                    <p className="link-text">
                        <Link to="/login" className="link-btn">Melde dich doch an</Link> , um dich mit anderen auszutauschen
                    </p>
                </div>
            )}  
            </div>      
              
    );
};

export default ShowPost;