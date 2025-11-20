package com.rep.finance.controller;

import com.rep.finance.dto.ScheduledTransactionRequest;
import com.rep.finance.model.ScheduledTransactionEntity;
import com.rep.finance.service.ScheduledTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scheduled-transactions")
@RequiredArgsConstructor
public class ScheduledTransactionController {

    private final ScheduledTransactionService scheduledTransactionService;

    @PostMapping
    public ResponseEntity<ScheduledTransactionEntity> scheduleTransaction(
            @RequestParam String userId,
            @RequestBody ScheduledTransactionRequest dto) {

        ScheduledTransactionEntity scheduledTx = scheduledTransactionService.scheduleTransaction(userId, dto);
        return ResponseEntity.ok(scheduledTx);
    }

    // NEW ENDPOINT: GET request to retrieve all scheduled transactions for a user
    @GetMapping
    public ResponseEntity<List<ScheduledTransactionEntity>> getScheduledTransactions(@RequestParam String userId) {
        List<ScheduledTransactionEntity> transactions = scheduledTransactionService.getUserScheduledTransactions(userId);
        return ResponseEntity.ok(transactions);
    }
}