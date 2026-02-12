export interface Service {
  id: string;
  title: string;
  description: string;
  href: string;
  icon?: string;
  features?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image?: string;
  rating?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image?: string;
  tags?: string[];
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
