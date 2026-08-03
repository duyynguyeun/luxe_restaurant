package com.luxe_restaurant.domain.repositories;

import com.luxe_restaurant.domain.entities.InventoryTransactionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryTransactionItemRepository extends JpaRepository<InventoryTransactionItem, Long> {

    List<InventoryTransactionItem> findByTransactionId(Long transactionId);
}
