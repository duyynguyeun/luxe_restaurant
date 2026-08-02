package com.luxe_restaurant.domain.exception;

import lombok.Getter;

@Getter
public abstract class BaseException extends RuntimeException {
    private final ErrorCode errorCode;

    public BaseException(ErrorCode errorCode) {
        super(errorCode.getErrorMessage());
        this.errorCode = errorCode;
    }

    public BaseException(ErrorCode errorCode, String customMessage) {
        super(customMessage != null ? customMessage : errorCode.getErrorMessage());
        this.errorCode = errorCode;
    }
}
