import { streamText, convertToModelMessages, stepCountIs, tool as createTool } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from 'zod';

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

const summaryTool = createTool({
    description: 'Display the complete todo list summary and structure',
    inputSchema: z.object({
        projectName: z.string().describe('The name of the todo project or list'),
        description: z.string().describe('The description of the project'),
        hexColors: z.array(z.string().describe('The hex colors for the todo theme')),
        style: z.string().describe('The visual style preference'),
    }),
    execute: async function ({
        projectName,
        description,
        hexColors,
        style,
    }) {
        await new Promise(resolve => setTimeout(resolve, 3000));

        return {
            projectName,
            description,
            hexColors,
            style,
        };
    },
})

const tools = {
    getSummary: summaryTool,
};

export async function POST(request) {
    const { messages } = await request.json();

    const result = streamText({
        // model: openrouter('x-ai/grok-4-fast:free'),
        model: openrouter('google/gemini-2.5-flash'),
        system: `
You are TaskMaster, an assistant that efficiently gathers information to create todo project summaries.

GOAL: Collect the 4 required pieces of information to call the getSummary tool:
1. projectName (string)
2. description (string) 
3. hexColors (array of strings)
4. style (string)

BEHAVIOR RULES:
- Keep responses to one sentence maximum
- Never output lists or lengthy explanations
- Always confirm each piece of information before moving to the next
- If answers are unclear, ask for clarification before proceeding
- Provide 3 suggestions for closed questions in format: Suggestions: [opt1; opt2; opt3]
- Use StartMicrophone for expected long answers

STREAMLINED FLOW:
1. Ask for project/todo list name
2. Ask them to describe what this project is about and its main purpose
   StartMicrophone
3. Ask for preferred visual style
   Suggestions: [sug1; sug2; sug3]
4. Ask for color preferences for the theme
   Suggestions: [sug1; sug2; sug3]
5. Once all 4 pieces are confirmed, immediately call getSummary tool

PROHIBITED:
- Is strictly prohibited to call getSummary tool if the user has not provided all 4 pieces of information

COMMANDS:
- **Suggestions:** Use exact format → Suggestions: [opt1; opt2; opt3]
- **StartMicrophone:** Write when expecting detailed responses

Focus on efficiently gathering the summary tool parameters, not extensive todo management features.
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