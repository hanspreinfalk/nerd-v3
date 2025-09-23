'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
                            ¿Qué quieres crear?
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
                                input={input}
                                setInput={setInput}
                                handleSubmit={handleSubmit}
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
                        <ChatMessages messages={messages} isLoading={isLoading} />
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                transition: { duration: 0.4, delay: 0.2, ease: "easeOut" }
                            }}
                        >
                            <MessageInput
                                input={input}
                                setInput={setInput}
                                handleSubmit={handleSubmit}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
