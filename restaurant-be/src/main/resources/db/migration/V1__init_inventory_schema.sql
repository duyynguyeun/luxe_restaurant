-- Flyway Migration Script: V1__init_inventory_schema.sql
-- Module Quản lý Kho nguyên liệu và Công thức món ăn

-- 0. Bảng món ăn (Đảm bảo bảng dish đã tồn tại để thiết lập FK)
CREATE TABLE IF NOT EXISTS dish (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name_dish VARCHAR(255) UNIQUE,
    url_image VARCHAR(255),
    price DECIMAL(15, 2),
    des VARCHAR(255),
    category_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 1. Bảng Nguyên liệu
CREATE TABLE IF NOT EXISTS ingredients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    base_unit VARCHAR(20) NOT NULL,
    description TEXT,
    low_stock_threshold DECIMAL(12, 3) NOT NULL DEFAULT 0.000,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng Công thức món ăn (MenuItemIngredients)
CREATE TABLE IF NOT EXISTS menu_item_ingredients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dish_id BIGINT NOT NULL,
    ingredient_id BIGINT NOT NULL,
    quantity DECIMAL(12, 3) NOT NULL,
    note VARCHAR(255),
    CONSTRAINT uk_dish_ingredient UNIQUE (dish_id, ingredient_id),
    CONSTRAINT fk_recipe_dish FOREIGN KEY (dish_id) REFERENCES dish(id) ON DELETE CASCADE,
    CONSTRAINT fk_recipe_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng Tồn kho hiện tại (InventoryStock)
CREATE TABLE IF NOT EXISTS inventory_stocks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ingredient_id BIGINT NOT NULL UNIQUE,
    quantity_on_hand DECIMAL(12, 3) NOT NULL DEFAULT 0.000,
    average_cost DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    version BIGINT NOT NULL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_stock_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng Header Giao dịch kho (InventoryTransaction)
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL,
    reference_type VARCHAR(30),
    reference_id VARCHAR(50),
    supplier_name VARCHAR(255),
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    confirmed_at DATETIME,
    confirmed_by VARCHAR(100),
    INDEX idx_trans_ref (reference_type, reference_id),
    INDEX idx_trans_code (code),
    INDEX idx_trans_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng Chi tiết Giao dịch kho (InventoryTransactionItem)
CREATE TABLE IF NOT EXISTS inventory_transaction_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id BIGINT NOT NULL,
    ingredient_id BIGINT NOT NULL,
    input_quantity DECIMAL(12, 3) NOT NULL,
    input_unit VARCHAR(20) NOT NULL,
    base_quantity DECIMAL(12, 3) NOT NULL,
    unit_cost DECIMAL(15, 2) DEFAULT 0.00,
    total_cost DECIMAL(15, 2) DEFAULT 0.00,
    batch_code VARCHAR(50),
    expiry_date DATE,
    stock_before DECIMAL(12, 3),
    stock_after DECIMAL(12, 3),
    CONSTRAINT fk_trans_item_header FOREIGN KEY (transaction_id) REFERENCES inventory_transactions(id) ON DELETE CASCADE,
    CONSTRAINT fk_trans_item_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(id),
    INDEX idx_item_ingredient_created (ingredient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
