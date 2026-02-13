import { motion } from "framer-motion";
import { ArrowUpRight, Calendar } from "lucide-react";

import { blogPosts } from "@/data";

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
          {blogPosts.map((post, i) => (
            <motion.a
              key={post.title}
              href={post.link}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group glass rounded-2xl overflow-hidden hover:shadow-xl transition-all block h-full flex flex-col"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar size={14} />
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span>{post.readTime}</span>
                </div>

                <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors flex items-start gap-1">
                  {post.title}
                  <ArrowUpRight size={16} className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
