package com.luxe_restaurant.domain.utils;

import com.luxe_restaurant.domain.enums.IngredientUnit;
import com.luxe_restaurant.domain.exception.BusinessException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class UnitConverterTest {

    @Test
    @DisplayName("Quy đổi 1.5 KG sang GRAM thành công")
    void testConvertKgToGram() {
        BigDecimal result = UnitConverter.convertToBaseUnit(new BigDecimal("1.5"), IngredientUnit.KILOGRAM, IngredientUnit.GRAM);
        assertEquals(new BigDecimal("1500.0"), result);
    }

    @Test
    @DisplayName("Quy đổi 2.5 LITER sang MILLILITER thành công")
    void testConvertLiterToMilliliter() {
        BigDecimal result = UnitConverter.convertToBaseUnit(new BigDecimal("2.5"), IngredientUnit.LITER, IngredientUnit.MILLILITER);
        assertEquals(new BigDecimal("2500.0"), result);
    }

    @Test
    @DisplayName("Giữ nguyên khi cùng đơn vị PIECE")
    void testConvertPieceToPiece() {
        BigDecimal result = UnitConverter.convertToBaseUnit(new BigDecimal("10"), IngredientUnit.PIECE, IngredientUnit.PIECE);
        assertEquals(new BigDecimal("10"), result);
    }

    @Test
    @DisplayName("Báo lỗi khi quy đổi giữa hai đơn vị không tương thích (GRAM sang PIECE)")
    void testIncompatibleUnitConversion() {
        assertThrows(BusinessException.class, () ->
            UnitConverter.convertToBaseUnit(new BigDecimal("100"), IngredientUnit.GRAM, IngredientUnit.PIECE)
        );
    }

    @Test
    @DisplayName("Báo lỗi khi số lượng quy đổi âm")
    void testNegativeQuantityConversion() {
        assertThrows(BusinessException.class, () ->
            UnitConverter.convertToBaseUnit(new BigDecimal("-1"), IngredientUnit.KILOGRAM, IngredientUnit.GRAM)
        );
    }
}
