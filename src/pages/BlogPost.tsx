import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import DOMPurify from "dompurify";
import { apiClient } from "@/lib/apiClient";

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

const SITE = "https://tejas3806.lovable.app";

function clampDescription(text: string | undefined, fallback: string) {
  const raw = (text || "").replace(/\s+/g, " ").trim();
  if (!raw) return fallback;
  if (raw.length <= 160) return raw.length >= 50 ? raw : `${raw} — ${fallback}`.slice(0, 160);
  return `${raw.slice(0, 157).trimEnd()}...`;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    apiClient
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

  if (notFound) {
    const url = `${SITE}/blog/${slug ?? ""}`;
    return (
      <>
        <Helmet>
          <title>Post not found — Tejas Mellimpudi</title>
          <meta name="description" content="This blog post could not be found. Browse other posts on Tejas Mellimpudi's portfolio." />
          <meta name="robots" content="noindex, follow" />
          <link rel="canonical" href={url} />
        </Helmet>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-bold">Post not found</h1>
          <Link to="/" className="text-neon-cyan hover:underline">← Back to portfolio</Link>
        </div>
      </>
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
  const url = `${SITE}/blog/${post.slug}`;
  const description = clampDescription(post.excerpt, `Read "${post.title}" on Tejas Mellimpudi's portfolio.`);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    image: post.image || undefined,
    datePublished: post.date || undefined,
    mainEntityOfPage: url,
    author: { "@type": "Person", name: "Mellimpudi Tejas", url: SITE },
  };

  return (
    <>
      <Helmet>
        <title>{`${post.title} — Tejas Mellimpudi`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={description} />
        {post.image && <meta name="twitter:image" content={post.image} />}
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>
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
    </>
  );
};

export default BlogPost;
