package com.rep.finance.service;

import com.rep.finance.dto.*;

import com.rep.finance.model.Role;
import com.rep.finance.model.UserEntity;
import com.rep.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;


    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()
                )
        );

        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        String userId = user.getId();
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return convertToAuthResponse(accessToken,refreshToken,userId);
    }

    private AuthResponse convertToAuthResponse(String accessToken, String refreshToken, String id){
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(id)
                .build();
    }

    public RegisterResponse register(RegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new ResponseStatusException(HttpStatus.CONFLICT,"User already exists");
        }
        UserEntity user = convertToUserEntity(request);
        userRepository.save(user);
        return convertToRegisterResponse(user);
    }

    private RegisterResponse convertToRegisterResponse(UserEntity user) {
        return RegisterResponse.builder()
                .uuid(user.getId().toString())
                .username(user.getUsername())
                .email(user.getEmail())
                .isAccountVerified(user.isVerified())
                .build();
    }

    private UserEntity convertToUserEntity(RegisterRequest request) {
        return UserEntity.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())

                .id(UUID.randomUUID().toString())
                .isVerified(false)
                .role(Role.USER)
                .build();
    }

    public String generateOtp(){
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
        return otp;
    }
    public long generateOtpExpiry(){
        long expiryTime = System.currentTimeMillis() + (15 * 60 * 1000);
        return expiryTime;
    }

    public void verifyEmail(@RequestBody String email, String otp){
        System.out.println("🔍 Checking email: " + email);
        System.out.println("✅ existsByEmail? " + userRepository.existsByEmail(email));

        if(!userRepository.existsByEmail(email)){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"User not register. PLease register before verifying");
        }

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"user not found"));
        if (user.getVerifyOtp() == null || !user.getVerifyOtp().equals(otp)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Invalid or missing OTP");
        }
        if (user.getVerifyOtpExpiry() < System.currentTimeMillis()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP Expired");
        }
        user.setVerifyOtp(null);
        user.setVerifyOtpExpiry(0L);
        user.setVerified(true);
        userRepository.save(user);
    }

    public ResponseEntity<RefreshTokenResponse> refresh(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        String email = jwtService.extractEmail(refreshToken);
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"user not found"));
        if(user.getRefreshToken() != null && user.getRefreshToken().equals(request.getRefreshToken()) && jwtService.isTokenValid(refreshToken,user)){
            String newAccessToken = jwtService.generateAccessToken(user);
            return ResponseEntity.ok( RefreshTokenResponse
                    .builder()
                    .accessToken(newAccessToken)
                    .build());

        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    public ResponseEntity<?> logout(logoutRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found"));
        user.setRefreshToken(null);
        userRepository.save(user);
        return ResponseEntity.ok("Successfully LoggedOut");
    }
}
