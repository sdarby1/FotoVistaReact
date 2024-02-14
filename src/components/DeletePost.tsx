import { useParams, useNavigate } from 'react-router-dom';
import http from '../utils/http';

const DeletePost = () => {
    const navigate = useNavigate();
    const { postId } = useParams<{ postId: string }>();

    const handleDelete = async () => {
        if (window.confirm("Möchtest du diesen Post wirklich löschen? Dies kann nicht rückgängig gemacht werden.")) {
            try {
                await http.delete(`/posts/${postId}`);
                navigate('/profile', { state: { message: '✅ Der Post wurde erfolgreich gelöscht' } });
            } catch (error) {
                console.error('Fehler beim Löschen des Posts', error);
                alert('Es gab ein Problem beim Löschen des Posts.');
            }
        }
    };

    return (
        <button onClick={handleDelete} className="delete-profile-btn">
            Post löschen
        </button>
    );
};

export default DeletePost;
