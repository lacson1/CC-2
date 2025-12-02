import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  continuous?: boolean;
  language?: string;
  className?: string;
}

export function VoiceInput({
  onTranscript,
  continuous = false,
  language = 'en-US',
  className = ''
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);

      if (final) {
        onTranscript(final.trim());
        setInterimTranscript('');
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      let errorMessage = 'Speech recognition error';
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please check your device.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your connection.';
          break;
      }

      toast({
        title: 'Voice Input Error',
        description: errorMessage,
        variant: 'destructive'
      });
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [continuous, language, onTranscript, toast]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
        toast({
          title: 'Failed to start voice input',
          description: 'Please try again',
          variant: 'destructive'
        });
      }
    }
  };

  if (!isSupported) {
    return (
      <Badge variant="outline" className="text-xs">
        Voice input not supported
      </Badge>
    );
  }

  return (
    <div className={className}>
      <Button
        type="button"
        variant={isListening ? 'destructive' : 'outline'}
        size="sm"
        onClick={toggleListening}
        className={isListening ? 'animate-pulse' : ''}
      >
        {isListening ? (
          <>
            <MicOff className="h-4 w-4 mr-2" />
            Stop
          </>
        ) : (
          <>
            <Mic className="h-4 w-4 mr-2" />
            Dictate
          </>
        )}
      </Button>
      
      {interimTranscript && (
        <div className="mt-2 text-sm text-muted-foreground italic flex items-center gap-2">
          <Loader2 className="h-3 w-3 animate-spin" />
          {interimTranscript}
        </div>
      )}
    </div>
  );
}

// Hook for easier integration
export function useVoiceInput(onTranscript: (text: string) => void, options?: {
  continuous?: boolean;
  language?: string;
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  return {
    isListening,
    isSupported,
    VoiceInputButton: () => (
      <VoiceInput
        onTranscript={onTranscript}
        continuous={options?.continuous}
        language={options?.language}
      />
    )
  };
}
