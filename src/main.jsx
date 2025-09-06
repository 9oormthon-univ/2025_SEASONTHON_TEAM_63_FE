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
import ChallengeDetailPage from './pages/StoreDetail/ChallengeDetailPage';
import StoreBasket from './pages/StoreDetail/StoreBasket';
import Position from './pages/MapPosition/Position';
import WriteReview from './pages/WriteReview/WriteReview';
import FilteredShops from './pages/FilteredShops/FilteredShops';

// --- 인증 관련 페이지 컴포넌트 ---
import LoginPage from './pages/Auth/LoginPage';
import SignUpForm from './pages/Auth/SignUpForm';
import SignUpStep2Page from './pages/Auth/SignUpStep2Page';
import CompleteUserSignUpForm from './pages/Auth/CompleteUserSignUpForm';

// --- 새로 추가할 컴포넌트 ---
import JointPayerSelection from './pages/jointpayment/JointPayerSelection'; // ✨ 추가

import './index.css';

// 2. React Query 클라이언트 인스턴스 생성
const queryClient = new QueryClient();

// 3. 라우트 보호를 위한 헬퍼 컴포넌트
const PrivateRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('authToken');
    return isLoggedIn ? children : <Navigate to="/" />;
};

const PublicRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('authToken');
    return isLoggedIn ? <Navigate to="/main" /> : children;
};

// 4. React 애플리케이션 렌더링
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider>
                <Router>
                    <Routes>
                        {/* --- Public Routes --- */}
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

                        {/* --- Semi-Private Routes --- */}
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

                        {/* --- Private Routes (MainLayout) --- */}
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
                            <Route path="/personal-information-review" element={<ReviewPage />} />
                            <Route path="/personal-info" element={<PersonalInformation />}>
                                <Route index element={<div />} />
                                <Route path="reviews" element={<ReviewPage />} />
                                <Route path="successful-challenges" element={<SuccessfulChallenge />} />
                                <Route path="coupons" element={<CouponBox />} />
                            </Route>
                        </Route>

                        {/* --- Private Routes (BlankLayout) --- */}
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
                            <Route path="/store/:storeId/challenge/:challengeId" element={<ChallengeDetailPage />} />
                            <Route path="/store/:storeId/basket" element={<StoreBasket />} />
                            <Route path="/locationmap" element={<Position />} />
                            <Route path="/write-review/:orderId" element={<WriteReview />} />
                            <Route path="/filtered-shops" element={<FilteredShops />} />

                            {/* ✨ 여기에 새로운 라우트 추가 */}
                            <Route path="/joint-payment" element={<JointPayerSelection />} />
                        </Route>

                        {/* --- Fallback Route --- */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Router>
            </Provider>
        </QueryClientProvider>
    </StrictMode>
);
