import { useState, useCallback, useEffect } from 'react';

export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const synth = window.speechSynthesis;

    useEffect(() => {
        if (!synth) {
            setIsSupported(false);
        }
    }, [synth]);

    const speak = useCallback((text: string) => {
        if (!isSupported || !synth) return;

        // Cancel current speech
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        // Select a pleasant voice if available
        // Prefer "Google US English", "Samantha", or "Microsoft Zira"
        const voices = synth.getVoices();
        const preferredVoice = voices.find(v =>
            v.name.includes("Google US English") ||
            v.name.includes("Samantha") ||
            v.name.includes("Zira")
        );

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        // Adjust rate and pitch for a more natural feel
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        synth.speak(utterance);
    }, [isSupported, synth]);

    const stop = useCallback(() => {
        if (synth) {
            synth.cancel();
            setIsSpeaking(false);
        }
    }, [synth]);

    return { speak, stop, isSpeaking, isSupported };
};
