
import {
  Github, Linkedin, Mail, Cpu, Rocket, Code2,
  Instagram, X, Terminal, Globe, Microscope, Laptop
} from "lucide-react";

export const personalInfo = {
  name: "Mellimpudi Tejas",
  role: "AIMLDS Engineer & Physicist",
  email: "tejas.mellimpudi@gmail.com",
  location: "Hyderabad, India",
  avatar: "https://github.com/tejastro123.png", // Auto-pulls your GitHub profile pic
  bio: {
    tagline: "Bridging the gap between Theoretical Physics and Computational Reality.",
    short: "Dual Degree scholar at BITS Pilani engineering the future of Robotics, Space Tech, and Full-Stack Systems.",
    long: "I stand at the convergence of hardware and software. As a Dual Degree student at BITS Pilani, I blend the analytical rigor of Theoretical Physics with the structural precision of Computer Science. Raised in the shadow of launchpads at Sriharikota, my passion for aerospace and robotics is innate. I don't just write code; I build systems that interact with the physical world—from designing Mars Rover avionics to architecting custom Quantum Computing IDEs.",
  },
};

export const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/tejastro123",
    icon: Github,
    color: "hover:text-gray-900 dark:hover:text-white",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tejas-mellimpudi/",
    icon: Linkedin,
    color: "hover:text-[#0077b5]",
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/tejas_mellimpudi",
    icon: X,
    color: "hover:text-black dark:hover:text-white",
  },
  {
    label: "Email",
    href: `mailto:${personalInfo.email}`,
    icon: Mail,
    color: "hover:text-red-500",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/tejas_mellimpudi/",
    icon: Instagram,
    color: "hover:text-pink-600",
  },
];

export const about = {
  heading: "Beyond the Code",
  content: "My journey isn't defined solely by lines of code. It's about curiosity, endurance, and the pursuit of the unknown.",
  funFacts: [
    {
      icon: Rocket,
      text: "Sriharikota Native: grew up watching ISRO rocket launches from my backyard.",
    },
    {
      icon: Cpu,
      text: "Hardware Enthusiast: Active core member of the Mars Rover Team & Robotics Club.",
    },
    {
      icon: Terminal,
      text: "Quantum Explorer: Developing custom languages for Quantum simulations.",
    },
    {
      icon: Globe,
      text: "Sci-Fi Aficionado: Consuming space tech media to fuel real-world innovation.",
    },
  ],
};

export const experience = [
  {
    id: 1,
    type: "work",
    title: "Avionics & Electronics Engineer",
    org: "Vanguard Club (Mars Rover Team)",
    date: "Nov 2024 – Present",
    location: "BITS Pilani",
    description: "Spearheading the electronics architecture for a next-gen Mars Rover prototype. Designing robust power distribution systems (PDS) and integrating embedded sensors for autonomous navigation in rugged terrains.",
    skills: ["Circuit Design", "PCB Layout", "Power Systems", "Embedded C"],
  },
  {
    id: 2,
    type: "work",
    title: "Robotics Engineer",
    org: "Robotics Club (ARC)",
    date: "Sep 2023 – Present",
    location: "BITS Pilani",
    description: "Engineered combat-ready robots (Monster Robowar) and precision autonomous bots (Line Follower). Led hands-on troubleshooting of hardware-software interfaces involving Arduino and C++ control logic.",
    skills: ["C++", "Arduino", "Motor Drivers", "Actuators"],
  },
  {
    id: 3,
    type: "research",
    title: "Research & Development Associate",
    org: "Spectrum Club (Physics Dept)",
    date: "Sep 2023 – Present",
    location: "BITS Pilani",
    description: "Conducting advanced physics experiments and simulating theoretical models to bridge abstract concepts with observable phenomena.",
    skills: ["Data Analysis", "Experimental Physics", "Simulation"],
  },
  {
    id: 4,
    type: "academic",
    title: "Teaching Assistant",
    org: "BITS Pilani",
    date: "Jan 2025 – Present",
    location: "Pilani, India",
    description: "Mentoring undergraduates, managing academic records, and facilitating laboratory evaluations for core courses.",
    skills: ["Mentorship", "Academic Management"],
  },
  {
    id: 5,
    type: "education",
    title: "M.Sc. Physics + B.E. Computer Science",
    org: "BITS Pilani",
    date: "2023 – 2028 (Expected)",
    location: "Pilani, India",
    description: "Dual Degree Program | CGPA: 8.58/10.0. A rigorous interdisciplinary curriculum combining Quantum Mechanics, Electromagnetism, Data Structures, and Algorithms.",
    skills: ["Quantum Computing", "Algorithms", "Mathematics"],
  },
];

