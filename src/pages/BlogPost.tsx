import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import DOMPurify from "dompurify";
import { supabase } from "@/lib/supabaseClient";

interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  read_time: string;
  excerpt: string;
  image: string;
  content: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setNotFound(true);
        else setPost(data as Post);
      });
  }, [slug]);

  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} — Tejas Mellimpudi`;
    }
  }, [post]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">Post not found</h1>
        <Link to="/" className="text-neon-cyan hover:underline">← Back to portfolio</Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin" />
      </div>
    );
  }

  const safeHtml = DOMPurify.sanitize(post.content);

  return (
    <article className="min-h-screen py-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <Link
          to="/#blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-neon-cyan mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to all posts
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
            {post.date && (
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {post.date}
              </span>
            )}
            {post.read_time && (
              <span className="flex items-center gap-1">
                <Clock size={12} /> {post.read_time}
              </span>
            )}
          </div>
        </motion.header>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full rounded-2xl mb-10 neon-border"
          />
        )}

        <div
          className="prose prose-invert prose-lg max-w-none prose-headings:gradient-text prose-a:text-neon-cyan"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </div>
    </article>
  );
};

export default BlogPost;
