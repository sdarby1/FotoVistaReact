import React, { useState, useEffect } from 'react';
import http from '../utils/http'; // Stellen Sie sicher, dass dies auf Ihre HTTP-Anforderungsbibliothek verweist

interface LikesProps {
  postId: number;
}

const LikesComponent: React.FC<LikesProps> = ({ postId }) => {
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isTogglingLike, setIsTogglingLike] = useState<boolean>(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await http.get(`/posts/${postId}/likes`);
        if(response.data) {
          setLikesCount(response.data.likesCount);
          setIsLiked(response.data.isLiked);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Likes', error);
      }
    };

    fetchLikes();
  }, [postId]);

  const toggleLike = async () => {
    setIsTogglingLike(true);
    try {
      const response = await http.post(`/posts/${postId}/toggle-like`);
      if(response.data) {
        setIsLiked(response.data.isLiked);
        setLikesCount(response.data.likesCount);
      }
    } catch (error) {
      console.error('Fehler beim Togglen des Like-Status', error);
    } finally {
      setIsTogglingLike(false);
    }
  };

  const LikeIcon = ({ isLiked }) => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="26.986" height="29.257" viewBox="0 0 26.986 29.257">
        <path
          d="M30.326,27.337A2.854,2.854,0,0,0,31.5,25.13a3.087,3.087,0,0,0-.766-2.046c-.042-.084-.077-.162-.112-.239l-.014-.077a.918.918,0,0,1,.141-.7,3.082,3.082,0,0,0,.408-1.807,2.136,2.136,0,0,0-.682-1.631,1.341,1.341,0,0,1-.288-1.287,2.712,2.712,0,0,0-.577-2.658c-.738-.83-1.427-.928-3.263-.823-1.266.077-3.9.485-5.639.759-.71.113-1.329.211-1.519.225-.893.091-1.069,0-1.153-.345a2.28,2.28,0,0,1,.345-.914,15.079,15.079,0,0,0,1.02-2.517c.71-2.334.633-4.866-.19-6.342A2.3,2.3,0,0,0,17.36,3.382a2.8,2.8,0,0,0-1.962.555c-.239.281-.162.816-.436,1.884a20.5,20.5,0,0,1-.844,2.953c-.527,1.167-2.791,3.171-4.008,4.247-.288.253-.534.471-.71.64a14.493,14.493,0,0,0-1.793,2.3,12.239,12.239,0,0,1-.963,1.3,2.54,2.54,0,0,1-1.568.766.564.564,0,0,0-.562.563V29.805a.582.582,0,0,0,.584.584,11.08,11.08,0,0,1,4.669.83,12.151,12.151,0,0,0,3.262.851,67.537,67.537,0,0,0,7.917.57,35.041,35.041,0,0,0,3.98-.274c2.18-.253,4.514-.759,5.288-2.6a1.986,1.986,0,0,0-.035-1.666.553.553,0,0,1-.056-.183A.6.6,0,0,1,30.326,27.337Z"
          transform="translate(-4.514 -3.382)"
          fill={isLiked ? "#007bff" : "#bcbcbc"} // Blau wenn geliked, sonst Grau
        />
      </svg>
    );
  };

  return (
    <div className="like-post-container">
        <button onClick={toggleLike} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <LikeIcon isLiked={isLiked} />
        </button>
        <span>{likesCount} Likes</span>
    </div>
  );
};

export default LikesComponent;
