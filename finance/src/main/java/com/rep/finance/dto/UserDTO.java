package com.rep.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class UserDTO {
    private String email;
    private String username;
    private boolean isVerified;
}
