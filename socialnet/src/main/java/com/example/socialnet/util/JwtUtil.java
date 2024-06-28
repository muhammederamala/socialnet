package com.example.socialnet.util;

import com.example.socialnet.Models.UserModel;
import org.springframework.security.core.userdetails.UserDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "your_secret_key";

    public String generateToken(String username, String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        claims.put("userId",userId);
        return Jwts.builder()
                .setSubject(userId)
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    public boolean validateToken(String token, String username) {
        try {
            Claims claims = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
            String tokenUserId = claims.getSubject();
            String tokenUsername = claims.get("username", String.class);

            // Validate the username
            return (username.equals(tokenUsername));
        } catch (Exception e) {
            return false;
        }
    }

    public List<String> extractUsername(String token) {
        List<String> userDetails = new ArrayList<>();
        Claims claims = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
        String username = claims.get("username", String.class);
        String userId = claims.get("userId", String.class);
//        String userId = claims.getSubject();
        userDetails.add(userId);
        userDetails.add(username);
        return userDetails;
    }
}
