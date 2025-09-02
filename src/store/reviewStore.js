import { create } from 'zustand';
import initialReviews from '../data/storedetail/reviewData.json';

const useReviewStore = create((set) => ({
  reviews: initialReviews,

  addReview: (newReview) =>
    set((state) => {
      const reviewToAdd = {
        id: state.reviews.length + 1, // Simple ID generation
        author: '새로운 닉네임', // Placeholder author
        date: new Date().toISOString().split('T')[0].replace(/-/g, '.'), // Format YYYY.MM.DD
        ...newReview,
      };
      return { reviews: [reviewToAdd, ...state.reviews] };
    }),
}));

export default useReviewStore;
