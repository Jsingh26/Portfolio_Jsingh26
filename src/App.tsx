import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  Code, 
  Database, 
  Globe, 
  Award, 
  Menu, 
  X, 
  ExternalLink, 
  MapPin, 
  GraduationCap, 
  Sun, 
  Moon, 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  FileText, 
  Cpu, 
  Cloud,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import confetti from 'canvas-confetti';

// Register GSAP ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ----------------------------------------------------
// Custom Mini-Components & Animation Wrappers
// ----------------------------------------------------

// 1. Text Scramble Component
const TextScramble = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';

  useEffect(() => {
    let timer: any;
    let iteration = 0;
    
    const startScramble = () => {
      timer = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              if (char === ' ') return ' ';
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('')
        );

        if (iteration >= text.length) {
          clearInterval(timer);
        }
        iteration += 1 / 3;
      }, 30);
    };

    const delayTimeout = setTimeout(startScramble, delay);

    return () => {
      clearTimeout(delayTimeout);
      clearInterval(timer);
    };
  }, [text, delay]);

  return <span>{displayText}</span>;
};

// 2. Count-Up Stat Component
const CountUp = ({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const endVal = end;
    if (start === endVal) return;

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easedProgress = progress * (2 - progress); // quadratic ease-out
      const currentCount = Math.floor(easedProgress * (endVal - start) + start);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// 3. Magnetic Hover Wrapper (using GSAP for elastic follow)
const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    gsap.to(ref.current, {
      x: x * 0.35,
      y: y * 0.35,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {children}
    </div>
  );
};

// 4. 3D Tilt Card (using React mouse movement handler)
const TiltCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rotateX = -(y / (box.height / 2)) * 10; // max 10 degrees
    const rotateY = (x / (box.width / 2)) * 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      className={`glow-card ${className}`}
    >
      {children}
    </div>
  );
};

// ----------------------------------------------------
// Projects & Stack Data Setup
// ----------------------------------------------------

interface Project {
  id: number;
  title: string;
  category: 'ai' | 'fullstack' | 'research';
  tags: string[];
  shortDesc: string;
  longDesc: string;
  impact: string;
  github: string;
  badge?: string;
  creds?: string;
}

