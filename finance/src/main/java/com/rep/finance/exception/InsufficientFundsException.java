package com.rep.finance.exception;

// Inheriting from RuntimeException allows it to be thrown without
// being declared in method signatures (unchecked exception).
public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(String message) {
        super(message);
    }
}