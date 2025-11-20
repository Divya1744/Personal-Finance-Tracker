package com.rep.finance.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class RegisterResponse {
    private String uuid;
    private String username;
    private String email;
    private boolean isAccountVerified;
}
