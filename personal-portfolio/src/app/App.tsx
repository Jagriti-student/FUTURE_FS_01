import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import {
  Github, Linkedin, Mail, ExternalLink, Download,
  ChevronDown, Menu, X, Sun, Moon,
  Code2, GraduationCap, Terminal, Database, Cpu,
  MessageSquare, Send, CheckCircle,
  ArrowRight, Globe, Zap, BookOpen,
  Calendar, Award, Star,
} from "lucide-react";
import { Toaster, toast } from "sonner";

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Hackathons", href: "#hackathons" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

const EDUCATION = [
  {
    degree: "B.Tech Computer Science Engineering",
    school: "Guru Jambheshwar University of Science and Technology",
    duration: "August 2024 – June 2028",
    grade: "SGPA: 8.41",
    Icon: GraduationCap,
    color: "#7c3aed",
  },
  {
    degree: "Class 12th",
    school: "Govt Model Sanskriti Senior Secondary School",
    duration: "2023 – 2024",
    grade: "CGPA: 8.4",
    Icon: BookOpen,
    color: "#06b6d4",
  },
  {
    degree: "Class 10th",
    school: "C.D. Vishvas High School",
    duration: "2021 – 2022",
    grade: "CGPA: 10",
    Icon: Award,
    color: "#10b981",
  },
];

const EXPERIENCES = [
  {
    title: "Full Stack Development Intern",
    company: "Axcentra",
    duration: "May 2026 – June 2026",
    type: "Internship",
    points: [
      "Developed responsive web interfaces with modern UI patterns.",
      "Worked with HTML, CSS, JavaScript for feature implementation.",
      "Integrated REST APIs and resolved production bugs.",
    ],
    color: "#7c3aed",
  },
  {
    title: "Internshala Student Partner",
    company: "Internshala",
    duration: "March 2026 – May 2026",
    type: "Campus Ambassador",
    points: [
      "Promoted internships and learning programs on campus.",
      "Connected students with skill development opportunities.",
      "Strengthened communication and leadership capabilities.",
    ],
    color: "#06b6d4",
  },
  {
    title: "Full Stack Development Intern",
    company: "Future Interns",
    duration: "2025 – 2026",
    type: "Internship",
    points: [
      "Built web-based features for production applications.",
      "Worked with Git, GitHub, and deployment pipelines.",
      "Collaborated on cross-functional development tasks.",
    ],
    color: "#10b981",
  },
  {
    title: "Top Contributor – KWOC 2025",
    company: "IIT Kharagpur",
    duration: "January 2025 – February 2025",
    type: "Open Source",
    points: [
      "Recognized as Top Contributor at IIT Kharagpur Winter of Code.",
      "Contributed meaningful PRs to open-source projects.",
      "Collaborated with global developers via GitHub workflows.",
    ],
    color: "#f59e0b",
  },
];

const SKILL_CATEGORIES = [
  {
    name: "Programming",
    Icon: Terminal,
    skills: ["Python", "C++", "C", "JavaScript", "SQL"],
  },
  {
    name: "Frontend",
    Icon: Code2,
    skills: ["HTML5", "CSS3", "React.js", "Tailwind CSS"],
  },
  {
    name: "Tools",
    Icon: Database,
    skills: ["Git", "GitHub", "VS Code", "PyCharm"],
  },
  {
    name: "Concepts",
    Icon: Cpu,
    skills: ["Data Structures & Algorithms", "OOP", "DBMS", "REST APIs"],
  },
  {
    name: "Soft Skills",
    Icon: MessageSquare,
    skills: ["Communication", "Leadership", "Time Management"],
  },
];

const PROJECTS = [
  {
    title: "Currency Converter",
    description:
      "Responsive real-time currency conversion app with live exchange rate API integration. Uses async/await patterns for clean API handling and a smooth UX.",
    tech: ["HTML", "CSS", "JavaScript", "Exchange Rate API"],
    github: "https://github.com/Jagriti-student",
    live: null,
    gradientFrom: "rgba(124,58,237,0.15)",
    gradientTo: "rgba(79,70,229,0.1)",
    borderColor: "rgba(124,58,237,0.3)",
    accentColor: "#a78bfa",
  },
  {
    title: "Multi-Tool AI Web Application",
    description:
      "AI-powered web app featuring translation, summarization, and proofreading powered by the OpenAI API. Clean, accessible interface with modular tool architecture.",
    tech: ["HTML", "CSS", "JavaScript", "OpenAI API"],
    github: "https://github.com/Jagriti-student",
    live: null,
    gradientFrom: "rgba(6,182,212,0.15)",
    gradientTo: "rgba(59,130,246,0.1)",
    borderColor: "rgba(6,182,212,0.3)",
    accentColor: "#22d3ee",
  },
];

