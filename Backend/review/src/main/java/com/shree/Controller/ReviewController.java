package com.shree.Controller;

import com.shree.Model.Review;
import com.shree.Service.ReviewService;
import com.shree.Service.client.SalonFeignClient;
import com.shree.Service.client.UserFeignClient;
import com.shree.payload.dto.ApiResponse;
import com.shree.payload.dto.ReviewRequest;
import com.shree.payload.dto.SalonDTO;
import com.shree.payload.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

private final ReviewService reviewService;
private final UserFeignClient userFeignClient;
private final SalonFeignClient salonFeignClient;

@PostMapping("/salon/{salonId}")
public ResponseEntity<Review> createReview(@RequestBody ReviewRequest req,@PathVariable Long salonId,  @RequestHeader("Authorization")String jwt ) throws Exception {
    UserDTO userDTO= userFeignClient.getUserProfile(jwt).getBody();

    SalonDTO salonDTO = salonFeignClient.getSalonById(salonId).getBody();

    Review review= reviewService.createReview(req,userDTO,salonDTO);

    return ResponseEntity.ok(review);

}

    @GetMapping("/salon/{salonId}")
    public ResponseEntity<List<Review>> getReviewBySalonId(@PathVariable Long salonId,  @RequestHeader("Authorization")String jwt ) throws Exception {

        SalonDTO salonDTO = salonFeignClient.getSalonById(salonId).getBody();

       List<Review> review= reviewService.getReviewBySalonId(salonDTO.getId());

        return ResponseEntity.ok(review);

    }


    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(@PathVariable Long reviewId, @RequestBody ReviewRequest req, @RequestHeader("Authorization")String jwt ) throws Exception {
        UserDTO userDTO= userFeignClient.getUserProfile(jwt).getBody();

        Review review= reviewService.updateReview(req,reviewId,userDTO.getId());

        return ResponseEntity.ok(review);

    }


    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(@PathVariable Long reviewId,  @RequestHeader("Authorization")String jwt ) throws Exception {
        UserDTO userDTO= userFeignClient.getUserProfile(jwt).getBody();

    reviewService.deleteReview(reviewId, userDTO.getId());

        ApiResponse apiResponse=new ApiResponse();
        apiResponse.setMessage("Review deleted");

        return ResponseEntity.ok(apiResponse);

    }
}
