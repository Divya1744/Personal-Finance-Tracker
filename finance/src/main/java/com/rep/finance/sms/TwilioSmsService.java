package com.rep.finance.sms;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.rest.api.v2010.account.MessageCreator;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TwilioSmsService implements SmsSender {

    private static final Logger LOGGER = LoggerFactory.getLogger(TwilioSmsService.class);

    private final TwilioConfig twilioConfig;

    @Override
    public void sendSms(SmsRequest smsRequest) {
        if (isPhoneNumberValid(smsRequest.getPhoneNumber())) {
            PhoneNumber to = new PhoneNumber(smsRequest.getPhoneNumber());
            PhoneNumber from = new PhoneNumber(twilioConfig.getTrialNumber());
            String message = smsRequest.getMessage();
            MessageCreator creator = Message.creator(to, from, message);
            creator.create();
            LOGGER.info("SMS reminder sent to {} for scheduled transaction.", smsRequest.getPhoneNumber());
        } else {
            LOGGER.error("Phone number [{}] is invalid or missing. SMS not sent.", smsRequest.getPhoneNumber());
            // No exception thrown here, just a log, so the scheduler keeps running.
        }
    }

    private boolean isPhoneNumberValid(String phoneNumber) {
        // Simple check for E.164 format (e.g., +15555555555)
        return phoneNumber != null && phoneNumber.matches("^\\+[1-9]\\d{7,14}$");
    }
}