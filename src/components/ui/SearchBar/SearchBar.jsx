import React from 'react';
import './SearchBar.css';

function SearchBar({ placeholder }) {
    return (
        <div className="search-container">
            <input type="text" className="search-input" placeholder={placeholder} />
        </div>
    );
}

export default SearchBar;
