package com.rep.finance.dto;

import lombok.Data;
import java.util.List;

@Data
public class OCRTransactionListDTO {
    private List<TransactionOCRRequest> transactions;
}
