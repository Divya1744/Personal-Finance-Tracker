package com.rep.finance.service;

import com.rep.finance.model.BudgetEntity;
import com.rep.finance.model.UserEntity;
import com.rep.finance.repository.BudgetRepository;
import com.rep.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;

    public BudgetEntity getBudget(String userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return budgetRepository.findByUser(user)
                .orElse(BudgetEntity.builder()
                        .user(user)
                        .totalIncome(0.0)
                        .totalExpense(0.0)
                        .remainingBudget(0.0)
                        .build());
    }
}
