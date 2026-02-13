import { supabase } from "./supabaseClient";

/**
 * Seeds the Supabase database with the current static data from src/data/index.ts.
 * This maps icon components to their string names for database storage.
 */
export const seedDatabase = async () => {
  const results: string[] = [];

  // 1. Personal Info
  const { count: piCount } = await supabase.from("personal_info").select("*", { count: "exact", head: true });
  if (!piCount || piCount === 0) {
    const { error } = await supabase.from("personal_info").insert({
      name: "Mellimpudi Tejas",
      role: "AIMLDS Engineer & Physicist",
      email: "tejas.mellimpudi@gmail.com",
      location: "Hyderabad, India",
      avatar: "https://github.com/tejastro123.png",
      bio_tagline: "Bridging the gap between Theoretical Physics and Computational Reality.",
      bio_short: "Dual Degree scholar at BITS Pilani engineering the future of Robotics, Space Tech, and Full-Stack Systems.",
      bio_long: "I stand at the convergence of hardware and software. As a Dual Degree student at BITS Pilani, I blend the analytical rigor of Theoretical Physics with the structural precision of Computer Science. Raised in the shadow of launchpads at Sriharikota, my passion for aerospace and robotics is innate. I don't just write code; I build systems that interact with the physical world—from designing Mars Rover avionics to architecting custom Quantum Computing IDEs.",
    });
    results.push(error ? `❌ personal_info: ${error.message}` : "✅ personal_info seeded");
  } else {
    results.push("⏭️ personal_info already exists");
  }

  // 2. Social Links
  const { count: slCount } = await supabase.from("social_links").select("*", { count: "exact", head: true });
  if (!slCount || slCount === 0) {
    const socialLinks = [
      { label: "GitHub", href: "https://github.com/tejastro123", icon_name: "Github", color: "hover:text-gray-900 dark:hover:text-white", sort_order: 0 },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/tejas-mellimpudi/", icon_name: "Linkedin", color: "hover:text-[#0077b5]", sort_order: 1 },
      { label: "X (Twitter)", href: "https://x.com/tejas_mellimpudi", icon_name: "X", color: "hover:text-black dark:hover:text-white", sort_order: 2 },
      { label: "Email", href: "mailto:tejas.mellimpudi@gmail.com", icon_name: "Mail", color: "hover:text-red-500", sort_order: 3 },
      { label: "Instagram", href: "https://www.instagram.com/tejas_mellimpudi/", icon_name: "Instagram", color: "hover:text-pink-600", sort_order: 4 },
    ];
    const { error } = await supabase.from("social_links").insert(socialLinks);
    results.push(error ? `❌ social_links: ${error.message}` : "✅ social_links seeded");
  } else {
    results.push("⏭️ social_links already exists");
  }

  // 3. About
  const { count: abCount } = await supabase.from("about").select("*", { count: "exact", head: true });
  if (!abCount || abCount === 0) {
    const { error } = await supabase.from("about").insert({
      heading: "Beyond the Code",
      content: "My journey isn't defined solely by lines of code. It's about curiosity, endurance, and the pursuit of the unknown.",
      fun_facts: [
        { icon_name: "Rocket", text: "Sriharikota Native: grew up watching ISRO rocket launches from my backyard." },
        { icon_name: "Cpu", text: "Hardware Enthusiast: Active core member of the Mars Rover Team & Robotics Club." },
        { icon_name: "Terminal", text: "Quantum Explorer: Developing custom languages for Quantum simulations." },
        { icon_name: "Globe", text: "Sci-Fi Aficionado: Consuming space tech media to fuel real-world innovation." },
      ],
    });
    results.push(error ? `❌ about: ${error.message}` : "✅ about seeded");
  } else {
    results.push("⏭️ about already exists");
  }

  // 4. Experience
  const { count: exCount } = await supabase.from("experience").select("*", { count: "exact", head: true });
  if (!exCount || exCount === 0) {
    const experience = [
      { type: "work", title: "Avionics & Electronics Engineer", org: "Vanguard Club (Mars Rover Team)", date: "Nov 2024 – Present", location: "BITS Pilani", description: "Spearheading the electronics architecture for a next-gen Mars Rover prototype.", skills: ["Circuit Design", "PCB Layout", "Power Systems", "Embedded C"], sort_order: 0 },
      { type: "work", title: "Robotics Engineer", org: "Robotics Club (ARC)", date: "Sep 2023 – Present", location: "BITS Pilani", description: "Engineered combat-ready robots and precision autonomous bots.", skills: ["C++", "Arduino", "Motor Drivers", "Actuators"], sort_order: 1 },
      { type: "research", title: "Research & Development Associate", org: "Spectrum Club (Physics Dept)", date: "Sep 2023 – Present", location: "BITS Pilani", description: "Conducting advanced physics experiments and simulating theoretical models.", skills: ["Data Analysis", "Experimental Physics", "Simulation"], sort_order: 2 },
      { type: "academic", title: "Teaching Assistant", org: "BITS Pilani", date: "Jan 2025 – Present", location: "Pilani, India", description: "Mentoring undergraduates and facilitating laboratory evaluations.", skills: ["Mentorship", "Academic Management"], sort_order: 3 },
      { type: "education", title: "M.Sc. Physics + B.E. Computer Science", org: "BITS Pilani", date: "2023 – 2028 (Expected)", location: "Pilani, India", description: "Dual Degree Program | CGPA: 8.58/10.0.", skills: ["Quantum Computing", "Algorithms", "Mathematics"], sort_order: 4 },
    ];
    const { error } = await supabase.from("experience").insert(experience);
    results.push(error ? `❌ experience: ${error.message}` : "✅ experience seeded");
  } else {
    results.push("⏭️ experience already exists");
  }

  // 5. Projects
  const { count: prCount } = await supabase.from("projects").select("*", { count: "exact", head: true });
  if (!prCount || prCount === 0) {
    const projects = [
      { title: "QUICKIDE", description: "A specialized lightweight GUI IDE for writing, visualizing, and simulating quantum programs.", tags: ["Python", "Quantum Computing", "Tkinter"], category: "System Software", demo: "#", github: "https://github.com/tejastro123/QUICKIDE", featured: true, image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000", sort_order: 0 },
      { title: "LIVEMART", description: "A comprehensive full-stack e-commerce ecosystem.", tags: ["React", "Node.js", "Express", "MongoDB"], category: "Full Stack", demo: "https://livemart-main.vercel.app", github: "https://github.com/tejastro123/LIVEMART", featured: true, image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1000", sort_order: 1 },
      { title: "WebRTC Communication", description: "Real-time video and audio communication platform.", tags: ["WebRTC", "Socket.io", "JavaScript"], category: "Networking", demo: "https://webrtc-eight-olive.vercel.app", github: "https://github.com/tejastro123/webrtc", featured: true, image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1000", sort_order: 2 },
      { title: "Agentic-AI-Lynq", description: "An exploration into autonomous AI agents.", tags: ["Python", "LLMs", "AI Agents"], category: "AI / ML", demo: "#", github: "https://github.com/tejastro123/Agentic-AI-Lynq", featured: true, image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000", sort_order: 3 },
      { title: "My-QuCPL", description: "Custom Quantum Programming Language and toolchain.", tags: ["Language Design", "Quantum", "Python"], category: "Quantum Computing", demo: "https://my-qucpl.vercel.app", github: "https://github.com/tejastro123/MY-QUCPL", featured: true, image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000", sort_order: 4 },
      { title: "CPP-DSA Archive", description: "Comprehensive collection of DSA in C++.", tags: ["C++", "Algorithms", "DSA"], category: "Algorithms", demo: "#", github: "https://github.com/tejastro123/CPP-DSA", featured: false, image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1000", sort_order: 5 },
    ];
    const { error } = await supabase.from("projects").insert(projects);
    results.push(error ? `❌ projects: ${error.message}` : "✅ projects seeded");
  } else {
    results.push("⏭️ projects already exists");
  }

  // 6. Skills
  const { count: skCount } = await supabase.from("skills").select("*", { count: "exact", head: true });
  if (!skCount || skCount === 0) {
    const skills = [
      { title: "Core Programming", icon_name: "Code2", items: [{ name: "C++ (STL)", level: 95 }, { name: "Python", level: 90 }, { name: "JavaScript/ES6+", level: 85 }, { name: "TypeScript", level: 80 }], sort_order: 0 },
      { title: "Full Stack Development", icon_name: "Laptop", items: [{ name: "React.js", level: 85 }, { name: "Node.js & Express", level: 80 }, { name: "MongoDB", level: 75 }, { name: "Django", level: 65 }], sort_order: 1 },
      { title: "Robotics & Hardware", icon_name: "Cpu", items: [{ name: "Arduino / C", level: 90 }, { name: "Circuit Design", level: 80 }, { name: "Sensor Integration", level: 85 }, { name: "IoT Protocols", level: 75 }], sort_order: 2 },
      { title: "Scientific Tech", icon_name: "Microscope", items: [{ name: "Qiskit (Quantum)", level: 80 }, { name: "NumPy/Pandas", level: 85 }, { name: "Matplotlib", level: 80 }, { name: "Jupyter", level: 90 }], sort_order: 3 },
    ];
    const { error } = await supabase.from("skills").insert(skills);
    results.push(error ? `❌ skills: ${error.message}` : "✅ skills seeded");
  } else {
    results.push("⏭️ skills already exists");
  }

  // 7. Services
  const { count: svCount } = await supabase.from("services").select("*", { count: "exact", head: true });
  if (!svCount || svCount === 0) {
    const services = [
      { title: "Full Stack Engineering", description: "Building scalable web applications from scratch using the MERN stack and Django.", icon_name: "Globe", sort_order: 0 },
      { title: "AI ML DS", description: "Building AI, ML, and Data Science models from scratch.", icon_name: "Cpu", sort_order: 1 },
      { title: "Quantum Computing", description: "Developing educational tools and simulations for Quantum Computing concepts.", icon_name: "Microscope", sort_order: 2 },
    ];
    const { error } = await supabase.from("services").insert(services);
    results.push(error ? `❌ services: ${error.message}` : "✅ services seeded");
  } else {
    results.push("⏭️ services already exists");
  }

  // 8. Testimonials
  const { count: teCount } = await supabase.from("testimonials").select("*", { count: "exact", head: true });
  if (!teCount || teCount === 0) {
    const testimonials = [
      { quote: "Ever tried, ever failed, no matter. Try again, fail again, fail better.", name: "Samuel Beckett", role: "Writer", sort_order: 0 },
      { quote: "Only those who will risk going too far can possibly find out how far one can go.", name: "Sir Arthur C. Clarke", role: "Writer", sort_order: 1 },
      { quote: "The only way to do great work is to love what you do.", name: "Steve Jobs", role: "Entrepreneur", sort_order: 2 },
    ];
    const { error } = await supabase.from("testimonials").insert(testimonials);
    results.push(error ? `❌ testimonials: ${error.message}` : "✅ testimonials seeded");
  } else {
    results.push("⏭️ testimonials already exists");
  }

  // 9. Blog Posts
  const { count: blCount } = await supabase.from("blog_posts").select("*", { count: "exact", head: true });
  if (!blCount || blCount === 0) {
    const blogPosts = [
      { title: "From Code to Combat: Building the Monster Robowar Bot", date: "Feb 12, 2026", read_time: "5 min read", excerpt: "A deep dive into the motor drivers, power distribution, and structural challenges.", link: "#", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000" },
      { title: "Simulating Quantum Gates with Python", date: "Jan 28, 2026", read_time: "8 min read", excerpt: "How I built a custom interpreter to visualize quantum superposition.", link: "#", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000" },
    ];
    const { error } = await supabase.from("blog_posts").insert(blogPosts);
    results.push(error ? `❌ blog_posts: ${error.message}` : "✅ blog_posts seeded");
  } else {
    results.push("⏭️ blog_posts already exists");
  }

  return results;
};
