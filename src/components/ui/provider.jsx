// src/components/ui/provider.jsx

// "use client"; // Next.js용 지시어이므로 React에서는 필요 없습니다.
import React from 'react';

// ChakraProvider 대신, 단순히 자식 컴포넌트들을 렌더링하는 역할만 하도록 수정합니다.
// 이렇게 하면 나중에 다른 전역 Provider(예: 테마, 모달)를 추가할 때 이 파일을 재사용할 수 있습니다.
export function Provider({ children }) {
    return <>{children}</>;
}
