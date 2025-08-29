// src/main.jsx

// 1. 라이브러리 및 컴포넌트 가져오기 (Imports)
import { StrictMode } from 'react';
import { Provider } from '@/components/ui/provider'; // 사용자 정의 Provider
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// --- 추가된 부분 ---
import MainLayout from './components/MainLayout/MainLayout';

import Home from './pages/home/home';
import Favorite from './pages/Favorite/Favorite';
import PaymentManagement from './pages/PaymentManagement/PaymentManagement';
import OrderDetails from './pages/OrderDetails/OrderDetails';
import PersonalInformation from './pages/PersonalInformation/PersonalInformation';

import './index.css'; // 전역 CSS 스타일
import StoreMenu from './pages/StoreDetail/StoreMenu';

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
              <Route path="/" element={<Home />} />
              <Route path="/favorite" element={<Favorite />} />
              <Route path="/payment" element={<PaymentManagement />} />
              <Route path="/orders" element={<OrderDetails />} />
              <Route path="/personal-info" element={<PersonalInformation />} />
              <Route path="/storemenu" element={<StoreMenu />} />
            </Route>
          </Routes>
        </Router>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
