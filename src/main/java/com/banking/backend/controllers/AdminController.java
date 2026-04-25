package com.banking.backend.controllers;

import com.banking.backend.models.User;
import com.banking.backend.payload.response.AccountResponse;
import com.banking.backend.payload.response.MessageResponse;
import com.banking.backend.repository.UserRepository;
import com.banking.backend.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountService accountService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @PostMapping("/accounts/{accountId}/toggle-status")
    public ResponseEntity<?> toggleAccountStatus(@PathVariable Long accountId) {
        accountService.toggleAccountStatus(accountId);
        return ResponseEntity.ok(new MessageResponse("Account status toggled successfully!"));
    }
}
