package com.rep.finance.repository;

// ... imports

import com.rep.finance.model.TransactionEntity;
import com.rep.finance.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {
    List<TransactionEntity> findByUser(UserEntity user);

    @Query("SELECT t FROM TransactionEntity t WHERE t.user.id = :userId AND t.timestamp >= :date")
    List<TransactionEntity> findByUserIdAndTimestampAfter(@Param("userId") String userId,
                                                          @Param("date") LocalDateTime date);

    @Query("SELECT t FROM TransactionEntity t WHERE t.user.id = :userId AND t.timestamp >= :date")
    List<TransactionEntity> findByUser_IdAndTimestampAfter(String userId, LocalDateTime date); // <-- **Changed Long to String**
}