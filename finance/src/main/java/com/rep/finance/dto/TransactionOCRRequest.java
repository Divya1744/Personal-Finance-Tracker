package com.rep.finance.dto;

import lombok.Data;

@Data
public class TransactionOCRRequest {
    private Double amount;
    private String type;
    private String category;
    private String note;
    private String timestamp; // optional, not needed for your service
    private String userId;
}
