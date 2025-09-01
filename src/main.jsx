// src/main.jsx

// 1. 라이브러리 및 컴포넌트 가져오기 (Imports)
import { StrictMode } from 'react';
import { Provider } from '@/components/ui/provider'; // 사용자 정의 Provider
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// --- 추가된 부분 ---
import MainLayout from './components/MainLayout/MainLayout';

import Main from './components/Main/Main';
import Favorite from './pages/Favorite/Favorite';
import PaymentManagement from './pages/PaymentManagement/PaymentManagement';
import OrderDetails from './pages/OrderDetails/OrderDetails';
import PersonalInformation from './pages/PersonalInformation/PersonalInformation';

import './index.css'; // 전역 CSS 스타일
import StoreDetail from './pages/StoreDetail/StoreDetail';
import StoreMenu from './pages/StoreDetail/StoreMenu';
import StoreChallenge from './pages/StoreDetail/StoreChallenge';
import StoreReview from './pages/StoreDetail/StoreReview';
import StoreInfo from './pages/StoreDetail/StoreInfo';
import StoreBasket from './pages/StoreDetail/StoreBasket';
import Position from './pages/MapPosition/Position';
import WriteReview from './pages/WriteReview/WriteReview';
import FilteredShops from './pages/FilteredShops/FilteredShops';

// 2. React Query 클라이언트 인스턴스 생성
const queryClient = new QueryClient();

// 3. React 애플리케이션 렌더링
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider>
        <Router>
          <Routes>
            <Route element={<MainLayout />}>
              {/* 홈 화면 element을 Home에서 Main으로 최신화 했습니다. */}
              <Route path="/" element={<Main />} />
              <Route path="/favorite" element={<Favorite />} />
              <Route path="/payment" element={<PaymentManagement />} />
              <Route path="/orders" element={<OrderDetails />} />
              <Route path="/personal-info" element={<PersonalInformation />} />
              <Route
                path="/shops/:category/:filter"
                element={<FilteredShops />}
              />

              {/* 가게 상세 페이지 */}
              <Route path="/store/:storeId" element={<StoreDetail />}>
                <Route index element={<StoreMenu />} />
                <Route path="menu" element={<StoreMenu />} />
                <Route path="challenge" element={<StoreChallenge />} />
                <Route path="review" element={<StoreReview />} />
                <Route path="info" element={<StoreInfo />} />
              </Route>

              <Route path="/store-basket" element={<StoreBasket />} />
              <Route path="/locationmap" element={<Position />} />
              <Route path="/write-review" element={<WriteReview />} />
            </Route>
          </Routes>
        </Router>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
