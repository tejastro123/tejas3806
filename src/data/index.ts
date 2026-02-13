import { Github, Linkedin, Mail, Twitter, FileText, Cpu, Rocket, Code2, Facebook, Instagram, X } from "lucide-react";

export const personalInfo = {
  name: "Mellimpudi Tejas",
  role: "CS & Physics Student | Developer",
  email: "tejas.mellimpudi@gmail.com",
  location: "Hyderabad, India",
  bio: {
    short: "Dual Degree student at BITS Pilani exploring Robotics, Computer Science, Space Tech, Physics, Modern Tech and Software.",
    long: "I am a dual degree student at BITS Pilani pursuing M.Sc. Physics and B.E. Computer Science. My interests lie at the intersection of software and hardware, ranging from building robots and designing and developing web applications using MERN Stack. I grew up in Sriharikota, which ignited my passion for Science and Technology.",
  },
};

export const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/tejastro123",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tejas-mellimpudi/",
    icon: Linkedin,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/tejas.mellimpudi",
    icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/tejas_mellimpudi/",
    icon: Instagram,
  },
  {
    label: "X",
    href: "https://x.com/tejas_mellimpudi",
    icon: X,
  },
  {
    label: "Email",
    href: `mailto:${personalInfo.email}`,
    icon: Mail,
  },

];

export const about = {
  funFacts: [
    "🚀 Growing up in Sriharikota, I watched rocket launches since childhood",
    "🤖 Active member of the Robotics Club (ARC), Mars Rover Team and Computer Science Club (CSA)",
    "🏏 All-rounder in the Cricket Team",
    "🎬 Huge fan of Sci-Fi movies and Space Tech",
  ],
};

export const experience = [
  {
    type: "work",
    title: "Rover Electronics Team",
    org: "Vanguard Club (Mars Rover Team)",
    date: "Nov 2024 – Present",
    description: "Designing a Mars rover prototype, focusing on electric circuit boards and electronics integration.",
  },
  {
    type: "work",
    title: "Electronic Department Member",
    org: "Robotics Club (ARC)",
    date: "Sep 2023 – Present",
    description: "Designed and built robots including a Monster Robowar bot and a Line Following bot. Gained hands-on experience in C++, Arduino, and troubleshooting hardware.",
  },
  {
    type: "work",
    title: "R&D Member",
    org: "Spectrum Club (Physics Dept)",
    date: "Sep 2023 – Present",
    description: "Conducting physics experiments and researching theoretical concepts.",
  },
  {
    type: "work",
    title: "Teacher Assistant",
    org: "BITS Pilani",
    date: "Jan 2025 – Present",
    description: "Assisting teachers with classroom tasks, conducting tests, and managing records.",
  },
  {
    type: "education",
    title: "M.Sc. Physics + B.E. Computer Science",
    org: "BITS Pilani",
    date: "2023 – Present",
    description: "Dual Degree Program. CGPA: 8.58. Course is a mix of Physics and Computer Science.",
  },
];

