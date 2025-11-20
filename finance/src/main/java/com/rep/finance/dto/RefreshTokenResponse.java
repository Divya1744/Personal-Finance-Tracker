package com.rep.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class RefreshTokenResponse {
    private String accessToken;
    //private String refreshToken;
}
