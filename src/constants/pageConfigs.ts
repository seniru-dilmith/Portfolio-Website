import { getSvgPathsByTheme } from "@/constants/svgPaths";

export interface PageConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl: string;
  twitterTitle?: string;
  twitterDescription?: string;
  backgroundClassName?: string;
  svgTheme: 'balloon' | 'music' | 'tech' | 'nature';
  animatedBackgroundProps?: {
    gradientFrom?: string;
    gradientVia?: string;
    gradientTo?: string;
    duration?: number;
    opacity?: number;
  };
  floatingElementsProps?: {
    primaryCount?: number;
    extraCount?: number;
    ambientCount?: number;
    starCount?: number;
    starOpacity?: string;
    starColor?: string;
    customColors?: string[];
  };
}

export const PAGE_CONFIGS: Record<string, PageConfig> = {
  projects: {
    title: "Projects - Seniru Dilmith",
    description: "Explore my projects in AI, Web Development, Cloud Computing, and Open Source contributions.",
    keywords: "Projects, AI, Web Development, Cloud, Open Source, Next.js, React",
    ogUrl: "https://seniru.dev/projects",
    svgTheme: 'balloon',
    floatingElementsProps: {
      primaryCount: 3,
      extraCount: 1,
      ambientCount: 1,
      starCount: 5,
      starOpacity: "25",
      starColor: "accent/60",
    },
  },
  story: {
    title: "My Story - Seniru Dilmith",
    description: "Read articles on web development, AI, cloud computing, and technology trends.",
    keywords: "Tech Blog, AI, Web Development, Cloud Computing, Programming, Next.js",
    ogTitle: "Blog - Seniru Dilmith",
    ogDescription: "Read the latest articles on AI, web development, and software engineering.",
    ogUrl: "https://seniru.dev/story",
    twitterTitle: "My Story - Seniru Dilmith",
    twitterDescription: "Insights on AI, Web Development, and Cloud Computing.",
    backgroundClassName: "min-h-screen bg-gradient-to-br from-primary to-secondary via-accent text-primary-content overflow-x-hidden relative",
    svgTheme: 'music',
    animatedBackgroundProps: {
      gradientFrom: "hsl(var(--primary) / 0.3)",
      gradientVia: "hsl(var(--secondary) / 0.2)", 
      gradientTo: "hsl(var(--accent) / 0.3)",
      duration: 10,
    },
    floatingElementsProps: {
      primaryCount: 3,
      extraCount: 1,
      ambientCount: 1,
      starCount: 5,
      starOpacity: "60",
      starColor: "accent/80",
      customColors: ["#ffffff", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af"],
    },
  },
  articles: {
    title: "Articles - Seniru Dilmith",
    description: "Technical articles and insights on modern web development, AI, and software engineering.",
    keywords: "Articles, Blog, Web Development, AI, Software Engineering, Technical Writing",
    ogUrl: "https://seniru.dev/articles",
    svgTheme: 'tech',
    floatingElementsProps: {
      primaryCount: 4,
      extraCount: 8,
      ambientCount: 6,
      starCount: 10,
      starOpacity: "20",
      starColor: "primary/50",
    },
  },
  contact: {
    title: "Contact - Seniru Dilmith",
    description: "Get in touch for collaborations, projects, or just to say hello.",
    keywords: "Contact, Collaboration, Projects, Communication",
    ogUrl: "https://seniru.dev/contact",
    svgTheme: 'nature',
    floatingElementsProps: {
      primaryCount: 3,
      extraCount: 6,
      ambientCount: 4,
      starCount: 8,
      starOpacity: "15",
      starColor: "secondary/40",
    },
  },
};

// Helper function to get page configuration with SVG paths
export const getPageConfig = (pageKey: string): PageConfig & { floatingSvgPaths: string[] } => {
  const config = PAGE_CONFIGS[pageKey];
  if (!config) {
    throw new Error(`Page configuration not found for key: ${pageKey}`);
  }
  
  return {
    ...config,
    floatingSvgPaths: getSvgPathsByTheme(config.svgTheme),
  };
};
