import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  BookOpen,
  Search,
  Heart,
  Brain,
  Pill,
  Activity,
  Apple,
  Moon,
  Dumbbell,
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const categories = [
  { id: "all", label: "All Topics", icon: BookOpen },
  { id: "symptoms", label: "Symptoms", icon: Activity },
  { id: "conditions", label: "Conditions", icon: Heart },
  { id: "prevention", label: "Prevention", icon: Apple },
  { id: "mental", label: "Mental Health", icon: Brain },
  { id: "lifestyle", label: "Lifestyle", icon: Dumbbell },
];

const articles = [
  {
    id: "1",
    title: "Understanding Headaches: Types, Causes, and When to Worry",
    excerpt: "Learn about the different types of headaches, their common triggers, and when you should seek medical attention.",
    category: "symptoms",
    readTime: "5 min",
    tags: ["headache", "migraine", "tension"],
    verified: true,
    url: "https://www.mayoclinic.org/symptoms/headache/basics/definition/sym-20050800"
  },
  {
    id: "2",
    title: "Common Cold vs. Flu: How to Tell the Difference",
    excerpt: "Both share similar symptoms, but knowing the difference can help you get the right treatment faster.",
    category: "conditions",
    readTime: "4 min",
    tags: ["cold", "flu", "respiratory"],
    verified: true,
    url: "https://www.cdc.gov/flu/symptoms/coldflu.htm"
  },
  {
    id: "3",
    title: "10 Simple Habits for a Healthier Heart",
    excerpt: "Small daily changes that can significantly reduce your risk of cardiovascular disease.",
    category: "prevention",
    readTime: "6 min",
    tags: ["heart", "prevention", "exercise"],
    verified: true,
    url: "https://www.heart.org/en/healthy-living/healthy-lifestyle/my-life-check--lifes-simple-7"
  },
  {
    id: "4",
    title: "Managing Stress and Anxiety: Practical Techniques",
    excerpt: "Evidence-based strategies to help you cope with daily stress and reduce anxiety symptoms.",
    category: "mental",
    readTime: "7 min",
    tags: ["stress", "anxiety", "mindfulness"],
    verified: true,
    url: "https://www.nimh.nih.gov/health/publications/so-stressed-out-fact-sheet"
  },
  {
    id: "5",
    title: "Sleep Hygiene: Why Quality Sleep Matters",
    excerpt: "Discover how sleep affects every aspect of your health and tips for better rest.",
    category: "lifestyle",
    readTime: "5 min",
    tags: ["sleep", "insomnia", "rest"],
    verified: true,
    url: "https://www.sleepfoundation.org/sleep-hygiene"
  },
  {
    id: "6",
    title: "Digestive Health: Understanding Your Gut",
    excerpt: "The gut-brain connection and why digestive health impacts your overall wellbeing.",
    category: "conditions",
    readTime: "6 min",
    tags: ["digestion", "gut health", "nutrition"],
    verified: true,
    url: "https://www.niddk.nih.gov/health-information/digestive-diseases"
  },
  {
    id: "7",
    title: "Building a Stronger Immune System Naturally",
    excerpt: "Science-backed ways to support your immune system through diet, exercise, and lifestyle.",
    category: "prevention",
    readTime: "5 min",
    tags: ["immune", "vitamins", "nutrition"],
    verified: true,
    url: "https://www.health.harvard.edu/staying-healthy/how-to-boost-your-immune-system"
  },
  {
    id: "8",
    title: "Recognizing Signs of Depression",
    excerpt: "Understanding the symptoms of depression and when to seek professional help.",
    category: "mental",
    readTime: "6 min",
    tags: ["depression", "mental health", "therapy"],
    verified: true,
    url: "https://www.nimh.nih.gov/health/topics/depression"
  },
];

const KnowledgeHub = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === "all" || article.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-3">Health Knowledge Hub</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            AI-curated health articles from verified medical sources. Learn about symptoms,
            conditions, prevention, and healthy living.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative max-w-xl mx-auto"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search health topics..."
            className="pl-12 h-12 text-base rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border text-muted-foreground hover:bg-muted"
                }`}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {filteredArticles.map((article, index) => (
            <motion.a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group block"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {article.verified && (
                    <span className="flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                      <Sparkles className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{article.readTime} read</span>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all opacity-0 group-hover:opacity-100" />
              </div>

              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {article.excerpt}
              </p>

              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.a>
          ))}
        </motion.div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No articles found matching your search</p>
          </div>
        )}

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-muted/50 rounded-xl p-4 text-center"
        >
          <p className="text-sm text-muted-foreground">
            📚 All content is reviewed by medical professionals and sourced from verified health organizations.
            This information is educational and should not replace professional medical advice.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeHub;
