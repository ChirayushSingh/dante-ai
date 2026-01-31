import { Activity, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
    return (
        <footer className="bg-muted/30 border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white">
                                <Activity className="w-5 h-5" />
                            </div>
                            <span className="font-display font-bold text-lg text-foreground">
                                Diagnova<span className="text-primary">AI</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Empowering healthcare with advanced artificial intelligence.
                            Making diagnostics accessible, accurate, and personal for everyone.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-display font-semibold text-foreground mb-6">Company</h3>
                        <ul className="space-y-4">
                            {['About Us', 'Careers', 'Press', 'Blog', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-display font-semibold text-foreground mb-6">Legal</h3>
                        <ul className="space-y-4">
                            {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Security', 'Compliance'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-display font-semibold text-foreground mb-6">Stay Updated</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Subscribe to our newsletter for the latest health tech insights.
                        </p>
                        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                            <Input
                                placeholder="Enter your email"
                                className="bg-background border-border focus:ring-primary"
                            />
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Diagnova AI. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <Mail className="w-4 h-4" /> support@diagnova.ai
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