export const projects = [
  // --- FEATURED / MAJOR PROJECTS ---
  {
    title: "QUICKIDE",
    description: "A specialized lightweight GUI IDE designed for writing, visualizing, and simulating quantum programs using the custom QuCPL language.",
    tags: ["Python", "Quantum Computing", "Tkinter", "Compiler Design"],
    category: "System Software",
    demo: "#",
    github: "https://github.com/tejastro123/QUICKIDE",
    featured: true,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "LIVEMART",
    description: "A comprehensive full-stack e-commerce ecosystem featuring real-time inventory updates, secure authentication, and a modern responsive UI.",
    tags: ["React", "Node.js", "Express", "MongoDB"],
    category: "Full Stack",
    demo: "https://livemart-main.vercel.app",
    github: "https://github.com/tejastro123/LIVEMART",
    featured: true,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "WebRTC Communication",
    description: "Real-time video and audio communication platform built using WebRTC protocols for low-latency peer-to-peer data streaming.",
    tags: ["WebRTC", "Socket.io", "JavaScript", "Streaming"],
    category: "Networking",
    demo: "https://webrtc-eight-olive.vercel.app",
    github: "https://github.com/tejastro123/webrtc",
    featured: true,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Agentic-AI-Lynq",
    description: "An exploration into autonomous AI agents, focusing on decision-making loops and tool-use within Large Language Model contexts.",
    tags: ["Python", "LLMs", "AI Agents", "Automation"],
    category: "AI / ML",
    demo: "#",
    github: "https://github.com/tejastro123/Agentic-AI-Lynq",
    featured: true,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "My-QuCPL",
    description: "Designed a custom Quantum Programming Language (QuCPL) and toolchain, bridging the gap between high-level logic and quantum gate execution.",
    tags: ["Language Design", "Quantum", "Python"],
    category: "Quantum Computing",
    demo: "https://my-qucpl.vercel.app",
    github: "https://github.com/tejastro123/MY-QUCPL",
    featured: true,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Portfolio V2 (tejas3806)",
    description: "My personal digital garden and portfolio website built with modern React patterns and Vite.",
    tags: ["TypeScript", "React", "Portfolio"],
    category: "Web Dev",
    demo: "#",
    github: "https://github.com/tejastro123/tejas3806",
    featured: true,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000",
  },

  // --- ALGORITHMS & DATA STRUCTURES ---
  {
    title: "CPP-DSA Archive",
    description: "Comprehensive collection of Data Structures and Algorithms implementation in C++.",
    tags: ["C++", "Algorithms", "DSA"],
    category: "Algorithms",
    demo: "#",
    github: "https://github.com/tejastro123/CPP-DSA",
    featured: false,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "JAVA_DSA",
    description: "Data Structures and Algorithms implementations utilizing Java's object-oriented features.",
    tags: ["Java", "DSA"],
    category: "Algorithms",
    demo: "#",
    github: "https://github.com/tejastro123/JAVA_DSA",
    featured: false,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Python-DSA",
    description: "Pythonic implementations of core data structures and algorithm optimization techniques.",
    tags: ["Python", "DSA"],
    category: "Algorithms",
    demo: "#",
    github: "https://github.com/tejastro123/Python-DSA",
    featured: false,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "CPP Problem Set",
    description: "A well-organized collection of competitive programming problems with solutions in C++ and Python.",
    tags: ["C++", "DSA", "Algorithms"],
    category: "Algorithms",
    demo: "#",
    github: "https://github.com/tejastro123/CPP",
    featured: false,
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000",
  },

  // --- QUANTUM COMPUTING RESOURCES ---
  {
    title: "Quantum-Projects",
    description: "A collection of quantum computing projects and experiments using Qiskit.",
    tags: ["Jupyter Notebook", "Qiskit", "Physics"],
    category: "Quantum Computing",
    demo: "#",
    github: "https://github.com/tejastro123/Quantum-Projects",
    featured: false,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Qiskit Tutorials",
    description: "Step-by-step tutorials and examples for learning Qiskit framework.",
    tags: ["Jupyter Notebook", "Qiskit", "Tutorial"],
    category: "Quantum Computing",
    demo: "#",
    github: "https://github.com/tejastro123/qiskit-tutorials",
    featured: false,
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Quantum Resources",
    description: "Curated learning paths and resources for mastering Quantum Computing.",
    tags: ["Jupyter Notebook", "Resources", "Quantum"],
    category: "Quantum Computing",
    demo: "#",
    github: "https://github.com/tejastro123/Quantum-Computing-Resources",
    featured: false,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1000",
  },

  // --- WEB DEVELOPMENT & FRONTEND ---
  {
    title: "MY-REACT",
    description: "A sandbox for personal React projects, component experiments, and hook implementations.",
    tags: ["JavaScript", "React"],
    category: "Frontend",
    demo: "#",
    github: "https://github.com/tejastro123/MY-REACT",
    featured: false,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Text App Utility",
    description: "A text processing application for string manipulation and formatting.",
    tags: ["JavaScript", "Utility"],
    category: "Web Dev",
    demo: "#",
    github: "https://github.com/tejastro123/text-app",
    featured: false,
    image: "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Web Dev Project",
    description: "Frontend showcase highlighting responsive design principles.",
    tags: ["JavaScript", "HTML", "CSS"],
    category: "Web Dev",
    demo: "#",
    github: "https://github.com/tejastro123/web-dev-pjt",
    featured: false,
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Web Dev Basics",
    description: "Fundamental experiments with HTML5, CSS3, and Vanilla JavaScript.",
    tags: ["HTML", "CSS", "JavaScript"],
    category: "Web Dev",
    demo: "#",
    github: "https://github.com/tejastro123/WEB-DEV-basics",
    featured: false,
    image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?auto=format&fit=crop&q=80&w=1000",
  },

  // --- DATA SCIENCE & AI ---
  {
    title: "Machine Learning (ML)",
    description: "Explaining key ML algorithms from scratch and implementing predictive models.",
    tags: ["Machine Learning", "Python"],
    category: "AI / ML",
    demo: "#",
    github: "https://github.com/tejastro123/ML",
    featured: false,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Data Science Notebooks",
    description: "A repository of Data Science projects, visualizations, and analyses.",
    tags: ["Jupyter Notebook", "Data Science"],
    category: "Data Science",
    demo: "#",
    github: "https://github.com/tejastro123/DATA-SCIENCE",
    featured: false,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Django Apps",
    description: "A repository of Django-based web applications and backend logic.",
    tags: ["Python", "Django", "Web"],
    category: "Backend",
    demo: "#",
    github: "https://github.com/tejastro123/Django",
    featured: false,
    image: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=1000",
  },

  // --- PROGRAMMING & CONFIG ---
  {
    title: "100 Days of Python",
    description: "Log and code from the 100 Days of Code Python challenge.",
    tags: ["Python", "Challenge"],
    category: "Programming",
    demo: "#",
    github: "https://github.com/tejastro123/100-days-of-Python",
    featured: false,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Python Basics",
    description: "Basic Python programming examples and exercises for beginners.",
    tags: ["Python", "Basics"],
    category: "Programming",
    demo: "#",
    github: "https://github.com/tejastro123/Python-basic",
    featured: false,
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Java Tutorials",
    description: "Java programming tutorials, code snippets, and OOP concepts.",
    tags: ["Java", "Tutorial"],
    category: "Programming",
    demo: "#",
    github: "https://github.com/tejastro123/JAVA_tutorial",
    featured: false,
    image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Config Profile (tejastro123)",
    description: "Configuration and profile README for my GitHub presence.",
    tags: ["Config", "Profile"],
    category: "Other",
    demo: "#",
    github: "https://github.com/tejastro123/tejastro123",
    featured: false,
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "CNI Inductions 2025",
    description: "Academic induction tasks and assignments for CNI 2025 Sem 1.",
    tags: ["Academic", "Assignments"],
    category: "Other",
    demo: "#",
    github: "https://github.com/tejastro123/2025-sem1-cni-inductions",
    featured: false,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000",
  },
];

