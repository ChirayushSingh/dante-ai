import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Activity } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Features", path: "#features" },
        { name: "How it Works", path: "#how-it-works" },
        { name: "Testimonials", path: "#testimonials" },
        { name: "About", path: "#about" },
    ];

    const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.querySelector(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const isActive = (path: string) => {
        return false; // Removing active state for hash links simplifies behavior
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md shadow-md py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="container px-4 mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-lg group-hover:shadow-glow transition-all duration-300">
                        <Activity className="w-6 h-6" />
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight text-foreground">
                        Diagnova<span className="text-primary">AI</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.path}
                            onClick={(e) => handleScrollToSection(e, link.path)}
                            className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link to="/auth">
                        <Button variant="ghost" className="font-medium hover:bg-primary/5 hover:text-primary">
                            Sign In
                        </Button>
                    </Link>
                    <Link to="/auth">
                        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-glow transition-all duration-300 rounded-full px-6">
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-foreground p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border p-4 shadow-xl animate-fade-in">
                    <div className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                className="text-foreground/80 hover:text-primary font-medium py-2 transition-colors"
                                onClick={(e) => {
                                    handleScrollToSection(e, link.path);
                                    setIsOpen(false);
                                }}
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="pt-4 border-t border-border flex flex-col gap-3">
                            <Link to="/auth" onClick={() => setIsOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start">
                                    Sign In
                                </Button>
                            </Link>
                            <Link to="/auth" onClick={() => setIsOpen(false)}>
                                <Button className="w-full bg-primary hover:bg-primary/90">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
