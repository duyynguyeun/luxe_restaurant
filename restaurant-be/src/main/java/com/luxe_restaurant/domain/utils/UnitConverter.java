package com.luxe_restaurant.domain.utils;

import com.luxe_restaurant.domain.enums.IngredientUnit;
import com.luxe_restaurant.domain.exception.BusinessException;
import com.luxe_restaurant.domain.exception.ErrorCode;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class UnitConverter {

    private static final BigDecimal THOUSAND = new BigDecimal("1000");

    /**
     * Quy đổi số lượng từ inputUnit về baseUnit của nguyên liệu.
     */
    public static BigDecimal convertToBaseUnit(BigDecimal quantity, IngredientUnit inputUnit, IngredientUnit baseUnit) {
        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException(ErrorCode.INVALID_QUANTITY);
        }
        if (inputUnit == null || baseUnit == null || !inputUnit.isCompatibleWith(baseUnit)) {
            throw new BusinessException(ErrorCode.INVALID_UNIT_CONVERSION,
                    String.format("Không thể quy đổi từ %s sang %s", inputUnit, baseUnit));
        }

        if (inputUnit == baseUnit) {
            return quantity;
        }

        // KILOGRAM -> GRAM
        if (inputUnit == IngredientUnit.KILOGRAM && baseUnit == IngredientUnit.GRAM) {
            return quantity.multiply(THOUSAND);
        }
        // LITER -> MILLILITER
        if (inputUnit == IngredientUnit.LITER && baseUnit == IngredientUnit.MILLILITER) {
            return quantity.multiply(THOUSAND);
        }
        // GRAM -> KILOGRAM (nếu baseUnit là KG)
        if (inputUnit == IngredientUnit.GRAM && baseUnit == IngredientUnit.KILOGRAM) {
            return quantity.divide(THOUSAND, 6, RoundingMode.HALF_UP);
        }
        // MILLILITER -> LITER (nếu baseUnit là LITER)
        if (inputUnit == IngredientUnit.MILLILITER && baseUnit == IngredientUnit.LITER) {
            return quantity.divide(THOUSAND, 6, RoundingMode.HALF_UP);
        }

        throw new BusinessException(ErrorCode.INVALID_UNIT_CONVERSION,
                String.format("Quy đổi giữa %s và %s chưa được hỗ trợ", inputUnit, baseUnit));
    }

    /**
     * Tính đơn giá tính theo base unit dựa trên unitCost của inputUnit.
     * Ví dụ: 100.000 VND / 1 KG -> 100 VND / 1 GRAM (vì 1 KG = 1000 GRAM)
     */
    public static BigDecimal convertUnitCostToBase(BigDecimal inputUnitCost, IngredientUnit inputUnit, IngredientUnit baseUnit) {
        if (inputUnitCost == null || inputUnitCost.compareTo(BigDecimal.ZERO) < 0) {
            return BigDecimal.ZERO;
        }
        if (inputUnit == baseUnit) {
            return inputUnitCost;
        }

        // Nếu mua bằng KILOGRAM nhưng baseUnit là GRAM: unitCostBase = unitCost / 1000
        if (inputUnit == IngredientUnit.KILOGRAM && baseUnit == IngredientUnit.GRAM) {
            return inputUnitCost.divide(THOUSAND, 6, RoundingMode.HALF_UP);
        }
        // Nếu mua bằng LITER nhưng baseUnit là MILLILITER: unitCostBase = unitCost / 1000
        if (inputUnit == IngredientUnit.LITER && baseUnit == IngredientUnit.MILLILITER) {
            return inputUnitCost.divide(THOUSAND, 6, RoundingMode.HALF_UP);
        }

        return inputUnitCost;
    }
}
