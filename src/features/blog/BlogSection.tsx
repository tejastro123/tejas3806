import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { apiClient } from "@/services/api/apiClient";
import { blogPosts as fallbackPosts } from "@/data";
import { useTranslation } from "react-i18next";
import { trackEvent } from "@/services/api/analytics";

interface DBPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  read_time: string;
  excerpt: string;
  link: string;
  image: string;
  content: string;
  published: boolean;
  created_at: string;
}

const BlogSection = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<DBPost[] | null>(null);

  useEffect(() => {
    apiClient
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setPosts((data as DBPost[]) ?? []));
  }, []);

  // Use DB posts when available, otherwise fall back to hardcoded.
  const usingFallback = !posts || posts.length === 0;
  const displayPosts = usingFallback
    ? fallbackPosts.map((p, i) => ({
        id: String(i),
        title: p.title,
        slug: "",
        date: p.date,
        read_time: p.readTime ?? "",
        excerpt: p.excerpt,
        link: p.link,
        image: p.image,
        content: "",
        published: true,
        created_at: "",
      }))
    : posts!;

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
          {displayPosts.map((post, i) => {
            const hasInternal = !usingFallback && post.slug;
            const Wrapper: any = hasInternal ? Link : "a";
            const wrapperProps = hasInternal
              ? { to: `/blog/${post.slug}` }
              : {
                  href: post.link,
                  target: post.link !== "#" ? "_blank" : undefined,
                  rel: "noopener noreferrer",
                };
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card-3d"
              >
                <Wrapper
                  {...wrapperProps}
                  onClick={() => trackEvent("blog_click", post.slug || post.title)}
                  className="card-3d-inner block rounded-2xl glass neon-border overflow-hidden group h-full holo-shine"
                >
                  {post.image && (
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
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
                      {post.read_time && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {post.read_time}
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
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
