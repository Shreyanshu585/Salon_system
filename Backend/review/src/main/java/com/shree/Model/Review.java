package com.shree.Model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Data
@Entity
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long Id;
    @Column(nullable = false)
    private String reviewText;
    @Column(nullable = false)
    private double rating;
    @Column(nullable = false)
    private Long salonId;
    @Column(nullable = false)
    private Long userId;
    @CreatedDate
    private LocalDateTime createdAt;


}
