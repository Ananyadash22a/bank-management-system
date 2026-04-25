package com.banking.backend.repository;

import com.banking.backend.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    @Query("SELECT t FROM Transaction t WHERE t.sourceAccount.id = :accountId OR t.destinationAccount.id = :accountId ORDER BY t.transactionDate DESC")
    List<Transaction> findByAccountIdOrderByTransactionDateDesc(Long accountId);
    
    // For mini statement (e.g. limit to 10 in the service layer using Pageable or stream)
}
