package com.luxe_restaurant.domain.enums;

public enum IngredientUnit {
    GRAM("Khối lượng"),
    KILOGRAM("Khối lượng"),
    MILLILITER("Thể tích"),
    LITER("Thể tích"),
    PIECE("Đếm số lượng");

    private final String category;

    IngredientUnit(String category) {
        this.category = category;
    }

    public String getCategory() {
        return category;
    }

    public boolean isCompatibleWith(IngredientUnit targetUnit) {
        return this.category.equals(targetUnit.category);
    }
}
