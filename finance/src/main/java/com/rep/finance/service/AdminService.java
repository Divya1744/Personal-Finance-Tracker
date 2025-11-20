package com.rep.finance.service;

import com.rep.finance.dto.UserDTO;
import com.rep.finance.model.UserEntity;
import com.rep.finance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;

    public ResponseEntity<List<UserDTO>> getAllUsers() {
       List<UserEntity> users = userRepository.findAll();
       List<UserDTO> userList = users.stream()
               .map(user -> new UserDTO(user.getEmail(),user.getUsername(),user.isVerified())).toList();
       return ResponseEntity.ok(userList);
    }
}
