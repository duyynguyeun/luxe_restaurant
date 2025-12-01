package com.luxe_restaurant.app.requests.report;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportRequest {
    private String text;
    private String imageUrl;
    private LocalDateTime date;
    private Long userId;
}
