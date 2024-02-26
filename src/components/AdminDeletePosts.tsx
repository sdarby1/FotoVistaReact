import { useContext, useState } from 'react';
import http from '../utils/http'; 
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';

interface DeletePostButtonProps {
  postId: number; 
  postTitle: string;
}

const DeletePostButton = ({ postId, postTitle }: DeletePostButtonProps) => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    try {
      await http.delete(`/admin/posts/${postId}`);
      navigate(`/discover`, { state: { message: `✅ Post "${postTitle}" erfolgreich gelöscht.` } });
    } catch (error) {
      console.error("Fehler beim Löschen des Posts", error);
      alert("Es gab ein Problem beim Löschen des Posts.");
    }
  };

  return auth.role === 'admin' ? (
    <>
      <button onClick={() => setShowModal(true)} className="delete-post-btn">
        Post löschen
      </button>
      {showModal && (
        <ConfirmationModal
          message={`Möchtest du den Post "${postTitle}" wirklich löschen?`}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  ) : null;
};

export default DeletePostButton;
