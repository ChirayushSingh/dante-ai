import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the conversational symptom interview work?",
    answer: "Unlike simple symptom forms, Aura Aid AI has an actual conversation with you. When you describe your symptoms, our AI asks intelligent follow-up questions based on your answers—just like a real healthcare professional would. This dynamic approach helps gather more accurate information for better assessments.",
  },
  {
    question: "What do the urgency levels mean?",
    answer: "We provide three levels of risk triage: 'Self-care' means you can likely manage at home with rest and over-the-counter remedies. 'Consult Soon' suggests you should see a healthcare provider within a few days. 'Emergency/Urgent' means you should seek immediate medical attention. These are guidance only—when in doubt, always err on the side of caution.",
  },
  {
    question: "How does my health profile improve results?",
    answer: "Your health profile (age, gender, chronic conditions, medications, allergies) allows our AI to provide personalized insights. For example, certain symptoms have different implications based on age or existing conditions. The more complete your profile, the more tailored and relevant your assessments become.",
  },
  {
    question: "Can the AI health chatbot give medical advice?",
    answer: "Our AI health assistant can answer general health questions, explain medical terms, provide educational content, and help you understand your assessment results. However, it will never prescribe treatments or replace professional medical advice. It's designed to inform and educate, not diagnose or treat.",
  },
  {
    question: "Is my health data secure and private?",
    answer: "Absolutely. We use end-to-end encryption, follow HIPAA compliance guidelines, and never share your personal health information with third parties. Your data is stored securely, and you can export or delete it at any time from your account settings.",
  },
  {
    question: "Can I share my results with my doctor?",
    answer: "Yes! You can download detailed PDF reports of any symptom check to share with healthcare providers. These reports include the conversation summary, identified symptoms, possible conditions, and urgency assessment—giving your doctor valuable context.",
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
            Everything you need to know about Aura Aid AI and how it works.
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
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
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
