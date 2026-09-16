export interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface CategoryCard {
  name: string;
  image: string;
}

export interface NavigationItem {
  name: string;
  icon: string;
  path: string;
  badge?: number;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}
