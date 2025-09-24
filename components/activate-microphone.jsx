import { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button } from './ui/button';
import { Mic, MicOff } from 'lucide-react';

export function ActivateMicrophone({ onTranscription }) {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if (transcript && onTranscription && listening) {
            onTranscription(transcript);
        }
    }, [transcript, onTranscription, listening]);

    const startListening = () => {
        resetTranscript();
        SpeechRecognition.startListening({
            continuous: true,
            language: 'en-US'
        });
    };

    const stopListening = () => {
        SpeechRecognition.stopListening();
    };

    const toggle = () => {
        if (!browserSupportsSpeechRecognition) return;

        if (listening) {
            stopListening();
        } else {
            startListening();
        }
    };

    // if (!browserSupportsSpeechRecognition) {
    //     return null;
    // }

    return (
        <Button
            onClick={toggle}
            type="button"
            variant="outline"
            className="cursor-pointer"
        >
            {listening ? (
                <div className="flex flex-row gap-2 items-center">
                    <p className="text-sm text-red-500">Stop Microphone</p>
                    <MicOff className="w-5 h-5 text-red-500" />
                </div>
            ) : (
                <div className="flex flex-row gap-2 items-center">
                    <p className="text-sm">Start Microphone</p>
                    <Mic className="w-5 h-5 text-gray" />
                </div>
            )}
        </Button>
    );
}