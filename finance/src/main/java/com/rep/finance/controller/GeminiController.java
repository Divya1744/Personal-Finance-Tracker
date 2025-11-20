package com.rep.finance.controller;

import com.rep.finance.service.FinanceGeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/finance-ai")
public class GeminiController {

    private final FinanceGeminiService financeGeminiService;

    @PostMapping("/ask")
    public String ask(@RequestBody String question, @RequestParam String userId){ // <-- **Changed Long to String**
        return financeGeminiService.getFinancialAdvice(userId, question);
    }
}