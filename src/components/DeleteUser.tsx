import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, defaultAuth } from '../context/AuthProvider';
import http from '../utils/http';

const DeleteUser = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (window.confirm("Möchtest du wirklich dein Konto löschen? Dies kann nicht rückgängig gemacht werden.")) {
            try {
                await http.delete('/user/delete');
                setAuth(defaultAuth); // Authentifizierungsstatus im Kontext auf null setzen
                navigate('/login', { state: { message: '✅ Dein Konto wurde erfolgreich gelöscht' } });
            } catch (error) {
                console.error('Fehler beim Löschen des Kontos', error);
                alert('Es gab ein Problem beim Löschen deines Kontos.');
            }
        }
    };

    return (
        <button onClick={handleDelete} className="delete-profile-btn">
            Konto löschen
        </button>
    );
};

export default DeleteUser;
