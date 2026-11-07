package com.shree.Service;

import com.razorpay.PaymentLink;
import com.razorpay.RazorpayException;
import com.shree.Domain.PaymentMethod;
import com.shree.Model.PaymentOrder;
import com.shree.PayloadResponse.dto.BookingDTO;
import com.shree.PayloadResponse.dto.UserDTO;
import com.shree.PayloadResponse.response.PaymentLinkResponse;
import com.stripe.exception.StripeException;

public interface PaymentService  {

    PaymentLinkResponse createOrder(UserDTO userDTO,
                                    BookingDTO booking,
                                    PaymentMethod paymentMethod) throws RazorpayException, StripeException;

    PaymentOrder getPaymentOrderById(Long id) throws Exception;
    PaymentOrder getPaymentOrderByPaymentId(String paymentId);
    PaymentLink createRazorpayPaymentLink(UserDTO user, Long amount, Long orderId) throws RazorpayException;
    String createStripePaymentLink(UserDTO user,Long amount ,Long orderId) throws StripeException;

    Boolean proceedPayment(PaymentOrder paymentOrder,String paymentId, String paymentLinkId) throws RazorpayException;
    Boolean proceedStripePayment(Long orderId, String sessionId) throws StripeException;



}
