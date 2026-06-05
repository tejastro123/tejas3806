import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const url = `https://tejas3806.lovable.app${location.pathname}`;

  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | Tejas Mellimpudi</title>
        <meta
          name="description"
          content="The page you are looking for does not exist. Return to Tejas Mellimpudi's portfolio home."
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="404 — Page Not Found" />
        <meta property="og:description" content="This page could not be found." />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            Return to Home
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
