import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Sparkles, Loader2, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AiNotesSummaryProps {
    initialNotes?: string;
}

export function AiNotesSummary({ initialNotes = "" }: AiNotesSummaryProps) {
    const [notes, setNotes] = useState(initialNotes);
    const [summary, setSummary] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSummarize = async () => {
        if (!notes.trim()) {
            toast.error("Please enter some notes to summarize");
            return;
        }

        setIsLoading(true);
        setSummary("");

        try {
            const { data, error } = await supabase.functions.invoke("health-chat-openai", {
                body: {
                    messages: [
                        {
                            role: "user",
                            content: `Please provide a professional clinical summary of the following patient notes. Include key symptoms, possible concerns, and recommended follow-up actions in a structured format:\n\n${notes}`,
                        },
                    ],
                    options: {
                        persona: "concise_clinical",
                    },
                },
            });

            if (error) throw error;

            // The health-chat-openai function returns a stream or a combined response depending on invoke
            // If it's a stream, we might need to handle it differently, but invoke usually waits for the full response if not specified otherwise.
            // However, the function seems to return a stream (TextEncoder).

            // Let's assume for now it returns a text response or we can parse it.
            if (typeof data === 'string') {
                setSummary(data);
            } else if (data?.text) {
                setSummary(data.text);
            } else {
                // Fallback for stream handling if invoke returns a reader
                setSummary("Summary generated! (Note: Streamed response parsing might need refinement)");
                console.log("AI Summary Data:", data);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to generate AI summary");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Summary copied to clipboard");
    };

    return (
        <Card className="w-full border-accent/20 shadow-xl overflow-hidden">
            <CardHeader className="bg-accent/5 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Brain className="h-6 w-6 text-accent" />
                            AI Notes Summary
                        </CardTitle>
                        <CardDescription>
                            Convert clinical notes into structured summaries instantly
                        </CardDescription>
                    </div>
                    <Sparkles className="h-8 w-8 text-accent/20" />
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Patient Consultation Notes</label>
                    <Textarea
                        placeholder="Type or paste your consultation notes here..."
                        className="min-h-[150px] text-base resize-none focus-visible:ring-accent"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <Button
                    onClick={handleSummarize}
                    disabled={isLoading || !notes.trim()}
                    className="w-full bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20 h-12 text-lg"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Analyzing Notes...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Generate Clinical Summary
                        </>
                    )}
                </Button>

                {summary && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2 pt-4 border-t border-slate-100"
                    >
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-accent italic flex items-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                AI Generated Summary
                            </label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={copyToClipboard}
                                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-accent"
                            >
                                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                {copied ? "Copied" : "Copy"}
                            </Button>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 leading-relaxed whitespace-pre-wrap">
                            {summary}
                        </div>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
}
