// src/components/auth/FavoriteStateInitializer.jsx

import { useEffect } from 'react';
import axiosInstance from '../../api/auth/axiosInstance';
import useFavoriteStore from '../../store/useFavoriteStore';

function FavoriteStateInitializer() {
    // 전역 스토어에서 상태를 설정하는 함수만 가져옵니다.
    const setStoreSubscription = useFavoriteStore((state) => state.setStoreSubscription);

    useEffect(() => {
        const initializeFavorites = async () => {
            // 사용자가 로그인했을 때만 (토큰이 있을 때) 찜 목록을 조회합니다.
            if (localStorage.getItem('authToken')) {
                try {
                    const response = await axiosInstance.get('/api/stores/subscribed');
                    if (response.data && response.data.success) {
                        const favoriteShops = response.data.data || [];

                        // 서버에서 받은 찜 목록으로 전역 상태를 초기화합니다.
                        favoriteShops.forEach((shop) => {
                            setStoreSubscription(shop.id, true);
                        });
                        console.log('전역 찜 상태 초기화 완료.');
                    }
                } catch (error) {
                    console.error('전역 찜 상태 초기화 실패:', error);
                }
            }
        };

        initializeFavorites();
        // setStoreSubscription은 Zustand 스토어에서 생성되므로 앱 생명주기 동안 변경되지 않습니다.
        // 따라서 의존성 배열에 추가해도 안전합니다.
    }, [setStoreSubscription]);

    // 이 컴포넌트는 화면에 아무것도 그리지 않습니다.
    return null;
}

export default FavoriteStateInitializer;
