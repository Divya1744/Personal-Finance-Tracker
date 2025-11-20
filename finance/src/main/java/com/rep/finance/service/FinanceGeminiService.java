package com.rep.finance.service;

import com.rep.finance.service.GeminiService;
import com.google.genai.types.GenerateContentResponse;
import com.rep.finance.model.TransactionEntity;
import com.rep.finance.model.BudgetEntity;
import com.rep.finance.repository.TransactionRepository;
import com.rep.finance.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class FinanceGeminiService {

    private final GeminiService geminiService;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;

    public String getFinancialAdvice(String userId, String question) { // <-- **Changed Long to String**
        LocalDateTime startDateTime = LocalDateTime.now().minusDays(30);

        List<TransactionEntity> transactions = transactionRepository
                .findByUser_IdAndTimestampAfter(userId, startDateTime); // <-- **Pass String userId directly**

        BudgetEntity budget = budgetRepository.findByUser_Id(userId);

        StringBuilder prompt = new StringBuilder();
        prompt.append("""
you are a smart financial assistant
IMPORTANT SYSTEM RULES:
You are a financial assistant ONLY. 
You ONLY answer questions about:
- budgeting
- savings
- expenses
- income
- financial advice
- spending habits
- investments (basic)
- expense analysis
- money management
- user's financial data

You MUST refuse all questions unrelated to finance.

If the user asks something unrelated (e.g., coding, React, Java, personal life, movies, tech),
you MUST reply with:

"I'm here only to help with your finances, budgets, expenses, and money management."

Never break these rules.
""");
        prompt.append("User transactions for the last 30 days:\n");

        if (transactions.isEmpty()) {
            prompt.append("No transactions recorded.\n");
        } else {
            for (TransactionEntity t : transactions) {
                prompt.append("- ")
                        .append(t.getTimestamp())
                        .append(" | ")
                        .append(t.getCategory())
                        .append(" | ₹")
                        .append(t.getAmount())
                        .append(" | Note: ")
                        .append(t.getNote() != null ? t.getNote() : "N/A")
                        .append("\n");
            }
        }

        if (budget != null) {
            prompt.append("Total income: ₹").append(budget.getTotalIncome()).append("\n");
            prompt.append("Total expenses: ₹").append(budget.getTotalExpense()).append("\n");
            prompt.append("Remaining budget: ₹").append(budget.getRemainingBudget()).append("\n");
        }

        prompt.append("\nUser question: ").append(question).append("\n");
        prompt.append("Answer in a clear, concise, and friendly way.");

        GenerateContentResponse response = geminiService.ask(prompt.toString());
        return response.text();
    }
}
