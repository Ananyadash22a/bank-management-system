package com.banking.backend.controllers;

import com.banking.backend.payload.response.AccountResponse;
import com.banking.backend.payload.response.MessageResponse;
import com.banking.backend.security.services.UserDetailsImpl;
import com.banking.backend.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createAccount(@AuthenticationPrincipal UserDetailsImpl userDetails, @RequestBody Map<String, String> request) {
        String accountType = request.getOrDefault("accountType", "Savings");
        accountService.createAccount(userDetails.getId(), accountType);
        return ResponseEntity.ok(new MessageResponse("Account created successfully!"));
    }

    @GetMapping("/my-accounts")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<AccountResponse>> getMyAccounts(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<AccountResponse> accounts = accountService.getUserAccounts(userDetails.getId());
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<AccountResponse> getAccountDetails(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }
}
