package com.luxe_restaurant.domain.exception;

public class NotFoundException extends BaseException {

    public NotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }

    public NotFoundException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }
}
