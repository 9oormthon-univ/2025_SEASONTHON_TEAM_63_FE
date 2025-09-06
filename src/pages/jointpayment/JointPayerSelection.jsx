import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getMyCorporation,
  getUsersByCorporation,
} from '../../api/corps/corpsApi';
import { createOrder, completePayment } from '../../api/order/orderApi';
import useCartStore from '../../store/cartStore';
import PortOne from '@portone/browser-sdk/v2';
import './JointPayerSelection.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const JointPayerSelection = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const { cart, removeFromCart, getTotalPrice } = useCartStore();
  const [corporation, setCorporation] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedPayers, setSelectedPayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('IDLE');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. 내 법인 정보(corpId) 가져오기
        const corpResponse = await getMyCorporation();
        if (!corpResponse.success || !corpResponse.data) {
          throw new Error('법인 정보를 가져올 수 없습니다.');
        }

        const myCorp = corpResponse.data;
        setCorporation(myCorp);

        // 2. 가져온 corpId로 소속 직원 목록 조회하기
        const usersResponse = await getUsersByCorporation(myCorp.id);
        if (
          usersResponse.success &&
          Array.isArray(usersResponse.data.content)
        ) {
          // API 응답의 nickname을 name으로, id를 username으로 매핑하여 UI와 맞춤
          const userList = usersResponse.data.content.map((user) => ({
            id: user.id,
            name: user.nickname, // "최현우"와 같은 이름
            username: `ID: ${user.id}`, // "lena_day"와 같은 사용자 ID (API에 없으므로 대체)
          }));
          setEmployees(userList);
        } else {
          setEmployees([]);
        }
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
        setError('소속 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTogglePayer = (employeeId) => {
    setSelectedPayers((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;
    // 닉네임(name) 기준으로 검색
    return employees.filter(
      (emp) =>
        emp.name && emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, employees]);

  const handleSelectionComplete = async () => {
    if (selectedPayers.length === 0) {
      alert('공동 결제자를 1명 이상 선택해주세요.');
      return;
    }

    try {
      if (!isLoggedIn()) {
        alert('로그인이 필요합니다.');
        if (window.confirm('로그인 페이지로 이동하시겠습니까?')) {
          navigate('/');
        }
        return;
      }

      setPaymentStatus('PENDING');

      // 주문 생성
      const currentStoreId = parseInt(storeId) || 123;
      const orderRequest = {
        storeId: currentStoreId,
        items: cart.map((item) => ({
          menuId: item.id,
          quantity: item.quantity,
        })),
        // 공동 결제자 정보 추가 (필요시)
        jointPayers: selectedPayers,
      };

      const orderResponse = await createOrder(orderRequest);
      if (!orderResponse.success)
        throw new Error(orderResponse.message || '주문 생성 실패');

      const { data: order } = orderResponse;

      // 포트원 결제 진행
      const payment = await PortOne.requestPayment({
        storeId: import.meta.env.VITE_PORTONE_STORE_ID,
        channelKey: import.meta.env.VITE_PORTONE_CHANNEL_KEY,
        paymentId: order.MerchantUid,
        orderName: `${corporation?.corpName || 'RE:visit'} 공동주문`,
        totalAmount: getTotalPrice(),
        currency: 'KRW',
        payMethod: 'TRANSFER',
        redirectUrl: `${window.location.origin}/orders`,
        customData: {
          orderId: order.id,
          storeId: currentStoreId,
          jointPayers: selectedPayers,
        },
      });

      if (payment.code !== undefined) {
        setPaymentStatus('FAILED');
        alert(`결제 실패: ${payment.message}`);
        return;
      }

      // 결제 완료 처리
      const completeResponse = await completePayment({
        paymentId: payment.paymentId,
      });
      if (completeResponse.success) {
        setPaymentStatus('SUCCESS');
        alert('공동 결제가 완료되었습니다!');
        // 장바구니 비우기
        cart.forEach((item) => removeFromCart(item.id));
        navigate('/orders', { replace: true });
      } else {
        throw new Error(completeResponse.message || '결제 완료 처리 실패');
      }
    } catch (error) {
      console.error('공동 결제 에러:', error);
      setPaymentStatus('FAILED');
      alert(`공동 결제 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const isLoggedIn = () => localStorage.getItem('authToken') !== null;

  const renderContent = () => {
    if (loading)
      return (
        <div className="loading-container">소속 정보를 불러오는 중...</div>
      );
    if (error) return <div className="loading-container">{error}</div>;

    return (
      <div className="employee-list-container">
        {filteredEmployees.length > 0 ? (
          <ul className="employee-list">
            {filteredEmployees.map((emp) => {
              const isSelected = selectedPayers.includes(emp.id);
              return (
                <li
                  key={emp.id}
                  className="employee-item"
                  onClick={() => handleTogglePayer(emp.id)}
                >
                  <div className="employee-avatar-placeholder"></div>
                  <div className="employee-details">
                    <span className="employee-name">{emp.name}</span>
                    <span className="employee-username">{emp.username}</span>
                  </div>
                  {isSelected ? (
                    <CheckCircleIcon className="check-icon selected" />
                  ) : (
                    <RadioButtonUncheckedIcon className="check-icon" />
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="no-results">
            <p>
              {employees.length === 0
                ? '소속된 직원이 없습니다.'
                : '검색 결과가 없습니다.'}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="joint-payer-container">
      <header className="joint-payer-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowBackIcon />
        </button>
        <h1>공동 결제자 선택</h1>
      </header>
      <main className="joint-payer-main">
        <div className="corp-info-section">
          <span className="corp-icon-placeholder"></span>
          <div>
            <p className="corp-name">
              {corporation?.corpName || '법인 정보 로딩중...'}
            </p>
            <p className="corp-subtitle">공동결제자 선택</p>
          </div>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="사용자명을 입력해주세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="search-icon" />
        </div>
        <p className="payer-count">공동 결제자 {selectedPayers.length}명</p>
        {renderContent()}
      </main>
      <footer className="joint-payer-footer">
        <button
          className="complete-btn"
          onClick={handleSelectionComplete}
          disabled={selectedPayers.length === 0 || paymentStatus === 'PENDING'}
        >
          {paymentStatus === 'PENDING' ? '결제 진행 중...' : '공동 결제하기'}
        </button>
      </footer>
    </div>
  );
};

export default JointPayerSelection;
