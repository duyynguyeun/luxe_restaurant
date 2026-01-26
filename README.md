# Hướng dẫn cài đặt
## Công nghệ sử dụng
- Backend: Java, Spring Boot.
- Frontend: Javascript, ReactJS, HTML, CSS.
- Database: MySQL
- ORM: JPA
- Authentication: JWT
- Build Tool: Maven
- IDE: IntelliJ, VsCode.
## Yêu cầu hệ thống
- JDK >= 21
- ReactJS >= 18.2.0
- npm
- MySQL >= 8.0
- Git
## Hướng dẫn cài đặt
- Bước 1: Clone source code
    git clone https://github.com/duyynguyeun/luxe_restaurant.git
    cd luxe_restaurant
- Bước 2: Cài đặt backend
    cd restaurant-be
    mvn clean install
- Bước 3: Cài đặt Frontend
    cd restaurant-fe
    npm install
## Cấu hình hệ thống
- Database: CREATE DATABASE luxe_restaurant;
- File cấu hình backend (application.yaml): 
    Thông tin lấy ở file docs.
- File cấu hình Frontend (.env) : VITE_API_URL=http://localhost:8080
## Khởi chạy hệ thống
- Backend: mvn spring-boot:run
- Frontend: npm run dev
- Truy cập : Frontend: http://localhost:5173 và Backend API: http://localhost:8080/api
# Sử dụng hệ thống
## Tài khoản mẫu
- Admin: admin@gmail.com với mật khẩu là 123.
- User: luxerestaurant2025@gmail.com với mật khẩu là Duynguyen123#.
## Các chức năng chính
- Admin: 
    Quản lý món ăn.
    Quản lý đơn hàng.
    Quản lý đặt bàn.
    Quản lý ưu đãi.
    Quản lý người dùng.
    Quản lý report.
- Customers:
    Xem và mua món ăn.
    Xem đơn hàng.
    Đặt bàn.
    Xem ưu đãi.
    Dùng chatbot và nhắn tin cho nhân viên cũng như người dùng khác.
    Gửi report.
## API Documentation
- Swagger UI: http://localhost:8080/swagger-ui.html
- Một số API chính: 
    /api/user/
    /api/reservations/
    /api/orders/
    /api/dish/
    /api/report/
    /api/promotion/
    /api/login
    /api/images
    /api/chatbot
    /api/category/getall
## Cấu trúc thư mục
	RESTAURANT/
├── restaurant-be/              # Backend – Spring Boot
│   ├── .github/                 # GitHub workflows / CI (nếu có)
│   ├── .idea/                   # Cấu hình IDE
│   ├── .mvn/                    # Maven wrapper
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/luxe_restaurant/
│   │       │       ├── app/      # Tầng xử lý request/response
│   │       │       │   ├── controllers/   # REST Controllers
│   │       │       │   ├── requests/      # DTO nhận dữ liệu từ client
│   │       │       │   └── responses/     # DTO trả dữ liệu về client
│   │       │       │
│   │       │       ├── domain/   # Domain layer (business logic)
│   │       │       │   ├── configs/        # Cấu hình (Security, CORS, JWT…)
│   │       │       │   ├── dto/            # DTO dùng nội bộ
│   │       │       │   ├── entities/       # JPA Entities
│   │       │       │   ├── enums/          # Enum (Role, Status, …)
│   │       │       │   ├── repositories/  # JPA Repositories
│   │       │       │   └── services/       # Business Services
│   │       │       │
│   │       │       └── LuxeRestaurantApplication.java
│   │       │
│   │       └── resources/
│   │           ├── db/          # Script SQL / migration
│   │           ├── static/      # Tài nguyên tĩnh (nếu có)
│   │           ├── templates/   # Template (cũ – không dùng nếu REST)
│   │           └── application.yml
│   │
│   └── pom.xml
│
├── restaurant-fe/               # Frontend – React + Vite
│   ├── dist/                    # Build production
│   ├── node_modules/
│   ├── public/                 # Public assets
│   ├── src/
│   │   ├── admin/               # Trang & chức năng Admin
│   │   ├── assets/              # Ảnh, icon, font
│   │   ├── Chatbot/             # Chatbot module
│   │   ├── components/          # Component dùng chung
│   │   ├── context/             # React Context (Auth, Cart, ...)
│   │   ├── dndx/                # Drag & Drop (DnD)
│   │   ├── giohang/             # Giỏ hàng
│   │   ├── i18n/                # Đa ngôn ngữ
│   │   ├── Lienhe/              # Trang liên hệ
│   │   ├── Loading/             # Loading / Spinner
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── .env                     # Biến môi trường
│   ├── package.json
│   └── vite.config.js
│
└── README.md
## Các lỗi thường gặp
- Không kết nối được database → kiểm tra username/password.
- Lỗi CORS → kiểm tra cấu hình Spring Security.
