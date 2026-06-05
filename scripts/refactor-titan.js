import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

// Directories to create
const dirsToCreate = [
  'src/app/router',
  'src/app/providers',
  'src/app/store',
  'src/app/config',
  'src/app/bootstrap',
  'src/features/hero',
  'src/features/about',
  'src/features/skills',
  'src/features/services',
  'src/features/blog',
  'src/features/projects',
  'src/features/analytics',
  'src/features/auth',
  'src/features/ai',
  'src/features/testimonials',
  'src/features/experience',
  'src/features/contact',
  'src/features/error',
  'src/features/admin',
  'src/features/portfolio',
  'src/shared/components/ui',
  'src/shared/hooks',
  'src/shared/types',
  'src/shared/utils',
  'src/shared/constants',
  'src/shared/locales',
  'src/services/api',
  'src/services/cache',
  'src/services/auth',
  'src/services/websocket',
  'src/infrastructure/logging',
  'src/infrastructure/monitoring',
  'src/infrastructure/tracing',
  'src/infrastructure/security',
  'src/tests'
];

// File relocations: [source, destination]
const fileMoves = [
  // Components
  ['src/components/AboutSection.tsx', 'src/features/about/AboutSection.tsx'],
  ['src/components/BlogSection.tsx', 'src/features/blog/BlogSection.tsx'],
  ['src/components/ContactSection.tsx', 'src/features/contact/ContactSection.tsx'],
  ['src/components/ExperienceSection.tsx', 'src/features/experience/ExperienceSection.tsx'],
  ['src/components/HeroSection.tsx', 'src/features/hero/HeroSection.tsx'],
  ['src/components/ProjectsSection.tsx', 'src/features/projects/ProjectsSection.tsx'],
  ['src/components/ServicesSection.tsx', 'src/features/services/ServicesSection.tsx'],
  ['src/components/SkillsSection.tsx', 'src/features/skills/SkillsSection.tsx'],
  ['src/components/TestimonialsSection.tsx', 'src/features/testimonials/TestimonialsSection.tsx'],
  ['src/components/Terminal.tsx', 'src/features/ai/Terminal.tsx'],
  ['src/components/Navbar.tsx', 'src/shared/components/Navbar.tsx'],
  ['src/components/Footer.tsx', 'src/shared/components/Footer.tsx'],
  ['src/components/CustomCursor.tsx', 'src/shared/components/CustomCursor.tsx'],
  ['src/components/ParticleGrid.tsx', 'src/shared/components/ParticleGrid.tsx'],
  ['src/components/LanguageSwitcher.tsx', 'src/shared/components/LanguageSwitcher.tsx'],
  ['src/components/Magnetic.tsx', 'src/shared/components/Magnetic.tsx'],
  ['src/components/NavLink.tsx', 'src/shared/components/NavLink.tsx'],
  ['src/components/RichTextEditor.tsx', 'src/shared/components/RichTextEditor.tsx'],
  ['src/components/ResumeDownloadButton.tsx', 'src/features/about/ResumeDownloadButton.tsx'],
  ['src/components/ResumePDF.tsx', 'src/features/about/ResumePDF.tsx'],
  ['src/components/admin/ProtectedRoute.tsx', 'src/features/auth/ProtectedRoute.tsx'],

  // Context & Lib
  ['src/context/AuthContext.tsx', 'src/services/auth/AuthContext.tsx'],
  ['src/lib/apiClient.ts', 'src/services/api/apiClient.ts'],
  ['src/lib/analytics.ts', 'src/services/api/analytics.ts'],
  ['src/lib/githubSync.ts', 'src/services/api/githubSync.ts'],
  ['src/lib/i18n.ts', 'src/app/config/i18n.ts'],
  ['src/lib/utils.ts', 'src/shared/utils/utils.ts'],

  // Pages
  ['src/pages/Index.tsx', 'src/features/portfolio/PortfolioPage.tsx'],
  ['src/pages/BlogPost.tsx', 'src/features/blog/BlogPostPage.tsx'],
  ['src/pages/NotFound.tsx', 'src/features/error/NotFoundPage.tsx']
];

