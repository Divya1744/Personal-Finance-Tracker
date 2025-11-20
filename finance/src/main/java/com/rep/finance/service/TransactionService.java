package com.rep.finance.service;

import com.rep.finance.model.*;
import com.rep.finance.repository.TransactionRepository;
import com.rep.finance.repository.UserRepository;
import com.rep.finance.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository;

    public List<TransactionEntity> getUserTransactions(String userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return transactionRepository.findByUser(user);
    }

    public TransactionEntity addTransaction(String userId, Double amount, String type, Category category, String note) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TransactionEntity tx = TransactionEntity.builder()
                .user(user)
                .amount(amount)
                .type(type)
                .category(category)
                .note(note)
                .build();

        transactionRepository.save(tx);

        updateBudget(user, amount, type);

        return tx;
    }

    public void deleteTransaction(String userId, Long transactionId) {
        TransactionEntity tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!tx.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        transactionRepository.delete(tx);

        // reverse the budget
        updateBudget(tx.getUser(), tx.getAmount(), tx.getType().equals("INCOME") ? "EXPENSE" : "INCOME");
    }

    private void updateBudget(UserEntity user, Double amount, String type) {
        BudgetEntity budget = budgetRepository.findByUser(user)
                .orElse(BudgetEntity.builder()
                        .user(user)
                        .totalIncome(0.0)
                        .totalExpense(0.0)
                        .remainingBudget(0.0)
                        .build());

        if (type.equalsIgnoreCase("INCOME")) {
            budget.setTotalIncome(budget.getTotalIncome() + amount);
            budget.setRemainingBudget(budget.getRemainingBudget() + amount);
        } else if (type.equalsIgnoreCase("EXPENSE")) {
            budget.setTotalExpense(budget.getTotalExpense() + amount);
            budget.setRemainingBudget(budget.getRemainingBudget() - amount);
        }

        budgetRepository.save(budget);
    }
}
