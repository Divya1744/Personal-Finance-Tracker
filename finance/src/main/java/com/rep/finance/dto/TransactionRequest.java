package com.rep.finance.dto;

import lombok.Data;

@Data
public class TransactionRequest {
    private Double amount;
    private String type;       // INCOME or EXPENSE
    private String category;   // must match Category enum
    private String note;
}
