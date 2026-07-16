// Plain-data snapshot of public portfolio content, safe for the MCP edge
// bundle (no icon or React imports). Keep in sync with src/data/index.ts
// when editing the public portfolio.

export const personalInfo = {
  name: "Mellimpudi Tejas",
  role: "AIMLDS Engineer & Physicist",
  email: "tejas.mellimpudi@gmail.com",
  location: "Hyderabad, India",
  avatar: "https://github.com/tejastro123.png",
  website: "https://tejas3806.lovable.app",
  bio: {
    tagline: "Bridging the gap between Theoretical Physics and Computational Reality.",
    short:
      "Dual Degree scholar at BITS Pilani engineering the future of Robotics, Space Tech, and Full-Stack Systems.",
    long: "I stand at the convergence of hardware and software. As a Dual Degree student at BITS Pilani, I blend the analytical rigor of Theoretical Physics with the structural precision of Computer Science. Raised in the shadow of launchpads at Sriharikota, my passion for aerospace and robotics is innate. I don't just write code; I build systems that interact with the physical world—from designing Mars Rover avionics to architecting custom Quantum Computing IDEs.",
  },
};

export const socialLinks = [
  { label: "GitHub", href: "https://github.com/tejastro123" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/tejas-mellimpudi/" },
  { label: "X (Twitter)", href: "https://x.com/tejas_mellimpudi" },
  { label: "Email", href: "mailto:tejas.mellimpudi@gmail.com" },
  { label: "Instagram", href: "https://www.instagram.com/tejas_mellimpudi/" },
];

export const experience = [
  {
    id: 1,
    type: "work",
    title: "Avionics & Electronics Engineer",
    org: "Vanguard Club (Mars Rover Team)",
    date: "Nov 2024 – Present",
    location: "BITS Pilani",
    description:
      "Spearheading the electronics architecture for a next-gen Mars Rover prototype. Designing robust power distribution systems (PDS) and integrating embedded sensors for autonomous navigation in rugged terrains.",
    skills: ["Circuit Design", "PCB Layout", "Power Systems", "Embedded C"],
  },
  {
    id: 2,
    type: "work",
    title: "Robotics Engineer",
    org: "Robotics Club (ARC)",
    date: "Sep 2023 – Present",
    location: "BITS Pilani",
    description:
      "Engineered combat-ready robots (Monster Robowar) and precision autonomous bots (Line Follower). Led hands-on troubleshooting of hardware-software interfaces involving Arduino and C++ control logic.",
    skills: ["C++", "Arduino", "Motor Drivers", "Actuators"],
  },
  {
    id: 3,
    type: "research",
    title: "Research & Development Associate",
    org: "Spectrum Club (Physics Dept)",
    date: "Sep 2023 – Present",
    location: "BITS Pilani",
    description:
      "Conducting advanced physics experiments and simulating theoretical models to bridge abstract concepts with observable phenomena.",
    skills: ["Data Analysis", "Experimental Physics", "Simulation"],
  },
  {
    id: 4,
    type: "academic",
    title: "Teaching Assistant",
    org: "BITS Pilani",
    date: "Jan 2025 – Present",
    location: "Pilani, India",
    description:
      "Mentoring undergraduates, managing academic records, and facilitating laboratory evaluations for core courses.",
    skills: ["Mentorship", "Academic Management"],
  },
  {
    id: 5,
    type: "education",
    title: "M.Sc. Physics + B.E. Computer Science",
    org: "BITS Pilani",
    date: "2023 – 2028 (Expected)",
    location: "Pilani, India",
    description:
      "Dual Degree Program | CGPA: 8.58/10.0. A rigorous interdisciplinary curriculum combining Quantum Mechanics, Electromagnetism, Data Structures, and Algorithms.",
    skills: ["Quantum Computing", "Algorithms", "Mathematics"],
  },
];

export const skillGroups = [
  {
    title: "Core Programming",
    skills: [
      { name: "C++ (STL)", level: 95 },
      { name: "Python", level: 90 },
      { name: "JavaScript/ES6+", level: 85 },
      { name: "TypeScript", level: 80 },
    ],
  },
  {
    title: "Full Stack Development",
    skills: [
      { name: "React.js", level: 85 },
      { name: "Node.js & Express", level: 80 },
      { name: "MongoDB", level: 75 },
      { name: "Django", level: 65 },
    ],
  },
  {
    title: "Robotics & Hardware",
    skills: [
      { name: "Arduino / C", level: 90 },
      { name: "Circuit Design", level: 80 },
      { name: "Sensor Integration", level: 85 },
      { name: "IoT Protocols", level: 75 },
    ],
  },
  {
    title: "Scientific Tech",
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
  },
  {
    title: "AI ML DS",
    description:
      "Building AI, ML, and Data Science models from scratch. Implementing custom algorithms and frameworks.",
  },
  {
    title: "Quantum Computing",
    description: "Developing educational tools and simulations for Quantum Computing concepts.",
  },
];

export const projects = [
  { title: "QUICKIDE", description: "A specialized lightweight GUI IDE designed for writing, visualizing, and simulating quantum programs using the custom QuCPL language.", tags: ["Python", "Quantum Computing", "Tkinter", "Compiler Design"], category: "System Software", demo: "#", github: "https://github.com/tejastro123/QUICKIDE", featured: true },
  { title: "LIVEMART", description: "A comprehensive full-stack e-commerce ecosystem featuring real-time inventory updates, secure authentication, and a modern responsive UI.", tags: ["React", "Node.js", "Express", "MongoDB"], category: "Full Stack", demo: "https://livemart-main.vercel.app", github: "https://github.com/tejastro123/LIVEMART", featured: true },
  { title: "WebRTC Communication", description: "Real-time video and audio communication platform built using WebRTC protocols for low-latency peer-to-peer data streaming.", tags: ["WebRTC", "Socket.io", "JavaScript", "Streaming"], category: "Networking", demo: "https://webrtc-eight-olive.vercel.app", github: "https://github.com/tejastro123/webrtc", featured: true },
  { title: "Agentic-AI-Lynq", description: "An exploration into autonomous AI agents, focusing on decision-making loops and tool-use within Large Language Model contexts.", tags: ["Python", "LLMs", "AI Agents", "Automation"], category: "AI / ML", demo: "#", github: "https://github.com/tejastro123/Agentic-AI-Lynq", featured: true },
  { title: "My-QuCPL", description: "Designed a custom Quantum Programming Language (QuCPL) and toolchain, bridging the gap between high-level logic and quantum gate execution.", tags: ["Language Design", "Quantum", "Python"], category: "Quantum Computing", demo: "https://my-qucpl.vercel.app", github: "https://github.com/tejastro123/MY-QUCPL", featured: true },
  { title: "Portfolio V2 (tejas3806)", description: "My personal digital garden and portfolio website built with modern React patterns and Vite.", tags: ["TypeScript", "React", "Portfolio"], category: "Web Dev", demo: "#", github: "https://github.com/tejastro123/tejas3806", featured: true },
  { title: "CPP-DSA Archive", description: "Comprehensive collection of Data Structures and Algorithms implementation in C++.", tags: ["C++", "Algorithms", "DSA"], category: "Algorithms", demo: "#", github: "https://github.com/tejastro123/CPP-DSA", featured: false },
  { title: "JAVA_DSA", description: "Data Structures and Algorithms implementations utilizing Java's object-oriented features.", tags: ["Java", "DSA"], category: "Algorithms", demo: "#", github: "https://github.com/tejastro123/JAVA_DSA", featured: false },
  { title: "Python-DSA", description: "Pythonic implementations of core data structures and algorithm optimization techniques.", tags: ["Python", "DSA"], category: "Algorithms", demo: "#", github: "https://github.com/tejastro123/Python-DSA", featured: false },
  { title: "Quantum-Projects", description: "A collection of quantum computing projects and experiments using Qiskit.", tags: ["Jupyter Notebook", "Qiskit", "Physics"], category: "Quantum Computing", demo: "#", github: "https://github.com/tejastro123/Quantum-Projects", featured: false },
  { title: "Machine Learning (ML)", description: "Explaining key ML algorithms from scratch and implementing predictive models.", tags: ["Machine Learning", "Python"], category: "AI / ML", demo: "#", github: "https://github.com/tejastro123/ML", featured: false },
  { title: "Data Science Notebooks", description: "A repository of Data Science projects, visualizations, and analyses.", tags: ["Jupyter Notebook", "Data Science"], category: "Data Science", demo: "#", github: "https://github.com/tejastro123/DATA-SCIENCE", featured: false },
  { title: "Django Apps", description: "A repository of Django-based web applications and backend logic.", tags: ["Python", "Django", "Web"], category: "Backend", demo: "#", github: "https://github.com/tejastro123/Django", featured: false },
];