const HACKATHONS = [
  {
    title: "SheShield",
    subtitle: "Women Safety Application",
    description:
      "AI-powered women safety solution providing emergency assistance, SOS alerts, and location-based safety features for real-world impact.",
    tech: ["React.js", "JavaScript", "AI APIs"],
    github: "https://github.com/Jagriti-student/SheShield-Women-Safety-App",
    features: ["SOS Emergency Button", "Safety Alerts", "Emergency Contacts", "Location Assistance"],
    emoji: "🛡️",
    color: "#ec4899",
  },
  {
    title: "Election Education Assistant",
    subtitle: "AI Civic Tech",
    description:
      "AI-based assistant helping citizens understand elections, voting processes, and civic responsibilities through interactive conversation.",
    tech: ["React.js", "JavaScript", "AI/NLP"],
    Github: "https://github.com/Jagriti-student/Election-Process-Education",
    features: ["AI Chatbot", "Election Awareness", "Interactive Learning"],
    emoji: "🗳️",
    color: "#3b82f6",
  },
  {
    title: "RoadSOS AI",
    subtitle: "Smart Road Safety Assistant",
    description:
      "AI-based road safety platform for emergency assistance, accident response, and smart safety insights powered by computer vision.",
    tech: ["Python", "AI/ML", "Computer Vision", "React.js"],
    Github: "https://github.com/Jagriti-student/RoadSOS-AI",
    features: ["Emergency Alerts", "Accident Support", "Smart Safety Insights"],
    emoji: "🚨",
    color: "#ef4444",
  },
];

