import axiosInstance from '../auth/axiosInstance';

/**
 * 주문 생성 API
 */
export const createOrder = async (orderData) => {
  const response = await axiosInstance.post('/api/orders', orderData);
  return response.data;
};

/**
 * 주문 조회 API
 */
export const getOrder = async (orderId) => {
  const response = await axiosInstance.get(`/api/orders/${orderId}`);
  return response.data;
};

/**
 * 결제 완료 처리 API
 */
export const completePayment = async (paymentData) => {
  const response = await axiosInstance.post(
    '/api/payment/complete',
    paymentData
  );
  return response.data;
};
