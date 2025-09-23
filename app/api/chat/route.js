import { streamText, convertToModelMessages, stepCountIs } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(request) {
    const { messages } = await request.json();

    const result = streamText({
        model: openrouter('x-ai/grok-4-fast:free'),
        system: 'You are a helpful assistant! Never answer long answers, always be concise and to the point.',
        messages: convertToModelMessages(messages),
        stopWhen: stepCountIs(5),
        onError: (error) => {
            console.error(error);
        },
    });

    return result.toUIMessageStreamResponse();
}