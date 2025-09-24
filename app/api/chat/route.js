import { streamText, convertToModelMessages, stepCountIs, tool as createTool } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from 'zod';

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

const weatherTool = createTool({
    description: 'Display the weather for a location',
    inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
    }),
    execute: async function ({ location }) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Random weather conditions
        const weatherConditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Overcast', 'Snowy', 'Drizzle'];
        const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

        // Random temperature between 15-85°F based on weather condition
        let tempRange;
        switch (randomWeather) {
            case 'Sunny':
                tempRange = [70, 85];
                break;
            case 'Snowy':
                tempRange = [15, 35];
                break;
            case 'Rainy':
            case 'Drizzle':
                tempRange = [45, 65];
                break;
            case 'Cloudy':
            case 'Overcast':
                tempRange = [50, 70];
                break;
            case 'Partly Cloudy':
                tempRange = [60, 80];
                break;
            default:
                tempRange = [50, 75];
        }

        const randomTemp = Math.floor(Math.random() * (tempRange[1] - tempRange[0] + 1)) + tempRange[0];

        return { weather: randomWeather, temperature: randomTemp, location };
    },
})

const generateLogoTool = createTool({
    description: 'Generate a logo using AI based on business information',
    inputSchema: z.object({
        businessName: z.string().describe('The name of the business'),
        businessType: z.string().describe('The type of business or what it offers'),
        businessDescription: z.string().describe('A description of what the business does'),
    }),
    execute: async function ({ businessName, businessType, businessDescription }) {
        // Create a prompt for DALL-E or similar image generation API
        const prompt = `Create a modern, professional logo for a business called "${businessName}". The business is a ${businessType} that ${businessDescription}. The logo should be clean, memorable, and suitable for digital and print use. Style: minimalist, professional, vector-style logo on transparent background.`;

        try {
            // Check if OpenAI API key is available
            if (!process.env.OPENAI_API_KEY) {
                // Fallback: Use a placeholder image service for demonstration
                const placeholderUrl = `https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=${encodeURIComponent(businessName)}`;

                return {
                    businessName,
                    businessType,
                    businessDescription,
                    imageUrl: placeholderUrl,
                    prompt,
                    success: true,
                    isPlaceholder: true,
                };
            }

            // Use OpenAI DALL-E 3 directly for image generation
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'dall-e-3',
                    prompt: prompt,
                    n: 1,
                    size: '1024x1024',
                    quality: 'standard',
                    style: 'natural'
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('OpenAI API Error:', response.status, errorData);
                throw new Error(`OpenAI API request failed: ${response.status} - ${errorData}`);
            }

            const data = await response.json();
            const imageUrl = data.data[0].url;

            return {
                businessName,
                businessType,
                businessDescription,
                imageUrl,
                prompt,
                success: true,
            };
        } catch (error) {
            console.error('Logo generation failed:', error);
            return {
                businessName,
                businessType,
                businessDescription,
                error: 'Failed to generate logo. Please try again.',
                success: false,
            };
        }
    },
});

const tools = {
    generateLogo: generateLogoTool,
    displayWeather: weatherTool,
};

export async function POST(request) {
    const { messages } = await request.json();

    const result = streamText({
        // model: openrouter('x-ai/grok-4-fast:free'),
        model: openrouter('google/gemini-2.5-flash'),
        system: `\n
        '
        You are an assistant that helps users create a complete website for their business.
- Keep every response short, no more than one sentence.
- Never output lists.
- After each tool call, act as if you are showing the result with only a short phrase.
- Today’s date is ${new Date().toLocaleDateString()}.  
- Always ask a follow-up question that nudges the user toward completing the flow.  
- Never skip steps; if a question is unclear or incomplete, repeat or reframe it until resolved.  
- Always request missing details such as business name, logo, colors, products, or style.  
- If the answer may be long, suggest using the microphone.  
- For every closed question, always provide next prompt suggestions in this format: Suggestions: [sug1; sug2; sug3], no more than 3 suggestions.  
- Strictly follow this flow:  
  1. Ask if they have a business.  
     Suggestions: [Yes, I have a business; No, I don’t; I want to start one]  
  2. Ask for the business name.  
  3. Ask for the type of business or what they offer (suggest microphone if long).  
  4. Ask if they have a logo.  
     Suggestions: [Yes, I have a logo; No, I don’t; I want to generate one]  
  5. If yes, ask if they want to upload it.  
     Suggestions: [Yes, upload my logo; No, skip upload; I’ll add later]  
  6. If no, ask if they want one generated.  
     Suggestions: [Yes, generate a logo; No, skip logo; I’ll decide later]  
  7. Ask for the product or service catalog.  
  8. Ask about preferred colors and style.  
  9. Ask what pages they want.  
     Suggestions: [Home; About; Contact; Shop]  
  10. When all details are gathered, generate the full website in HTML.     
        '
      `,
        messages: convertToModelMessages(messages),
        stopWhen: stepCountIs(5),
        onError: (error) => {
            console.error(error);
        },
        tools,
    });

    return result.toUIMessageStreamResponse();
}