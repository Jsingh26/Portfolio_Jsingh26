// App.jsx
import React, { useState, useEffect } from 'react';
import { Mail, Phone, Linkedin, Github, Code, Database, Globe, Award, Calendar, ExternalLink, Menu, X, ChevronDown } from 'lucide-react';
import './App.css';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Handle scroll to update active navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Navigation Link Component
  const NavLink = ({ href, children }) => (
    <button
      onClick={() => scrollToSection(href)}
      className={`nav-link ${activeSection === href ? 'active' : ''}`}
    >
      {children}
    </button>
  );

  // Projects data - Updated from new resume
  const projects = [
    {
      title: "AI Emotion Detection & Video Analytics System",
      description: "Developed an AI-based emotion detection system using Python, DeepFace, and OpenCV to analyze facial emotions from videos and webcam feeds. Built a PyQt6 GUI supporting batch video processing and real-time emotion visualization. Generated visual analytics and exported emotion datasets to CSV.",
      impact: "Complete emotion analytics pipeline with GUI and data export capabilities.",
      tech: ["Python", "DeepFace", "OpenCV", "PyQt6", "Pandas"]
    },
    {
      title: "MERN Stack Food Delivery Platform",
      period: "Recent",
      description: "Developed a full-stack food delivery platform using Node.js, Express, React, and MongoDB. Implemented authentication, order tracking, and RESTful APIs for efficient backend communication. Designed optimized database schemas for managing user and order data.",
      impact: "Complete full-stack application with authentication and real-time order tracking.",
      tech: ["Node.js", "Express", "React", "MongoDB"]
    },
    {
      title: "Real-Time Emergency SOS & GPS Tracking Application",
      period: "Hackathon Project",
      description: "Built a safety application with GPS tracking and SOS alerts using location-based services. Implemented real-time location sharing to improve emergency response.",
      impact: "Selected as a finalist in a college hackathon.",
      tech: ["JavaScript", "REST APIs", "GPS APIs"]
    }
  ];

  // Skills data - Updated from new resume
  const skills = {
    Programming: {
      skills: ["Java", "Python", "C++", "JavaScript"],
      icon: <Code className="skill-icon programming" />
    },
    Frontend: {
      skills: ["React.js", "HTML5", "CSS3", "Tailwind", "SASS"],
      icon: <Globe className="skill-icon frontend" />
    },
    Backend: {
      skills: ["Node.js", "Express.js", "PHP", "Flask"],
      icon: <Code className="skill-icon backend" />
    },
    Frameworks: {
      skills: ["Streamlit", "Flask", "Express.js"],
      icon: <Code className="skill-icon frameworks" />
    },
    Databases: {
      skills: ["MongoDB", "SQL"],
      icon: <Database className="skill-icon database" />
    },
    Tools: {
      skills: ["Git", "GitHub", "Postman", "VS Code"],
      icon: <Award className="skill-icon tools" />
    },
    Concepts: {
      skills: ["REST APIs", "Data Structures & Algorithms", "Agile Development", "Data Visualization"],
      icon: <Award className="skill-icon concepts" />
    }
  };

  return (
    <div className="portfolio">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo">
            Japinder Singh
          </div>
          
          {/* Desktop Navigation */}
          <div className="nav-links">
            <NavLink href="home">Home</NavLink>
            <NavLink href="about">About</NavLink>
            <NavLink href="skills">Skills</NavLink>
            <NavLink href="projects">Projects</NavLink>
            <NavLink href="experience">Experience</NavLink>
            <NavLink href="contact">Contact</NavLink>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mobile-menu-btn"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="mobile-nav-links">
            <NavLink href="home">Home</NavLink>
            <NavLink href="about">About</NavLink>
            <NavLink href="skills">Skills</NavLink>
            <NavLink href="projects">Projects</NavLink>
            <NavLink href="experience">Experience</NavLink>
            <NavLink href="contact">Contact</NavLink>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Hi, I'm <span className="hero-name">Japinder</span>
            </h1>
            <p className="hero-subtitle">
              Full-Stack Developer | Computer Science Undergraduate
            </p>
            <p className="hero-description">
              Passionate about building impactful web solutions with modern technologies
            </p>
            <div className="hero-buttons">
              <button
                onClick={() => scrollToSection('projects')}
                className="btn-primary"
              >
                View My Work
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="btn-secondary"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section bg-white">
        <div className="section-container">
          <h2 className="section-title">About Me</h2>
          
          <div className="about-grid">
            <div className="about-content">
              <h3>Computer Science Student & Full-Stack Developer</h3>
              <p>
                Computer Science undergraduate passionate about building scalable software and AI-powered applications. 
                Former Research Intern at DRDO, where I worked on physiological data analytics and interactive dashboards 
                for research workflows. Experienced in full-stack development using React, Node.js, and Python, with a 
                strong foundation in data analysis, backend systems, and problem solving.
              </p>
              
              <div className="contact-info">
                <div className="contact-item">
                  <Mail className="contact-icon" size={20} />
                  <span className="contact-text">japinder2004@gmail.com</span>
                </div>
                <div className="contact-item">
                  <Phone className="contact-icon" size={20} />
                  <span className="contact-text">+91 9717091015</span>
                </div>
              </div>
            </div>
            
            <div className="education-card">
              <h4>Education</h4>
              <div className="education-items">
                <div className="education-item">
                  <h5>B.Tech in Computer Science Engineering</h5>
                  <p>Guru Gobind Singh Indraprastha University</p>
                  <p className="date">Nov 2022 – Jul 2026 • CGPA: 9.1/10</p>
                </div>
                <div className="education-item">
                  <h5>Senior Secondary (Class XII)</h5>
                  <p>St. Francis School, CBSE</p>
                  <p className="date">2022 • 88.6%</p>
                </div>
                <div className="education-item">
                  <h5>Secondary (Class X)</h5>
                  <p>St. Francis School, CBSE</p>
                  <p className="date">2022 • 89%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section bg-gray">
        <div className="section-container">
          <h2 className="section-title">Technical Skills</h2>
          
          <div className="skills-grid">
            {Object.entries(skills).map(([category, data]) => (
              <div key={category} className="skill-card">
                <div className="skill-header">
                  {data.icon}
                  <h3 className="skill-title">{category}</h3>
                </div>
                <div className="skill-tags">
                  {data.skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section bg-white">
        <div className="section-container">
          <h2 className="section-title">Featured Projects</h2>
          
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  <span className="project-period">{project.period}</span>
                </div>
                
                <p className="project-description">{project.description}</p>
                
                <div className="project-impact">
                  <p className="project-impact-text">
                    <strong>Impact:</strong> {project.impact}
                  </p>
                </div>
                
                <div className="project-tech">
                  {project.tech.map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="section bg-gray">
        <div className="section-container">
          <h2 className="section-title">Experience & Certifications</h2>
          
<div className="experience-grid">
            <div className="experience-card">
              <h3 className="experience-title">Research Intern</h3>
              <div className="experience-item">
                <h4>Defence Institute of Physiology and Allied Sciences (DRDO)</h4>
                <p className="company">Delhi, India</p>
                <p className="date">Aug 2025 – Feb 2026</p>
                <ul className="experience-list">
                  <li>• Applied data science techniques to analyze physiological datasets supporting biostatistics research</li>
                  <li>• Built Python data pipelines using Pandas and NumPy for data preprocessing and analysis</li>
                  <li>• Developed a React + TypeScript dashboard for interactive research data visualization</li>
                  <li>• Implemented secure data handling practices aligned with DRDO research standards</li>
                </ul>
                <div className="project-tech">
                  <strong>Tech:</strong> Python, Pandas, NumPy, SQL, React, TypeScript, Tableau
                </div>
              </div>
            </div>
            
            <div className="experience-card">
              <h3 className="experience-title">Certifications</h3>
              <div className="certifications-list">
                <div className="certification-item">
                  <h4>IBM: Full Stack Software Development</h4>
                  <p className="provider">Coursera</p>
                </div>
                <div className="certification-item">
                  <h4>100xDevs Cohort 2.0</h4>
                  <p className="provider">MERN Stack, DevOps</p>
                </div>
              </div>
            </div>

            <div className="experience-card achievements-card">
              <h3 className="experience-title">Achievements</h3>
              <ul className="experience-list">
                <li>• Solved 200+ problems on coding platforms focusing on Data Structures and Algorithms</li>
              </ul>
            </div>

            <div className="experience-card extracurricular-card">
              <h3 className="experience-title">Extracurricular</h3>
              <ul className="experience-list">
                <li>• Chief Magazine Editor -- Computer Science Department</li>
                <li>• Participated in multiple inter-college hackathons and technical competitions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="section-container">
          <h2 className="section-title">Get In Touch</h2>
          
          <div className="contact-intro">
            <p>
              I'm always open to discussing new opportunities and interesting projects. 
              Let's connect and build something amazing together!
            </p>
            
            <div className="contact-grid">
              <a
                href="mailto:japinder2004@gmail.com"
                className="contact-card"
              >
                <Mail className="contact-card-icon" size={32} />
                <h3>Email</h3>
                <p>japinder2004@gmail.com</p>
              </a>
              
              <a
                href="tel:+919717091015"
                className="contact-card"
              >
                <Phone className="contact-card-icon" size={32} />
                <h3>Phone</h3>
                <p>+91 9717091015</p>
              </a>
            </div>
            
            <div className="social-links">
              <a
                href="https://linkedin.com/in/JapinderSingh26"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Linkedin className="social-icon" size={24} />
              </a>
              <a
                href="https://github.com/Jsingh26"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Github className="social-icon" size={24} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="section-container">
          <div className="text-center">
            <p>
              © 2025 Japinder Singh. Built with React and CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;