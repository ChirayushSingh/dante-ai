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
            role: "Homemaker",
            location: "Mumbai, Maharashtra",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "The Hindi support and easy to understand reports are a blessing. I use it for my whole family now.",
            author: "Rahul Verma",
            role: "Software Engineer",
            location: "Delhi, Delhi",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "As a medical student, I'm impressed by the accuracy. It's great for quick reference and suggestions.",
            author: "Dr. Ananya Patel",
            role: "Medical Student",
            location: "Bangalore, Karnataka",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "Diagnova's AI-powered diagnostics are incredibly accurate. It helped identify an underlying condition before it became serious. Highly recommend!",
            author: "Vikram Singh",
            role: "Business Owner",
            location: "Jaipur, Rajasthan",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "Finally, a health app that actually listens to your symptoms properly. The reports are so detailed and easy to understand for anyone.",
            author: "Neha Gupta",
            role: "Teacher",
            location: "Pune, Maharashtra",
            avatar: "https://images.unsplash.com/photo-1507876466326-005ec29a7375?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "The 24/7 availability and instant results are a game-changer. No need to wait for doctor appointments for initial assessment.",
            author: "Amit Desai",
            role: "Accountant",
            location: "Ahmedabad, Gujarat",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "Working in healthcare, I appreciate the medical accuracy of Diagnova. It's a reliable tool for pre-consultation assessment.",
            author: "Sneha Banerjee",
            role: "Nurse",
            location: "Kolkata, West Bengal",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "The privacy and security measures are excellent. I can trust my health data is safe. Great platform!",
            author: "Rajesh Kumar",
            role: "Entrepreneur",
            location: "Hyderabad, Telangana",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "Diagnova's explainable AI results help me understand my health better. No confusing medical jargon, just plain facts.",
            author: "Deepika Singh",
            role: "Freelancer",
            location: "Noida, Uttar Pradesh",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "Even as a retired physician, I'm impressed with the AI diagnostic capability. It's ahead of many systems I've used professionally.",
            author: "Sanjay Patel",
            role: "Retired Doctor",
            location: "Surat, Gujarat",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "Love how Diagnova tracks my health trends over time. It helps me adjust my fitness routine based on real health insights.",
            author: "Pooja Sharma",
            role: "Fitness Trainer",
            location: "Chennai, Tamil Nadu",
            avatar: "https://images.unsplash.com/photo-1507876466326-005ec29a7375?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "The user experience is smooth and intuitive. My whole family has started using it. Worth every penny!",
            author: "Arjun Nair",
            role: "Journalist",
            location: "Kochi, Kerala",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "Being busy with work, Diagnova is perfect for quick health checks. It saves time and gives peace of mind.",
            author: "Megha Reddy",
            role: "Corporate Executive",
            location: "Bangalore, Karnataka",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "The interface design is beautiful and user-friendly. AI technology should be this accessible to everyone.",
            author: "Rohan Chatterjee",
            role: "Graphic Designer",
            location: "Kolkata, West Bengal",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "As a student on a budget, Diagnova is affordable and reliable. Saved me from unnecessary hospital visits multiple times.",
            author: "Anjali Mishra",
            role: "Student",
            location: "Lucknow, Uttar Pradesh",
            avatar: "https://images.unsplash.com/photo-1507876466326-005ec29a7375?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "Diagnova's urgency assessment helped me decide when to visit the doctor. Very practical and helpful feature.",
            author: "Vimal Kapoor",
            role: "Construction Manager",
            location: "Gurgaon, Haryana",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "The health chatbot is incredibly helpful for general health questions. It feels like having a doctor in your pocket.",
            author: "Ritika Dubey",
            role: "Marketing Manager",
            location: "Delhi, Delhi",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "As a pharmacist, I often recommend Diagnova to customers. The medical knowledge integrated is impressive.",
            author: "Kunal Singh",
            role: "Pharmacist",
            location: "Indore, Madhya Pradesh",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "In remote areas, having access to quality health assessment tools like Diagnova is life-changing.",
            author: "Swati Pandey",
            role: "NGO Worker",
            location: "Varanasi, Uttar Pradesh",
            avatar: "https://images.unsplash.com/photo-1507876466326-005ec29a7375?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "The technology behind Diagnova is state-of-the-art. Finally, AI is being used to solve real health problems.",
            author: "Harsh Mehra",
            role: "IT Consultant",
            location: "Mumbai, Maharashtra",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "Love how Diagnova complements my wellness journey. It provides scientific backing to my health routine.",
            author: "Divya Sharma",
            role: "Yoga Instructor",
            location: "Rishikesh, Uttarakhand",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
            rating: 5
        },
        {
            quote: "Managing my diet and health is easier now with Diagnova's detailed health reports and tracking features.",
            author: "Nikhil Nambiar",
            role: "Chef",
            location: "Kochi, Kerala",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-grow">
                {/* Header Section */}
                <section className="relative py-16 overflow-hidden bg-gradient-to-b from-primary/5 to-transparent pt-32">
                    <div className="container px-4 mx-auto">
                        <Link to="/">
                            <Button variant="outline" size="sm" className="rounded-full gap-2 mb-6">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Home
                            </Button>
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
                            Stories from Our Community
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            Real people, real health stories. See how Aura AI is making a difference in the lives of thousands across India.
                        </p>
                    </div>
                </section>

                {/* Testimonials Grid */}
                <section className="py-20 bg-muted/30">
                    <div className="container px-4 mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonials.map((t, i) => (
                                <TestimonialCard key={i} {...t} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-primary to-accent relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" />
                    <div className="container px-4 mx-auto relative z-10 text-center">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                            Ready to Share Your Story?
                        </h2>
                        <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
                            Join thousands of happy users and take control of your health journey with Aura AI.
                        </p>
                        <Link to="/auth">
                            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8 h-14 text-lg font-semibold shadow-lg">
                                Start Your Health Journey
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

const TestimonialCard = ({ quote, author, role, location, avatar, rating }: {
    quote: string
    author: string
    role: string
    location: string
    avatar: string
    rating: number
}) => (
    <div className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md group">
        {/* Stars */}
        <div className="flex gap-1 mb-4">
            {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
        </div>

        {/* Quote */}
        <p className="text-muted-foreground mb-6 leading-relaxed italic text-sm">
            "{quote}"
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-4 pt-6 border-t border-border">
            <div className="w-12 h-12 rounded-full border-2 border-primary/20 p-0.5 flex-shrink-0">
                <img
                    src={avatar}
                    alt={author}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`;
                    }}
                />
            </div>
            <div className="min-w-0">
                <h4 className="font-semibold text-foreground text-sm">{author}</h4>
                <p className="text-xs text-muted-foreground">{role}</p>
                <p className="text-xs text-muted-foreground">{location}</p>
            </div>
        </div>
    </div>
);

export default Testimonials;
