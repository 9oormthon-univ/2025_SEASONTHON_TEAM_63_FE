import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Footer from '../../components/Footer/Footer';
import { getStoreInfo } from '../../api/storedetail/storeApi'; // API 함수 임포트
import './styles/ChallengeDetailPage.css';
import CheckIcon from '@mui/icons-material/Check';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

const ChallengeDetailPage = () => {
  const { storeId, challengeId } = useParams();
  const location = useLocation();
  const [footerHeight, setFooterHeight] = useState(0);
  const [storeName, setStoreName] = useState('');
  const [showModal, setShowModal] = useState(false); // 팝업 모달 상태 추가
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 상태 추가

  useEffect(() => {
    const fetchStoreName = async () => {
      try {
        const data = await getStoreInfo(storeId);
        setStoreName(data.name);
      } catch (error) {
        console.error('Failed to fetch store name:', error);
        setStoreName('RE:visit'); // 에러 시 기본값
      }
    };

    if (storeId) {
      fetchStoreName();
    }
  }, [storeId]);

  // 참여하기 버튼을 통해 들어온 경우 자동으로 팝업 열기
  useEffect(() => {
    if (location.state?.openModal) {
      setShowModal(true);
    }
  }, [location.state]);

  // 실제 앱에서는 API 호출을 통해 challengeId에 맞는 데이터를 가져옵니다.
  const challenge = {
    id: challengeId,
    storeName: '토핑맛집 [피자헛]', // 이 부분은 챌린지 데이터에 따라 다를 수 있습니다.
    title: '피자 5판 먹으면 1판 무료 챌린지',
    dateRange: '8월 20일 ~ 8월 27일',
    progress: 3,
    total: 5,
    goal: 'OO가게 5회이상 방문',
    reward: '30% 할인쿠폰 발급',
    period: '2025.08.31 ~',
    rules: [
      '사장님이 작성한 참여 규칙',
      '사장님이 작성한 참여 규칙',
      '사장님이 작성한 참여 규칙',
    ],
  };

  const progressPercentage = (challenge.progress / challenge.total) * 100;

  // 팝업 열기/닫기 핸들러
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 사진 첨부 핸들러
  const handlePhotoUpload = () => {
    // hidden input을 클릭하여 파일 선택창 열기
    document.getElementById('photo-upload-input').click();
  };

  // 파일 선택 핸들러
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 파일 타입 검증 (이미지만 허용)
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage({
            file: file,
            preview: e.target.result,
            name: file.name,
          });
        };
        reader.readAsDataURL(file);
      } else {
        alert('이미지 파일만 업로드 가능합니다.');
      }
    }
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = () => {
    setSelectedImage(null);
    // input 값도 초기화
    document.getElementById('photo-upload-input').value = '';
  };

  // 등록하기 핸들러
  const handleSubmit = () => {
    if (selectedImage) {
      console.log('등록하기 클릭됨 - 선택된 이미지:', selectedImage.name);
      // 실제 구현에서는 API 호출 로직 추가
      // FormData를 사용하여 파일 업로드
    } else {
      alert('사진을 먼저 선택해주세요.');
      return;
    }

    setShowModal(false);
    setSelectedImage(null); // 모달 닫을 때 이미지도 초기화
  };

  return (
    <>
      <PageHeader title="챌린지 상세보기" />
      <div
        className="challenge-detail-main-content"
        style={{ paddingBottom: footerHeight }}
      >
        <h2 className="challenge-page-subtitle">
          {storeName ? `${storeName}에서 진행중인 챌린지` : '챌린지 상세 정보'}
        </h2>

        <div className="challenge-summary-card">
          <div className="challenge-banner">
            <div className="challenge-banner-text">
              <p>{challenge.dateRange}</p>
              <p>
                <strong>{challenge.storeName}</strong>
              </p>
              <h3>{challenge.title}</h3>
            </div>
          </div>
        </div>

        <div className="challenge-progress-section">
          <div className="progress-header">
            <p>진행률</p>
            <span>
              {challenge.progress}/{challenge.total}
            </span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {challenge.total - challenge.progress}회 더 방문하면 챌린지 완료!
          </p>
        </div>

        <div className="challenge-info-section">
          <div className="info-item">
            <span className="info-icon">?</span>
            <div>
              <strong className="info-title">목표</strong>
              <p>{challenge.goal}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🎁</span>
            <div>
              <strong className="info-title">달성시 리워드</strong>
              <p>{challenge.reward}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📅</span>
            <div>
              <strong className="info-title">기간</strong>
              <p>{challenge.period}</p>
            </div>
          </div>
        </div>

        <div className="challenge-rules-section">
          <h4>참여 규칙</h4>
          <ul>
            {challenge.rules.map((rule, index) => (
              <li key={index}>
                <CheckIcon sx={{ color: '#FF6835', marginRight: '12px' }} />
                {rule}
              </li>
            ))}
          </ul>
        </div>

        <button className="challengeDetail-btn" onClick={handleOpenModal}>
          참여하기
        </button>
      </div>

      {/* 바텀 시트 모달 팝업 */}
      {showModal && (
        <div className="challenge-modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="photo-upload-section">
              {selectedImage ? (
                // 이미지가 선택된 경우
                <div className="selected-image-container">
                  <div className="selected-image-preview">
                    <img
                      src={selectedImage.preview}
                      alt="선택된 이미지"
                      className="preview-image"
                    />
                    <button
                      className="remove-image-btn"
                      onClick={handleRemoveImage}
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="image-info">
                    <p className="image-name">{selectedImage.name}</p>
                    <button
                      className="change-image-btn"
                      onClick={handlePhotoUpload}
                      type="button"
                    >
                      📷 다른 사진 선택하기
                    </button>
                  </div>
                </div>
              ) : (
                // 이미지가 선택되지 않은 경우
                <>
                  <div className="upload-area" onClick={handlePhotoUpload}>
                    <div className="camera-icon">
                      <CameraAltIcon />
                    </div>
                    <div className="upload-text">사진을 업로드해주세요</div>
                  </div>
                  <button
                    className="photo-upload-btn"
                    onClick={handlePhotoUpload}
                    type="button"
                  >
                    <InsertPhotoIcon />
                    사진 첨부하기
                  </button>
                </>
              )}

              {/* 숨겨진 파일 input */}
              <input
                id="photo-upload-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>{' '}
            <button className="modal-submit-btn" onClick={handleSubmit}>
              등록하기
            </button>
          </div>
        </div>
      )}

      <Footer setFooterHeight={setFooterHeight} />
    </>
  );
};

export default ChallengeDetailPage;
