package com.banking.backend.services;

import com.banking.backend.models.Account;
import com.banking.backend.models.Transaction;
import com.banking.backend.repository.AccountRepository;
import com.banking.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional
    public Transaction deposit(Long accountId, BigDecimal amount) {
        Account account = getActiveAccount(accountId);

        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);

        Transaction transaction = new Transaction("DEPOSIT", amount, null, account);
        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction withdraw(Long accountId, BigDecimal amount) {
        Account account = getActiveAccount(accountId);

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds");
        }

        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        Transaction transaction = new Transaction("WITHDRAWAL", amount, account, null);
        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction transfer(Long fromAccountId, String toAccountNumber, BigDecimal amount) {
        Account fromAccount = getActiveAccount(fromAccountId);
        
        if (fromAccount.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds");
        }

        Account toAccount = accountRepository.findByAccountNumber(toAccountNumber)
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        if (!toAccount.isActive()) {
            throw new RuntimeException("Destination account is inactive");
        }
        
        if (fromAccount.getId().equals(toAccount.getId())) {
             throw new RuntimeException("Cannot transfer to the same account");
        }

        fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
        toAccount.setBalance(toAccount.getBalance().add(amount));

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        Transaction transaction = new Transaction("TRANSFER", amount, fromAccount, toAccount);
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionHistory(Long accountId) {
        return transactionRepository.findByAccountIdOrderByTransactionDateDesc(accountId);
    }
    
    public List<Transaction> getMiniStatement(Long accountId) {
        return transactionRepository.findByAccountIdOrderByTransactionDateDesc(accountId)
                .stream()
                .limit(10)
                .toList();
    }

    private Account getActiveAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        if (!account.isActive()) {
            throw new RuntimeException("Account is inactive or frozen");
        }
        return account;
    }
}
