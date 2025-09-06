import axiosInstance from '../auth/axiosInstance';

// 참여중인 챌린지 목록 조회
export const getParticipatingChallenges = async () => {
  try {
    const response = await axiosInstance.get('/api/challenges/participating');
    return response.data;
  } catch (error) {
    console.error('참여중인 챌린지 조회 실패:', error);
    throw error;
  }
};

// 챌린지 등록/참여 (실제 구현 시 필요한 엔드포인트로 수정)
export const participateChallenge = async (challengeId, formData) => {
  try {
    const response = await axiosInstance.post(
      `/api/challenges/${challengeId}/participate`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('챌린지 참여 실패:', error);
    throw error;
  }
};
