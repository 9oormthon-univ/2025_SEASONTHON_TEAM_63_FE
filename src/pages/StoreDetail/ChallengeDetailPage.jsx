import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Footer from '../../components/Footer/Footer';
import { getStoreInfo } from '../../api/storedetail/storeApi'; // API 함수 임포트
import {
  participateChallenge,
  getParticipatingChallenges,
} from '../../api/storedetail/challengeRegistration';
import './styles/ChallengeDetailPage.css';
import CheckIcon from '@mui/icons-material/Check';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

const ChallengeDetailPage = () => {
  const { storeId, challengeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [footerHeight, setFooterHeight] = useState(0);
  const [storeName, setStoreName] = useState('');
  const [showModal, setShowModal] = useState(false); // 팝업 모달 상태 추가
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false); // 등록 중 상태
  const [isParticipating, setIsParticipating] = useState(false); // 참여 중 상태

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

  // 참여 여부 확인
  useEffect(() => {
    const checkParticipationStatus = async () => {
      try {
        // API에서 참여중인 챌린지 확인
        const response = await getParticipatingChallenges();
        if (response.success) {
          const isAlreadyParticipating = response.data.some(
            (challenge) => challenge.challengeId === parseInt(challengeId)
          );
          setIsParticipating(isAlreadyParticipating);
        }
      } catch (error) {
        console.error('참여 상태 확인 API 실패, localStorage 확인:', error);
        // API 실패 시 localStorage에서 확인
        const localData = JSON.parse(
          localStorage.getItem('participatingChallenges') || '[]'
        );
        const isAlreadyParticipating = localData.some(
          (challenge) => challenge.challengeId === parseInt(challengeId)
        );
        setIsParticipating(isAlreadyParticipating);
      }
    };

    if (challengeId) {
      checkParticipationStatus();
    }
  }, [challengeId]);

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
    title: '주말에는 1+1!!',
    dateRange: '40주년 이벤트',
    progress: 3,
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

      // API 호출
      const response = await participateChallenge(challengeId, formData);

      if (response.success) {
        // 등록 성공 시 참여 정보를 localStorage에 저장 (임시)
        const participationData = {
          challengeId: challengeId,
          storeId: storeId,
          storeName: challenge.storeName,
          challengeDescription: challenge.title,
          challengeType: 'REVIEW', // 예시, 실제로는 API에서 받아온 값
          currentOrderCount: challenge.progress,
          targetOrderCount: challenge.total,
          status: 'PARTICIPATING',
          participatedAt: new Date().toISOString(),
        };

        // 기존 참여중인 챌린지 가져오기
        const existingChallenges = JSON.parse(
          localStorage.getItem('participatingChallenges') || '[]'
        );

        // 중복 체크 후 추가
        const isAlreadyParticipating = existingChallenges.some(
          (c) => c.challengeId === challengeId
        );
        if (!isAlreadyParticipating) {
          existingChallenges.push(participationData);
          localStorage.setItem(
            'participatingChallenges',
            JSON.stringify(existingChallenges)
          );
        }

        alert('챌린지 등록이 완료되었습니다!');

        // 참여 상태를 true로 설정
        setIsParticipating(true);

        // 모달 닫기 및 상태 초기화
        setShowModal(false);
        setSelectedImage(null);

        // 마이페이지로 이동
        navigate('/personal-info');
      }
    } catch (error) {
      console.error('챌린지 등록 오류:', error);

      // 409 에러 (이미 참여중인 챌린지) 처리
      if (error.response && error.response.status === 409) {
        alert('이미 참여중인 챌린지입니다. 마이페이지에서 확인해보세요!');

        // 참여 상태를 true로 설정
        setIsParticipating(true);

        // 이미 참여중이므로 localStorage에 추가하고 마이페이지로 이동
        const participationData = {
          challengeId: challengeId,
          storeId: storeId,
          storeName: challenge.storeName,
          challengeDescription: challenge.title,
          challengeType: 'REVIEW',
          currentOrderCount: challenge.progress,
          targetOrderCount: challenge.total,
          status: 'PARTICIPATING',
          participatedAt: new Date().toISOString(),
        };

        const existingChallenges = JSON.parse(
          localStorage.getItem('participatingChallenges') || '[]'
        );
        const isAlreadyInLocal = existingChallenges.some(
          (c) => c.challengeId === challengeId
        );

        if (!isAlreadyInLocal) {
          existingChallenges.push(participationData);
          localStorage.setItem(
            'participatingChallenges',
            JSON.stringify(existingChallenges)
          );
        }

        // 모달 닫기 및 상태 초기화
        setShowModal(false);
        setSelectedImage(null);

        // 마이페이지로 이동
        navigate('/personal-info');
      } else {
        // 다른 에러들 처리
        const errorMessage =
          error.response?.data?.message ||
          '챌린지 등록 중 오류가 발생했습니다.';
        alert(errorMessage);
      }
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

        <button
          className={`challengeDetail-btn ${
            isParticipating ? 'participating' : ''
          }`}
          onClick={isParticipating ? undefined : handleOpenModal}
          disabled={isParticipating}
        >
          {isParticipating ? '진행중' : '참여하기'}
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
