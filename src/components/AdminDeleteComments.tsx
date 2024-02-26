import React, { useContext, useState } from 'react';
import http from '../utils/http'; 
import { AuthContext } from '../context/AuthProvider';
import ConfirmationModal from './ConfirmationModal';

interface DeleteCommentButtonProps {
    commentId: number; 
    onCommentDeleted: (commentId: number) => void; 
}

const DeleteCommentButton: React.FC<DeleteCommentButtonProps> = ({ commentId, onCommentDeleted }) => {
    const { auth } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
            try {
                await http.delete(`/admin/comment/${commentId}`);
                onCommentDeleted(commentId); 
            } catch (error) {
                console.error("Fehler beim Löschen des Kommentars", error);
            }       
    };
    

    return auth.role === 'admin' ? (
        <>
        <button onClick={() => setShowModal(true)} className="delete-comment-btn">
            <img src="/src/images/posticons/delete-icon.svg" />
        </button>
        {showModal && (
            <ConfirmationModal
              message={`Möchtest du den Kommentar wirklich löschen?`}
              onConfirm={handleDelete}
              onCancel={() => setShowModal(false)}
            />
          )}
          </>
    ) : null;
};

export default DeleteCommentButton;
