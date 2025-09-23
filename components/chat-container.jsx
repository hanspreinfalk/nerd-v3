'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { ChatMessages } from './chat-messages';
import { MessageInput } from './message-input';

export function ChatContainer() {
    const [input, setInput] = useState('');
    const { messages, sendMessage, isLoading } = useChat();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-[calc(100dvh-4rem)] bg-background">
            {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 pb-8">
                    <p className="text-white text-4xl sm:text-5xl">¿Qué quieres crear?</p>
                    <div className="w-full">
                        <MessageInput
                            input={input}
                            setInput={setInput}
                            handleSubmit={handleSubmit}
                        />
                    </div>
                </div>
            ) : (
                <>
                    <ChatMessages messages={messages} isLoading={isLoading} />
                    <MessageInput
                        input={input}
                        setInput={setInput}
                        handleSubmit={handleSubmit}
                    />
                </>
            )}
        </div>
    );
}
