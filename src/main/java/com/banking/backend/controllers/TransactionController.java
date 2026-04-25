package com.banking.backend.controllers;

import com.banking.backend.models.Transaction;
import com.banking.backend.payload.request.TransactionRequest;
import com.banking.backend.payload.request.TransferRequest;
import com.banking.backend.services.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/{accountId}/deposit")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Transaction> deposit(
            @PathVariable Long accountId,
            @Valid @RequestBody TransactionRequest request) {
        Transaction transaction = transactionService.deposit(accountId, request.getAmount());
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/{accountId}/withdraw")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Transaction> withdraw(
            @PathVariable Long accountId,
            @Valid @RequestBody TransactionRequest request) {
        Transaction transaction = transactionService.withdraw(accountId, request.getAmount());
        return ResponseEntity.ok(transaction);
    }

    @PostMapping("/{accountId}/transfer")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Transaction> transfer(
            @PathVariable Long accountId,
            @Valid @RequestBody TransferRequest request) {
        Transaction transaction = transactionService.transfer(accountId, request.getToAccountNumber(), request.getAmount());
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/{accountId}/history")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Transaction>> getHistory(@PathVariable Long accountId) {
        return ResponseEntity.ok(transactionService.getTransactionHistory(accountId));
    }

    @GetMapping("/{accountId}/mini-statement")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Transaction>> getMiniStatement(@PathVariable Long accountId) {
        return ResponseEntity.ok(transactionService.getMiniStatement(accountId));
    }
}
