package com.shree.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

@Entity
@Data
public class Category {
@Id
    @GeneratedValue(strategy = GenerationType.AUTO )
    private Long id;
@Column(nullable = false)
    private String name;

private String image;
@Column(nullable = false)
private  Long salonId;










}
