import React, { useContext } from 'react';
import http from '../utils/http'; // Pfad zu deinem HTTP-Client anpassen
import { AuthContext } from '../context/AuthProvider';

interface DeleteReplyButtonProps {
    replyId: number; 
    onReplyDeleted: (commentId: number) => void; 
}

const DeleteReplyButton: React.FC<DeleteReplyButtonProps> = ({ replyId, onReplyDeleted }) => {
    const { auth } = useContext(AuthContext);

    const handleDelete = async () => {
        if (window.confirm("Möchtest du diese Antwort wirklich löschen?")) {
            try {
                await http.delete(`/admin/reply/${replyId}`);
                onReplyDeleted(replyId); 
            } catch (error) {
                console.error("Fehler beim Löschen der Antwort", error);
            }
        }
    };
    

    return auth.role === 'admin' ? (
        <button onClick={handleDelete} className="delete-comment-btn">
            <img src="/src/images/posticons/delete-icon.svg" />
        </button>
    ) : null;
};

export default DeleteReplyButton;
