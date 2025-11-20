package com.rep.finance.sms;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class SmsRequest {
    private final String phoneNumber;
    private final String message;
}