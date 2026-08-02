package com.luxe_restaurant.domain.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    @Builder.Default
    private boolean success = false;
    private String errorCode;
    private String errorMessage;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    private Object details;
}
