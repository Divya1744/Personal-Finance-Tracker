package com.rep.finance.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_scheduled_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduledTransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String type; // "INCOME" or "EXPENSE"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column
    private String note;

    @Column(nullable = false)
    private LocalDateTime scheduledTimestamp; // When the transaction is set to occur

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private boolean isNotified = false; // Flag to ensure notification is sent only once
}