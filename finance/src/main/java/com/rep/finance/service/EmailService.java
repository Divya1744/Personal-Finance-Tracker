package com.rep.finance.service;

import com.rep.finance.dto.RegisterResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;
    public void welcomeMailWithOtp(RegisterResponse response, String otp){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setSubject("welcome to our platform");
        message.setFrom(fromEmail);
        message.setTo(response.getEmail());
        message.setText("Thankyou for registering with us. Your verification otp is "+otp);
        mailSender.send(message);
    }
}
