import { personalInfo } from "@/data";

const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="container mx-auto text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} {personalInfo.name}. Built with ❤️ and lots of ☕</p>
      </div>
    </footer>
  );
};

export default Footer;
