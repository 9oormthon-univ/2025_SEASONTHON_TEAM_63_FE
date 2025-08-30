// src/components/ui/SearchBar/SearchBar.jsx

import React from 'react';
import './SearchBar.css';

// ✨ onFocus prop을 받아 input 요소에 연결
function SearchBar({ placeholder, onFocus }) {
    return (
        <div className="search-container">
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                onFocus={onFocus} // 포커스 시 부모 컴포넌트의 함수 호출
                readOnly // 실제 입력은 SearchPage에서 하므로 읽기 전용으로 설정
            />
            {/* CSS로 돋보기 아이콘 추가 */}
        </div>
    );
}

export default SearchBar;