const projectsData: Project[] = [
  {
    id: 1,
    title: "AI Customer Support Platform",
    category: "ai",
    tags: ["Node.js", "React", "TypeScript", "PostgreSQL", "Groq Llama 3.3", "RAG", "Drizzle ORM", "Clerk", "Docker"],
    shortDesc: "Architected a full-stack AI support platform with RAG document retrieval indexing 10,000+ chunks.",
    longDesc: "Designed and built an enterprise support infrastructure with 20+ REST APIs, 15+ database entities, and a shared OpenAPI-generated client (using Orval) to streamline frontend-backend integration effort by 80%. Developed a RAG document retrieval pipeline indexing 10,000+ chunks (PDF/DOCX/TXT/MD) with sub-500ms query latency via custom PostgreSQL full-text search. Includes an embeddable React chat widget supporting 100+ concurrent conversations and RBAC workflows.",
    impact: "Reduces manual support intervention by 70% and cuts dev environment setup time by 85%.",
    github: "https://github.com/Jsingh26/ai-customer-support-platform",
    badge: "Featured AI Build"
  },
  {
    id: 2,
    title: "Dual-Stream Deepfake Detection Platform",
    category: "research",
    tags: ["PyTorch", "EfficientNet-B4", "FFT", "CNN", "Cross-Attention", "FastAPI", "React", "Docker"],
    shortDesc: "Dual-stream neural network for spatial and frequency-domain AI deepfake image detection.",
    longDesc: "Research and web platform built to classify images as real or AI-generated using a spatial-frequency dual-stream cross-attention model. Evaluated on the 100,000-image CIFAKE dataset, attaining 94.5% accuracy, 93.1% precision, 95.9% recall, and 94.5% F1-score (+3.3 points over baseline EfficientNet-B4). Implemented using PyTorch DataParallel on 2x Tesla T4 GPUs. Includes a FastAPI and React.js web interface processing 500+ images/hour.",
    impact: "Published in Springer ICAMC 2026, New Delhi (Co-authored with Faisal Rais and Dr. Mohd Izhar).",
    github: "https://github.com/Jsingh26/deepfake-detection",
    badge: "Published Springer Research",
    creds: "https://github.com/Jsingh26"
  },
  {
    id: 3,
    title: "Project Management System & Analytics",
    category: "fullstack",
    tags: ["React", "Node.js", "Express", "SQLite", "JWT", "Python", "Pandas", "Streamlit"],
    shortDesc: "Full-stack project tracker and budget analytics system built for physiological research labs (DRDO).",
    longDesc: "A complete, JWT-secured Project Management System built during DRDO internship replacing manual spreadsheet tracking across 20+ concurrent research projects. Features bcrypt-hashed RBAC workflows (Admin, Scientist, Pending approvals), a Streamlit budget tracking dashboard comparing utilized vs remaining research funds, and a Python (Pandas) analytics script analyzing monthly staff attendance logs.",
    impact: "Cuts manual attendance analysis and reporting workflows by 70%.",
    github: "https://github.com/Jsingh26/pms-attendance-analytics"
  },
  {
    id: 4,
    title: "NeuroVision — Candidate Expression Analyzer",
    category: "ai",
    tags: ["React", "TypeScript", "Node.js", "Python", "OpenCV", "PyTorch", "DeepFace", "MongoDB"],
    shortDesc: "Computer vision recruitment tool analyzing observable facial expressions & confidence trends.",
    longDesc: "AI-powered interview dashboard prototype. Utilizes computer vision and PyTorch/DeepFace models to parse non-verbal cues (facial expressions, eye-gaze tracking, attention levels) from recorded or live video streams. Offers recruiters chronologically structured charts (Plotly) for decision support, while emphasizing fairness, ethical hiring filters, and future ATS integrations.",
    impact: "Enables structural behavioral evaluations during candidate screeners.",
    github: "https://github.com/Jsingh26/neurovision-analyzer",
    badge: "Recruitment Prototype"
  },
  {
    id: 5,
    title: "Video Emotion Analysis Tool",
    category: "ai",
    tags: ["Python", "DeepFace", "OpenCV", "PyQt6", "Pandas"],
    shortDesc: "Desktop PyQt6 application for real-time and batch emotion tracking on video feeds.",
    longDesc: "Developed a native desktop analytics tool to map facial expressions into 7 major emotion classes in real-time. Designed with a PyQt6 GUI displaying time-series histograms and confidence charts, calculating nervousness indicators, and exporting clean datasets in CSV for statistical evaluation.",
    impact: "Delivers a standalone statistical software client for behavioral laboratories.",
    github: "https://github.com/Jsingh26/video-emotion-analyser"
  },
  {
    id: 6,
    title: "SafeSphere — Personal Safety Platform",
    category: "fullstack",
    tags: ["Node.js", "Express", "MongoDB", "React", "Geolocation API"],
    shortDesc: "SOS emergency portal featuring real-time location sharing and automated alert check-ins.",
    longDesc: "A personal security hub allowing users to trigger SOS emergency signals with live location coordinates, establish scheduled check-ins that alert contacts if missed, and post community safety warning points on a shared dashboard map.",
    impact: "Provides automated distress broadcasting with minimal user interactions.",
    github: "https://github.com/Jsingh26/safesphere-portal"
  },
  {
    id: 7,
    title: "Artify — Art Auction Platform",
    category: "fullstack",
    tags: ["PHP", "MySQL", "HTML5", "CSS3", "JavaScript"],
    shortDesc: "Online bidding application for artwork with automated timers & bidding history.",
    longDesc: "Bidding and listing environment designed for artists and curators. Built using structured PHP and MySQL, supporting secure auctions, catalog listings, auto-closing listing timers, and immediate updates to bidding history tables.",
    impact: "Centralized bidding space for independent painting collections.",
    github: "https://github.com/Jsingh26/artify-auction"
  },
  {
    id: 8,
    title: "Car Sales Analysis Dashboard",
    category: "research",
    tags: ["Python", "Streamlit", "Pandas", "Plotly"],
    shortDesc: "Automotive survey data processing hub built with Streamlit and Plotly.",
    longDesc: "Data pipeline and web dashboard built to analyze multi-year consumer survey datasets. Implements granular cross-filters (models, price range, safety rating, fuel economy) and generates time-series charts to assist automotive researchers.",
    impact: "Converts tabular spreadsheet survey statistics into interactive research reports.",
    github: "https://github.com/Jsingh26/car-sales-dashboard"
  }
];

// Tech stack items
const techArsenal = {
  "Languages": ["C++", "Java", "C#", "JavaScript (ES6+)", "TypeScript", "Python", "SQL"],
  "Frontend": ["React.js", "HTML5", "CSS3", "Tailwind CSS", "Responsive Design", "Framer Motion"],
  "Backend": ["Node.js", "Express.js", "FastAPI", "Flask", "REST APIs", "GraphQL", "WebSockets", "JWT Auth"],
  "Databases": ["PostgreSQL", "MongoDB", "SQLite", "MySQL", "Redis", "Vector Databases", "Prisma", "Drizzle ORM"],
  "Cloud & DevOps": ["Docker", "Kubernetes", "AWS (EC2, S3, Lambda)", "Azure", "Git", "GitHub", "CI/CD", "Linux"],
  "AI & Machine Learning": ["PyTorch", "RAG Systems", "LLMs", "LangChain", "Computer Vision", "OpenCV", "DeepFace", "Prompt Engineering"],
  "Core Computer Science": ["Data Structures & Algorithms", "OOP & SOLID Principles", "DBMS", "Operating Systems", "Computer Networks", "System Design", "Design Patterns", "Microservices"],
  "Tools & Frameworks": ["Tableau", "Pandas", "NumPy", "Plotly", "Streamlit", "GitHub Copilot", "Vite"]
};

