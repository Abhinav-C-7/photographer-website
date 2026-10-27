import hero1 from '../assets/photos/hero-1.jpg';
import hero2 from '../assets/photos/hero-2.jpg';
import hero3 from '../assets/photos/hero-3.jpg';
import band from '../assets/photos/band.jpg';
import about1 from '../assets/photos/about-1.jpg';
import about2 from '../assets/photos/about-2.jpg';
import about3 from '../assets/photos/about-3.jpg';
import album1 from '../assets/photos/album-1.jpg';
import album2 from '../assets/photos/album-2.jpg';
import album3 from '../assets/photos/album-3.jpg';
import album4 from '../assets/photos/album-4.jpg';
import album5 from '../assets/photos/album-5.jpg';
import album6 from '../assets/photos/album-6.jpg';
import detail1 from '../assets/photos/detail-1.jpg';
import detail2 from '../assets/photos/detail-2.jpg';
import detail3 from '../assets/photos/detail-3.jpg';
import detail4 from '../assets/photos/detail-4.jpg';
import detail5 from '../assets/photos/detail-5.jpg';
import detail6 from '../assets/photos/detail-6.jpg';

// TODO(client): replace the placeholder values below with the real ones.
export const site = {
  name: 'bijith.now',
  title: 'bijith.now | Wedding Photographer',
  description:
    'bijith.now is a wedding photographer telling love stories with warmth and honesty. Explore real wedding albums and get in touch to check your date.',
  email: 'hello@example.com',
  instagramHandle: 'bijith.now',
  instagram: 'https://www.instagram.com/bijith.now/',
  formAction: 'https://formspree.io/f/YOUR_FORM_ID',
  locality: '',
};

export const hero = [
  { image: hero1, alt: 'Bride and groom sitting together by a lake at sunset', focus: '68% 60%' },
  { image: hero2, alt: 'Couple smiling close together in a field at sunset', focus: '58% 40%' },
  { image: hero3, alt: 'Bride and groom walking hand in hand through the woods', focus: '76% 70%' },
];

export const aboutImages = { a: about1, b: about2, c: about3 };
export const bandImage = band;

export const details = [detail1, detail2, detail3, detail4, detail5, detail6];

export interface Album {
  slug: string;
  couple: string;
  place: string;
  year: number;
  cover: ImageMetadata;
  summary: string;
}

// Placeholder albums: replace couple, place, summary and cover photo per wedding.
export const albums: Album[] = [
  { slug: 'ananya-and-rohan', couple: 'Ananya & Rohan', place: 'Placeholder Palace', year: 2025, cover: album1,
    summary: 'A two-day celebration of family, colour and long, unhurried evenings.' },
  { slug: 'meera-and-arjun', couple: 'Meera & Arjun', place: 'Placeholder Gardens', year: 2025, cover: album2,
    summary: 'A morning ceremony among the trees, followed by a lunch that ran into dusk.' },
  { slug: 'isha-and-kabir', couple: 'Isha & Kabir', place: 'Placeholder Coast', year: 2025, cover: album3,
    summary: 'Sea air, bare feet and a ceremony held just as the sun went down.' },
  { slug: 'diya-and-neel', couple: 'Diya & Neel', place: 'Placeholder Estate', year: 2024, cover: album4,
    summary: 'An intimate wedding for forty people, with nothing rushed and nothing staged.' },
  { slug: 'sara-and-vikram', couple: 'Sara & Vikram', place: 'Placeholder Hills', year: 2024, cover: album5,
    summary: 'Cool mountain light, warm families and a very long dance floor.' },
  { slug: 'tara-and-dev', couple: 'Tara & Dev', place: 'Placeholder Courtyard', year: 2024, cover: album6,
    summary: 'A courtyard wedding full of marigolds, music and quiet little moments.' },
];
