import { useContext } from 'react';
import http from '../utils/http'; 
import { AuthContext } from '../context/AuthProvider';
import {useNavigate } from 'react-router-dom'


interface DeletePostButtonProps {
    postId: number; 
    postTitle: string;
}

const DeletePostButton = ({ postId, postTitle }: DeletePostButtonProps) => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (window.confirm(`Möchtest du diesen Post wirklich löschen?`)) {
            try {
                await http.delete(`/admin/posts/${postId}`);
                navigate(`/discover`, { state: { message: `✅ Post "${postTitle}" erfolgreich gelöscht.` } });
            } catch (error) {
                console.error("Fehler beim Löschen des Posts", error);
                alert("Es gab ein Problem beim Löschen des Posts.");
            }
        }
    };

    return auth.role === 'admin' ? (
        <button onClick={handleDelete} className="delete-post-btn">
            Post löschen
        </button>
    ) : null;
};

export default DeletePostButton;
