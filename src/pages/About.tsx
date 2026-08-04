import { motion } from "framer-motion";
import { Award, Bot, Sparkles } from "lucide-react";

const TAGS = [
  "Quality Engineering",
  "Automation",
  "Product Development",
  "GitHub Copilot (GH-300)",
  "Generative AI",
  "Agentic AI",
  "Applied AI Engineering",
];
export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-40 pt-12 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass overflow-hidden rounded-3xl"
      >
        <div className="grid gap-8 p-7 sm:p-10 md:grid-cols-[220px_1fr] md:items-center">
          {/* Avatar / identity */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 animate-floaty rounded-full bg-tiranga opacity-30 blur-2xl" />
              <img
                src="/devanand.jpg"
                alt="Devanand Gujar"
                className="relative h-32 w-32 rounded-full object-cover shadow-glow ring-2 ring-white/20"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <span className="chip inline-flex w-fit gap-2">
              <Sparkles className="h-4 w-4 text-saffron-400" />
              Hello, I'm
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
              Devanand <span className="gradient-text">Gujar</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              <p>Engineering Graduate with strong experience leading <strong className="text-white">Quality Engineering, Test Automation and software delivery.     </strong>
              Recognized with <strong className="text-white">9+ awards</strong> for performance, innovation, impact and teamwork across Wolters Kluwer, Citibank, PubMatic, PTC, and Cybage.</p><br/>
              <p>Expertise in <strong className="text-white">Java coding</strong>, automation framework design and development from scratch using <strong className="text-white">Selenium, Playwright </strong>, TypeScript, and Rest Assured for UI automation and <strong className="text-white">API automation</strong>. Strongly believes in shift-left testing, code reviews and fast feedback loops for higher release confidence.</p><br/>
              <p>Strong <strong className="text-white">Risk Management, Team Management</strong> and <strong className="text-white">stakeholder management</strong> capabilities with a proven ability to drive quality initiatives across complex enterprise programs. Managed cross-functional globally distributed team of 10+ QA engineers and developers, combining strategic leadership with deep hands-on execution.</p>

              <p><strong className="text-white">Copilot Certified</strong> and leveraging <strong className="text-white">AI tools</strong> like <strong className="text-white">Copilot</strong> and <strong className="text-white">Cursor</strong> to accelerate automation development and engineering productivity. Experienced in designing AI agents for QA and software development process automation. Actively learning and experimenting with Generative AI and Agentic AI using LLMs - Claude Opus, GPT‑5x, GPT‑5x Codex, and Gemini‑3x.</p>

            </p>

            {/* Quick facts */}
            <div className="mt-6 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-white/70">
                <Award className="h-5 w-5 text-saffron-400" />
                <span>
                  <strong className="text-white">9+</strong> Workplace awards
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Bot className="h-5 w-5 text-indiagreen-400" />
                <span>Copilot certified</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Sparkles className="h-5 w-5 text-saffron-400" />
                <span>Applied AI enthusiast</span>
              </div>
            </div>

            {/* Skill tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

