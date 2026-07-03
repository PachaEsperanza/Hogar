export const heroSlides = [
  {
    type: 'image' as const,
    src: '/Hogar/images/hero1.jpg',
  },
  {
    type: 'image' as const,
    src: '/Hogar/images/hero2.jpeg',
  },
  {
    type: 'image' as const,
    src: '/Hogar/images/hero3.jpg',
  },
  {
    type: 'video' as const,
    src: '/Hogar/videos/hero5.mp4',
  },
  {
    type: 'video' as const,
    src: '/Hogar/videos/heroo.mp4',
  },
];

export interface Producer {
  name: string;
  location: string;
  story: string;
  image: string;
}