const ACHIEVEMENTS = [
  { emoji: "🏆", title: "CodeChef Peak Rating", desc: "1507" },
  { emoji: "⚡", title: "Codeforces Newbie Peak", desc: "654" },
  { emoji: "🎓", title: "IIT Kharagpur KWOC 2025", desc: "Top Contributor" },
  { emoji: "🌸", title: "GirlScript Summer of Code 2026", desc: "Contributor" },
  { emoji: "🏅", title: "Elite Her Hackathon", desc: "Top 100 Finalist" },
  { emoji: "🌐", title: "Google Solution Challenge", desc: "Participant" },
  { emoji: "📊", title: "Xpecto'26 Data Science Contest", desc: "IIT Mandi Participant" },
  { emoji: "🤖", title: "Prompt Wars AI Competition", desc: "Participant" },
  { emoji: "💎", title: "SheFi Cohort 16", desc: "Member" },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

function useScrollSpy() {
  const [active, setActive] = useState("hero");
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { threshold: 0.25 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);
  return active;
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className="text-center mb-16"
    >
      <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-3">
        <div className="h-px w-10 bg-gradient-to-r from-transparent to-violet-500/60" />
        <span className="text-xs font-mono tracking-widest uppercase text-violet-400">{subtitle}</span>
        <div className="h-px w-10 bg-gradient-to-l from-transparent to-violet-500/60" />
      </motion.div>
      <motion.h2
        variants={fadeUp}
        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent"
        style={{ fontFamily: "Outfit, sans-serif" }}
      >
        {title}
      </motion.h2>
    </motion.div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────

function Nav({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useScrollSpy();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -72 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-2xl bg-background/80 border-b border-border shadow-lg shadow-violet-900/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => scrollTo("#hero")}
          className="flex items-center gap-2 group"
        >
          <span
            className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            JG
          </span>
          <span className="hidden sm:block text-sm text-foreground/50 group-hover:text-foreground/70 transition-colors">
            Jagriti
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ label, href }) => {
            const id = href.slice(1);
            return (
              <button
                key={href}
                onClick={() => scrollTo(href)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  active === id
                    ? "text-violet-400 bg-violet-500/10"
                    : "text-foreground/50 hover:text-foreground hover:bg-white/5"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-foreground/50 hover:text-foreground hover:bg-white/5 transition-all"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a
            href="https://github.com/Jagriti-student"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex p-2 rounded-lg text-foreground/50 hover:text-foreground hover:bg-white/5 transition-all"
          >
            <Github size={17} />
          </a>
          <button
            className="md:hidden p-2 rounded-lg text-foreground/50 hover:text-foreground"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-border backdrop-blur-2xl bg-background/95"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <button
                  key={href}
                  onClick={() => { scrollTo(href); setOpen(false); }}
                  className="text-left px-4 py-2.5 rounded-lg text-sm text-foreground/60 hover:text-foreground hover:bg-white/5 transition-all"
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Ambient blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-[15%] w-[480px] h-[480px] rounded-full bg-violet-600/15 blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-[15%] w-96 h-96 rounded-full bg-cyan-600/15 blur-3xl animate-[pulse_5s_ease-in-out_infinite_1.5s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-indigo-600/10 blur-3xl animate-[pulse_6s_ease-in-out_infinite_3s]" />
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #7c3aed 1px, transparent 1px), linear-gradient(to bottom, #7c3aed 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Text – 3 cols */}
          <div className="lg:col-span-3 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Open to opportunities
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.65 }}
              className="text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold leading-[1.1] mb-5"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                Jagriti
                <br />
                
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.55 }}
              className="text-base md:text-lg text-muted-foreground mb-3"
            >
              B.Tech CS Student
              <span className="mx-2 text-violet-500">|</span>
              Full Stack Developer
              <span className="mx-2 text-cyan-500">|</span>
              AI/ML Enthusiast
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.55 }}
              className="text-sm text-muted-foreground max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Passionate about Full Stack Development, Artificial Intelligence, Open Source Contribution,
              and building technology solutions that create real-world impact.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44, duration: 0.55 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8"
            >
              <button
                onClick={() => scrollTo("#projects")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                View Projects <ArrowRight size={15} />
              </button>
              <button
                onClick={() => scrollTo("#contact")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card/40 backdrop-blur-sm text-foreground/80 text-sm font-medium hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-foreground transition-all duration-300"
              >
                <Mail size={15} /> Contact Me
              </button>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card/40 backdrop-blur-sm text-foreground/80 text-sm font-medium hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-foreground transition-all duration-300"
              >
                <Download size={15} /> Resume
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex items-center gap-3 justify-center lg:justify-start"
            >
              {[
                { Icon: Github, href: "https://github.com/Jagriti-student", hover: "hover:text-foreground" },
                { Icon: Linkedin, href: "https://linkedin.com/in/jagriti-goyal-2aa529346", hover: "hover:text-violet-400" },
                { Icon: Mail, href: "mailto:jagriti7989@gmail.com", hover: "hover:text-cyan-400" },
              ].map(({ Icon, href, hover }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-lg border border-border bg-card/30 flex items-center justify-center text-muted-foreground ${hover} hover:border-violet-500/30 hover:bg-violet-500/10 transition-all duration-300`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Avatar – 2 cols */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-2 flex justify-center"
          >
            <div className="relative w-72 h-72">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600/30 via-purple-600/20 to-cyan-600/25 blur-2xl scale-110" />
              {/* Main circle */}
              <div className="relative w-full h-full rounded-full border border-violet-500/25 bg-gradient-to-br from-violet-950/70 via-indigo-950/60 to-slate-900/70 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                {/* Code pattern background */}
                <div className="absolute inset-0 opacity-10">
                  {["const", "=>", "{}", "AI", "ML", "API", "</>", "git", "npm"].map((w, i) => (
                    <span
                      key={i}
                      className="absolute text-violet-300 font-mono text-xs"
                      style={{
                        top: `${10 + (i * 11) % 80}%`,
                        left: `${5 + (i * 23) % 80}%`,
                        opacity: 0.6 + (i % 3) * 0.2,
                      }}
                    >
                      {w}
                    </span>
                  ))}
                </div>
                <div className="text-center z-10">
                  <div
                    className="text-7xl font-black bg-gradient-to-br from-violet-300 via-purple-200 to-cyan-300 bg-clip-text text-transparent"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    J
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground/60 mt-1 tracking-wider">
                    developer.init()
                  </div>
                </div>
              </div>

              {/* Orbiting badges */}
              <div className="absolute -top-3 -right-2 w-11 h-11 rounded-xl bg-violet-600/20 border border-violet-500/30 backdrop-blur-sm flex items-center justify-center text-violet-300 shadow-lg">
                <Code2 size={18} />
              </div>
              <div className="absolute -bottom-2 -left-3 w-11 h-11 rounded-xl bg-cyan-600/20 border border-cyan-500/30 backdrop-blur-sm flex items-center justify-center text-cyan-300 shadow-lg">
                <Zap size={18} />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 -right-5 w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/30 backdrop-blur-sm flex items-center justify-center text-emerald-300">
                <Github size={16} />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 -left-5 w-10 h-10 rounded-lg bg-amber-600/20 border border-amber-500/30 backdrop-blur-sm flex items-center justify-center text-amber-300">
                <Star size={16} />
              </div>

              {/* Floating chips */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-10 top-6 px-3 py-1.5 rounded-lg bg-card/80 border border-border backdrop-blur-sm text-[10px] font-mono text-muted-foreground whitespace-nowrap shadow-xl"
              >
                <span className="text-violet-400">const</span> dev{" "}
                <span className="text-muted-foreground/60">=</span>{" "}
                <span className="text-cyan-400">&quot;Jagriti&quot;</span>
              </motion.div>

              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 bottom-6 px-3 py-1.5 rounded-lg bg-card/80 border border-border backdrop-blur-sm text-[10px] font-mono whitespace-nowrap shadow-xl"
              >
                <span className="text-emerald-400">✓</span>{" "}
                <span className="text-muted-foreground">open to work</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.button
          onClick={() => scrollTo("#about")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          <span className="text-[10px] font-mono tracking-widest">scroll</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ChevronDown size={16} />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const highlights = [
    { Icon: Code2, label: "Full Stack Development", cls: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
    { Icon: Zap, label: "Artificial Intelligence", cls: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
    { Icon: Globe, label: "Open Source Contributor", cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { Icon: Terminal, label: "Problem Solving", cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title="About Me" subtitle="Who I Am" />
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeUp}>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-5">
              I am a{" "}
              <span className="text-foreground font-medium">Computer Science Engineering student</span>{" "}
              at Guru Jambheshwar University, passionate about building web applications,
              exploring AI technologies, solving complex programming challenges, and contributing
              meaningfully to open-source communities.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              With hands-on internship experience and multiple hackathon builds, I bridge theoretical
              knowledge with practical execution — from scalable full-stack products to ML-powered solutions
              that address real-world problems.
            </p>
            <div className="flex flex-wrap gap-2">
              {["React.js", "Python", "AI/ML", "Open Source", "DSA", "REST APIs"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs border border-violet-500/25 bg-violet-500/8 text-violet-300 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
            {highlights.map(({ Icon, label, cls }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className={`p-4 rounded-xl border backdrop-blur-sm flex items-start gap-3 ${cls} hover:scale-[1.03] transition-transform duration-300`}
              >
                <Icon size={19} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground leading-snug">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── EDUCATION ────────────────────────────────────────────────────────────────

function Education() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="education" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-600/[0.04] via-transparent to-transparent -z-10" />
      <div className="max-w-3xl mx-auto">
        <SectionHeader title="Education" subtitle="Academic Journey" />
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="relative"
        >
          {/* Timeline spine */}
          <div className="absolute left-5 top-3 bottom-3 w-px bg-gradient-to-b from-violet-500/50 via-violet-500/20 to-transparent hidden sm:block" />

          {EDUCATION.map((edu, i) => (
            <motion.div key={i} variants={fadeUp} className="relative sm:pl-16 pb-8 last:pb-0">
              {/* Dot */}
              <div
                className="absolute left-0 top-0 w-10 h-10 rounded-xl flex items-center justify-center hidden sm:flex"
                style={{ background: `${edu.color}18`, border: `1px solid ${edu.color}35` }}
              >
                <edu.Icon size={18} style={{ color: edu.color }} />
              </div>

              <div className="p-6 rounded-2xl bg-card/50 border border-border backdrop-blur-sm hover:border-violet-500/25 hover:bg-card/80 transition-all duration-300 group">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-foreground group-hover:text-violet-300 transition-colors">
                    {edu.degree}
                  </h3>
                  <span
                    className="text-xs font-mono px-2.5 py-1 rounded-full"
                    style={{ background: `${edu.color}15`, color: edu.color, border: `1px solid ${edu.color}30` }}
                  >
                    {edu.grade}
                  </span>
                </div>
                <p className="text-sm font-medium mb-1.5" style={{ color: edu.color }}>
                  {edu.school}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  {edu.duration}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────

function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title="Experience" subtitle="Professional Journey" />
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid md:grid-cols-2 gap-5"
        >
          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="p-6 rounded-2xl bg-card/50 border border-border backdrop-blur-sm hover:border-violet-500/20 hover:bg-card/80 transition-all duration-300 group flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <span
                    className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-full mb-1.5"
                    style={{
                      background: `${exp.color}12`,
                      color: exp.color,
                      border: `1px solid ${exp.color}28`,
                    }}
                  >
                    {exp.type}
                  </span>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-violet-300 transition-colors leading-snug">
                    {exp.title}
                  </h3>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: exp.color }}>
                    {exp.company}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/30 px-2 py-1 rounded-lg whitespace-nowrap flex-shrink-0">
                  <Calendar size={10} />
                  {exp.duration}
                </div>
              </div>
              <ul className="space-y-2 flex-grow">
                {exp.points.map((pt, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: exp.color }}
                    />
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────

function Skills() {
  const [tab, setTab] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-600/[0.04] to-transparent -z-10" />
      <div className="max-w-4xl mx-auto">
        <SectionHeader title="Skills" subtitle="Technical Arsenal" />
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          {/* Tab row */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 mb-10">
            {SKILL_CATEGORIES.map(({ name, Icon }, idx) => (
              <button
                key={idx}
                onClick={() => setTab(idx)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                  tab === idx
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
                    : "border border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-violet-500/25"
                }`}
              >
                <Icon size={14} />
                {name}
              </button>
            ))}
          </motion.div>

          {/* Skills */}
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {SKILL_CATEGORIES[tab].skills.map((skill, idx) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.055 }}
                className="px-5 py-3 rounded-xl border border-violet-500/20 bg-violet-500/8 text-violet-300 text-sm font-medium hover:bg-violet-500/18 hover:border-violet-500/40 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-200 cursor-default"
              >
                {skill}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader title="Projects" subtitle="What I've Built" />
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid md:grid-cols-2 gap-6"
        >
          {PROJECTS.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex flex-col p-6 rounded-2xl backdrop-blur-sm border hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group"
              style={{
                background: `linear-gradient(135deg, ${p.gradientFrom}, ${p.gradientTo})`,
                borderColor: p.borderColor,
              }}
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-3">
                <h3
                  className="text-lg font-bold text-foreground group-hover:transition-colors"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  {p.title}
                </h3>
                <div className="flex gap-2 flex-shrink-0">
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground bg-background/20 hover:bg-background/50 transition-all"
                  >
                    <Github size={15} />
                  </a>
                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground bg-background/20 hover:bg-background/50 transition-all"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow">
                {p.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-background/25 border border-border text-muted-foreground font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── HACKATHONS ───────────────────────────────────────────────────────────────

function Hackathons() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="hackathons" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-600/[0.04] to-transparent -z-10" />
      <div className="max-w-6xl mx-auto">
        <SectionHeader title="Hackathon Projects" subtitle="Competitive Builds" />
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid md:grid-cols-3 gap-5"
        >
          {HACKATHONS.map((h, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex flex-col p-6 rounded-2xl bg-card/50 border border-border backdrop-blur-sm hover:border-violet-500/25 hover:bg-card/80 transition-all duration-300 group"
            >
              <div className="text-3xl mb-3">{h.emoji}</div>
              <span className="text-[10px] font-mono text-muted-foreground mb-1">{h.subtitle}</span>
              <h3
                className="text-base font-bold text-foreground mb-3 group-hover:text-violet-300 transition-colors"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                {h.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-grow">
                {h.description}
              </p>

              <div className="space-y-1.5 mb-4">
                {h.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle size={11} style={{ color: h.color, flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1">
                {h.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-background/40 border border-border text-muted-foreground font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────

function Achievements() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="achievements" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader title="Achievements" subtitle="Milestones" />
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {ACHIEVEMENTS.map((a, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex items-start gap-4 p-5 rounded-xl bg-card/50 border border-border backdrop-blur-sm hover:border-violet-500/25 hover:bg-card/80 hover:scale-[1.02] transition-all duration-300 group"
            >
              <span className="text-2xl flex-shrink-0 leading-none">{a.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-violet-300 transition-colors leading-snug">
                  {a.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── GITHUB ───────────────────────────────────────────────────────────────────

function GitHubSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="github" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-600/[0.04] to-transparent -z-10" />
      <div className="max-w-4xl mx-auto">
        <SectionHeader title="GitHub" subtitle="Open Source" />
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="space-y-5"
        >
          {/* Profile card */}
          <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-card/50 border border-border backdrop-blur-sm flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/25 flex items-center justify-center text-violet-400 flex-shrink-0">
              <Github size={28} />
            </div>
            <div className="flex-grow text-center sm:text-left">
              <p className="font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>Jagriti-student</p>
              <p className="text-sm text-muted-foreground">github.com/Jagriti-student</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Full Stack Developer · AI/ML Enthusiast · Open Source Contributor
              </p>
            </div>
            <a
              href="https://github.com/Jagriti-student"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0"
            >
              <Github size={16} /> Visit Profile
            </a>
          </motion.div>

          {/* Stats image */}
          <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden border border-border bg-card/30">
            <img
              src="https://github-readme-stats.vercel.app/api?username=Jagriti-student&show_icons=true&theme=tokyonight&bg_color=0d0d1a&border_color=4c1d95&title_color=a78bfa&icon_color=22d3ee&text_color=e2e8f0&hide_border=false&count_private=true"
              alt="Jagriti GitHub Stats"
              className="w-full"
              loading="lazy"
            />
          </motion.div>

          {/* Streak image */}
          <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden border border-border bg-card/30">
            <img
              src="https://github-readme-streak-stats.herokuapp.com/?user=Jagriti-student&theme=tokyonight&background=0d0d1a&border=4c1d95&ring=a78bfa&fire=22d3ee&currStreakLabel=a78bfa&sideLabels=e2e8f0&dates=94a3b8"
              alt="Jagriti GitHub Streak"
              className="w-full"
              loading="lazy"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────

function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSending(true);
    // Simulated EmailJS send — replace with real emailjs.send() call
    await new Promise((r) => setTimeout(r, 1600));
    setSending(false);
    toast.success("Message sent! Jagriti will reply soon.");
    setForm({ name: "", email: "", message: "" });
  };

  const contacts = [
    { Icon: Mail, label: "Email", value: "jagriti7989@gmail.com", href: "mailto:jagriti7989@gmail.com" },
    { Icon: Linkedin, label: "LinkedIn", value: "jagriti-goyal-2aa529346", href: "https://linkedin.com/in/jagriti-goyal-2aa529346" },
    { Icon: Github, label: "GitHub", value: "Jagriti-student", href: "https://github.com/Jagriti-student" },
  ];

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-600/[0.04] to-transparent -z-10" />
      <div className="max-w-5xl mx-auto">
        <SectionHeader title="Get In Touch" subtitle="Contact" />
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-10"
        >
          {/* Left side */}
          <motion.div variants={fadeUp} className="space-y-6">
            <p className="text-muted-foreground leading-relaxed text-sm">
              Whether you have an internship opportunity, a project collaboration, or just want to
              connect — my inbox is always open. I&apos;ll get back to you as soon as possible!
            </p>

            <div className="space-y-3">
              {contacts.map(({ Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/40 hover:border-violet-500/30 hover:bg-card/70 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-medium text-foreground group-hover:text-violet-300 transition-colors truncate">
                      {value}
                    </p>
                  </div>
                  <ArrowRight size={14} className="ml-auto text-muted-foreground group-hover:text-violet-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={fadeUp}>
            <form
              onSubmit={handleSubmit}
              className="p-6 rounded-2xl bg-card/50 border border-border backdrop-blur-sm space-y-4"
            >
              {[
                { key: "name", label: "Name", type: "text", placeholder: "Your name" },
                { key: "email", label: "Email", type: "email", placeholder: "your@email.com" },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-foreground/70 mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl bg-background/40 border border-border text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-violet-500/50 focus:bg-background/70 transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-foreground/70 mb-1.5">Message</label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Your message..."
                  className="w-full px-4 py-2.5 rounded-xl bg-background/40 border border-border text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-violet-500/50 focus:bg-background/70 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={15} /> Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-5">
        <div className="text-center">
          <p
            className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Jagriti
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Full Stack Developer · AI/ML Enthusiast · Open Source Contributor
          </p>
        </div>

        <div className="flex items-center gap-3">
          {[
            { Icon: Github, href: "https://github.com/Jagriti-student", label: "GitHub" },
            { Icon: Linkedin, href: "https://linkedin.com/in/jagriti-goyal-2aa529346", label: "LinkedIn" },
            { Icon: Mail, href: "mailto:jagriti7989@gmail.com", label: "Email" },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-9 h-9 rounded-lg border border-border bg-card/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-violet-500/40 hover:bg-violet-500/10 transition-all"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground/50 font-mono">
          © 2026 Jagriti· Built with React & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      <Toaster position="top-right" richColors />
      <Nav isDark={isDark} toggleTheme={() => setIsDark((d) => !d)} />
      <main>
        <Hero />
        <About />
        <Education />
        <Experience />
        <Skills />
        <Projects />
        <Hackathons />
        <Achievements />
        <GitHubSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
