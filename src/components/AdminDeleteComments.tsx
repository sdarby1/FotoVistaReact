import React, { useContext } from 'react';
import http from '../utils/http'; // Pfad zu deinem HTTP-Client anpassen
import { AuthContext } from '../context/AuthProvider';

interface DeleteCommentButtonProps {
    commentId: number; 
    onCommentDeleted: (commentId: number) => void; 
}

const DeleteCommentButton: React.FC<DeleteCommentButtonProps> = ({ commentId, onCommentDeleted }) => {
    const { auth } = useContext(AuthContext);

    const handleDelete = async () => {
        if (window.confirm("Möchtest du diesen Kommentar wirklich löschen?")) {
            try {
                await http.delete(`/admin/comment/${commentId}`);
                onCommentDeleted(commentId); 
            } catch (error) {
                console.error("Fehler beim Löschen des Kommentars", error);
            }
        }
    };

    return auth.role === 'admin' ? (
        <button onClick={handleDelete} className="delete-comment-btn">
            Kommentar löschen
        </button>
    ) : null;
};

export default DeleteCommentButton;
