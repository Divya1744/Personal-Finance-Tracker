package com.rep.finance.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GeminiService {
    private final Client client;

       public GenerateContentResponse ask(String prompt){
            return client.models.generateContent(
                    "gemini-2.5-flash",
                    prompt,
                    null);
        }
    }

