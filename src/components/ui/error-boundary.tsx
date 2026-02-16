import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    name?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`Uncaught error in ${this.props.name || 'component'}:`, error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Card className="border-red-200 bg-red-50 shadow-md my-4">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-red-700 flex items-center gap-2 text-lg">
                            <AlertCircle className="w-5 h-5" />
                            Component Error ({this.props.name || 'Unknown'})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-red-600 mb-4">
                            Something went wrong while loading this section. This might be due to a 3D graphics error or connection issue.
                        </p>
                        <div className="bg-white/50 p-2 rounded text-xs font-mono text-red-800 mb-4 overflow-auto max-h-20">
                            {this.state.error?.message}
                        </div>
                        <Button
                            variant="outline"
                            className="border-red-200 hover:bg-red-100 text-red-700"
                            onClick={() => this.setState({ hasError: false, error: null })}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            );
        }

        return this.props.children;
    }
}
