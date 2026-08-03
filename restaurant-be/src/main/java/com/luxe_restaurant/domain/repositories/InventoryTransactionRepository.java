package com.luxe_restaurant.domain.repositories;

import com.luxe_restaurant.domain.entities.InventoryTransaction;
import com.luxe_restaurant.domain.enums.InventoryTransactionStatus;
import com.luxe_restaurant.domain.enums.InventoryTransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {

    Optional<InventoryTransaction> findByCode(String code);

    boolean existsByCode(String code);

    Optional<InventoryTransaction> findByReferenceTypeAndReferenceIdAndTypeAndStatus(
            String referenceType, String referenceId, InventoryTransactionType type, InventoryTransactionStatus status);

    @Query("SELECT DISTINCT t FROM InventoryTransaction t " +
           "LEFT JOIN t.items i " +
           "WHERE (:transactionCode IS NULL OR LOWER(t.code) LIKE LOWER(CONCAT('%', :transactionCode, '%'))) AND " +
           "(:type IS NULL OR t.type = :type) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:referenceId IS NULL OR t.referenceId = :referenceId) AND " +
           "(:ingredientId IS NULL OR i.ingredient.id = :ingredientId) AND " +
           "(:startDate IS NULL OR t.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR t.createdAt <= :endDate)")
    Page<InventoryTransaction> filterTransactions(
            @Param("transactionCode") String transactionCode,
            @Param("type") InventoryTransactionType type,
            @Param("status") InventoryTransactionStatus status,
            @Param("referenceId") String referenceId,
            @Param("ingredientId") Long ingredientId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);
}
