package com.json_editor.demo;

import org.springframework.web.bind.annotation.*;
import okhttp3.*;
import okhttp3.RequestBody;

import java.io.IOException;

@RestController
@RequestMapping("/api/chatgpt")
@CrossOrigin("*")
public class ChatGptController {

    private static final String OPENAI_API_KEY = "YOUR_API_KEY_HERE";  // Replace with your actual API key
    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private OkHttpClient client = new OkHttpClient();

    @PostMapping("/suggestions")
    public String getSuggestions(@org.springframework.web.bind.annotation.RequestBody String code) throws IOException {
        // Build the request body with the correct format
        String jsonRequest = buildJsonRequest(code);

        // Set the request body
        MediaType mediaType = MediaType.get("application/json");
        RequestBody body = RequestBody.create(mediaType, jsonRequest);

        // Build the request
        Request request = new Request.Builder()
                .url(OPENAI_API_URL)
                .addHeader("Authorization", "Bearer " + OPENAI_API_KEY)
                .post(body)
                .build();

        // Execute the request and handle the response
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }
            String responseBody = response.body().string();
            System.out.println("ChatGPT Response: " + responseBody);  // Log response
            return responseBody;
        } catch (IOException e) {
            e.printStackTrace();
            throw new IOException("Error communicating with OpenAI API: " + e.getMessage());
        }
    }

    // Helper method to build the correct request body format
    private String buildJsonRequest(String code) {
        // Here, you should format the request JSON correctly for OpenAI
        // OpenAI's chat API expects a 'messages' array and a 'model' field
        return "{\n" +
                "  \"model\": \"gpt-3.5-turbo\",\n" +
                "  \"messages\": [\n" +
                "    {\"role\": \"user\", \"content\": \"" + escapeJson(code) + "\"}\n" +
                "  ]\n" +
                "}";
    }

    // Helper method to escape the JSON content properly to avoid syntax issues
    private String escapeJson(String code) {
        // This is just a simple escape for double quotes in the JSON string
        return code.replace("\"", "\\\"");
    }
}
