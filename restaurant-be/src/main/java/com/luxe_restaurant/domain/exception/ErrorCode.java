package com.luxe_restaurant.domain.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    // AUTH
    AUTH_001("AUTH_001", "Email hoặc mật khẩu không chính xác!", HttpStatus.BAD_REQUEST),
    AUTH_002("AUTH_002", "Mã OTP không chính xác hoặc đã hết hạn!", HttpStatus.BAD_REQUEST),
    AUTH_003("AUTH_003", "Phiên đăng nhập (Token JWT) hết hạn hoặc không hợp lệ!", HttpStatus.UNAUTHORIZED),
    AUTH_004("AUTH_004", "Bạn không có quyền truy cập thực hiện thao tác này!", HttpStatus.FORBIDDEN),
    AUTH_005("AUTH_005", "Tài khoản người dùng đã bị khóa hoặc bị vô hiệu hóa!", HttpStatus.FORBIDDEN),

    // USER
    USER_001("USER_001", "Không tìm thấy người dùng!", HttpStatus.NOT_FOUND),
    USER_002("USER_002", "Email này đã được đăng ký trên hệ thống!", HttpStatus.CONFLICT),
    USER_003("USER_003", "Số điện thoại này đã tồn tại!", HttpStatus.CONFLICT),
    USER_004("USER_004", "Mật khẩu hiện tại không chính xác!", HttpStatus.BAD_REQUEST),
    USER_005("USER_005", "Không thể xóa người dùng này vì đã có giao dịch phát sinh!", HttpStatus.BAD_REQUEST),

    // DISH & CATEGORY
    DISH_001("DISH_001", "Không tìm thấy món ăn!", HttpStatus.NOT_FOUND),
    DISH_002("DISH_002", "Tên món ăn này đã tồn tại trong thực đơn!", HttpStatus.CONFLICT),
    DISH_003("DISH_003", "Món ăn hiện tại đã tạm ngừng kinh doanh hoặc hết hàng!", HttpStatus.BAD_REQUEST),
    DISH_004("DISH_004", "Không thể xóa món ăn vì đã từng nằm trong đơn hàng phát sinh!", HttpStatus.BAD_REQUEST),
    CATEGORY_001("CATEGORY_001", "Không tìm thấy danh mục món ăn!", HttpStatus.NOT_FOUND),
    CATEGORY_002("CATEGORY_002", "Tên danh mục món ăn đã tồn tại!", HttpStatus.CONFLICT),
    CATEGORY_003("CATEGORY_003", "Không thể xóa danh mục vì vẫn còn món ăn thuộc danh mục này!", HttpStatus.BAD_REQUEST),

    // ORDER
    ORDER_001("ORDER_001", "Không tìm thấy đơn hàng!", HttpStatus.NOT_FOUND),
    ORDER_002("ORDER_002", "Đơn hàng đã tồn tại trên hệ thống!", HttpStatus.CONFLICT),
    ORDER_003("ORDER_003", "Không thể chuyển đổi trạng thái đơn hàng theo luồng này!", HttpStatus.BAD_REQUEST),
    ORDER_004("ORDER_004", "Giỏ hàng/Đơn hàng không được chứa danh sách món rỗng!", HttpStatus.BAD_REQUEST),
    ORDER_005("ORDER_005", "Đơn hàng đã hoàn thành hoặc bị hủy, không thể chỉnh sửa!", HttpStatus.BAD_REQUEST),

    // RESERVATION & TABLE
    RESERVATION_001("RESERVATION_001", "Không tìm thấy thông tin đặt bàn!", HttpStatus.NOT_FOUND),
    RESERVATION_002("RESERVATION_002", "Bàn ăn đã được đặt trong khoảng thời gian này!", HttpStatus.CONFLICT),
    RESERVATION_003("RESERVATION_003", "Thời gian đặt bàn không hợp lệ!", HttpStatus.BAD_REQUEST),
    RESERVATION_004("RESERVATION_004", "Lịch đặt bàn này đã bị hủy trước đó!", HttpStatus.BAD_REQUEST),
    TABLE_001("TABLE_001", "Không tìm thấy thông tin bàn ăn!", HttpStatus.NOT_FOUND),
    TABLE_002("TABLE_002", "Bàn ăn hiện đang ở trạng thái không khả dụng!", HttpStatus.BAD_REQUEST),

    // PROMOTION
    PROMOTION_001("PROMOTION_001", "Không tìm thấy chương trình ưu đãi!", HttpStatus.NOT_FOUND),
    PROMOTION_002("PROMOTION_002", "Mã ưu đãi này đã tồn tại!", HttpStatus.CONFLICT),
    PROMOTION_003("PROMOTION_003", "Chương trình ưu đãi đã hết hạn hoặc chưa đến đợt áp dụng!", HttpStatus.BAD_REQUEST),
    PROMOTION_004("PROMOTION_004", "Đơn hàng chưa đạt giá trị tối thiểu để sử dụng ưu đãi!", HttpStatus.BAD_REQUEST),

    // REPORT
    REPORT_001("REPORT_001", "Không tìm thấy báo cáo!", HttpStatus.NOT_FOUND),

    // SERVICE INTEGRATION
    AI_001("AI_001", "Hệ thống Chatbot AI hiện đang quá tải, vui lòng thử lại sau!", HttpStatus.SERVICE_UNAVAILABLE),
    CLOUDINARY_001("CLOUDINARY_001", "Tải hình ảnh lên hệ thống Cloudinary thất bại!", HttpStatus.INTERNAL_SERVER_ERROR),
    MAIL_001("MAIL_001", "Gửi email thông báo/mã OTP thất bại!", HttpStatus.INTERNAL_SERVER_ERROR),

    // SYSTEM & VALIDATION
    SYS_001("SYS_001", "Lỗi hệ thống nội bộ, vui lòng liên hệ quản trị viên!", HttpStatus.INTERNAL_SERVER_ERROR),
    SYS_002("SYS_002", "Dữ liệu yêu cầu gửi lên không hợp lệ!", HttpStatus.BAD_REQUEST),
    SYS_003("SYS_003", "Tài nguyên API không tồn tại!", HttpStatus.NOT_FOUND);

    private final String errorCode;
    private final String errorMessage;
    private final HttpStatus httpStatus;

    ErrorCode(String errorCode, String errorMessage, HttpStatus httpStatus) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.httpStatus = httpStatus;
    }
}
