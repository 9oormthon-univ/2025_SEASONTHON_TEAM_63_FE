// src/components/SearchPage/SearchPage.jsx

import React, { useState, useEffect } from 'react';
import './SearchPage.css';

function SearchPage({ onClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);

    // 컴포넌트가 로드될 때 로컬 스토리지에서 최근 검색어를 불러옵니다.
    useEffect(() => {
        const storedSearches = localStorage.getItem('recentSearches');
        if (storedSearches) {
            setRecentSearches(JSON.parse(storedSearches));
        }
    }, []);

    // 검색어를 로컬 스토리지에 저장하는 함수
    const updateRecentSearches = (term) => {
        if (!term) return;
        const newSearches = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5); // 중복 제거 및 최대 5개
        setRecentSearches(newSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    };

    // 검색 실행 핸들러
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        updateRecentSearches(searchTerm.trim());
        // 실제 검색 로직 수행 (예: API 호출, 결과 페이지 이동 등)
        console.log(`'${searchTerm}' 검색 실행`);
    };

    // 최근 검색어 삭제 핸들러
    const handleRemoveSearch = (termToRemove) => {
        const updatedSearches = recentSearches.filter((term) => term !== termToRemove);
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

    // 인기 검색어 더미 데이터
    const popularKeywords = [
        { rank: 1, term: '마라탕', status: 'up' },
        { rank: 2, term: '부산 여행', status: 'down' },
        { rank: 3, term: '냉면 맛집', status: 'new' },
        { rank: 4, term: '제주도 펜션', status: null },
        { rank: 5, term: '여름 옷', status: null },
    ];

    return (
        <div className="search-page-overlay">
            <header className="search-page-header">
                <button onClick={onClose} className="back-button">
                    ←
                </button>
                <h1>검색</h1>
            </header>

            <main className="search-page-content">
                <form onSubmit={handleSearchSubmit} className="search-page-bar">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="가게를 입력하세요"
                        autoFocus
                    />
                    <button type="submit" className="search-icon-btn">
                        🔍
                    </button>
                </form>

                <section className="recent-searches">
                    <h2>최근 검색어</h2>
                    <div className="tags-container">
                        {recentSearches.length > 0 ? (
                            recentSearches.map((term, index) => (
                                <span key={index} className="search-tag">
                                    {term}
                                    <button onClick={() => handleRemoveSearch(term)} className="remove-tag-btn">
                                        ×
                                    </button>
                                </span>
                            ))
                        ) : (
                            <p className="no-recent-searches">최근 검색 기록이 없습니다.</p>
                        )}
                    </div>
                </section>

                <section className="popular-searches">
                    <h2>인기 검색어</h2>
                    <ol>
                        {popularKeywords.map((keyword) => (
                            <li key={keyword.rank}>
                                <span className={`rank rank-${keyword.rank}`}>{keyword.rank}</span>
                                <span className="term">{keyword.term}</span>
                                {keyword.status === 'new' && <span className="status new">NEW</span>}
                                {keyword.status === 'up' && <span className="status up">▲</span>}
                                {keyword.status === 'down' && <span className="status down">▼</span>}
                                <span className="link-icon">↗</span>
                            </li>
                        ))}
                    </ol>
                </section>
            </main>
        </div>
    );
}

export default SearchPage;
