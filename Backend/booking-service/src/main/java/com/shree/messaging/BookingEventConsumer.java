package com.shree.messaging;

import com.shree.Model.PaymentOrder;
import com.shree.Service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingEventConsumer {
private final BookingService bookingService;

@RabbitListener(queues = "booking-queue")
public void bookingUpdateListener(PaymentOrder paymentOrder) throws Exception {
    bookingService.bookingSuccess(paymentOrder);

}
}
