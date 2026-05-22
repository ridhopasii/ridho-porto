export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  avatar: string;
  resumeUrl: string;
  socials: {
    github: string;
    linkedin: string;
    telegram: string;
    instagram: string;
  };
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  logo: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  type: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  logo: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Activity {
  id: string;
  title: string;
  organization: string;
  logo: string;
  date: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  featured: boolean;
  link: string;
  github: string;
  tags: string[];
  category: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
  date: string;
  featured: boolean;
  views: number;
  comments: number;
  reactions: number;
  author: string;
  authorAvatar: string;
  readTime: string;
}

export interface Contact {
  id: string;
  platform: string;
  username: string;
  url: string;
  icon: string;
  color: string;
}

export interface Recommendation {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  date: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  likes: number;
  avatar: string;
}

export interface PinnedMessage {
  id: string;
  content: string;
  icon: string;
}

export interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  adminPassword: string;
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
}

export interface AppData {
  profile: Profile;
  experiences: WorkExperience[];
  educations: Education[];
  activities: Activity[];
  projects: Project[];
  blogPosts: BlogPost[];
  contacts: Contact[];
  recommendations: Recommendation[];
  chatMessages: ChatMessage[];
  pinnedMessage: PinnedMessage;
  settings: SiteSettings;
  techStacks: string[];
}