// ----------------------------------------------------
// Main App Component
// ----------------------------------------------------
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [projectFilter, setProjectFilter] = useState<'all' | 'ai' | 'fullstack' | 'research'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Form states
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // References for animations
  const timelineRef = useRef<HTMLDivElement>(null);
  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8b5cf6', '#06b6d4']
    });
  };

  // Initialize Lenis scroll and handle intersection highlights
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const sections = ['home', 'about', 'experience', 'projects', 'tech', 'achievements', 'education', 'contact'];
    
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Theme Toggle Effect
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  // GSAP ScrollTrigger Animations for Timelines & Stats
  useEffect(() => {
    // Stat counters scroll animations
    const counters = gsap.utils.toArray('.stat-counter');
    counters.forEach((counter: any) => {
      gsap.fromTo(counter, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          scrollTrigger: {
            trigger: counter,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Pinned vertical progress timeline in Education
    const timelineEl = timelineRef.current;
    if (timelineEl) {
      const items = timelineEl.querySelectorAll('.education-item');
      items.forEach((item: any) => {
        gsap.fromTo(item.querySelector('.edu-content'),
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          }
        );
        gsap.fromTo(item.querySelector('.edu-dot'),
          { scale: 0 },
          {
            scale: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none none"
            }
          }
        );
      });
    }
  }, []);

  // Filter projects based on selection
  const filteredProjects = projectsData.filter(project => {
    if (projectFilter === 'all') return true;
    return project.category === projectFilter;
  });

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
    triggerConfetti();
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div className="min-h-screen text-slate-100 dark:text-slate-200 transition-colors duration-300">
      
      {/* Background Mesh (Dynamic Color Gradients) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="mesh-gradient opacity-80 dark:opacity-100"></div>
        <div className="tech-grid absolute inset-0 opacity-[0.2] dark:opacity-[0.1]"></div>
      </div>

      {/* ----------------------------------------------------
          Navbar Section
          ---------------------------------------------------- */}
      <header className="fixed top-0 left-0 w-full z-50 glass-nav shadow-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            onClick={() => scrollTo('home')}
            className="text-2xl font-bold font-display cursor-pointer bg-gradient-to-r from-accentBlue via-accentViolet to-accentCyan bg-clip-text text-transparent tracking-tight hover:brightness-110 transition-all"
          >
            Japinder.dev
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {['home', 'about', 'experience', 'projects', 'tech', 'achievements', 'education', 'contact'].map((sect) => (
              <button
                key={sect}
                onClick={() => scrollTo(sect)}
                className={`text-sm font-medium capitalize tracking-wide transition-all duration-300 hover:text-accentCyan ${
                  activeSection === sect 
                    ? 'text-accentBlue font-semibold border-b-2 border-accentBlue pb-1' 
                    : 'text-slate-400 dark:text-slate-300'
                }`}
              >
                {sect}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <Magnetic>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2.5 rounded-full glass border border-white/10 hover:text-accentCyan text-slate-300 hover:shadow-glow-cyan transition-all"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </Magnetic>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full glass shadow-xl border-t border-white/5 py-6 px-8 flex flex-col space-y-4 md:hidden"
            >
              {['home', 'about', 'experience', 'projects', 'tech', 'achievements', 'education', 'contact'].map((sect) => (
                <button
                  key={sect}
                  onClick={() => scrollTo(sect)}
                  className={`text-left text-lg font-medium capitalize py-2 ${
                    activeSection === sect ? 'text-accentBlue' : 'text-slate-400'
                  }`}
                >
                  {sect}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12 overflow-x-hidden">
        
        {/* ----------------------------------------------------
            Hero Section
            ---------------------------------------------------- */}
        <section id="home" className="min-h-[85vh] flex flex-col justify-center items-center py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center w-full">
            
            {/* Hero Left Content */}
            <div className="md:col-span-7 flex flex-col space-y-6 text-center md:text-left">
              {/* Status Badge */}
              <div className="inline-flex items-center space-x-2.5 glass px-4 py-1.5 rounded-full border border-white/10 w-fit mx-auto md:mx-0 shadow-md">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold tracking-wider text-emerald-400 dark:text-emerald-300">
                  Open to SDE-1 / Full-Stack / Backend / AI Engineer roles
                </span>
              </div>

              {/* Title with Text Scramble */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-[1.1] tracking-tight">
                Hi, I'm <span className="bg-gradient-to-r from-accentBlue via-accentViolet to-accentCyan bg-clip-text text-transparent"><TextScramble text="Japinder Singh" /></span>
              </h1>

              {/* Title & Tagline options */}
              <p className="text-xl sm:text-2xl font-medium text-slate-300 dark:text-slate-200">
                Software Engineer | Full-Stack Developer | AI Engineer
              </p>

              <p className="text-base sm:text-lg text-slate-400 dark:text-slate-400 max-w-xl leading-relaxed italic font-medium">
                "A jack of all trades is a master of none, but oftentimes better than a master of one"
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                <Magnetic>
                  <button 
                    onClick={() => scrollTo('projects')}
                    className="relative group px-6 py-3.5 bg-gradient-to-r from-accentBlue to-accentViolet hover:from-accentViolet hover:to-accentBlue text-white font-semibold rounded-xl flex items-center space-x-2.5 shadow-lg shadow-accentBlue/20 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-glow-violet"
                  >
                    <span>View My Work</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Magnetic>

                <Magnetic>
                  <button 
                    onClick={() => scrollTo('contact')}
                    className="px-6 py-3.5 glass border border-white/10 hover:border-white/20 text-slate-200 hover:text-white font-semibold rounded-xl hover:shadow-glow-cyan transition-all"
                  >
                    Contact Me
                  </button>
                </Magnetic>
              </div>
            </div>

            {/* Hero Right: Profile Photo with Parallax/Float */}
            <div className="md:col-span-5 flex justify-center items-center">
              <div className="relative group max-w-[300px] sm:max-w-[340px] w-full">
                {/* Outer Glow Ring */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-accentBlue via-accentViolet to-accentCyan rounded-[2.2rem] blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-slow"></div>
                
                {/* Profile Image container */}
                <div className="relative aspect-[4/5] w-full rounded-[2rem] overflow-hidden border-4 border-slate-900/90 dark:border-slate-950/80 shadow-2xl animate-float">
                  <img 
                    src="/profile.jpeg" 
                    alt="Japinder Singh Headshot" 
                    className="w-full h-full object-cover scale-[1.01] group-hover:scale-[1.03] transition-transform duration-700 object-top"
                    onError={(e) => {
                      // fallback if image has issue rendering
                      e.currentTarget.src = "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400";
                    }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Scroll Down Indicator */}
          <div 
            onClick={() => scrollTo('about')}
            className="absolute bottom-6 flex flex-col items-center cursor-pointer text-slate-400 hover:text-accentCyan transition-colors animate-bounce mt-8 md:mt-0"
          >
            <span className="text-xs font-semibold uppercase tracking-widest mb-1.5">Scroll Down</span>
            <ChevronRight size={20} className="rotate-90" />
          </div>
        </section>

        {/* ----------------------------------------------------
            About Section
            ---------------------------------------------------- */}
        <section id="about" className="py-20 border-t border-white/5 scroll-mt-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display mb-12 flex items-center space-x-3">
            <span className="text-accentBlue font-mono">01.</span>
            <span>About Me</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-lg leading-relaxed text-slate-300 dark:text-slate-400 space-y-4"
              >
                <p>
                  Software Engineer with experience building full-stack, backend, and AI-powered applications using React, Node.js, TypeScript, Python, PostgreSQL, and Docker. Developed scalable RAG systems, published Springer research on deepfake detection (94.5% accuracy), and solved 400+ DSA problems (1550+ LeetCode contest rating).
                </p>
                <p>
                  Graduated with a 9.35 CGPA, combining strong problem-solving with system design fundamentals. Passionate about transforming research ideas into optimized, production-level code.
                </p>
              </motion.div>

              {/* Status and Bio Metadata Grid */}
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="glass p-5 rounded-xl border border-white/5">
                  <div className="text-accentCyan font-bold mb-1 flex items-center gap-2">
                    <MapPin size={16} /> Location
                  </div>
                  <div className="text-slate-300">Delhi NCR, India</div>
                  <div className="text-xs text-slate-400">Open to relocation</div>
                </div>

                <div className="glass p-5 rounded-xl border border-white/5">
                  <div className="text-accentViolet font-bold mb-1 flex items-center gap-2">
                    <GraduationCap size={16} /> Education
                  </div>
                  <div className="text-slate-300 text-sm font-semibold">B.Tech in CSE</div>
                  <div className="text-xs text-slate-400">CGPA: 9.35 / 10</div>
                </div>
              </div>
            </div>

            {/* Quick Education Summary list */}
            <div className="lg:col-span-5 flex flex-col justify-between glass p-6 rounded-2xl border border-white/5">
              <div className="space-y-6">
                <h3 className="text-xl font-bold font-display flex items-center space-x-2 border-b border-white/5 pb-3">
                  <BookOpen size={20} className="text-accentBlue" />
                  <span>Educational Profile</span>
                </h3>
                
                <div className="space-y-4 text-sm">
                  <div className="relative pl-6 border-l-2 border-accentBlue/20">
                    <div className="absolute top-1 left-0 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accentBlue shadow-glow-blue"></div>
                    <div className="font-semibold text-slate-200">B.Tech, Computer Science Engineering</div>
                    <div className="text-xs text-slate-400">GGSIPU, New Delhi (CGPA: 9.35)</div>
                    <div className="text-xs text-accentBlue font-mono mt-0.5">2022 – 2026</div>
                  </div>

                  <div className="relative pl-6 border-l-2 border-accentBlue/20">
                    <div className="absolute top-1 left-0 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accentViolet"></div>
                    <div className="font-semibold text-slate-200">Class XII (CBSE) — 88.6%</div>
                    <div className="text-xs text-slate-400">St. Francis School</div>
                    <div className="text-xs text-accentViolet font-mono mt-0.5">Completed 2022</div>
                  </div>

                  <div className="relative pl-6 border-l-2 border-accentBlue/20">
                    <div className="absolute top-1 left-0 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-accentCyan"></div>
                    <div className="font-semibold text-slate-200">Class X (CBSE) — 89%</div>
                    <div className="text-xs text-slate-400">St. Francis School</div>
                    <div className="text-xs text-accentCyan font-mono mt-0.5">Completed 2020</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------
            Experience Section (with animated counters)
            ---------------------------------------------------- */}
        <section id="experience" className="py-20 border-t border-white/5 scroll-mt-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display mb-12 flex items-center space-x-3">
            <span className="text-accentBlue font-mono">02.</span>
            <span>Experience</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Experience Card */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass p-6 sm:p-8 rounded-2xl border border-white/5 relative overflow-hidden">
                {/* Accent glow corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accentViolet/10 blur-3xl rounded-full"></div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-200">Research & Software Development Intern</h3>
                    <p className="text-accentCyan font-medium flex items-center gap-1 mt-1 text-sm sm:text-base">
                      DRDO, DIPAS, Delhi <span className="text-slate-500 font-normal">| Defence Research & Development Organisation</span>
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 glass rounded-full border border-white/10 text-xs font-semibold text-accentBlue font-mono">
                    Aug 2025 – Feb 2026
                  </div>
                </div>

                <ul className="space-y-3.5 text-slate-300 text-sm sm:text-base leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-accentBlue mt-1 flex-shrink-0" />
                    <span>Developed full-stack Project Management Application with 20+ REST APIs, 10+ database entities, and JWT-secured RBAC.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-accentBlue mt-1 flex-shrink-0" />
                    <span>Optimized backend services and SQL queries, reducing average database API response latency by 35–40%.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-accentBlue mt-1 flex-shrink-0" />
                    <span>Built Python datasets preprocessing pipelines (Pandas, NumPy) for complex biostatistics research inputs, cutting manual data-cleaning effort by 80%.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-accentBlue mt-1 flex-shrink-0" />
                    <span>Created self-serve biostatistics dashboard in React + TS and automated Excel reports analysis via integrated SQLite pipelines.</span>
                  </li>
                </ul>

                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {["React.js", "TypeScript", "Node.js", "Express", "SQLite", "Python", "Pandas", "Streamlit", "JWT", "Tableau"].map((tech) => (
                    <span key={tech} className="px-2.5 py-1 rounded bg-slate-900/60 dark:bg-slate-800/40 border border-white/5 text-xs text-slate-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* DRDO Analytics Count-Up Dashboard Panel */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="glass p-6 rounded-xl border border-white/5 flex flex-col justify-center items-center text-center hover:border-accentBlue/20 transition-all group">
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-accentBlue mb-2">
                  <CountUp end={20} suffix="+" />
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold group-hover:text-slate-300">
                  REST APIs Shipped
                </div>
              </div>

              <div className="glass p-6 rounded-xl border border-white/5 flex flex-col justify-center items-center text-center hover:border-accentViolet/20 transition-all group">
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-accentViolet mb-2">
                  <CountUp end={40} suffix="%" />
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold group-hover:text-slate-300">
                  Latency Reduction
                </div>
              </div>

              <div className="glass p-6 rounded-xl border border-white/5 flex flex-col justify-center items-center text-center hover:border-accentCyan/20 transition-all group">
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-accentCyan mb-2">
                  <CountUp end={80} suffix="%" />
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold group-hover:text-slate-300">
                  Manual Pre-processing Cut
                </div>
              </div>

              <div className="glass p-6 rounded-xl border border-white/5 flex flex-col justify-center items-center text-center hover:border-emerald-500/20 transition-all group">
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-emerald-400 mb-2">
                  <CountUp end={30} suffix="+" />
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold group-hover:text-slate-300">
                  Bugs Resolved
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ----------------------------------------------------
            Projects Section (Bento Grid)
            ---------------------------------------------------- */}
        <section id="projects" className="py-20 border-t border-white/5 scroll-mt-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display flex items-center space-x-3">
                <span className="text-accentBlue font-mono">03.</span>
                <span>Featured Projects</span>
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Click any project card to view its technical architectural breakdown.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 glass p-1.5 rounded-xl border border-white/10 w-fit">
              {['all', 'ai', 'fullstack', 'research'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setProjectFilter(filter as any)}
                  className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg capitalize transition-all ${
                    projectFilter === filter 
                      ? 'bg-accentBlue text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter === 'ai' ? 'AI/ML' : filter}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedProject(project)}
                  className="cursor-pointer h-full"
                >
                  <TiltCard className="glass h-full p-6 flex flex-col justify-between border border-white/5 hover:border-white/10 rounded-2xl shadow-lg relative overflow-hidden group hover:shadow-glow-blue transition-all duration-300">
                    <div>
                      {/* Project Header */}
                      <div className="flex items-center justify-between mb-4 gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-slate-900 border border-white/10 text-slate-400">
                          {project.category === 'ai' ? 'AI / ML' : project.category}
                        </span>
                        {project.badge && (
                          <span 
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerConfetti();
                            }}
                            className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-gradient-to-r from-accentBlue to-accentViolet text-white shadow animate-pulse"
                          >
                            {project.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold font-display mb-2 group-hover:text-accentCyan transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        {project.shortDesc}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="text-[11px] font-semibold text-accentBlue dark:text-accentCyan bg-accentBlue/10 dark:bg-accentCyan/10 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 4 && (
                          <span className="text-[11px] font-semibold text-slate-500 px-2 py-0.5">
                            +{project.tags.length - 4} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-xs font-semibold text-accentBlue group-hover:translate-x-1 transition-transform">
                        <span>Details</span>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Project Expanded Modal Overlay */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="glass border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header banner */}
                <div className="relative h-4 py-3 bg-gradient-to-r from-accentBlue via-accentViolet to-accentCyan">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute right-4 top-2 bg-slate-900/80 p-1.5 rounded-full text-white hover:bg-slate-900 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded text-xs uppercase font-bold bg-slate-900 text-slate-400 border border-white/5">
                        {selectedProject.category}
                      </span>
                      {selectedProject.badge && (
                        <span className="px-2.5 py-0.5 rounded text-xs uppercase font-bold bg-gradient-to-r from-accentBlue to-accentViolet text-white">
                          {selectedProject.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold font-display text-slate-100">{selectedProject.title}</h3>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-accentBlue">Overview</h4>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                      {selectedProject.longDesc}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-accentViolet">Key Impact & Outcomes</h4>
                    <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-accentViolet pl-4">
                      {selectedProject.impact}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-accentCyan">Technologies Utilized</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag) => (
                        <span key={tag} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-white/10 hover:border-white/20 text-white rounded-xl text-sm font-semibold transition-all hover:bg-slate-950"
                    >
                      <Github size={18} />
                      <span>View GitHub Repository</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ----------------------------------------------------
            Tech Arsenal Section
            ---------------------------------------------------- */}
        <section id="tech" className="py-20 border-t border-white/5 scroll-mt-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display mb-12 flex items-center space-x-3">
            <span className="text-accentBlue font-mono">04.</span>
            <span>Technical Arsenal</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(techArsenal).map(([category, skills]) => (
              <div 
                key={category} 
                className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 hover:shadow-glow-violet transition-all duration-300 flex flex-col space-y-4"
              >
                <h3 className="text-lg font-bold font-display border-b border-white/5 pb-2 text-slate-200 flex items-center gap-2">
                  {category === "Languages" && <Code size={18} className="text-accentBlue" />}
                  {category === "Frontend" && <Globe size={18} className="text-accentBlue" />}
                  {category === "Backend" && <Cpu size={18} className="text-accentViolet" />}
                  {category === "Databases" && <Database size={18} className="text-accentViolet" />}
                  {category === "Cloud & DevOps" && <Cloud size={18} className="text-accentCyan" />}
                  {category === "AI & Machine Learning" && <Activity size={18} className="text-accentCyan" />}
                  {category === "Core Computer Science" && <Terminal size={18} className="text-emerald-400" />}
                  {category === "Tools & Frameworks" && <Award size={18} className="text-emerald-400" />}
                  <span>{category}</span>
                </h3>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="text-xs px-2.5 py-1 rounded bg-slate-900/60 dark:bg-slate-800/40 border border-white/5 text-slate-300 hover:text-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------
            Achievements Section (Certifications & Stats)
            ---------------------------------------------------- */}
        <section id="achievements" className="py-20 border-t border-white/5 scroll-mt-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display mb-12 flex items-center space-x-3">
            <span className="text-accentBlue font-mono">05.</span>
            <span>Achievements & Certs</span>
          </h2>

          {/* Numerical By The Numbers Statistics Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            <div className="glass p-5 rounded-xl border border-white/5 text-center hover:border-accentBlue/20 transition-all">
              <div className="text-3xl font-extrabold font-display text-accentBlue mb-1">
                <CountUp end={400} suffix="+" />
              </div>
              <div className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-slate-400">DSA Solved</div>
            </div>
            
            <div className="glass p-5 rounded-xl border border-white/5 text-center hover:border-accentViolet/20 transition-all">
              <div className="text-3xl font-extrabold font-display text-accentViolet mb-1">
                <CountUp end={1550} suffix="+" />
              </div>
              <div className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-slate-400">LeetCode Rating</div>
            </div>

            <div className="glass p-5 rounded-xl border border-white/5 text-center hover:border-accentCyan/20 transition-all">
              <div className="text-3xl font-extrabold font-display text-accentCyan mb-1">
                <CountUp end={94} suffix=".5%" />
              </div>
              <div className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-slate-400">Model Accuracy</div>
            </div>

            <div className="glass p-5 rounded-xl border border-white/5 text-center hover:border-emerald-500/20 transition-all">
              <div className="text-3xl font-extrabold font-display text-emerald-400 mb-1">
                <CountUp end={9} suffix=".35" />
              </div>
              <div className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-slate-400">B.Tech CGPA</div>
            </div>

            <div className="glass p-5 rounded-xl border border-white/5 text-center hover:border-pink-500/20 transition-all col-span-2 md:col-span-1">
              <div className="text-3xl font-extrabold font-display text-pink-500 mb-1">
                <CountUp end={1} />
              </div>
              <div className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-slate-400">Springer Pub</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Certifications Grid */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xl font-bold font-display border-b border-white/5 pb-2 mb-4 text-slate-200">
                Professional Certifications
              </h3>

              <div className="space-y-3">
                <div className="glass p-4 rounded-xl border border-white/5 hover:border-accentBlue/20 transition-colors flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-200">IBM Full Stack Software Developer</h4>
                    <p className="text-xs text-slate-400">Coursera Professional Certificate</p>
                  </div>
                  <Award className="text-accentBlue flex-shrink-0" size={20} />
                </div>

                <a 
                  href="https://www.credly.com/badges/e1ac4e9a-fdec-4c62-88d0-4ff679cf82d8" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="glass p-4 rounded-xl border border-white/5 hover:border-accentViolet/20 transition-colors flex items-center justify-between gap-4 group"
                >
                  <div>
                    <h4 className="font-semibold text-slate-200 group-hover:text-accentViolet transition-colors">IBM — Liberty Developer Essentials</h4>
                    <p className="text-xs text-slate-400">IBM Cloud Pak for Applications</p>
                  </div>
                  <ExternalLink className="text-slate-400 group-hover:text-accentViolet transition-colors" size={16} />
                </a>

                <div className="glass p-4 rounded-xl border border-white/5 hover:border-accentCyan/20 transition-colors flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-200">Internet of Things Student Program</h4>
                    <p className="text-xs text-slate-400">E&ICT Academy, IIT Kanpur (MeitY)</p>
                  </div>
                  <Award className="text-accentCyan flex-shrink-0" size={20} />
                </div>

                <div className="glass p-4 rounded-xl border border-white/5 hover:border-emerald-500/20 transition-colors flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-slate-200">Data Analytics Job Simulation</h4>
                    <p className="text-xs text-slate-400">Deloitte Australia — Forage (ID: kggvFXATqjoRaCi4Q)</p>
                  </div>
                  <Award className="text-emerald-500 flex-shrink-0" size={20} />
                </div>
              </div>
            </div>

            {/* Core Achievements & Extracurriculars */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xl font-bold font-display border-b border-white/5 pb-2 mb-4 text-slate-200">
                Key Accomplishments
              </h3>

              <div className="glass p-6 rounded-2xl border border-white/5 space-y-4 text-sm h-full">
                <div className="flex items-start gap-3">
                  <Award className="text-accentBlue mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <strong className="text-slate-200 block">Runner-Up, GeeksforGeeks Hackathon 2024</strong>
                    <span className="text-slate-400 text-xs">Held at ADGIPS campus, New Delhi.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="text-accentViolet mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <strong className="text-slate-200 block">Springer Published Author</strong>
                    <span className="text-slate-400 text-xs">Springer ICAMC 2026: "Dual-Stream Deepfake & AI Image Detection".</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="text-accentCyan mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <strong className="text-slate-200 block">Chief Magazine Editor</strong>
                    <span className="text-slate-400 text-xs">Computer Science Department Magazine, ADGIPS.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ----------------------------------------------------
            Education Section (Timeline)
            ---------------------------------------------------- */}
        <section id="education" className="py-20 border-t border-white/5 scroll-mt-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display mb-12 flex items-center space-x-3">
            <span className="text-accentBlue font-mono">06.</span>
            <span>Education History</span>
          </h2>

          <div ref={timelineRef} className="relative border-l border-white/10 ml-4 md:ml-8 pl-6 md:pl-10 space-y-12">
            
            {/* Timeline Item 1 */}
            <div className="education-item relative">
              {/* timeline bullet */}
              <div className="edu-dot absolute left-0 top-1.5 -translate-x-[31px] md:-translate-x-[47px] w-5 h-5 rounded-full bg-slate-900 border-4 border-accentBlue shadow-glow-blue z-10 transition-transform duration-300"></div>
              
              <div className="edu-content glass p-6 rounded-2xl border border-white/5 relative hover:border-accentBlue/20 transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-100">B.Tech, Computer Science Engineering</h3>
                  <span className="px-3 py-1 glass border border-white/10 rounded-full text-xs font-mono text-accentBlue">
                    2022 – 2026
                  </span>
                </div>
                <h4 className="text-sm font-medium text-slate-300">Dr. Akhilesh Das Gupta Institute of Professional Studies (GGSIPU), New Delhi</h4>
                <p className="text-xs text-accentCyan mt-2 font-mono">CGPA: 9.35 / 10</p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="education-item relative">
              {/* timeline bullet */}
              <div className="edu-dot absolute left-0 top-1.5 -translate-x-[31px] md:-translate-x-[47px] w-5 h-5 rounded-full bg-slate-900 border-4 border-accentViolet shadow-glow-violet z-10 transition-transform duration-300"></div>
              
              <div className="edu-content glass p-6 rounded-2xl border border-white/5 relative hover:border-accentViolet/20 transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-100">Class XII (CBSE) Senior Secondary</h3>
                  <span className="px-3 py-1 glass border border-white/10 rounded-full text-xs font-mono text-accentViolet">
                    Completed 2022
                  </span>
                </div>
                <h4 className="text-sm font-medium text-slate-300">St. Francis School, New Delhi</h4>
                <p className="text-xs text-accentCyan mt-2 font-mono">Agg: 88.6%</p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="education-item relative">
              {/* timeline bullet */}
              <div className="edu-dot absolute left-0 top-1.5 -translate-x-[31px] md:-translate-x-[47px] w-5 h-5 rounded-full bg-slate-900 border-4 border-accentCyan shadow-glow-cyan z-10 transition-transform duration-300"></div>
              
              <div className="edu-content glass p-6 rounded-2xl border border-white/5 relative hover:border-accentCyan/20 transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-100">Class X (CBSE) Secondary</h3>
                  <span className="px-3 py-1 glass border border-white/10 rounded-full text-xs font-mono text-accentCyan">
                    Completed 2020
                  </span>
                </div>
                <h4 className="text-sm font-medium text-slate-300">St. Francis School, New Delhi</h4>
                <p className="text-xs text-accentCyan mt-2 font-mono">Agg: 89%</p>
              </div>
            </div>

          </div>
        </section>

        {/* ----------------------------------------------------
            Contact Section
            ---------------------------------------------------- */}
        <section id="contact" className="py-20 border-t border-white/5 scroll-mt-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display mb-12 flex items-center space-x-3">
            <span className="text-accentBlue font-mono">07.</span>
            <span>Get In Touch</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Contact Direct info & Social buttons */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <p className="text-lg text-slate-300 dark:text-slate-400 leading-relaxed">
                  I'm always open to discussing new SDE roles, internship opportunities, research partnerships, or interesting software builds. Let's connect and build something impactful!
                </p>
                
                <div className="space-y-4 pt-4">
                  <a 
                    href="mailto:japinder2004@gmail.com" 
                    className="flex items-center gap-4 text-slate-300 hover:text-accentCyan transition-colors group w-fit"
                  >
                    <div className="p-3 bg-slate-900 border border-white/5 rounded-xl group-hover:border-accentCyan group-hover:shadow-glow-cyan transition-all">
                      <Mail size={20} className="text-accentCyan" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 font-bold block">Email Me</span>
                      <span className="text-sm font-semibold">japinder2004@gmail.com</span>
                    </div>
                  </a>

                  <a 
                    href="tel:+919717091015" 
                    className="flex items-center gap-4 text-slate-300 hover:text-accentBlue transition-colors group w-fit"
                  >
                    <div className="p-3 bg-slate-900 border border-white/5 rounded-xl group-hover:border-accentBlue group-hover:shadow-glow-blue transition-all">
                      <Phone size={20} className="text-accentBlue" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 font-bold block">Call / Telegram</span>
                      <span className="text-sm font-semibold">+91 9717091015</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Social Channels Row */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-bold tracking-widest text-slate-500">Connect Online</h4>
                <div className="flex gap-4">
                  
                  <Magnetic>
                    <a
                      href="https://linkedin.com/in/JapinderSingh26"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 glass border border-white/10 rounded-xl hover:text-accentBlue text-slate-300 hover:shadow-glow-blue transition-all"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin size={20} />
                    </a>
                  </Magnetic>

                  <Magnetic>
                    <a
                      href="https://github.com/Jsingh26"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 glass border border-white/10 rounded-xl hover:text-white text-slate-300 transition-all"
                      aria-label="GitHub Profile"
                    >
                      <Github size={20} />
                    </a>
                  </Magnetic>

                  <Magnetic>
                    <a
                      href="https://leetcode.com/u/japinder_singh26"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => triggerConfetti()}
                      className="p-3.5 glass border border-white/10 rounded-xl hover:text-amber-500 text-slate-300 hover:shadow-glow-cyan transition-all"
                      aria-label="LeetCode Profile"
                    >
                      <FileText size={20} />
                    </a>
                  </Magnetic>

                </div>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="lg:col-span-7">
              <div className="glass p-6 sm:p-8 rounded-2xl border border-white/5">
                {formSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <CheckCircle2 size={48} className="text-emerald-400 mx-auto animate-bounce" />
                    <h3 className="text-xl font-bold">Message Transmitted!</h3>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto">
                      Thank you, Japinder will review your message and reply via email as soon as possible.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div className="space-y-1">
                      <label htmlFor="name" className="text-xs uppercase font-bold tracking-widest text-slate-400 block">Name</label>
                      <input 
                        id="name"
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-900/60 dark:bg-slate-950/40 border border-white/5 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-accentBlue focus:shadow-glow-blue transition-all text-sm"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="email" className="text-xs uppercase font-bold tracking-widest text-slate-400 block">Email Address</label>
                      <input 
                        id="email"
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-900/60 dark:bg-slate-950/40 border border-white/5 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-accentViolet focus:shadow-glow-violet transition-all text-sm"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="message" className="text-xs uppercase font-bold tracking-widest text-slate-400 block">Message</label>
                      <textarea 
                        id="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-slate-900/60 dark:bg-slate-950/40 border border-white/5 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-accentCyan focus:shadow-glow-cyan transition-all text-sm"
                        placeholder="Let's build something amazing together..."
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-accentBlue via-accentViolet to-accentCyan text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-accentViolet/20 hover:brightness-110 flex items-center justify-center gap-2"
                    >
                      <span>Send Secure Message</span>
                      <ArrowRight size={16} />
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer Marquee Banner */}
      <div className="w-full overflow-hidden border-y border-white/5 bg-slate-900/60 dark:bg-slate-950/30 py-3 pointer-events-none">
        <div className="flex animate-marquee whitespace-nowrap gap-12 text-xs font-mono tracking-widest text-slate-400 dark:text-slate-500">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex gap-12">
              <span>LET'S BUILD SOMETHING UNIQUE</span>
              <span>•</span>
              <span>TURNING RESEARCH INTO PRODUCTION</span>
              <span>•</span>
              <span>AVAILABLE FOR OPPORTUNITIES</span>
              <span>•</span>
              <span>JAPINDER SINGH</span>
              <span>•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-8 border-t border-white/5 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© 2026 Japinder Singh. Built from scratch with React, Vite, TS, Tailwind and Framer Motion.</p>
        <p className="flex items-center gap-1.5">
          <Terminal size={12} className="text-accentBlue" />
          <span>Optimized for 60fps scrolling</span>
        </p>
      </footer>
    </div>
  );
};

export default App;
