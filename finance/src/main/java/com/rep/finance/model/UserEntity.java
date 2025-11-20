package com.rep.finance.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "tbl_users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class UserEntity {
    @Id
    private String id;

    private String username;

    @Column(unique = true)
    private String email;

    private String password;

    private boolean isVerified;

    //@ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Role role;

    private String verifyOtp;
    private long verifyOtpExpiry;
    private String resetOtp;
    private long resetOtpExpiry;
    @Column(updatable = false)
    @CreationTimestamp
    private Timestamp createdAt;
    @UpdateTimestamp
    private Timestamp updatedAt;
    private String refreshToken;

    // ADDED: Phone number for SMS notifications
    private String phoneNumber;
}
