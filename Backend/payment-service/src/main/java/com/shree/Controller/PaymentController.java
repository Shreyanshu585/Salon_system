package com.shree.Controller;

import com.razorpay.RazorpayException;
import com.shree.Domain.PaymentMethod;
import com.shree.Model.PaymentOrder;
import com.shree.PayloadResponse.dto.BookingDTO;
import com.shree.PayloadResponse.dto.UserDTO;
import com.shree.PayloadResponse.response.PaymentLinkResponse;
import com.shree.Service.PaymentService;
import com.shree.Service.client.UserFeignClient;
import com.stripe.exception.StripeException;
import org.springframework.http.HttpStatus;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.Fetch;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService ;
    private final UserFeignClient userFeignClient;
    @PostMapping("/create")
    public ResponseEntity<PaymentLinkResponse> createPaymentLink(
            @RequestBody BookingDTO booking ,
            @RequestHeader("Authorization")String jwt,
            @RequestParam PaymentMethod paymentMethod) throws Exception {

        UserDTO user =userFeignClient.getUserProfile(jwt).getBody();

        PaymentLinkResponse response = paymentService.createOrder(user,booking ,paymentMethod);
        return ResponseEntity.ok(response);
    }




    @GetMapping("/{paymentOrderId}")
    public ResponseEntity<PaymentOrder> createPaymentOrderById(
            @PathVariable Long paymentOrderId) throws Exception {

        PaymentOrder paymentOrder = paymentService.getPaymentOrderById(paymentOrderId);
        return ResponseEntity.ok(paymentOrder);
    }

    @PatchMapping("/proceed")
    public ResponseEntity<?> proceedPayment(
            @RequestParam String paymentId,
            @RequestParam String paymentLinkId) {

        System.out.println("Proceed Payment Called: paymentId=" + paymentId + " paymentLinkId=" + paymentLinkId);
        try {
            PaymentOrder paymentOrder = paymentService.getPaymentOrderByPaymentId(paymentLinkId.trim());
            return ResponseEntity.ok(paymentService.proceedPayment(paymentOrder, paymentId, paymentLinkId.trim()));
        } catch (RazorpayException e) {
            // send the real reason back so the payment page can show it
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("message", "Couldn't reach Razorpay to verify this payment: " + e.getMessage()));
        }
    }

    // Stripe sends the customer back to /payment-success/{orderId}?session_id=...
    // The server asks Stripe directly whether that session was actually paid.
    @PatchMapping("/proceed/stripe")
    public ResponseEntity<?> proceedStripePayment(
            @RequestParam Long orderId,
            @RequestParam(required = false) String sessionId) {

        System.out.println("Proceed Stripe Payment Called: orderId=" + orderId + " sessionId=" + sessionId);
        try {
            return ResponseEntity.ok(paymentService.proceedStripePayment(orderId, sessionId));
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("message", "Couldn't reach Stripe to verify this payment: " + e.getMessage()));
        }
    }

}