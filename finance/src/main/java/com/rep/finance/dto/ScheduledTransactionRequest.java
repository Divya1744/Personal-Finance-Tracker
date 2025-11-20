package com.rep.finance.dto;

import lombok.Data;

import java.time.LocalDate; // Changed from LocalDateTime

@Data
public class ScheduledTransactionRequest {
    private Double amount;
    private String type; // INCOME or EXPENSE
    private String category; // must match Category enum
    private String note;
    private LocalDate scheduledDate; // Changed field name and type to LocalDate
}