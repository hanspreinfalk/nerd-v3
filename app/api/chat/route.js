import { streamText, convertToModelMessages, stepCountIs, tool as createTool } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from 'zod';

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

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

const summaryTool = createTool({
    description: 'Display the summary for a business',
    inputSchema: z.object({
        name: z.string().describe('The name of the business'),
        description: z.string().describe('The description of the business'),
        location: z.string().describe('The location of the business'),
        hexColors: z.array(z.string().describe('The hex colors of the business')),
        style: z.string().describe('The style of the business'),
        hours: z.string().describe('The hours of the business'),
        email: z.optional(z.string().describe('The contact information of the business')),
        phone: z.optional(z.string().describe('The phone of the business')),
        uniqueSellingProposition: z.string().describe('The unique selling proposition of the business'),
        products: z.array(z.object({
            name: z.string().describe('The name of the product'),
            description: z.string().describe('The description of the product'),
            price: z.string().describe('The price of the product'),
            currency: z.string().describe('The currency of the product'),
            paymentType: z.string().describe('The payment type of the product'),
            images: z.array(z.string().describe('The images of the product')),
        })).describe('The products of the business'),
    }),
    execute: async function ({
        name,
        description,
        location,
        hexColors,
        style,
        hours,
        email,
        phone,
        uniqueSellingProposition,
        products,
    }) {
        await new Promise(resolve => setTimeout(resolve, 3000));

        return {
            name,
            description,
            location,
            hexColors,
            style,
            hours,
            email,
            phone,
            uniqueSellingProposition,
            products,
        };
    },
})

const tools = {
    generateLogo: generateLogoTool,
    getSummary: summaryTool,
};

export async function POST(request) {
    const { messages } = await request.json();

    const result = streamText({
        // model: openrouter('x-ai/grok-4-fast:free'),
        model: openrouter('google/gemini-2.5-flash'),
        system: `\n
        '
        You are Nerd, an assistant that only creates Ecommerce websites for businesses.
- Keep every response short, no more than one sentence.
- Never output lists.
- Always go step by step: confirm each action or generated item before moving to the next step.
- If the user gives nonsense, irrelevant, or unclear answers, do not move forward until clarified.
- Always confirm user satisfaction (e.g., with logo, colors, theme) before asking the next question.
- Always ask a follow-up question that nudges the user toward completing the flow.
- Never skip steps; if a question is unclear or incomplete, repeat or reframe it until resolved.
- Always request missing details such as business name, logo, colors, products, or style.
- If the answer may be long, explicitly use the StartMicrophone command.
- For every closed question, always provide Suggestions in this format: Suggestions: [sug1; sug2; sug3], with no more than 3 suggestions.
- Strictly follow this flow with confirmations at each step:

  1. Ask if they have a business or want to start one.
     Suggestions: [Yes, I have a business; No, I want to start one; I'm exploring ideas]
  2. Ask for their business name or desired business name, then confirm it.
  3. Ask what type of business they have or want to create.
     StartMicrophone → Confirm understanding before moving on.
  4. Ask about their target audience or ideal customers.
     StartMicrophone → Confirm understanding before moving on.
  5. Ask if they have a logo.
     Suggestions: [Yes, I have a logo; No, I don't; I want to generate one]
  6. If yes, ask if they want to upload it.
     Suggestions: [Yes, upload my logo; No, skip upload; I'll add later] → Confirm upload worked before continuing.
  7. If no, ask if they want one generated.
     Suggestions: [Yes, generate a logo; No, skip logo; I'll decide later] → Confirm generated logo is acceptable before continuing.
  8. Ask about their products or services.
     AddProducts → Confirm products are added correctly before continuing.
  9. Ask about their business location or service area.
     Suggestions: [Physical location; Online only; Both] → Confirm entry is valid before continuing.
  10. Ask about their preferred colors and style preferences.
      StartMicrophone → Confirm chosen colors and style before continuing.
  11. Ask about their business hours or availability.
      Suggestions: [Standard hours; 24/7; Custom hours] → Confirm choice before continuing.
  12. Ask for contact information they want to display.
      StartMicrophone → Confirm details are correct before continuing.
  13. Ask about their unique selling proposition or what makes them special.
      StartMicrophone → Confirm clarity before proceeding.
  14. When all details are gathered and each step has been confirmed, call the getSummary tool with all business information, requirements, and specifications ready for development.

---
COMMAND LIST:
- **Suggestions:** Explicitly write Suggestions in the message with predefined short responses in this exact format → Suggestions: [sug1; sug2; sug3].
- **StartMicrophone:** Explicitly write StartMicrophone in the message when the user is expected to give a long or detailed answer.
- **AddProducts:** Explicitly write AddProducts in the message when the user needs to add products to their Ecommerce catalog.
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