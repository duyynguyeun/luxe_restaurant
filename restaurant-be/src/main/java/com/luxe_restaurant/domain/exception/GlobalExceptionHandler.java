package com.luxe_restaurant.domain.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // 1. Handle custom BaseExceptions (BusinessException, NotFoundException...)
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponse> handleBaseException(BaseException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        log.warn("Business Exception: [{}] - {}", errorCode.getErrorCode(), ex.getMessage());

        ErrorResponse response = ErrorResponse.builder()
                .success(false)
                .errorCode(errorCode.getErrorCode())
                .errorMessage(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, errorCode.getHttpStatus());
    }

    // 2. Handle DTO validation errors (@Valid, @NotNull, @NotBlank...)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        log.warn("Validation Error: {}", ex.getMessage());

        List<Map<String, String>> details = ex.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("field", fieldError.getField());
                    map.put("message", fieldError.getDefaultMessage());
                    return map;
                })
                .toList();

        ErrorResponse response = ErrorResponse.builder()
                .success(false)
                .errorCode(ErrorCode.SYS_002.getErrorCode())
                .errorMessage(ErrorCode.SYS_002.getErrorMessage())
                .timestamp(LocalDateTime.now())
                .details(details)
                .build();

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // 3. Handle all unhandled system exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        log.error("Unhandled System Exception: ", ex);

        ErrorResponse response = ErrorResponse.builder()
                .success(false)
                .errorCode(ErrorCode.SYS_001.getErrorCode())
                .errorMessage(ErrorCode.SYS_001.getErrorMessage())
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
