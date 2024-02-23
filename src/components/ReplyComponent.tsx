import React, { useState, useContext } from 'react';
import http from '../utils/http';
import { AuthContext } from '../context/AuthProvider';

interface ReplyProps {
    commentId: number;
    parentId?: number;
    onReplyAdded: () => void; 

}

const ReplyComponent: React.FC<ReplyProps> = ({ commentId, parentId ,onReplyAdded }) => {
    const [replyBody, setReplyBody] = useState('');
    const { auth } = useContext(AuthContext);

    const submitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyBody.trim()) return;

        try {
            await http.post(`/comments/${commentId}/replies`, {
                body: replyBody,
                parentId,
                userId: auth.id, 
            });
            setReplyBody('');
            onReplyAdded(); 
        } catch (error) {
            console.error('Fehler beim Hinzufügen der Antwort', error);
        }
    };

    return (
        <form onSubmit={submitReply} className="reply-form">
            <textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Schreibe eine Antwort..."
                className="reply-textarea"
            />
            <button type="submit"><img src="/src/images/posticons/send-icon.svg" /></button>
        </form>
    );
};

export default ReplyComponent;
