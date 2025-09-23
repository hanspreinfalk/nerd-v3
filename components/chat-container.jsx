'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessages } from './chat-messages';
import { MessageInput } from './message-input';
import { lastAssistantMessageIsCompleteWithToolCalls } from 'ai';

export function ChatContainer() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messageInputRef = useRef(null);
    const { messages, sendMessage, stop } = useChat({
        sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
        onFinish: () => {
            setIsLoading(false);
            messageInputRef.current?.focus();
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            setIsLoading(true);
            sendMessage({ text: input });
            setInput('');
        }
    };

    const handleTranscription = (transcript) => {
        setInput(transcript);
    };

    const handleLogoGenerate = async (businessName, businessType, businessDescription) => {
        setIsLoading(true);
        await sendMessage({
            text: `Please generate a logo for my business: ${businessName}, which is a ${businessType}. ${businessDescription}`
        });
    };

    return (
        <div className="flex flex-col h-[calc(100dvh-4rem)] bg-background">
            <AnimatePresence mode="wait">
                {messages.length === 0 ? (
                    <motion.div
                        key="initial-state"
                        className="flex-1 flex flex-col items-center justify-center gap-4 pb-8"
                        initial={{ opacity: 1 }}
                        exit={{
                            opacity: 0,
                            y: -20,
                            transition: { duration: 0.3, ease: "easeInOut" }
                        }}
                    >
                        <motion.p
                            className="text-white text-4xl sm:text-5xl"
                            exit={{
                                y: -30,
                                opacity: 0,
                                transition: { duration: 0.2, ease: "easeInOut" }
                            }}
                        >
                            What do you want to create?
                        </motion.p>
                        <motion.div
                            className="w-full"
                            exit={{
                                y: 20,
                                opacity: 0,
                                transition: { duration: 0.3, delay: 0.1, ease: "easeInOut" }
                            }}
                        >
                            <MessageInput
                                ref={messageInputRef}
                                input={input}
                                setInput={setInput}
                                handleSubmit={handleSubmit}
                                isLoading={isLoading}
                                stop={stop}
                                handleTranscription={handleTranscription}
                            />
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="chat-state"
                        className="flex flex-col h-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.4, ease: "easeOut" }
                        }}
                    >
                        <ChatMessages
                            messages={messages}
                            isLoading={isLoading}
                            handleTranscription={handleTranscription}
                            handleLogoGenerate={handleLogoGenerate}
                        />
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                transition: { duration: 0.4, delay: 0.2, ease: "easeOut" }
                            }}
                        >
                            <MessageInput
                                ref={messageInputRef}
                                input={input}
                                setInput={setInput}
                                handleSubmit={handleSubmit}
                                isLoading={isLoading}
                                stop={stop}
                                handleTranscription={handleTranscription}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
