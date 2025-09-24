import { Button } from "@/components/ui/button";

export function SuggestionButtons({ suggestions, onSuggestionClick }) {
    if (!suggestions || suggestions.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
                <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onSuggestionClick(suggestion.trim())}
                    className="text-sm"
                >
                    {suggestion.trim()}
                </Button>
            ))}
        </div>
    );
}
