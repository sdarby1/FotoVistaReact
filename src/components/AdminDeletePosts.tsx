// DeletePostButton.tsx
import { useContext } from 'react';
import http from '../utils/http'; // Pfad zu deinem HTTP-Client anpassen
import { AuthContext } from '../context/AuthProvider';
import {useNavigate } from 'react-router-dom'


const DeletePostButton = ({ postId, postTitle }) => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();


    const handleDelete = async () => {
        if (window.confirm("Möchtest du diesen Post wirklich löschen?")) {
            try {
                await http.delete(`/admin/posts/${postId}`);
                navigate(`/discover`, { state: { message: `✅ Post ${postTitle} erfolgreich erstellt` } });
            } catch (error) {
                console.error("Fehler beim Löschen des Posts", error);
                alert("Es gab ein Problem beim Löschen des Posts.");
            }
        }
    };
    console.log(auth); // Füge dies in ShowPost vor der Return-Anweisung hinzu

    return auth.role === 'admin' ? (
        <button onClick={handleDelete} className="delete-post-btn">
            Post löschen
        </button>
    ) : null;
};

export default DeletePostButton;
