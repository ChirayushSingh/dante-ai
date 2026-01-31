import { Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Testimonials = () => {
    const testimonials = [
        {
            quote: "I was worried about my mother's symptoms. Diagnova helped us understand it might be dehydration, not something worse. Saved us a panic trip to the ER!",
            author: "Priya Sharma",
            role: "Mumbai, India",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
        },
        {
            quote: "The detailed reports are satisfying. I showed the report to my doctor and he was impressed by the preliminary analysis.",
            author: "Amit Kapoor",
            role: "Pune, India",
            avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=150"
        },
        {
            quote: "The Hindi support and easy to understand reports are a blessing. I use it for my whole family now.",
            author: "Rahul Verma",
            role: "Delhi, India",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
        },
        {
            quote: "As a medical student, I'm impressed by the accuracy. It's great for quick reference and suggestions.",
            author: "Dr. Ananya Patel",
            role: "Intern, Bangalore",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
        },
        {
            quote: "User interface is very friendly for seniors. My grandmother can use the basic features herself.",
            author: "Vikram Singh",
            role: "Jaipur, India",
            avatar: "https://images.unsplash.com/photo-1556157382-97eda2d622ca?auto=format&fit=crop&q=80&w=150"
        },
        {
            quote: "A must-have app for every Indian household. Quick, reliable and very helpful.",
            author: "Meera Reddy",
            role: "Hyderabad, India",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow pt-32 pb-20">
                <div className="container px-4 mx-auto">
                    <Link to="/">
                        <Button variant="ghost" className="mb-8 pl-0 hover:pl-2 transition-all">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                        </Button>
                    </Link>

                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                            Stories from our Users
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Read how Diagnova AI is changing lives across the country.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <TestimonialCard key={i} {...t} />
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

const TestimonialCard = ({ quote, author, role, avatar }: { quote: string, author: string, role: string, avatar: string }) => (
    <div className="bg-background/50 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group relative">
        <div className="flex gap-1 text-amber-400 mb-6">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
        </div>
        <p className="text-foreground/80 text-lg mb-8 italic leading-relaxed">"{quote}"</p>
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-2 border-primary/20 p-1">
                <img src={avatar} alt={author} className="w-full h-full rounded-full object-cover" />
            </div>
            <div>
                <div className="font-bold text-foreground text-lg">{author}</div>
                <div className="text-sm text-primary font-medium">{role}</div>
            </div>
        </div>
    </div>
);

export default Testimonials;
