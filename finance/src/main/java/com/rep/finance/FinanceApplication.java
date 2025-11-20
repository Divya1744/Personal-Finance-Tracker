package com.rep.finance;

import com.rep.finance.sms.TwilioInitializer; // ADDED
import jakarta.annotation.PostConstruct; // ADDED
import lombok.RequiredArgsConstructor; // ADDED
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling; // ADDED

@SpringBootApplication
@EnableScheduling // ADDED: Enable scheduling for the notification job
@RequiredArgsConstructor // ADDED: For injecting TwilioInitializer
public class FinanceApplication {

	private final TwilioInitializer twilioInitializer; // ADDED: Inject Initializer

	@PostConstruct // ADDED: Initialize Twilio after application starts
	public void initTwilio() {
		twilioInitializer.init();
	}

	public static void main(String[] args) {
		System.out.println("hello");
		SpringApplication.run(FinanceApplication.class, args
		);
	}

}