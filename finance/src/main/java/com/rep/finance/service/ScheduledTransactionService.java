package com.rep.finance.service;

import com.rep.finance.dto.ScheduledTransactionRequest;
import com.rep.finance.model.Category;
import com.rep.finance.model.ScheduledTransactionEntity;
import com.rep.finance.model.UserEntity;
import com.rep.finance.repository.ScheduledTransactionRepository;
import com.rep.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
// import java.time.LocalTime; // atStartOfDay() is used, no explicit LocalTime import needed

@Service
@RequiredArgsConstructor
public class ScheduledTransactionService {

    private final ScheduledTransactionRepository scheduledTransactionRepository;
    private final UserRepository userRepository;

    public ScheduledTransactionEntity scheduleTransaction(String userId, ScheduledTransactionRequest dto) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // CONVERT LocalDate to LocalDateTime at midnight (start of the day)
        LocalDateTime scheduledTimestamp = dto.getScheduledDate().atStartOfDay();

        ScheduledTransactionEntity scheduledTx = ScheduledTransactionEntity.builder()
                .user(user)
                .amount(dto.getAmount())
                .type(dto.getType())
                .category(Category.valueOf(dto.getCategory().toUpperCase()))
                .note(dto.getNote())
                .scheduledTimestamp(scheduledTimestamp) // Used converted value
                .isNotified(false) // Reminder not yet sent
                .build();

        return scheduledTransactionRepository.save(scheduledTx);
    }

    // NEW METHOD: Retrieve all scheduled transactions for a user
    public List<ScheduledTransactionEntity> getUserScheduledTransactions(String userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return scheduledTransactionRepository.findByUser(user);
    }
}