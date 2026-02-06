import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RotateCcw,
  AlertCircle,
  Lock,
  CheckCircle,
  Code,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface ApiKey {
  id: string;
  key_name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  requests_count: number;
  is_active: boolean;
}

const ApiKeys = () => {
  const { user } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchKeys();
    }
  }, [user]);

  const fetchKeys = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setKeys(data);
    }
    setIsLoading(false);
  };

  const createKey = async () => {
    if (!user || !newKeyName.trim()) return;

    setIsCreating(true);

    // Generate a random key
    const keyValue = `aura_${crypto.randomUUID().replace(/-/g, '')}`;
    const keyPrefix = keyValue.slice(0, 12);

    // In production, you would hash the key before storing
    const { error } = await supabase.from("api_keys").insert({
      user_id: user.id,
      key_name: newKeyName.trim(),
      key_hash: keyValue, // In production, hash this
      key_prefix: keyPrefix,
    });

    if (!error) {
      setNewlyCreatedKey(keyValue);
      setNewKeyName("");
      fetchKeys();
      toast.success("API key created successfully!");
    } else {
      toast.error("Failed to create API key");
    }

    setIsCreating(false);
  };

  const deleteKey = async (id: string) => {
    const { error } = await supabase
      .from("api_keys")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchKeys();
      toast.success("API key deleted");
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const maskKey = (prefix: string) => {
    return prefix + "••••••••••••••••••••";
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">API Keys</h1>
            <p className="text-muted-foreground">
              Manage your API keys for access to Diagnova AI services.
            </p>
          </div>
        </motion.div>

        {/* Create New Key */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Create New API Key
          </h3>
          <div className="flex gap-3">
            <Input
              placeholder="Key name (e.g., Production, Development)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={createKey}
              disabled={!newKeyName.trim() || isCreating}
              className="gap-2"
            >
              <Key className="h-4 w-4" />
              Create Key
            </Button>
          </div>
        </motion.div>

        {/* Newly Created Key */}
        {newlyCreatedKey && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-success/10 border border-success/20 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-foreground mb-2">API Key Created Successfully!</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Copy this key now. You won't be able to see it again.
                </p>
                <div className="flex items-center gap-2 bg-background rounded-lg p-3">
                  <code className="flex-1 text-sm font-mono break-all">{newlyCreatedKey}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      copyKey(newlyCreatedKey);
                      setNewlyCreatedKey(null);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground mb-1">Keep your API keys secure</p>
            <p className="text-sm text-muted-foreground">
              Never share your API keys or expose them in client-side code.
              Rotate keys immediately if you suspect they've been compromised.
            </p>
          </div>
        </motion.div>

        {/* API Keys List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : keys.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No API keys yet</p>
              <p className="text-sm mt-1">Create your first API key to get started</p>
            </div>
          ) : (
            keys.map((apiKey, index) => (
              <motion.div
                key={apiKey.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card rounded-xl border border-border p-5 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <Key className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{apiKey.key_name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Created {format(new Date(apiKey.created_at), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteKey(apiKey.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-muted rounded-lg p-3 mb-4">
                  <code className="flex-1 text-sm font-mono">
                    {maskKey(apiKey.key_prefix)}
                  </code>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>
                    Last used: {apiKey.last_used_at
                      ? format(new Date(apiKey.last_used_at), "MMM dd, yyyy")
                      : "Never"}
                  </span>
                  <span>{apiKey.requests_count.toLocaleString()} requests</span>
                  <span className={`flex items-center gap-1 ${apiKey.is_active ? 'text-success' : 'text-muted-foreground'}`}>
                    <div className={`w-2 h-2 rounded-full ${apiKey.is_active ? 'bg-success' : 'bg-muted-foreground'}`} />
                    {apiKey.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* API Documentation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">Quick Start</h2>
          </div>

          <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-muted-foreground">
              {`curl -X POST https://api.auraaid.ai/v1/symptom-check \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"symptoms": ["headache", "fever", "fatigue"]}'`}
            </pre>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Need more help? Check out our <a href="#" className="text-primary hover:underline">API documentation</a> for
            detailed endpoints, examples, and SDKs.
          </p>
        </motion.div>

        {/* Usage Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">Usage Limits</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">API Requests (this month)</span>
                <span className="font-medium">0 / 1,000</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: "0%" }} />
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Need more requests? <a href="/dashboard/billing" className="text-primary hover:underline">Upgrade to Enterprise</a> for
              custom rate limits and dedicated support.
            </p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ApiKeys;