export const projects = [
  {
    title: "tejas3806",
    description: "Personal portfolio website built with React and Vite.",
    tags: ["TypeScript", "React", "Portfolio"],
    category: "Web Dev",
    demo: "#",
    github: "https://github.com/tejastro123/tejas3806",
  },
  {
    title: "webrtc",
    description: "WebRTC implementation for real-time communication.",
    tags: ["JavaScript", "WebRTC", "Real-time"],
    category: "Web Dev",
    demo: "https://webrtc-eight-olive.vercel.app",
    github: "https://github.com/tejastro123/webrtc",
  },
  {
    title: "CPP-DSA",
    description: "Comprehensive collection of Data Structures and Algorithms implementation in C++.",
    tags: ["C++", "Algorithms", "DSA"],
    category: "Algorithms",
    demo: "#",
    github: "https://github.com/tejastro123/CPP-DSA",
  },
  {
    title: "web-dev-pjt",
    description: "Web development project showcasing frontend skills.",
    tags: ["JavaScript", "HTML", "CSS"],
    category: "Web Dev",
    demo: "#",
    github: "https://github.com/tejastro123/web-dev-pjt",
  },
  {
    title: "WEB-DEV-basics",
    description: "WEB DEV - HTML,CSS,JS",
    tags: ["HTML", "CSS", "JavaScript"],
    category: "Web Dev",
    demo: "#",
    github: "https://github.com/tejastro123/WEB-DEV-basics",
  },
  {
    title: "Quantum-Projects",
    description: "A collection of quantum computing projects and experiments using Qiskit.",
    tags: ["Jupyter Notebook", "Qiskit", "Physics"],
    category: "Quantum Computing",
    demo: "#",
    github: "https://github.com/tejastro123/Quantum-Projects",
  },
  {
    title: "QUICKIDE",
    description: "QUICKIDE — A lightweight GUI IDE for writing, visualizing, and simulating quantum programs using the custom QuCPL language.",
    tags: ["Python", "Quantum Computing", "GUI"],
    category: "Software Tool",
    demo: "#",
    github: "https://github.com/tejastro123/QUICKIDE",
  },
  {
    title: "qiskit-tutorials",
    description: "Tutorials and examples for learning Qiskit.",
    tags: ["Jupyter Notebook", "Qiskit", "Tutorial"],
    category: "Quantum Computing",
    demo: "#",
    github: "https://github.com/tejastro123/qiskit-tutorials",
  },
  {
    title: "LIVEMART",
    description: "A full-stack e-commerce application. Features a modern UI and seamless shopping experience.",
    tags: ["JavaScript", "React", "Web"],
    category: "Full Stack",
    demo: "https://livemart-main.vercel.app",
    github: "https://github.com/tejastro123/LIVEMART",
  },
  {
    title: "tejastro123",
    description: "Hi 👋, I'm Tejas Mellimpudi",
    tags: ["Config", "Profile"],
    category: "Other",
    demo: "#",
    github: "https://github.com/tejastro123/tejastro123",
  },
  {
    title: "2025-sem1-cni-inductions",
    description: "Induction tasks for CNI 2025.",
    tags: ["Academic", "Assignments"],
    category: "Other",
    demo: "#",
    github: "https://github.com/tejastro123/2025-sem1-cni-inductions",
  },
  {
    title: "Agentic-AI-Lynq",
    description: "Exploration of Agentic AI systems and implementations.",
    tags: ["Python", "AI", "Agents"],
    category: "AI/ML",
    demo: "#",
    github: "https://github.com/tejastro123/Agentic-AI-Lynq",
  },
  {
    title: "MY-REACT",
    description: "Personal React projects and experiments.",
    tags: ["JavaScript", "React"],
    category: "Frontend",
    demo: "#",
    github: "https://github.com/tejastro123/MY-REACT",
  },
  {
    title: "text-app",
    description: "A text processing application.",
    tags: ["JavaScript", "Utility"],
    category: "Web Dev",
    demo: "#",
    github: "https://github.com/tejastro123/text-app",
  },
  {
    title: "JAVA_DSA",
    description: "Data Structures and Algorithms in Java.",
    tags: ["Java", "DSA"],
    category: "Algorithms",
    demo: "#",
    github: "https://github.com/tejastro123/JAVA_DSA",
  },
  {
    title: "CPP",
    description: "A well-organized collection of DSA problems with solutions in C++, Python.",
    tags: ["C++", "DSA", "Algorithms"],
    category: "Algorithms",
    demo: "#",
    github: "https://github.com/tejastro123/CPP",
  },
  {
    title: "Python-basic",
    description: "Basic Python programming examples and exercises.",
    tags: ["Python", "Basics"],
    category: "Programming",
    demo: "#",
    github: "https://github.com/tejastro123/Python-basic",
  },
  {
    title: "100-days-of-Python",
    description: "Code from the 100 Days of Code Python challenge.",
    tags: ["Python", "Challenge"],
    category: "Programming",
    demo: "#",
    github: "https://github.com/tejastro123/100-days-of-Python",
  },
  {
    title: "Python-DSA",
    description: "Data Structures and Algorithms in Python.",
    tags: ["Python", "DSA"],
    category: "Algorithms",
    demo: "#",
    github: "https://github.com/tejastro123/Python-DSA",
  },
  {
    title: "JAVA_tutorial",
    description: "Java programming tutorials and code snippets.",
    tags: ["Java", "Tutorial"],
    category: "Programming",
    demo: "#",
    github: "https://github.com/tejastro123/JAVA_tutorial",
  },
  {
    title: "MY-QUCPL",
    description: "A custom-designed quantum programming language and toolchain.",
    tags: ["Jupyter Notebook", "Quantum", "Language Design"],
    category: "Quantum Computing",
    demo: "https://my-qucpl.vercel.app",
    github: "https://github.com/tejastro123/MY-QUCPL",
  },
  {
    title: "Quantum-Computing-Resources",
    description: "Curated resources for learning Quantum Computing.",
    tags: ["Jupyter Notebook", "Resources", "Quantum"],
    category: "Quantum Computing",
    demo: "#",
    github: "https://github.com/tejastro123/Quantum-Computing-Resources",
  },
  {
    title: "ML",
    description: "Explains key ML algorithms from scratch and implements projects.",
    tags: ["Machine Learning", "Python"],
    category: "AI/ML",
    demo: "#",
    github: "https://github.com/tejastro123/ML",
  },
  {
    title: "Django",
    description: "A repository of Django-based web applications.",
    tags: ["Python", "Django", "Web"],
    category: "Backend",
    demo: "#",
    github: "https://github.com/tejastro123/Django",
  },
  {
    title: "DATA-SCIENCE",
    description: "Data Science projects and notebooks.",
    tags: ["Jupyter Notebook", "Data Science"],
    category: "Data Science",
    demo: "#",
    github: "https://github.com/tejastro123/DATA-SCIENCE",
  },
];

