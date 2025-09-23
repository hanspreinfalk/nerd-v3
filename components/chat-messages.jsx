import { motion } from "framer-motion";
import { UserIcon } from "@/components/icons";
import { Markdown } from "@/components/markdown";
import Image from "next/image";
import { useEffect, useRef } from "react";

export function ChatMessages({ messages, isLoading }) {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);

    // Determine if we should add padding:
    // - Add padding if last message is from user
    // - Keep padding while AI is responding (isLoading = true)
    // - Only remove padding when AI has finished AND last message is from assistant
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    const shouldAddPadding = lastMessage?.role === "user" || isLoading;

    const scrollToBottom = (behavior = "smooth") => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior
            });
        }
    };


    useEffect(() => {
        // Only scroll when:
        // 1. User sends a message (new message added and not loading)
        // 2. AI finishes responding (was loading, now not loading)
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];

            // Scroll when user sends message or AI finishes
            if (lastMessage.role === "user" || (!isLoading && lastMessage.role === "assistant")) {
                const timeoutId = setTimeout(() => {
                    scrollToBottom();
                }, 200);

                return () => clearTimeout(timeoutId);
            }
        }
    }, [messages, isLoading]);

    // Additional effect to handle padding changes
    useEffect(() => {
        if (messages.length > 0 && !isLoading) {
            // Only scroll after padding changes when not loading
            const timeoutId = setTimeout(() => {
                scrollToBottom();
            }, 50);

            return () => clearTimeout(timeoutId);
        }
    }, [shouldAddPadding]);


    return (
        <div ref={containerRef} className="flex-1 overflow-y-auto">
            <div className={`flex flex-col gap-4 items-center p-4 ${shouldAddPadding ? '' : ''}`}>
                {messages.map(({ role, parts, id, toolInvocations }) => (
                    <motion.div
                        key={id}
                        className={`flex flex-row gap-4 px-4 py-1 w-full md:w-[500px] md:px-0 first-of-type:pt-2`}
                        initial={{ y: 5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        <div className="size-[24px] border rounded-sm p-1 flex flex-col justify-center items-center shrink-0 text-zinc-500">
                            {role === "assistant" ? (
                                <Image src="/lentes.svg" alt="logo" width={24} height={24} />
                            ) : (
                                <UserIcon />
                            )}
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            {parts.map((part, index) => (
                                part.type === "text" && (
                                    <div
                                        key={index}
                                        className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4"
                                    >
                                        <Markdown>{part.text}</Markdown>
                                    </div>
                                )
                            ))}

                            {toolInvocations && (
                                <div>
                                    {toolInvocations.map((toolInvocation, index) => {
                                        const { toolName, toolCallId, state } = toolInvocation;
                                        <div key={index}>
                                            <Markdown>{toolName}</Markdown>
                                        </div>
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
