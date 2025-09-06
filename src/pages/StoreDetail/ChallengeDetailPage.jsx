import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Footer from '../../components/Footer/Footer';
import { getStoreInfo } from '../../api/storedetail/storeApi';
import useChallengeStore from '../../store/challengeStore'; // 새로운 챌린지 스토어
import './styles/ChallengeDetailPage.css';
import CheckIcon from '@mui/icons-material/Check';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

const ChallengeDetailPage = () => {
  const { storeId, challengeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Zustand 스토어 사용
  const {
    isParticipating,
    getChallengeData,
    refreshParticipatingChallenges,
    participateInChallenge,
    isLoading: challengeLoading,
    isCacheValid,
  } = useChallengeStore();

  // 로컬 상태들
  const [footerHeight, setFooterHeight] = useState(0);
  const [storeName, setStoreName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 챌린지 데이터 가져오기 (스토어에서)
  const challengeData = getChallengeData(challengeId);
  const isCurrentlyParticipating = isParticipating(challengeId);

  useEffect(() => {
    const fetchStoreName = async () => {
      try {
        const data = await getStoreInfo(storeId);
        setStoreName(data.name);
      } catch (error) {
        console.error('Failed to fetch store name:', error);
        setStoreName('RE:visit');
      }
    };

    if (storeId) {
      fetchStoreName();
    }
  }, [storeId]);

  // 챌린지 데이터 가져오기 (캐시 확인 후 필요시에만 API 호출)
  useEffect(() => {
    const loadChallengeData = async () => {
      if (challengeId) {
        // 캐시가 유효하지 않거나 해당 챌린지 데이터가 없으면 새로고침
        if (!isCacheValid() || !getChallengeData(challengeId)) {
          await refreshParticipatingChallenges();
        }
      }
    };

    loadChallengeData();
  }, [
    challengeId,
    refreshParticipatingChallenges,
    isCacheValid,
    getChallengeData,
  ]); // 참여하기 버튼을 통해 들어온 경우 자동으로 팝업 열기
  useEffect(() => {
    if (location.state?.openModal) {
      setShowModal(true);
    }
  }, [location.state]);

  // 안전한 숫자 변환 함수
  const safeNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  // 챌린지 데이터 (API에서 가져온 데이터가 있으면 사용, 없으면 기본값)
  const challenge = challengeData
    ? {
        id: challengeData.challengeId,
        storeName: '토핑맛집 [피자헛]',
        title: '주말에는 1+1!!', // 이벤트 제목은 하드코딩 (API에 없음)
        dateRange: '40주년 이벤트', // 이벤트 기간도 하드코딩 (API에 없음)
        progress: safeNumber(challengeData.currentOrderCount, 0),
        total: safeNumber(challengeData.targetOrderCount, 0) || 5, // 0이면 기본값 5 사용
        goal: challengeData.challengeDescription || 'OO가게 5회이상 방문',
        reward: challengeData.reward?.discount?.percentage
          ? `${challengeData.reward.discount.percentage}% 할인쿠폰 발급`
          : '30% 할인쿠폰 발급',
        period: '2025.08.31 ~',
        rules: [
          '이벤트는 무조건 주말에만 참여 가능합니다.',
          '오프라인에서 리뷰 작성히 확인 받아야 합니다.',
          '이벤트 잘 즐겨주세요 😀',
        ],
      }
    : {
        // 기본값 (API 데이터가 없을 때)
        id: challengeId,
        storeName: '토핑맛집 [피자헛]',
        title: '주말에는 1+1!!',
        dateRange: '40주년 이벤트',
        progress: 0,
        total: 5,
        goal: 'OO가게 5회이상 방문',
        reward: '30% 할인쿠폰 발급',
        period: '2025.08.31 ~',
        rules: [
          '이벤트는 무조건 주말에만 참여 가능합니다.',
          '오프라인에서 리뷰 작성히 확인 받아야 합니다.',
          '이벤트 잘 즐겨주세요 😀',
        ],
      };

  // 진행률 계산 (targetOrderCount가 0인 경우 기본값 사용)
  const progressPercentage =
    challenge.total > 0
      ? Math.round((challenge.progress / challenge.total) * 100)
      : 0; // total이 0이면 진행률도 0%

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

  // 등록하기 핸들러 (스토어 사용)
  const handleSubmit = async () => {
    if (!selectedImage) {
      alert('사진을 먼저 선택해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('image', selectedImage.file);
      formData.append('challengeId', challengeId);
      formData.append('storeId', storeId);

      // 스토어를 통한 챌린지 참여
      const result = await participateInChallenge(
        challengeId,
        storeId,
        formData
      );

      alert(result.message);

      if (result.success) {
        // 모달 닫기 및 상태 초기화
        setShowModal(false);
        setSelectedImage(null);
        // 현재 페이지에 머물면서 업데이트된 상태 확인
      }
    } catch (error) {
      console.error('챌린지 등록 오류?:', error);
    } finally {
      setIsSubmitting(false);
    }
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
            <a
              href="https://www.pizzahut.co.kr/menu/hotdeal/weekends?utm_source=google&utm_medium=SA&utm_campaign=conversion_search_weekend_pickup&utm_content=hellopizzahut_all_a&utm_term=%ED%94%BC%EC%9E%90%ED%97%9B%EC%9D%B4%EB%B2%A4%ED%8A%B8&gad_source=1"
              target="_blank"
            >
              <div className="challenge-banner-content">
                <div className="banner-left-section">
                  <img src="/Ad-logo.png" alt="로고" className="banner-logo" />
                  <div className="banner-text-section">
                    <p className="banner-date">{challenge.dateRange}</p>
                    <h2 className="banner-store-name">{challenge.storeName}</h2>
                    <h3 className="banner-title">{challenge.title}</h3>
                  </div>
                </div>
                <div className="banner-right-section">
                  <img
                    src="/banner.png"
                    alt="피자헛"
                    className="banner-image"
                  />
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="challenge-progress-section">
          <div className="progress-header">
            <p>진행률</p>
            <span>{challenge.progress}/5</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {5 - challenge.progress}회 더 방문하면 챌린지 완료!
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

        <button
          className={`challengeDetail-btn ${
            isCurrentlyParticipating ? 'participating' : ''
          }`}
          onClick={isCurrentlyParticipating ? undefined : handleOpenModal}
          disabled={isCurrentlyParticipating}
        >
          {isCurrentlyParticipating ? '진행중' : '참여하기'}
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
            </div>
            <button
              className="modal-submit-btn"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </div>
      )}

      <Footer setFooterHeight={setFooterHeight} />
    </>
  );
};

export default ChallengeDetailPage;
