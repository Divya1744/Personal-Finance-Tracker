package com.rep.finance.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.rep.finance.dto.OCRTransactionListDTO;
import com.rep.finance.dto.TransactionOCRRequest;
import com.rep.finance.model.Category;
import com.rep.finance.model.TransactionEntity;
import com.rep.finance.service.TransactionService;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.net.http.*;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/ocr")
@RequiredArgsConstructor
public class OcrController {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    private final TransactionService transactionService;
    private final ObjectMapper mapper = new ObjectMapper();

    @PostMapping(value = "/scan", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> analyzeImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userId") String userId) {

        try {
            // Convert image to Base64
            String base64 = Base64.getEncoder().encodeToString(file.getBytes());

            // Build Gemini Request JSON
            ObjectNode req = mapper.createObjectNode();
            var contents = req.putArray("contents");
            var parts = contents.addObject().putArray("parts");

            var img = parts.addObject().putObject("inlineData");
            img.put("mimeType", file.getContentType());
            img.put("data", base64);

            // STRICT CATEGORY-CONTROLLED PROMPT
            parts.addObject().put("text",
                    """
                    You are an OCR receipt parser with multilingual support.
            
                    TASK:
                    1. Detect the language of the receipt automatically.
                    2. Translate ALL extracted item names, notes, store names, and descriptions to ENGLISH.
                    3. Extract ONLY purchasable items from the receipt.
                    4. ALWAYS output final JSON IN ENGLISH ONLY.
            
                            CATEGORY RULES (IMPORTANT):
                                Classify items strictly into one of:
                                ["FOOD","TRAVEL","EDUCATION","BILLS","SALARY"]
                            
                                Use the following classification logic:
                                - FOOD → edible items, snacks, groceries, drinks, meals.
                                - TRAVEL → fuel, tolls, parking, bus/train/auto fares.
                                - EDUCATION → notebooks, pens, books, stationery, school/college materials.
                                - BILLS → medicines, pharmacy items, cosmetics, household goods, tools,
                                           fertilizers, farming items, electronics, repairs, services, misc shopping.
                                - SALARY → income entries only.
                            
                                If an item does NOT belong to FOOD, TRAVEL, EDUCATION, or SALARY → classify as BILLS.
                                Never classify fertilizers or household items as FOOD.
                                Never default to FOOD unless the item is clearly edible.
                                
                    CRITICAL RULES:
                    1. Return ONLY pure JSON. No markdown, no backticks, no explanation.
                    2. Every transaction MUST use one of these EXACT categories:
                       ["FOOD","TRAVEL","EDUCATION","BILLS","SALARY"]
                    3. If the category is unclear, default to "FOOD".
                    4. Output must follow EXACTLY this structure:
                    
                    {
                      "transactions": [
                        {
                          "amount": 0,
                          "type": "EXPENSE",
                          "category": "FOOD",
                          "note": "",
                          "timestamp": "",
                          "userId": "%s"
                        }
                      ]
                    }
            
                    Ensure all extracted text and notes are translated into ENGLISH before returning JSON.
                    """.formatted(userId)
            );




            // Gemini URL
            String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                    + model + ":generateContent?key=" + apiKey;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(req.toString()))
                    .build();

            HttpResponse<String> res = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            JsonNode root = mapper.readTree(res.body());

            // Safety checks
            if (root.has("error")) {
                return ResponseEntity.badRequest().body(root.get("error").get("message").asText());
            }

            var partsNode = root.path("candidates").path(0).path("content").path("parts");
            if (!partsNode.isArray() || partsNode.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid Gemini response: " + res.body());
            }

            String extracted = partsNode.get(0).get("text").asText();

            // Sanitize JSON
            String cleanJson = extracted
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            // Convert to DTO
            OCRTransactionListDTO dto = mapper.readValue(cleanJson, OCRTransactionListDTO.class);

            List<TransactionEntity> savedList = new ArrayList<>();

            // SAVE INTO DB
            for (TransactionOCRRequest t : dto.getTransactions()) {

                // Ensure category from Gemini is valid
                Category category = safeCategory(t.getCategory());

                TransactionEntity saved = transactionService.addTransaction(
                        userId,
                        t.getAmount(),
                        t.getType(),
                        category,
                        t.getNote()
                );

                savedList.add(saved);
            }

            return ResponseEntity.ok(savedList);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // --- SAFE CATEGORY HANDLER ---
    private Category safeCategory(String raw) {
        try {
            return Category.valueOf(raw.toUpperCase());
        } catch (Exception ignored) {
            return Category.FOOD; // fallback
        }
    }
}
