package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.app.requests.inventory.InventoryTransactionRequest;
import com.luxe_restaurant.app.responses.ingredient.IngredientResponse;
import com.luxe_restaurant.app.responses.inventory.InventoryDashboardResponse;
import com.luxe_restaurant.app.responses.inventory.InventoryTransactionResponse;
import com.luxe_restaurant.app.responses.page.PageResponse;
import com.luxe_restaurant.domain.enums.InventoryTransactionStatus;
import com.luxe_restaurant.domain.enums.InventoryTransactionType;
import com.luxe_restaurant.domain.services.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/admin/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/stocks")
    public PageResponse<IngredientResponse> filterStocks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "false") Boolean lowStockOnly,
            @PageableDefault(size = 20, page = 0) Pageable pageable) {
        return inventoryService.filterStocks(keyword, lowStockOnly, pageable);
    }

    @GetMapping("/transactions")
    public PageResponse<InventoryTransactionResponse> filterTransactions(
            @RequestParam(required = false) String transactionCode,
            @RequestParam(required = false) InventoryTransactionType type,
            @RequestParam(required = false) InventoryTransactionStatus status,
            @RequestParam(required = false) String referenceId,
            @RequestParam(required = false) Long ingredientId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @PageableDefault(size = 20, page = 0) Pageable pageable) {
        return inventoryService.filterTransactions(transactionCode, type, status, referenceId, ingredientId, startDate, endDate, pageable);
    }

    @GetMapping("/transactions/{id}")
    public InventoryTransactionResponse getTransactionById(@PathVariable Long id) {
        return inventoryService.getTransactionById(id);
    }

    @PostMapping("/imports")
    public InventoryTransactionResponse createImportTransaction(@Valid @RequestBody InventoryTransactionRequest request) {
        request.setType(InventoryTransactionType.IMPORT);
        return inventoryService.createTransaction(request);
    }

    @PostMapping("/exports")
    public InventoryTransactionResponse createExportTransaction(@Valid @RequestBody InventoryTransactionRequest request) {
        if (request.getType() == null) {
            request.setType(InventoryTransactionType.MANUAL_EXPORT);
        }
        return inventoryService.createTransaction(request);
    }

    @PostMapping("/adjustments")
    public InventoryTransactionResponse createAdjustmentTransaction(@Valid @RequestBody InventoryTransactionRequest request) {
        if (request.getType() == null) {
            request.setType(InventoryTransactionType.ADJUSTMENT_IN);
        }
        return inventoryService.createTransaction(request);
    }

    @PostMapping("/transactions/{id}/confirm")
    public InventoryTransactionResponse confirmTransaction(@PathVariable Long id) {
        return inventoryService.confirmTransaction(id);
    }

    @GetMapping("/dashboard")
    public InventoryDashboardResponse getDashboardSummary() {
        return inventoryService.getDashboardSummary();
    }
}
