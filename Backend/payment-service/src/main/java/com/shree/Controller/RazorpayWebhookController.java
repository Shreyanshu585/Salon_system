package com.shree.Controller;

import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.shree.Domain.PaymentOrderStatus;
import com.shree.Model.PaymentOrder;
import com.shree.Repository.PaymentOrderRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class RazorpayWebhookController {

        private final PaymentOrderRepository paymentOrderRepository;

    @Value("${razorpay.api.key}")
    private String razorpayApiKey;
    @Value("${razorpay.api.secret}")
    private String getRazorpayApiSecretKey;
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload,
                                                @RequestHeader("X-Razorpay-Signature") String signature) {
        try {
            // Verify signature
            RazorpayClient razorpayClient = new RazorpayClient(razorpayApiKey, getRazorpayApiSecretKey);
            boolean isValid = Utils.verifyWebhookSignature(payload, signature, getRazorpayApiSecretKey);

            if (!isValid) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
            }

            JSONObject event = new JSONObject(payload);
            String eventType = event.getString("event");

            if ("payment.captured".equals(eventType)) {
                JSONObject paymentObj = event.getJSONObject("payload").getJSONObject("payment").getJSONObject("entity");
                String paymentId = paymentObj.getString("id");
                String paymentLinkId = paymentObj.optString("payment_link_id");

                // Update DB
                PaymentOrder order = paymentOrderRepository.findByPaymentLinkId(paymentLinkId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

                order.setStatus(PaymentOrderStatus.SUCCESS);
                order.setRazorpayPaymentId(paymentId);
                paymentOrderRepository.save(order);
            }

            return ResponseEntity.ok("Webhook processed");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

}


