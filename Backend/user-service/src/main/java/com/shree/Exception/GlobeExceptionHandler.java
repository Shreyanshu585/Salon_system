package com.shree.Exception;

import com.shree.Payload.Response.ExceptionResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.WebExceptionHandler;

import java.time.LocalDate;
import java.time.LocalDateTime;
@ControllerAdvice
public class GlobeExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> ExceptionHandler(
            Exception ex,
            WebRequest req) {

        ex.printStackTrace(); // ADD THIS

        ExceptionResponse response = new ExceptionResponse(
                ex.getMessage(),
                req.getDescription(false),
                LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }
}
