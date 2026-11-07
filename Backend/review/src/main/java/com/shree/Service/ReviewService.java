package com.shree.Service;

import com.shree.Model.Review;
import com.shree.payload.dto.ReviewRequest;
import com.shree.payload.dto.SalonDTO;
import com.shree.payload.dto.UserDTO;

import java.util.List;

public interface ReviewService {
    Review createReview(ReviewRequest req,
                        UserDTO user, SalonDTO salon);


    List<Review> getReviewBySalonId(Long salonId);

    Review updateReview(ReviewRequest req,Long reviewId,Long userId) throws Exception;

    void deleteReview(Long reviewId ,Long userId) throws Exception;
}
