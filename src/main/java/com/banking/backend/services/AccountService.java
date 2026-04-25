package com.banking.backend.services;

import com.banking.backend.models.Account;
import com.banking.backend.models.User;
import com.banking.backend.payload.response.AccountResponse;
import com.banking.backend.repository.AccountRepository;
import com.banking.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Account createAccount(Long userId, String accountType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accountNumber = generateAccountNumber();
        Account account = new Account(accountNumber, BigDecimal.ZERO, accountType, user);
        
        return accountRepository.save(account);
    }

    public List<AccountResponse> getUserAccounts(Long userId) {
        List<Account> accounts = accountRepository.findByUserId(userId);
        return accounts.stream().map(this::mapToAccountResponse).collect(Collectors.toList());
    }

    public AccountResponse getAccountById(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return mapToAccountResponse(account);
    }

    @Transactional
    public void toggleAccountStatus(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        account.setActive(!account.isActive());
        accountRepository.save(account);
    }
    
    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream().map(this::mapToAccountResponse).collect(Collectors.toList());
    }

    private String generateAccountNumber() {
        // Simple generation logic (e.g. 10 digits)
        long number = (long) Math.floor(Math.random() * 9_000_000_000L) + 1_000_000_000L;
        String accNum = String.valueOf(number);
        // Ensure uniqueness
        while (accountRepository.existsByAccountNumber(accNum)) {
            number = (long) Math.floor(Math.random() * 9_000_000_000L) + 1_000_000_000L;
            accNum = String.valueOf(number);
        }
        return accNum;
    }

    private AccountResponse mapToAccountResponse(Account account) {
        return new AccountResponse(
                account.getId(),
                account.getAccountNumber(),
                account.getBalance(),
                account.getAccountType(),
                account.isActive(),
                account.getCreatedAt()
        );
    }
}
