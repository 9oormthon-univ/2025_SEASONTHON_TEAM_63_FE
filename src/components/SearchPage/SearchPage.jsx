import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/auth/axiosInstance'; // axios 인스턴스 import
import './SearchPage.css';

function SearchPage({ onClose }) {
    const navigate = useNavigate();

    // --- State 관리 ---
    const [searchTerm, setSearchTerm] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [searchResults, setSearchResults] = useState([]); // API 검색 결과
    const [loading, setLoading] = useState(false); // API 호출 로딩 상태
    const [error, setError] = useState(null); // API 호출 에러 상태
    const [hasSearched, setHasSearched] = useState(false); // 검색을 실행했는지 여부

    // 컴포넌트 마운트 시 최근 검색어 로드
    useEffect(() => {
        const storedSearches = localStorage.getItem('recentSearches');
        if (storedSearches) {
            setRecentSearches(JSON.parse(storedSearches));
        }
    }, []);

    // 최근 검색어 저장 함수
    const updateRecentSearches = (term) => {
        if (!term) return;
        const newSearches = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
        setRecentSearches(newSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    };

    // --- API 호출을 포함한 검색 실행 핸들러 ---
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        const trimmedSearchTerm = searchTerm.trim();
        if (!trimmedSearchTerm) return;

        updateRecentSearches(trimmedSearchTerm);
        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            // ***** 이 부분을 수정합니다 *****
            // 1. 서버가 기대하는 파라미터 형식에 맞게 쿼리 스트링을 직접 구성합니다.
            const keyword = encodeURIComponent(trimmedSearchTerm); // 한글 등 비-ASCII 문자를 안전하게 인코딩
            const page = 0;
            const size = 20;

            // 2. 템플릿 리터럴을 사용하여 URL을 생성합니다.
            const response = await axiosInstance.get(
                `/api/stores/search?keyword=${keyword}&pageRequest.page=${page}&pageRequest.size=${size}`
            );

            if (response.data && response.data.success) {
                setSearchResults(response.data.data.content || []);
            } else {
                throw new Error(response.data.message || '검색 결과를 가져오는데 실패했습니다.');
            }
        } catch (err) {
            console.error('검색 API 호출 에러:', err);
            // 서버에서 구체적인 에러 메시지를 보내주는 경우, 그것을 표시합니다.
            const errorMessage = err.response?.data?.message || '검색 중 오류가 발생했습니다.';
            setError(errorMessage);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    // 최근 검색어 클릭 시 해당 단어로 검색 실행
    const handleRecentSearchClick = (term) => {
        setSearchTerm(term);
        // form submit을 프로그래매틱하게 트리거
        const form = document.querySelector('.search-page-bar');
        if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    };

    // 최근 검색어 삭제 핸들러
    const handleRemoveSearch = (termToRemove) => {
        const updatedSearches = recentSearches.filter((term) => term !== termToRemove);
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

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
                        placeholder="가게 또는 메뉴를 입력하세요"
                        autoFocus
                    />
                    <button type="submit" className="search-icon-btn">
                        🔍
                    </button>
                </form>

                {/* 검색을 실행하기 전에는 '최근 검색어'를 보여주고, 실행 후에는 '검색 결과'를 보여줍니다. */}
                {!hasSearched ? (
                    <section className="recent-searches">
                        <h2>최근 검색어</h2>
                        <div className="tags-container">
                            {recentSearches.length > 0 ? (
                                recentSearches.map((term, index) => (
                                    <span
                                        key={index}
                                        className="search-tag"
                                        onClick={() => handleRecentSearchClick(term)}
                                    >
                                        {term}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveSearch(term);
                                            }}
                                            className="remove-tag-btn"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))
                            ) : (
                                <p className="no-recent-searches">최근 검색 기록이 없습니다.</p>
                            )}
                        </div>
                    </section>
                ) : (
                    <section className="search-results">
                        <h2>검색 결과</h2>
                        {loading ? (
                            <p>검색 중...</p>
                        ) : error ? (
                            <p className="error-message">{error}</p>
                        ) : searchResults.length === 0 ? (
                            <p>'{searchTerm}'에 대한 검색 결과가 없습니다.</p>
                        ) : (
                            <ul className="results-list">
                                {searchResults.map((store) => (
                                    <li
                                        key={store.id}
                                        className="result-item"
                                        onClick={() => navigate(`/store/${store.id}`)}
                                    >
                                        <div className="result-image">
                                            <img src={store.bannerImageUrl} alt={store.name} />
                                        </div>
                                        <div className="result-info">
                                            <h3>{store.name}</h3>
                                            <p className="result-category">{store.category}</p>
                                            <p className="result-description">{store.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}

export default SearchPage;
