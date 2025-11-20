package com.rep.finance.service;

import com.rep.finance.model.ScheduledTransactionEntity;
import com.rep.finance.repository.ScheduledTransactionRepository;
import com.rep.finance.sms.SmsRequest;
import com.rep.finance.sms.SmsSender;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationService.class);
    private final ScheduledTransactionRepository scheduledTransactionRepository;
    private final SmsSender smsSender;

    // MODIFIED for immediate testing: Runs every 60 seconds (1 minute).
    // The rate is in milliseconds.
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void sendScheduledTransactionReminders() {
        LOGGER.info("Starting scheduled transaction reminder job.");

        // Define the time window for reminders:
        // Transactions scheduled between now and the next 7 days
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = start.plusDays(7);

        List<ScheduledTransactionEntity> reminders = scheduledTransactionRepository
                .findByIsNotifiedFalseAndScheduledTimestampBetween(start, end);

        LOGGER.info("Found {} transactions scheduled within the next 7 days that haven't been notified.", reminders.size());

        for (ScheduledTransactionEntity tx : reminders) {
            String phoneNumber = tx.getUser().getPhoneNumber();

            if (phoneNumber != null) {

                String noteContent = tx.getNote() != null && !tx.getNote().trim().isEmpty()
                        ? tx.getNote().trim()
                        : "Scheduled transaction due."; // Fallback if note is empty

                String message = "Reminder : " + noteContent;

                try {
                    SmsRequest smsRequest = new SmsRequest(phoneNumber, message);
                    smsSender.sendSms(smsRequest);

                    // Mark as notified to prevent sending again
                    tx.setNotified(true);
                    scheduledTransactionRepository.save(tx);
                } catch (Exception e) {
                    LOGGER.error("Failed to send SMS reminder for scheduled transaction ID: {}", tx.getId(), e);
                }
            } else {
                LOGGER.warn("User {} has no phone number set. Skipping SMS reminder for transaction ID: {}", tx.getUser().getId(), tx.getId());
            }
        }

        LOGGER.info("Finished scheduled transaction reminder job.");
    }
}