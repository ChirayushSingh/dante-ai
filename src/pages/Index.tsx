import { ArrowRight, Activity, Shield, Zap, Globe, HeartPulse, Brain, Microscope, Play, Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { InteractiveBodyMap as BodyMap3D } from "@/components/tools/InteractiveBodyMap";
import "./index.css";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
            <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse-slow stagger-2" />
          </div>

          <div className="container px-4 mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-sm font-medium animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                Reimagining Healthcare Intelligence
              </div>

              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground leading-tight animate-fade-up">
                Advanced Diagnostics <br />
                <span className="gradient-text">Powered by AI</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-up stagger-1 leading-relaxed">
                Experience the future of medical analysis. Diagnova combines cutting-edge AI with clinical precision to delivery instant, accurate insights.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-up stagger-2">
                <Link to="/auth">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-glow hover:scale-105 transition-all duration-300 rounded-full px-8 h-14 text-lg w-full sm:w-auto">
                    Start Analysis <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <a href="#demo">
                  <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5 hover:text-primary rounded-full px-8 h-14 text-lg backdrop-blur-sm w-full sm:w-auto">
                    Watch Demo
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-muted/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="container px-4 mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold mb-6 animate-fade-in">
                ✨ Powerful Capabilities
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
                Why Choose <span className="gradient-text">Diagnova AI?</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                We combine advanced medical knowledge with state-of-the-art artificial intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Brain className="w-10 h-10 text-white" />}
                title="Neural Diagnosis"
                description="Our advanced neural networks analyze symptoms with 99.8% accuracy against global medical databases."
                delay="0"
                gradient="from-violet-500 to-purple-500"
              />
              <FeatureCard
                icon={<Shield className="w-10 h-10 text-white" />}
                title="Secure & Private"
                description="Your health data is encrypted with military-grade security. HIPAA and GDPR compliant protection."
                delay="100"
                gradient="from-emerald-500 to-teal-500"
              />
              <FeatureCard
                icon={<Zap className="w-10 h-10 text-white" />}
                title="Instant Results"
                description="Get comprehensive health reports in seconds, not days. Real-time analysis at your fingertips."
                delay="200"
                gradient="from-amber-500 to-orange-500"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 relative overflow-hidden">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-[60px] rounded-full" />
                <div className="glass-card rounded-2xl p-8 relative z-10 border border-white/20 shadow-2xl animate-float">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Symptom Analysis</h4>
                      <p className="text-sm text-muted-foreground">AI Processing...</p>
                    </div>
                    <div className="ml-auto">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-75" />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 bg-muted/50 rounded-lg text-sm text-foreground">
                      User: "I've been having improved headaches lately."
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg text-sm text-foreground">
                      Aura AI: "I understand. Let's analyze this further. Are you experiencing any sensitivity to light?"
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 order-1 lg:order-2">
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold animate-fade-in">
                  🚀 Simple Process
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                  How Diagnova Works
                </h2>
                <div className="space-y-8">
                  <StepRow
                    number="01"
                    title="Describe Symptoms"
                    description="Chat naturally with our AI assistant about what you're feeling."
                  />
                  <StepRow
                    number="02"
                    title="AI Analysis"
                    description="Our neural engine checks millions of medical records instantly."
                  />
                  <StepRow
                    number="03"
                    title="Get Insights"
                    description="Receive a detailed report with potential conditions and next steps."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Video Section */}
        <section id="demo" className="py-24 bg-muted/30">
          <div className="container px-4 mx-auto text-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold mb-6 animate-fade-in">
              🔴 Live Demo
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">
              See Diagnova in Action
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
              Watch how quickly you can get accurate health insights applied to real-world scenarios.
            </p>

            <div className="relative max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 group cursor-pointer bg-black">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/IcgaNYJwIac?autoplay=1&mute=0"
                title="Diagnova AI Health Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        </section>

        {/* 3D Interactive Body Map Preview */}
        <section id="3d-body-map" className="py-24 bg-background">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold">
                  3D Interactive Body Map
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                  Explore symptoms on a live 3D body
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Diagnova&apos;s 3D body scanner lets you precisely select where you feel discomfort, so the AI can
                  combine location, intensity, and associated symptoms for more accurate, explainable suggestions.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-1" />
                    <span>Click on head, chest, stomach, arms, and legs to localize symptoms.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-1" />
                    <span>Clean, geometric 3D visualization optimized for medical clarity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-1" />
                    <span>Seamlessly connects with the AI symptom checker inside your dashboard.</span>
                  </li>
                </ul>
              </div>

              <div className="max-w-xl mx-auto w-full">
                <BodyMap3D
                  onPartSelect={() => {
                    // Landing page preview: selection is visual only.
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 relative overflow-hidden bg-primary/5">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="text-left max-w-2xl">
                <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold mb-6 animate-fade-in">
                  💖 Community Love
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                  Trusted by Families <br /> Across India
                </h2>
              </div>
              <Link to="/testimonials">
                <Button variant="outline" size="lg" className="rounded-full gap-2 hover:bg-primary hover:text-white transition-all">
                  Read All Stories <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="I was worried about my mother's symptoms. Diagnova helped us understand it might be dehydration, not something worse. Saved us a panic trip to the ER!"
                author="Priya Sharma"
                role="Mumbai, India"
                avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
              />
              <TestimonialCard
                quote="The Hindi support and easy to understand reports are a blessing. I use it for my whole family now."
                author="Rahul Verma"
                role="Delhi, India"
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
              />
              <TestimonialCard
                quote="As a medical student, I'm impressed by the accuracy. It's great for quick reference and suggestions."
                author="Dr. Ananya Patel"
                role="Intern, Bangalore"
                avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-muted/50">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold animate-fade-in">
                🏥 Our Mission
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
                About Diagnova AI
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We are a team of doctors, data scientists, and engineers dedicated to democratizing healthcare.
                By combining the power of artificial intelligence with medical expertise, we aim to make high-quality
                health insights accessible to everyone, everywhere.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">99%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Availability</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50k+</div>
                  <div className="text-sm text-muted-foreground">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">100+</div>
                  <div className="text-sm text-muted-foreground">Conditions</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />

          <div className="container px-4 mx-auto relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              Ready to prioritize your health?
            </h2>
            <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
              Join the healthcare revolution today with Diagnova AI.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-full px-8 h-14 text-lg font-semibold shadow-glow">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay, gradient, image }: { icon: React.ReactNode, title: string, description: string, delay: string, gradient?: string, image?: string }) => (
  <div
    className="group relative rounded-3xl overflow-hidden card-hover feature-card-animate"
    data-delay={delay}
  >
    {/* Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-background to-background/50" />
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient || 'from-primary to-accent'} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

    {/* Animated Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

    <div className="relative p-8 h-full flex flex-col justify-end">
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient || 'from-primary to-accent'} flex items-center justify-center mb-6 shadow-lg shadow-white/5`}>
        {icon}
      </div>
      <h3 className="text-2xl font-display font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-lg">
        {description}
      </p>
    </div>
  </div>
);

const StepRow = ({ number, title, description }: { number: string, title: string, description: string }) => (
  <div className="flex gap-6 items-start group">
    <div className="text-4xl font-display font-bold text-primary/20 group-hover:text-primary transition-colors duration-300">
      {number}
    </div>
    <div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

const TestimonialCard = ({ quote, author, role, avatar }: { quote: string, author: string, role: string, avatar: string }) => (
  <div className="bg-background/50 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group relative">
    <div className="absolute top-8 right-8 text-primary/10 group-hover:text-primary/20 transition-colors">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
      </svg>
    </div>

    <div className="flex gap-1 text-amber-400 mb-6">
      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
    </div>
    <p className="text-foreground/80 text-lg mb-8 italic leading-relaxed relative z-10">"{quote}"</p>
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-full border-2 border-primary/20 p-1 flex-shrink-0">
        <img
          src={avatar}
          alt={author}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`;
          }}
        />
      </div>
      <div>
        <div className="font-bold text-foreground text-lg">{author}</div>
        <div className="text-sm text-primary font-medium">{role}</div>
      </div>
    </div>
  </div>
);

export default Index;
