package com.luxe_restaurant.domain.entities;

import jakarta.persistence.Column;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;

import java.time.LocalDateTime;

public class BaseEnity {

    @CreationTimestamp
    @Column(name = "created_at", columnDefinition = "TIMESTAMP(0) WITHOUT TIME ZONE")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "TIMESTAMP(0) WITHOUT TIME ZONE")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @CreatedBy
    private Long userId;
}
