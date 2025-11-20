package com.rep.finance.security;

import com.rep.finance.service.JwtService;
import com.rep.finance.model.UserEntity;
import com.rep.finance.service.CustomUserDetailsService;
import com.rep.finance.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final CustomUserDetailsService customUserDetailsService;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String path = request.getServletPath();
        System.out.println("Incoming Path: " + path);
        if (path.startsWith("/api/auth")) {
            filterChain.doFilter(request, response); // skip JWT check
            return;
        }
        String authHeader = request.getHeader("Authorization");
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request,response);
            return;
        }
        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        if(email!=null && SecurityContextHolder.getContext().getAuthentication()==null){

            UserEntity user = userRepository.findByEmail(email).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"user not found"));
            System.out.println("Authorities from DB: " + user.getRole());

            if(jwtService.isTokenValid(token,user)){
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
                System.out.println("Authorities from UserDetails: " + userDetails.getAuthorities());

                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
            else{
                throw new BadCredentialsException("JWT token is expired or invalid");
            }
        }
        filterChain.doFilter(request,response);

    }
}
