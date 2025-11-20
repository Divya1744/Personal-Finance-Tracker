package com.rep.finance.sms;

import com.twilio.Twilio;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class TwilioInitializer {

    private final static Logger LOGGER = LoggerFactory.getLogger(TwilioInitializer.class);

    private final TwilioConfig twilioConfig;

    // This method is called from @PostConstruct in FinanceApplication.java
    public void init() {
        Twilio.init(
                twilioConfig.getAccountSid(),
                twilioConfig.getAuthToken()
        );
        LOGGER.info("Twilio initialized with account sid {}", twilioConfig.getAccountSid());
    }
}