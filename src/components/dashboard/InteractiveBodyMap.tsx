import { AlertCircle } from "lucide-react";

interface InteractiveBodyMapProps {
    onSelectPart: (partId: string) => void;
}

export function InteractiveBodyMap({ onSelectPart }: InteractiveBodyMapProps) {
    return (
        <div className="w-full h-[300px] rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex flex-col items-center justify-center text-white p-6">
            <div className="text-center space-y-4">
                <div className="bg-white/10 p-4 rounded-full inline-block">
                    <AlertCircle className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">3D Map Initializing</h3>
                    <p className="text-sm text-slate-400 max-w-xs mx-auto mt-2">
                        We are currently stabilizing the 3D engine. Please use this precision selector to continue.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-6">
                    <button
                        onClick={() => onSelectPart("head")}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-all shadow-lg hover:shadow-indigo-500/20"
                    >
                        Head & Mind
                    </button>
                    <button
                        onClick={() => onSelectPart("chest")}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-all shadow-lg hover:shadow-indigo-500/20"
                    >
                        Chest & Heart
                    </button>
                    <button
                        onClick={() => onSelectPart("general")}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-all shadow-lg hover:shadow-indigo-500/20"
                    >
                        Abdomen
                    </button>
                    <button
                        onClick={() => onSelectPart("body")}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-all border border-white/5"
                    >
                        Arms & Legs
                    </button>
                </div>
            </div>
        </div>
    );
}