export const skills = [
  {
    title: "Languages",
    color: "bg-primary/10 text-primary border-primary/20",
    skills: [
      { name: "C++", level: 90 },
      { name: "Python", level: 85 },
      { name: "JavaScript", level: 80 },
      { name: "HTML/CSS", level: 85 },
    ],
  },
  {
    title: "Hardware & Robotics",
    color: "bg-secondary/10 text-secondary border-secondary/20",
    skills: [
      { name: "Arduino", level: 90 },
      { name: "Circuit Design", level: 80 },
      { name: "Sensors", level: 85 },
      { name: "Robotics", level: 85 },
    ],
  },
  {
    title: "Frameworks & Tools",
    color: "bg-accent/10 text-accent border-accent/20",
    skills: [
      { name: "Django", level: 60 },
      { name: "Pandas/Matplotlib", level: 75 },
      { name: "Git", level: 80 },
      { name: "VS Code", level: 90 },
    ],
  },
];

export const blogPosts = [
  {
    title: "My Journey in Robotics",
    date: "Feb 2026",
    excerpt: "Experiences building combat robots and exploring autonomous navigation with ARC.",
    link: "#",
  },
  {
    title: "Physics & Programming",
    date: "Jan 2026",
    excerpt: "How my dual degree in Physics and CS helps me model real-world systems.",
    link: "#",
  },
];

export const testimonials = [
  {
    quote: "Tejas is a dedicated member of the robotics club, always eager to solving complex hardware challenges.",
    name: "Club Senior",
    role: "President, ARC",
  },
  {
    quote: "A bright student with strong analytical skills in both physics and computer science.",
    name: "Professor",
    role: "BITS Pilani",
  },
];

