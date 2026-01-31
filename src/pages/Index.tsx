import { ArrowRight, Activity, Shield, Zap, Globe, HeartPulse, Brain, Microscope, Play, Check, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

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
                Experience the future of medical analysis. Diagnova combines cutting-edge AI with clinical precision to deliver instant, accurate insights.
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
        <section id="features" className="py-24 bg-muted/50 relative">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Why Choose Diagnova AI?
              </h2>
              <p className="text-muted-foreground text-lg">
                Built by experts, powered by data, and designed for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Brain className="w-8 h-8 text-primary" />}
                title="Neural Diagnosis"
                description="Our advanced neural networks analyze symptoms with 99.8% accuracy against global medical databases."
                delay="0"
              />
              <FeatureCard
                icon={<Shield className="w-8 h-8 text-primary" />}
                title="Secure & Private"
                description="Your health data is encrypted with military-grade security. HIPAA and GDPR compliant protection."
                delay="100"
              />
              <FeatureCard
                icon={<Zap className="w-8 h-8 text-primary" />}
                title="Instant Results"
                description="Get comprehensive health reports in seconds, not days. Real-time analysis at your fingertips."
                delay="200"
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
                      Diagnova AI: "I understand. Let's analyze this further. Are you experiencing any sensitivity to light?"
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
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
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              See Diagnova in Action
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
              Watch how quickly you can get accurate health insights with our intuitive platform.
            </p>

            <div className="relative max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border group cursor-pointer bg-black">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/LXb3EKWsInQ?si=J0yQoM2l2J5-x8a-" // Example healthcare AI video
                title="Diagnova AI Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 relative overflow-hidden">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-16">
              Loved by Thousands
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="Diagnova helped me identify a condition I had been struggling with for months. Truly life-changing technology."
                author="Sarah J."
                role="User"
                avatar="SJ"
              />
              <TestimonialCard
                quote="The accuracy and speed are incredible. It feels like having a doctor in your pocket 24/7."
                author="Michael Chen"
                role="Medical Student"
                avatar="MC"
              />
              <TestimonialCard
                quote="The interface is so beautiful and easy to use. I feel much more in control of my family's health."
                author="Elena Rodriguez"
                role="Parent"
                avatar="ER"
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-muted/50">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
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

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: string }) => (
  <div
    className="glass-card p-8 rounded-2xl card-hover group"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-display font-bold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
      {description}
    </p>
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
  <div className="glass-card p-8 rounded-2xl">
    <div className="flex gap-1 text-yellow-400 mb-6">
      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
    </div>
    <p className="text-foreground/80 text-lg mb-8 italic leading-relaxed">"{quote}"</p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
        {avatar}
      </div>
      <div>
        <div className="font-bold text-foreground">{author}</div>
        <div className="text-sm text-primary">{role}</div>
      </div>
    </div>
  </div>
);

export default Index;
