import React, { useContext, useState } from 'react';
import http from '../utils/http'; 
import { AuthContext } from '../context/AuthProvider';
import ConfirmationModal from './ConfirmationModal';

interface DeleteReplyButtonProps {
    replyId: number; 
    onReplyDeleted: (commentId: number) => void; 
}

const DeleteReplyButton: React.FC<DeleteReplyButtonProps> = ({ replyId, onReplyDeleted }) => {
    const { auth } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
            try {
                await http.delete(`/admin/reply/${replyId}`);
                onReplyDeleted(replyId); 
            } catch (error) {
                console.error("Fehler beim Löschen der Antwort", error);
            }      
    };
    

    return auth.role === 'admin' ? (
        <>
        <button onClick={() => setShowModal(true)} className="delete-comment-btn">
            <img src="/src/images/posticons/delete-icon.svg" />
        </button>
        {showModal && (
            <ConfirmationModal
              message={`Möchtest du diese Antwort wirklich löschen?`}
              onConfirm={handleDelete}
              onCancel={() => setShowModal(false)}
            />
          )}
          </>
    ) : null;
};

export default DeleteReplyButton;
