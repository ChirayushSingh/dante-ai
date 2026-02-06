import { Link } from "react-router-dom";
import { Heart, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "API Access", href: "/api-keys" },
    { label: "Health Hub", href: "/knowledge" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "HIPAA Compliance", href: "/hipaa" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "FAQ", href: "#faq" },
    { label: "Community", href: "/community" },
    { label: "Status", href: "/status" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      {/* Main footer */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl">
                  Diagnova<span className="gradient-text">AI</span>
                </span>
                <span className="text-[10px] text-muted-foreground -mt-0.5 tracking-wider">HEALTH AI</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Your intelligent healthcare support system—safer, smarter, and personalized.
              Always consult a healthcare professional.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:support@diagnova.ai" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-border">
        <div className="container-wide py-6">
          <MedicalDisclaimer />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container-wide py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Aura AI. All rights reserved.</p>
            <p>Made with ❤️ for your health</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
