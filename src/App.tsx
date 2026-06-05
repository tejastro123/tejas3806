import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/services/auth/AuthContext";
import { SocketProvider } from "@/app/providers/SocketProvider";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import Index from "@/features/portfolio/PortfolioPage";
import NotFound from "@/features/error/NotFoundPage";
import AdminLogin from "@/features/admin/AdminLogin";
import AdminLayout from "@/features/admin/AdminLayout";
import AdminDashboard from "@/features/admin/AdminDashboard";
import AdminHero from "@/features/admin/AdminHero";
import AdminAbout from "@/features/admin/AdminAbout";
import AdminExperience from "@/features/admin/AdminExperience";
import AdminProjects from "@/features/admin/AdminProjects";
import AdminSkills from "@/features/admin/AdminSkills";
import AdminServices from "@/features/admin/AdminServices";
import AdminBlog from "@/features/admin/AdminBlog";
import AdminTestimonials from "@/features/admin/AdminTestimonials";
import AdminMessages from "@/features/admin/AdminMessages";
import AdminAnalytics from "@/features/admin/AdminAnalytics";
import AdminObservability from "@/features/admin/AdminObservability";
import BlogPost from "@/features/blog/BlogPostPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <SocketProvider>
            <Routes>
              {/* Public portfolio */}
              <Route path="/" element={<Index />} />
              <Route path="/blog/:slug" element={<BlogPost />} />

              {/* Admin login (no auth needed) */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="hero" element={<AdminHero />} />
                <Route path="about" element={<AdminAbout />} />
                <Route path="experience" element={<AdminExperience />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="observability" element={<AdminObservability />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </SocketProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

