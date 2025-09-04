// src/main.jsx

// 1. 라이브러리 및 컴포넌트 가져오기 (Imports)
import { StrictMode } from 'react';
import { Provider } from '@/components/ui/provider';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// --- 기존 애플리케이션 컴포넌트들 ---
import MainLayout from './components/MainLayout/MainLayout';
import BlankLayout from './components/BlankLayout/BlankLayout';
import Main from './components/Main/Main';
import Favorite from './pages/Favorite/Favorite';
import PaymentManagement from './pages/PaymentManagement/PaymentManagement';
import OrderDetails from './pages/OrderDetails/OrderDetails';
import PersonalInformation from './pages/PersonalInformation/PersonalInformation';
import ReviewPage from './pages/PersonalInformation/PersonalInformation-review/PersonalInformation-review';
import SuccessfulChallenge from './pages/PersonalInformation/SuccessfulChallenge/SuccessfulChallenge';
import CouponBox from './pages/PersonalInformation/CouponBox/CouponBox';
import StoreDetail from './pages/StoreDetail/StoreDetail';
import StoreMenu from './pages/StoreDetail/StoreMenu';
import StoreChallenge from './pages/StoreDetail/StoreChallenge';
import StoreReview from './pages/StoreDetail/StoreReview';
import StoreInfo from './pages/StoreDetail/StoreInfo';
import StoreBasket from './pages/StoreDetail/StoreBasket';
import Position from './pages/MapPosition/Position';
import WriteReview from './pages/WriteReview/WriteReview';
import FilteredShops from './pages/FilteredShops/FilteredShops';

// --- 인증 관련 페이지 컴포넌트 ---
import LoginPage from './pages/Auth/LoginPage';
import SignUpForm from './pages/Auth/SignUpForm';
import SignUpStep2Page from './pages/Auth/SignUpStep2Page';
import CompleteUserSignUpForm from './pages/Auth/CompleteUserSignUpForm';
// import CompleteCorpSignUpForm from './pages/CompleteCorpSignUpForm'; // 기업 가입 기능 구현 시 주석 해제

import './index.css'; // 전역 CSS 스타일

// 2. React Query 클라이언트 인스턴스 생성
const queryClient = new QueryClient();

// 3. 라우트 보호를 위한 헬퍼 컴포넌트
// 로그인이 필요한 페이지를 위한 컴포넌트
const PrivateRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('authToken');
    return isLoggedIn ? children : <Navigate to="/" />;
};

// 로그아웃 상태여야만 접근 가능한 페이지를 위한 컴포넌트
const PublicRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('authToken');
    // 로그인 시 메인 페이지('/main')로 이동합니다.
    return isLoggedIn ? <Navigate to="/main" /> : children;
};

// 4. React 애플리케이션 렌더링
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider>
                <Router>
                    <Routes>
                        {/* --- Public Routes (로그인 안 한 사용자만 접근) --- */}
                        <Route
                            path="/"
                            element={
                                <PublicRoute>
                                    <LoginPage />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                <PublicRoute>
                                    <SignUpForm />
                                </PublicRoute>
                            }
                        />

                        {/* --- Semi-Private Routes (2단계 가입 전용) --- */}
                        {/* 로그인 토큰이 있어야만 접근 가능하도록 PrivateRoute로 변경 */}
                        <Route
                            path="/signup-step2"
                            element={
                                <PrivateRoute>
                                    <SignUpStep2Page />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/complete-signup/user"
                            element={
                                <PrivateRoute>
                                    <CompleteUserSignUpForm />
                                </PrivateRoute>
                            }
                        />
                        {/* <Route path="/complete-signup/corp" element={<PrivateRoute><CompleteCorpSignUpForm /></PrivateRoute>} /> */}

                        {/* --- Private Routes (가입 완료된 사용자가 접근) --- */}

                        {/* MainLayout을 사용하는 페이지 그룹 */}
                        <Route
                            element={
                                <PrivateRoute>
                                    <MainLayout />
                                </PrivateRoute>
                            }
                        >
                            <Route path="/main" element={<Main />} />
                            <Route path="/favorite" element={<Favorite />} />
                            <Route path="/payment" element={<PaymentManagement />} />
                            <Route path="/orders" element={<OrderDetails />} />
                            <Route path="/personal-info" element={<PersonalInformation />}>
                                <Route index element={<div />} />
                                <Route path="reviews" element={<ReviewPage />} />
                                <Route path="successful-challenges" element={<SuccessfulChallenge />} />
                                <Route path="coupons" element={<CouponBox />} />
                            </Route>
                        </Route>

                        {/* BlankLayout을 사용하는 페이지 그룹 */}
                        <Route
                            element={
                                <PrivateRoute>
                                    <BlankLayout />
                                </PrivateRoute>
                            }
                        >
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
                            <Route path="/filtered-shops" element={<FilteredShops />} />
                        </Route>

                        {/* 일치하는 라우트가 없을 경우 기본 경로로 리디렉션 */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Router>
            </Provider>
        </QueryClientProvider>
    </StrictMode>
);
