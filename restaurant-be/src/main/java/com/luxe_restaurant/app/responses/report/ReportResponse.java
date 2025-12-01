package com.luxe_restaurant.app.responses.report;

import com.luxe_restaurant.domain.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportResponse {
    private Long id;
    private String text;
    private String imageUrl;
    private LocalDateTime date;
    private User user;
}