// Helper to create directory recursively
function ensureDir(dirPath) {
  const absolutePath = path.resolve(rootDir, dirPath);
  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Helper to move file
function moveFile(src, dest) {
  const srcAbs = path.resolve(rootDir, src);
  const destAbs = path.resolve(rootDir, dest);
  if (fs.existsSync(srcAbs)) {
    // Ensure destination directory exists
    fs.mkdirSync(path.dirname(destAbs), { recursive: true });
    fs.renameSync(srcAbs, destAbs);
    console.log(`Moved: ${src} -> ${dest}`);
  } else {
    console.warn(`Source file not found: ${src}`);
  }
}

// Helper to copy directory contents
function moveDirContents(srcDirRel, destDirRel) {
  const srcAbs = path.resolve(rootDir, srcDirRel);
  const destAbs = path.resolve(rootDir, destDirRel);
  if (!fs.existsSync(srcAbs)) {
    console.warn(`Source directory not found: ${srcDirRel}`);
    return;
  }
  fs.mkdirSync(destAbs, { recursive: true });
  const items = fs.readdirSync(srcAbs);
  for (const item of items) {
    const srcItem = path.join(srcAbs, item);
    const destItem = path.join(destAbs, item);
    if (fs.statSync(srcItem).isDirectory()) {
      moveDirContents(path.join(srcDirRel, item), path.join(destDirRel, item));
    } else {
      fs.renameSync(srcItem, destItem);
      console.log(`Moved: ${path.join(srcDirRel, item)} -> ${path.join(destDirRel, item)}`);
    }
  }
  // Delete the empty directory
  try {
    fs.rmdirSync(srcAbs);
  } catch (e) {
    // ignore if not empty
  }
}

// Find all files in a directory recursively
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.css')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function runRefactor() {
  console.log('--- Creating Directories ---');
  dirsToCreate.forEach(ensureDir);

  console.log('\n--- Moving Individual Files ---');
  fileMoves.forEach(([src, dest]) => moveFile(src, dest));

  console.log('\n--- Moving UI Components ---');
  moveDirContents('src/components/ui', 'src/shared/components/ui');

  console.log('\n--- Moving Hooks ---');
  moveDirContents('src/hooks', 'src/shared/hooks');

  console.log('\n--- Moving Locales ---');
  moveDirContents('src/locales', 'src/shared/locales');

  console.log('\n--- Moving Admin Pages ---');
  moveDirContents('src/pages/admin', 'src/features/admin');

  console.log('\n--- Updating Import Statements ---');
  const allFiles = getAllFiles(srcDir);
  console.log(`Scanning ${allFiles.length} files for import updates...`);

  // We will perform replacements in code
  allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Convert relative component imports in features/shared to absolute or clean relative
    // To make it simple and bulletproof, replace common aliases:

    // UI components
    content = content.replace(/@\/components\/ui\//g, '@/shared/components/ui/');
    // Common components
    content = content.replace(/@\/components\/Navbar/g, '@/shared/components/Navbar');
    content = content.replace(/@\/components\/Footer/g, '@/shared/components/Footer');
    content = content.replace(/@\/components\/CustomCursor/g, '@/shared/components/CustomCursor');
    content = content.replace(/@\/components\/ParticleGrid/g, '@/shared/components/ParticleGrid');
    content = content.replace(/@\/components\/LanguageSwitcher/g, '@/shared/components/LanguageSwitcher');
    content = content.replace(/@\/components\/Magnetic/g, '@/shared/components/Magnetic');
    content = content.replace(/@\/components\/NavLink/g, '@/shared/components/NavLink');
    content = content.replace(/@\/components\/RichTextEditor/g, '@/shared/components/RichTextEditor');
    content = content.replace(/@\/components\/AboutSection/g, '@/features/about/AboutSection');
    content = content.replace(/@\/components\/BlogSection/g, '@/features/blog/BlogSection');
    content = content.replace(/@\/components\/ContactSection/g, '@/features/contact/ContactSection');
    content = content.replace(/@\/components\/ExperienceSection/g, '@/features/experience/ExperienceSection');
    content = content.replace(/@\/components\/HeroSection/g, '@/features/hero/HeroSection');
    content = content.replace(/@\/components\/ProjectsSection/g, '@/features/projects/ProjectsSection');
    content = content.replace(/@\/components\/ServicesSection/g, '@/features/services/ServicesSection');
    content = content.replace(/@\/components\/SkillsSection/g, '@/features/skills/SkillsSection');
    content = content.replace(/@\/components\/TestimonialsSection/g, '@/features/testimonials/TestimonialsSection');
    content = content.replace(/@\/components\/Terminal/g, '@/features/ai/Terminal');
    content = content.replace(/@\/components\/ResumeDownloadButton/g, '@/features/about/ResumeDownloadButton');
    content = content.replace(/@\/components\/ResumePDF/g, '@/features/about/ResumePDF');

    // Admin Protected route
    content = content.replace(/@\/components\/admin\/ProtectedRoute/g, '@/features/auth/ProtectedRoute');
    content = content.replace(/\.\.\/components\/admin\/ProtectedRoute/g, '@/features/auth/ProtectedRoute');

    // Context & Libs & Hooks
    content = content.replace(/@\/context\/AuthContext/g, '@/services/auth/AuthContext');
    content = content.replace(/@\/hooks\//g, '@/shared/hooks/');
    content = content.replace(/@\/lib\/apiClient/g, '@/services/api/apiClient');
    content = content.replace(/@\/lib\/analytics/g, '@/services/api/analytics');
    content = content.replace(/@\/lib\/githubSync/g, '@/services/api/githubSync');
    content = content.replace(/@\/lib\/utils/g, '@/shared/utils/utils');
    content = content.replace(/\.\.\/lib\/i18n/g, '@/app/config/i18n');
    content = content.replace(/\.\/lib\/i18n/g, '@/app/config/i18n');

    // Pages / Router imports in App.tsx
    content = content.replace(/\.\/pages\/Index/g, '@/features/portfolio/PortfolioPage');
    content = content.replace(/\.\/pages\/NotFound/g, '@/features/error/NotFoundPage');
    content = content.replace(/\.\/pages\/BlogPost/g, '@/features/blog/BlogPostPage');

    // Admin pages sub-imports in App.tsx
    content = content.replace(/\.\/pages\/admin\//g, '@/features/admin/');

    // Local JSON imports in i18n.ts
    content = content.replace(/\.\.\/locales\//g, '@/shared/locales/');

    // Relative parent imports in moved page/feature files
    content = content.replace(/import (.*) from "\.\.\/components\//g, 'import $1 from "@/shared/components/');
    content = content.replace(/import (.*) from "\.\.\/\.\.\/components\//g, 'import $1 from "@/shared/components/');

    // If any changes were made, write them back
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated imports in: ${path.relative(rootDir, file)}`);
    }
  });

  // Remove empty src/components folder if it's empty
  const oldComponentsDir = path.join(srcDir, 'components');
  if (fs.existsSync(oldComponentsDir)) {
    try {
      fs.rmdirSync(oldComponentsDir);
      console.log('Removed empty src/components directory.');
    } catch (e) {
      // not empty
    }
  }

  // Remove empty src/context folder
  const oldContextDir = path.join(srcDir, 'context');
  if (fs.existsSync(oldContextDir)) {
    try {
      fs.rmdirSync(oldContextDir);
      console.log('Removed empty src/context directory.');
    } catch (e) {
      // not empty
    }
  }

  // Remove empty src/lib folder
  const oldLibDir = path.join(srcDir, 'lib');
  if (fs.existsSync(oldLibDir)) {
    try {
      fs.rmdirSync(oldLibDir);
      console.log('Removed empty src/lib directory.');
    } catch (e) {
      // not empty
    }
  }

  // Remove empty src/pages folder
  const oldPagesDir = path.join(srcDir, 'pages');
  if (fs.existsSync(oldPagesDir)) {
    try {
      fs.rmdirSync(oldPagesDir);
      console.log('Removed empty src/pages directory.');
    } catch (e) {
      // not empty
    }
  }

  console.log('\n--- Refactoring Completed! ---');
}

runRefactor();
