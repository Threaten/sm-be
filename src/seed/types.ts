/**
 * Shape of the seed content: the website-facing view of the CMS schema
 * (uploads as `{ url, alt }`). Copied from sm-fe/lib/types.ts.
 */

export type Image = { url: string; alt: string };
export type Accent = "red" | "black";
export type Link = { label: string; href: string };

export type PageIntro = {
  eyebrow: string;
  title: string;
  copy: string;
  accent: Accent;
};

export type Course = {
  id?: string;
  slug: string;
  title: string;
  accent: Accent;
  level: string;
  summary: string;
  image: Image;
  imageCaption: string;
  duration: string;
  classSize: string;
  nextIntake: string;
  location: string;
  schedule: string;
  price: string;
  promotionPrice?: string | null;
  syllabus: { title: string; description?: string | null }[];
};

export type StaffMember = {
  slug: string;
  name: string;
  shortName: string;
  role: string;
  note: string;
  image: Image;
  quote: string;
  bio: string[];
  teachingFocus: string;
  specialties: string[];
  favoritePour: string;
  achievements: { year: string; title: string; organization: string }[];
};

export type Service = { title: string; label: string; copy: string; image: Image };
export type GalleryItem = { image: Image; caption: string };
export type Testimonial = { quote: string; author: string; role: string };

export type SiteSettings = {
  announcementBar: { enabled: boolean; message: string; linkLabel?: string | null; linkHref?: string | null };
  navigation: Link[];
  headerCta: Link;
  contact: { address: string; mapUrl: string; email: string; phone: string; hours: string };
  social: { handle: string; url: string };
  footer: {
    tagline: string;
    headline: string;
    ctaLabel: string;
    addressLabel: string;
    contactLabel: string;
    linksLabel: string;
    copyright: string;
  };
  seo: { siteName: string; description: string; shareImage: Image };
  theme: { white: string; black: string; red: string };
};

export type HomePage = {
  hero: {
    kickerLeft: string;
    kickerRight: string;
    titleLineOne: string;
    titleWord: string;
    titleEmphasis: string;
    titleLineThree: string;
    summary: string;
    buttonLabel: string;
    imageLeft: Image;
    imageRight: Image;
    burst: string;
    note: string;
  };
  marquee: string;
  manifesto: { eyebrow: string; title: string; copy: string; image: Image; stamp: string; linkLabel: string };
  /** `person` is a staff slug in the fallback and a populated doc from the CMS. */
  featuredInstructor: { eyebrow: string; title: string; person: StaffMember | string; linkLabel: string };
  featuredCourses: { eyebrow: string; title: string; linkLabel: string };
  testimonials: { eyebrow: string };
};

export type AboutPage = {
  intro: PageIntro;
  story: {
    eyebrow: string;
    title: string;
    copy: string;
    imageOne: Image;
    imageTwo: Image;
    imageOneCaption: string;
    stamp: string;
  };
  marquee: string;
  values: { title: string; items: { title: string; copy: string }[] };
};

export type CoursesPage = {
  intro: PageIntro;
  catalog: { viewCourseLabel: string; stickerLabel: string };
  marquee: string;
  faq: { eyebrow: string; title: string; items: { question: string; answer: string }[] };
  help: { eyebrow: string; title: string; linkLabel: string };
  detail: {
    backLabel: string;
    durationLabel: string;
    tuitionLabel: string;
    classSizeLabel: string;
    reserveLabel: string;
    syllabusEyebrow: string;
    syllabusTitle: string;
    syllabusCopy: string;
    intakeLabel: string;
  };
};

export type TeamPage = {
  intro: PageIntro;
  cardLinkLabel: string;
  note: { eyebrow: string; title: string; copy: string; linkLabel: string };
  profile: {
    backLabel: string;
    profileLabel: string;
    stamp: string;
    bioLabel: string;
    achievementsEyebrow: string;
    achievementsTitle: string;
    practiceEyebrow: string;
    practiceTitle: string;
    offDutyLabel: string;
    favoritePourLabel: string;
    nextLabel: string;
  };
};

/** A news post. `body` is plain paragraphs; the seed turns them into rich text. */
export type NewsPost = {
  slug: string;
  title: string;
  publishedAt: string;
  accent: Accent;
  excerpt: string;
  image: Image;
  imageCaption?: string;
  body: string[];
};

export type NewsPage = {
  intro: PageIntro;
  readMoreLabel: string;
  emptyLabel: string;
  detail: { backLabel: string; publishedLabel: string; moreTitle: string };
};

export type ServicesPage = {
  intro: PageIntro;
  itemLinkLabel: string;
  banner: { eyebrow: string; title: string };
};

export type GalleryPage = {
  intro: PageIntro;
  graffiti: string;
  social: { copy: string };
};

export type ContactPage = {
  intro: PageIntro;
  panels: {
    visitTitle: string;
    visitLinkLabel: string;
    emailTitle: string;
    emailNote: string;
    phoneTitle: string;
  };
  form: {
    eyebrow: string;
    title: string;
    nameLabel: string;
    phoneLabel: string;
    coursesLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
    successTitle: string;
    successCopy: string;
  };
};

export type PopupSlide = {
  active: boolean;
  displayMode: "image" | "video";
  title: string;
  eyebrow?: string | null;
  copy?: string | null;
  image?: Image | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  videoUrl?: string | null;
};

export type EntryPopup = { enabled: boolean; dismissLabel: string; slides: PopupSlide[] };
