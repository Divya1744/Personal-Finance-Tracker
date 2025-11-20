package com.rep.finance.controller;

import com.rep.finance.dto.TransactionRequest;
import com.rep.finance.model.TransactionEntity;
import com.rep.finance.model.BudgetEntity;
import com.rep.finance.model.Category;
import com.rep.finance.model.UserEntity;
import com.rep.finance.service.TransactionService;
import com.rep.finance.service.BudgetService;
import com.rep.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final BudgetService budgetService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<TransactionEntity>> getTransactions(@RequestParam String userId) {
        return ResponseEntity.ok(transactionService.getUserTransactions(userId));
    }

    @PostMapping
    public ResponseEntity<TransactionEntity> addTransaction(@RequestParam String userId,
                                                            @RequestBody TransactionRequest dto) {
        TransactionEntity tx = transactionService.addTransaction(
                userId,
                dto.getAmount(),
                dto.getType(),
                Category.valueOf(dto.getCategory()),
                dto.getNote()
        );
        return ResponseEntity.ok(tx);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTransaction(@RequestParam String userId,
                                                    @PathVariable Long id) {
        transactionService.deleteTransaction(userId, id);
        return ResponseEntity.ok("Transaction deleted");
    }

    @GetMapping("/budget")
    public ResponseEntity<BudgetEntity> getBudget(@RequestParam String userId) {
        return ResponseEntity.ok(budgetService.getBudget(userId));
    }
}