export const skills = [
  {
    title: "Core Programming",
    icon: Code2,
    skills: [
      { name: "C++ (STL)", level: 95 },
      { name: "Python", level: 90 },
      { name: "JavaScript/ES6+", level: 85 },
      { name: "TypeScript", level: 80 },
    ],
  },
  {
    title: "Full Stack Development",
    icon: Laptop,
    skills: [
      { name: "React.js", level: 85 },
      { name: "Node.js & Express", level: 80 },
      { name: "MongoDB", level: 75 },
      { name: "Django", level: 65 },
    ],
  },
  {
    title: "Robotics & Hardware",
    icon: Cpu,
    skills: [
      { name: "Arduino / C", level: 90 },
      { name: "Circuit Design", level: 80 },
      { name: "Sensor Integration", level: 85 },
      { name: "IoT Protocols", level: 75 },
    ],
  },
  {
    title: "Scientific Tech",
    icon: Microscope,
    skills: [
      { name: "Qiskit (Quantum)", level: 80 },
      { name: "NumPy/Pandas", level: 85 },
      { name: "Matplotlib", level: 80 },
      { name: "Jupyter", level: 90 },
    ],
  },
];

export const services = [
  {
    title: "Full Stack Engineering",
    description: "Building scalable web applications from scratch using the MERN stack and Django.",
    icon: Globe,
  },
  {
    title: "AI ML DS",
    description: "Building AI, ML, and Data Science models from scratch. Implementing custom algorithms and frameworks.",
    icon: Cpu,
  },
  {
    title: "Quantum Computing",
    description: "Developing educational tools and simulations for Quantum Computing concepts.",
    icon: Microscope,
  },
];

export const testimonials = [
  {
    quote: "Ever tried, ever failed, no matter. Try again, fail again, fail better.",
    name: "Samuel Beckett",
    role: "Writer",
  },
  {
    quote: "Only those who will risk going too far can possibly find out how far one can go.",
    name: "Sir Arthur C. Clarke",
    role: "Writer",
  },
  {
    quote: "The only way to do great work is to love what you do.",
    name: "Steve Jobs",
    role: "Entrepreneur",
  },
];

export const blogPosts = [
  {
    title: "From Code to Combat: Building the Monster Robowar Bot",
    date: "Feb 12, 2026",
    readTime: "5 min read",
    excerpt: "A deep dive into the motor drivers, power distribution, and structural challenges we faced in the arena.",
    link: "#",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000",
  },
  {
    title: "Simulating Quantum Gates with Python",
    date: "Jan 28, 2026",
    readTime: "8 min read",
    excerpt: "How I built a custom interpreter to visualize quantum superposition using standard classical libraries.",
    link: "#",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000",
  },
];
