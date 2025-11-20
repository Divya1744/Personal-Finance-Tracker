// File: finance/src/main/java/com/rep/finance/repository/ScheduledTransactionRepository.java

package com.rep.finance.repository;

import com.rep.finance.model.ScheduledTransactionEntity;
import com.rep.finance.model.UserEntity; // Import UserEntity
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduledTransactionRepository extends JpaRepository<ScheduledTransactionEntity, Long> {

    // ... existing method for notification check
    List<ScheduledTransactionEntity> findByIsNotifiedFalseAndScheduledTimestampBetween(
            LocalDateTime start,
            LocalDateTime end
    );

    /**
     * Finds all scheduled transactions for a given User.
     */
    List<ScheduledTransactionEntity> findByUser(UserEntity user);
}