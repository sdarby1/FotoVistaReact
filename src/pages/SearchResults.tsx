import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import http from '../utils/http'; 

interface User {
    id: number;
    username: string;
    profile_image: string | null; 
}

interface Post {
    id: number;
    title: string;
    image_path: string;
}

interface SearchResult {
    users: User[];
    posts: Post[];
}

const BASE_URL = 'http://localhost'; 

const SearchResultsPage: React.FC = () => {
    const [results, setResults] = useState<SearchResult>({ users: [], posts: [] });
    const location = useLocation();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const query = queryParams.get('q');
    
        const fetchSearchResults = async () => {
            setIsLoading(true); 
            try {
                const response = await http.get(`/search?q=${query}`);
                setResults(response.data);
            } catch (error) {
                console.error('Fehler beim Abrufen der Suchergebnisse', error);
            } finally {
                setIsLoading(false); 
            }
        };
    
        if (query) {
            fetchSearchResults();
        }
    }, [location.search]);
    

    return (
        <div>
            <h2>Suchergebnisse</h2>
            {isLoading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            ) : results.users.length === 0 && results.posts.length === 0 ? (
                <div>Keine Ergebnisse gefunden.</div>
            ) : (
                <div className="search-results">
                    {results.users.length > 0 && (
                        <div className="search-user">
                            <h3>Benutzer</h3>
                            {results.users.map((user) => (
                                <Link to={`/user/${user.id}`} className="post-link-btn" key={user.id}>
                                    <div className="search-user-container">
                                        <img src={user.profile_image ? `${BASE_URL}/${user.profile_image}` : '/src/images/no-profile-image-icon.svg'} alt="Profilbild" className="profile-image" />
                                        <p>{user.username}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    {results.posts.length > 0 && (
                        <div className="search-posts">
                            <h3>Beiträge</h3>
                            {results.posts.map((post) => (
                                <Link to={`/posts/${post.id}`} className="post-link-btn" key={post.id}>
                                    <div className="search-post-container">
                                        <h3 className="search-posts-title">{post.title}</h3>
                                        <img className="search-posts-image" src={`${BASE_URL}/${post.image_path}`} alt={post.title} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
    

};

export default SearchResultsPage;
