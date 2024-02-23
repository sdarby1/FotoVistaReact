// SearchComponent.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchComponent = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search-results?q=${query}`);
    };

    return (
        <form onSubmit={handleSearch} className="search-bar">
            <input
                type="text"
                placeholder="Suche..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="searchbar"
            />
            <button type="submit" className="search-btn">
                <img src="/src/images/search-icon.svg" />
            </button>
        </form>
    );
};

export default SearchComponent;
