import React, { useContext } from 'react';
import http from '../utils/http'; 
import { AuthContext } from '../context/AuthProvider';

interface DeleteCommentButtonProps {
    commentId: number; 
    onCommentDeleted: (commentId: number) => void; 
}

const DeleteCommentButton: React.FC<DeleteCommentButtonProps> = ({ commentId, onCommentDeleted }) => {
    const { auth } = useContext(AuthContext);

    const handleDeleted = async () => {
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
        <button onClick={handleDeleted} className="delete-comment-btn">
            <img src="/src/images/posticons/delete-icon.svg" />
        </button>
    ) : null;
};

export default DeleteCommentButton;
