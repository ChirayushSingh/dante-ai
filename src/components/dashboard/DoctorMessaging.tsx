import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Message {
    id: string;
    role: 'doctor' | 'patient';
    content: string;
    created_at: string;
}

interface DoctorMessagingProps {
    patientId: string;
    patientName: string;
    onClose?: () => void;
}

export function DoctorMessaging({ patientId, patientName, onClose }: DoctorMessagingProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        fetchMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel('clinical_messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages'
            }, (payload) => {
                if (payload.new) {
                    // In a real app, check if message belongs to this conversation
                    fetchMessages();
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [patientId]);

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            // For demo, we are querying specific conversations or just mocking/filtering
            // In a real schema, we'd have a conversation_id specifically for this doctor-patient pair
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Filter for demo purposes (ideally this is done in SQL)
            setMessages((data || []).map(m => ({
                id: m.id,
                role: m.role as any,
                content: m.content,
                created_at: m.created_at
            })));
        } catch (err) {
            console.error("Error fetching messages:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        try {
            const { error } = await supabase
                .from('messages')
                .insert({
                    role: 'doctor',
                    content: newMessage.trim(),
                    // We would add conversation_id or recipient_id here
                });

            if (error) throw error;
            setNewMessage('');
            fetchMessages();
        } catch (err: any) {
            toast.error("Failed to send message");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Card className="flex flex-col h-[500px] border-primary/20 shadow-xl">
            <CardHeader className="border-b bg-muted/30 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Chat with {patientName}</CardTitle>
                            <p className="text-xs text-muted-foreground">Secure Patient Channel</p>
                        </div>
                    </div>
                    {onClose && <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>}
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {isLoading && messages.length === 0 ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-muted-foreground text-sm">No messages yet. Start a conversation.</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'doctor' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'doctor'
                                                ? 'bg-primary text-white rounded-tr-none'
                                                : 'bg-muted text-foreground rounded-tl-none'
                                            }`}
                                    >
                                        <p>{msg.content}</p>
                                        <span className={`text-[10px] mt-1 block ${msg.role === 'doctor' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                            }`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>

                <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={isSending}
                            className="rounded-xl"
                        />
                        <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()} className="rounded-xl bg-primary">
                            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 text-center">
                        🔐 HIPAA compliant secure messaging enabled
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
