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
});

const tools = {
    displayWeather: weatherTool,
};

export async function POST(request) {
    const { messages } = await request.json();

    const result = streamText({
        // model: openrouter('x-ai/grok-4-fast:free'),
        model: openrouter('google/gemini-2.5-flash'),
        system: `
            - keep your responses limited to a sentence.
            - DO NOT output lists.
            - after every tool call, pretend you're showing the result to the user and keep your response limited to a phrase.
            - today's date is ${new Date().toLocaleDateString()}.
            - ask follow up questions to nudge user into the optimal flow
            - ask for any details you don't know'
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