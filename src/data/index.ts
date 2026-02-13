import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export const personalInfo = {
  name: "Tejas",
  role: "Software Engineer",
  email: "hello@example.com", // TODO: Update with real email
  location: "San Francisco, CA", // TODO: Update with real location
  bio: {
    short: "Building digital experiences with modern technologies.",
    long: "I'm a passionate software engineer specializing in building exceptional digital experiences. Currently, I'm focused on building accessible, human-centered products.",
  },
};

export const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/tejas3806",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/your-profile", // TODO: Update with real profile
    icon: Linkedin,
  },
  {
    label: "Email",
    href: `mailto:${personalInfo.email}`,
    icon: Mail,
  },
  // {
  //   label: "Twitter",
  //   href: "https://twitter.com/your-handle",
  //   icon: Twitter,
  // },
];

export const about = {
  funFacts: [
    "🎮 Avid gamer in my downtime",
    "☕ Fueled by coffee & curiosity",
    "🌍 Love open source contributions",
    "📚 Always learning something new",
  ],
  // You can add more highlights here or update existing ones
};

export const experience = [
  {
    type: "work",
    title: "Software Engineer",
    org: "Tech Company", // TODO: Update
    date: "2023 – Present",
    description: "Building scalable web applications and leading frontend architecture decisions.",
  },
  {
    type: "work",
    title: "Frontend Developer",
    org: "Startup Inc.", // TODO: Update
    date: "2022 – 2023",
    description: "Developed user-facing features with React and collaborated on design system implementation.",
  },
  {
    type: "education",
    title: "B.S. Computer Science",
    org: "University Name", // TODO: Update
    date: "2019 – 2023",
    description: "Graduated with honors. Focused on software engineering, algorithms, and web technologies.",
  },
];

export const projects = [
  {
    title: "Project One",
    description: "A description of your first project. detailed and interesting.",
    tags: ["React", "Node.js", "PostgreSQL"],
    category: "Full Stack",
    demo: "#", // TODO: Add real link
    github: "#", // TODO: Add real link
  },
  {
    title: "Project Two",
    description: "A description of your second project.",
    tags: ["Python", "AI", "FastAPI"],
    category: "AI/ML",
    demo: "#",
    github: "#",
  },
  {
    title: "Project Three",
    description: "A description of your third project.",
    tags: ["Next.js", "TypeScript"],
    category: "Frontend",
    demo: "#",
    github: "#",
  },
];

export const skills = [
  {
    title: "Languages",
    color: "bg-primary/10 text-primary border-primary/20",
    skills: [
      { name: "JavaScript", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "Python", level: 80 },
      { name: "Java", level: 75 },
    ],
  },
  {
    title: "Frontend",
    color: "bg-secondary/10 text-secondary border-secondary/20",
    skills: [
      { name: "React", level: 95 },
      { name: "Next.js", level: 85 },
      { name: "Tailwind CSS", level: 90 },
      { name: "HTML/CSS", level: 95 },
    ],
  },
  {
    title: "Backend & Tools",
    color: "bg-accent/10 text-accent border-accent/20",
    skills: [
      { name: "Node.js", level: 85 },
      { name: "PostgreSQL", level: 80 },
      { name: "Git", level: 90 },
      { name: "Docker", level: 70 },
    ],
  },
];

export const blogPosts = [
  {
    title: "Building Scalable React Applications",
    date: "Jan 2026",
    excerpt: "Lessons learned from architecting large-scale React apps with clean patterns and best practices.",
    link: "#",
  },
  {
    title: "My Journey Into Open Source",
    date: "Dec 2025",
    excerpt: "How contributing to open source projects transformed my skills and career opportunities.",
    link: "#",
  },
  {
    title: "TypeScript Tips You Wish You Knew Sooner",
    date: "Nov 2025",
    excerpt: "A collection of TypeScript patterns and techniques that will level up your code quality.",
    link: "#",
  },
];

export const testimonials = [
  {
    quote: "One of the most talented engineers I've worked with. Consistently delivers high-quality code and is always willing to help teammates.",
    name: "Jane Doe",
    role: "Engineering Manager at Tech Co",
  },
  {
    quote: "A creative problem solver who brings energy and fresh ideas to every project. It was a pleasure mentoring them during their internship.",
    name: "John Smith",
    role: "Senior Developer at Startup Inc.",
  },
  {
    quote: "Exceptional student with a strong work ethic. Their final project was one of the best I've seen in my 15 years of teaching.",
    name: "Prof. Sarah Johnson",
    role: "CS Professor at University",
  },
];
