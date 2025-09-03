import './styles/Storedetail.css';
import { Outlet, NavLink } from 'react-router-dom';
import { useState } from 'react';
import StarRateIcon from '@mui/icons-material/StarRate';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PageHeader from '../../components/ui/PageHeader';
import Footer from '../../components/Footer/Footer';

// 평점 , 가게 이름
export const grade = 4.5;
export const storeName = 'RE:visit';

// 가게 상세페이지 전역에 쓰이는 요소
const StoreDetail = () => {
  const [footerHeight, setFooterHeight] = useState(0);

  return (
    <div className="store-detail-container">
      <main className="store-detail-main">
        <PageHeader title="가게 정보" />

        {/* 가게 이름, 별점 등 상단 정보 */}
        <section>
          <div className="store-img">
            <FavoriteIcon sx={{ color: '#FF6835' }} />
          </div>
          <p className="store-name">{storeName}</p>
          <div className="storeMark-container">
            <StarRateIcon sx={{ color: '#FF6835', marginLeft: '12px' }} />
            <p>{grade}</p>
          </div>
        </section>

        <nav className="store-nav">
          <NavLink to="menu">메뉴</NavLink>
          <NavLink to="challenge">챌린지</NavLink>
          <NavLink to="review">리뷰</NavLink>
          <NavLink to="info">가게정보</NavLink>
        </nav>

        {/* 탭에 따라 다른 컴포넌트가 이 자리에 렌더링됩니다. */}
        <Outlet />
      </main>

      {/* Footer 컴포넌트를 페이지 하단에 고정 */}
      <Footer setFooterHeight={setFooterHeight} />
    </div>
  );
};

export default StoreDetail;
