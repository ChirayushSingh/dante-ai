import { useState } from "react";
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
  Lock
} from "lucide-react";
import { toast } from "sonner";

const mockKeys = [
  {
    id: "1",
    name: "Production Key",
    key: "dd_prod_sk_1234567890abcdef",
    created: "Jan 10, 2026",
    lastUsed: "2 hours ago",
    requests: 1247,
  },
  {
    id: "2",
    name: "Development Key",
    key: "dd_dev_sk_0987654321fedcba",
    created: "Jan 5, 2026",
    lastUsed: "1 day ago",
    requests: 89,
  },
];

const ApiKeys = () => {
  const [showKey, setShowKey] = useState<string | null>(null);

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const maskKey = (key: string) => {
    return key.slice(0, 10) + "••••••••••••••••";
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
              Manage your API keys for programmatic access
            </p>
          </div>
          <Button variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Key
          </Button>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
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
          {mockKeys.map((apiKey, index) => (
            <motion.div
              key={apiKey.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-card rounded-xl border border-border p-5 shadow-soft"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{apiKey.name}</h3>
                    <p className="text-xs text-muted-foreground">Created {apiKey.created}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-muted rounded-lg p-3 mb-4">
                <code className="flex-1 text-sm font-mono">
                  {showKey === apiKey.id ? apiKey.key : maskKey(apiKey.key)}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                >
                  {showKey === apiKey.id ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyKey(apiKey.key)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>Last used: {apiKey.lastUsed}</span>
                <span>{apiKey.requests.toLocaleString()} requests</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Usage Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card rounded-2xl border border-border p-6 shadow-soft"
        >
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">Usage Limits</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">API Requests (this month)</span>
                <span className="font-medium">1,336 / 10,000</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "13.36%" }} />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Need more requests? <a href="#" className="text-primary hover:underline">Upgrade to Enterprise</a> for custom rate limits.
            </p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ApiKeys;
