import React, { useState, useRef, useEffect } from 'react';
import './ExpandableList.css';

export default function ExpandableList({ children, maxHeight = 400 }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        // 콘텐츠의 실제 높이가 최대 높이보다 큰지 확인하여 '더보기' 버튼 표시 여부 결정
        if (contentRef.current && contentRef.current.scrollHeight > maxHeight) {
            setIsOverflowing(true);
        } else {
            setIsOverflowing(false);
        }
    }, [children, maxHeight]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="expandable-container">
            <div
                ref={contentRef}
                className={`expandable-content ${isExpanded ? 'expanded' : ''}`}
                style={{ maxHeight: isExpanded ? `${contentRef.current.scrollHeight}px` : `${maxHeight}px` }}
            >
                {children}
            </div>
            {isOverflowing && (
                <button onClick={toggleExpand} className="expand-button">
                    {isExpanded ? '접기' : '더보기'}
                </button>
            )}
        </div>
    );
}
