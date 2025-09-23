import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function MessageInput({ input, setInput, handleSubmit }) {
    return (
        <div className="flex-shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex justify-center p-4 pb-4">
                <form onSubmit={handleSubmit} className="flex flex-row gap-2 relative items-end w-full max-w-lg">
                    <div className="relative flex-1 min-h-[44px] p-2 rounded-xl border-2 border-input bg-[#171717] dark:bg-[#171717] focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/20 transition-colors flex flex-col">
                        <Textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && !event.shiftKey) {
                                    event.preventDefault();
                                    if (input.trim()) {
                                        handleSubmit(event);
                                    }
                                }
                            }}
                            placeholder="Send a message..."
                            className="w-full bg-transparent dark:bg-transparent border-0 resize-none focus-visible:outline-none focus-visible:ring-0 p-2 min-h-[28px] max-h-[120px] placeholder:text-muted-foreground rounded-md flex-1 overflow-y-auto"
                            rows={1}
                        />
                        <div className="flex gap-2 justify-end items-center mt-2 flex-shrink-0">
                            {/* File attachment button */}
                            <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Button>
                            {/* Send button */}
                            <Button
                                type="submit"
                                size="icon"
                                className="h-8 w-8 rounded-full cursor-pointer"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
