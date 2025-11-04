package com.luxe_restaurant.domain.entities;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedBy;

import java.time.LocalDateTime;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
public class BaseEnity {

    @CreationTimestamp
    @Column(name = "created_at", columnDefinition = "TIMESTAMP(0) WITHOUT TIME ZONE")
    private LocalDateTime createdAt;

    @CreatedBy
    private Long userId;
}
