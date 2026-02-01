import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VoiceConsultationProps {
  onTranscriptUpdate?: (transcript: string) => void;
}

export function VoiceConsultation({ onTranscriptUpdate }: VoiceConsultationProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + transcriptSegment + ' ');
            onTranscriptUpdate?.(transcript + transcriptSegment + ' ');
          } else {
            interimTranscript += transcriptSegment;
          }
        }
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setError(null);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const clearTranscript = () => setTranscript('');

  const downloadTranscript = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(transcript));
    element.setAttribute('download', `consultation-${new Date().getTime()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Voice-First Consultation</CardTitle>
        <CardDescription>Speak your symptoms and concerns naturally</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? 'destructive' : 'default'}
            className="flex-1"
            size="lg"
          >
            {isListening ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Start Listening
              </>
            )}
          </Button>
          <Button
            onClick={() => speak(transcript || 'No transcript yet')}
            variant="outline"
            disabled={isSpeaking}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg min-h-24 max-h-48 overflow-y-auto">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {transcript || 'Your transcribed speech will appear here...'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={clearTranscript} variant="outline" className="flex-1">
            Clear
          </Button>
          <Button onClick={() => navigator.clipboard.writeText(transcript)} variant="outline">
            <Copy className="h-4 w-4" />
          </Button>
          <Button onClick={downloadTranscript} variant="outline">
            <Download className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          <p>✓ Real-time speech recognition</p>
          <p>✓ Copy & download transcripts</p>
          <p>✓ Text-to-speech feedback</p>
        </div>
      </CardContent>
    </Card>
  );
}
