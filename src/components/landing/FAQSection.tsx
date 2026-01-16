import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How accurate is the AI disease detection?",
    answer: "Our AI provides preliminary assessments based on the symptoms you enter. While trained on extensive medical data, it's designed to assist—not replace—professional medical diagnosis. Accuracy varies by condition and symptom clarity. Always consult a healthcare provider for definitive diagnosis.",
  },
  {
    question: "Is my health data secure and private?",
    answer: "Absolutely. We use end-to-end encryption, follow HIPAA compliance guidelines, and never share your personal health information with third parties. Your data is stored securely and you can delete it at any time from your account settings.",
  },
  {
    question: "Can this replace a doctor's visit?",
    answer: "No. Disease Detector is an educational tool designed to help you understand potential conditions based on symptoms. It should never replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical decisions.",
  },
  {
    question: "What symptoms can I check?",
    answer: "You can enter any physical symptoms you're experiencing—from headaches and fever to more specific conditions. Our AI analyzes combinations of symptoms to provide the most relevant potential conditions. The more detailed your input, the better the analysis.",
  },
  {
    question: "How does the API access work for Enterprise plans?",
    answer: "Enterprise users get secure API keys to integrate our disease detection capabilities into their own applications. You'll have access to our REST API with customizable rate limits, detailed documentation, and dedicated support for implementation.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time from your billing settings. If you cancel, you'll continue to have access until the end of your current billing period. Your health history data remains available even after cancellation.",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="section-padding">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-medium text-primary mb-4 block">FAQ</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Disease Detector and how it works.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-medium transition-shadow"
              >
                <AccordionTrigger className="text-left font-medium py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
