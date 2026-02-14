import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data";
import { useTranslation } from "react-i18next";

const BlogSection = () => {
  const { t } = useTranslation();
  return (
    <section id="blog" className="py-24 px-6 relative">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-mono text-neon-pink uppercase tracking-wider">
            <span className="w-8 h-px bg-neon-pink/50" />
            {t("nav.blog")}
            <span className="w-8 h-px bg-neon-pink/50" />
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 gradient-text">{t("blog.heading")}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {blogPosts.map((post, i) => (
            <motion.a
              key={post.title}
              href={post.link}
              target={post.link !== "#" ? "_blank" : undefined}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-3d block"
            >
              <div className="card-3d-inner rounded-2xl glass neon-border overflow-hidden group h-full holo-shine">
                {post.image && (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                )}
                <div className="p-6 relative z-10">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {post.date}
                    </span>
                    {post.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {post.readTime}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-neon-cyan transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-mono text-neon-cyan group-hover:gap-2 transition-all">
                    {t("blog.read_more")} <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
