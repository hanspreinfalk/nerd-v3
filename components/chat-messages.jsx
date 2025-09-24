import { motion } from "framer-motion";
import { UserIcon } from "@/components/icons";
import { Markdown } from "@/components/markdown";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Loader } from "./ai-elements/loader";
import { SuggestionButtons } from "./suggestion-buttons";
import { ActivateMicrophone } from "./activate-microphone";
import { Summary } from "./tool-components/summary";

export function ChatMessages({ messages, isLoading, handleTranscription, onSuggestionClick }) {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);

    // Function to parse suggestions, microphone, and add products commands from text
    const parseSuggestions = (text) => {
        const suggestionRegex = /Suggestions:\s*\[([^\]]+)\]/i;
        const microphoneRegex = /StartMicrophone/i;

        const suggestionMatch = text.match(suggestionRegex);
        const microphoneMatch = text.match(microphoneRegex);

        let suggestions = [];
        let showMicrophone = false;
        let cleanedText = text;

        if (suggestionMatch) {
            const suggestionsText = suggestionMatch[1];
            suggestions = suggestionsText.split(';').map(s => s.trim());
            cleanedText = cleanedText.replace(suggestionRegex, '').trim();
        }

        if (microphoneMatch) {
            showMicrophone = true;
            cleanedText = cleanedText.replace(microphoneRegex, '').trim();
        }

        return { suggestions, showMicrophone, cleanedText };
    };

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
            <div className={`flex flex-col gap-4 items-center p-4 ${shouldAddPadding ? 'pb-[5vh]' : 'pb-[5vh]'}`}>
                {messages.map(({ role, parts, id }, messageIndex) => (
                    <motion.div
                        key={id}
                        className={`flex flex-row gap-4 px-4 py-1 w-full md:w-[500px] md:px-0 first-of-type:pt-2`}
                        initial={{ y: 5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                    >
                        <div className="flex flex-col gap-2 w-full">
                            {parts.map((part, index) => {
                                //console.log(part)
                                if (part.type === "text") {
                                    const { suggestions, showMicrophone, cleanedText } = parseSuggestions(part.text);

                                    return (
                                        <div key={index} className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
                                            <div className="flex flex-row gap-3 items-start">
                                                {role === 'assistant' && (
                                                    <div className="shrink-0 mt-2">
                                                        <Image src="/lentes.svg" alt="logo" width={24} height={24} />
                                                    </div>
                                                )}
                                                {role === 'user' && (
                                                    <div className="size-[24px] border rounded-sm p-1 flex flex-col justify-center items-center shrink-0 text-zinc-500">
                                                        <UserIcon />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    {cleanedText && <Markdown>{cleanedText}</Markdown>}
                                                </div>
                                            </div>

                                            {/* Actions section - aligned with message content */}
                                            <div className="ml-9"> {/* ml-9 = gap-3 + icon width (24px) */}
                                                {suggestions.length > 0 && onSuggestionClick && messageIndex === messages.length - 1 && (
                                                    <SuggestionButtons
                                                        suggestions={suggestions}
                                                        onSuggestionClick={onSuggestionClick}
                                                    />
                                                )}
                                                {showMicrophone && handleTranscription && messageIndex === messages.length - 1 && (
                                                    <ActivateMicrophone onTranscription={handleTranscription} />
                                                )}
                                            </div>
                                        </div>
                                    )
                                }
                                else if (part.type === 'tool-getSummary') {
                                    // Only render if output is available
                                    if (part.output && part.state && part.state === 'output-available') {
                                        return (
                                            <div key={index} className="pb-4">
                                                <Summary 
                                                    name={part.input?.name}
                                                    description={part.input?.description}
                                                    hexColors={part.input?.hexColors}
                                                    style={part.input?.style}
                                                />
                                            </div>
                                        )
                                    }
                                    // Show loading state while waiting for output
                                    return (
                                        <div key={index} className="flex flex-row gap-4 items-center">
                                            {role === 'assistant' && (
                                                <Image src="/lentes.svg" alt="logo" width={24} height={24} />
                                            )}
                                            <div className="flex flex-row gap-2 items-center">
                                                <Loader />
                                                <div className="text-zinc-500 italic">
                                                    Getting summary for {part.input?.name || 'to do list'}...
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
