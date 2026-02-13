import { motion } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";

const posts = [
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

const BlogSection = () => {
  return (
    <section id="blog" className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Blog</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">Writing & Thoughts ✍️</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.a
              key={post.title}
              href={post.link}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group glass rounded-2xl p-6 hover:shadow-xl transition-all block"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Calendar size={14} />
                {post.date}
              </div>
              <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors flex items-start gap-1">
                {post.title}
                <ArrowUpRight size={16} className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
