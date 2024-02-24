import { useEffect, useState } from 'react';
import http from '../utils/http'; // Deinen HTTP-Client anpassen

const FollowButtonComponent = ({ profileUserId }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkFollowingStatus = async () => {
            try {
                const response = await http.get(`/users/${profileUserId}/isFollowing`);
                console.log('Is Following:', response.data.isFollowing); // Zum Debuggen
                setIsFollowing(response.data.isFollowing);
            } catch (error) {
                console.error('Fehler beim Überprüfen des Follow-Status:', error);
            } finally {
                setIsLoading(false);
            }
        };
    
        checkFollowingStatus();
    }, [profileUserId]);
    
    

    const handleFollow = async () => {
        setIsLoading(true);
        try {
            if (isFollowing) {
                await http.post(`/users/${profileUserId}/unfollow`);
            } else {
                await http.post(`/users/${profileUserId}/follow`);
            }
            setIsFollowing(!isFollowing); // Den Zustand nach der Aktion umschalten
        } catch (error) {
            console.error('Fehler beim Folgen/Entfolgen:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button onClick={handleFollow} disabled={isLoading} className="follow-btn">
            {isLoading ? 'Lädt...' : isFollowing ? 'Entfolgen' : 'Folgen'}
        </button>
    );
};

export default FollowButtonComponent;
