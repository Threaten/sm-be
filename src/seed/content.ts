/**
 * Seed content for a fresh database (seed-skillmix.ts); migrate-v2.ts also
 * uses it to fill fields that did not exist in the old schema.
 *
 * sm-fe keeps the same content in sm-fe/lib/fallback.ts for when the CMS is
 * unreachable. If you change one, consider changing the other.
 */
import type {
  AboutPage,
  ContactPage,
  Course,
  CoursesPage,
  EntryPopup,
  GalleryItem,
  GalleryPage,
  HomePage,
  Service,
  NewsPage,
  ServicesPage,
  SiteSettings,
  StaffMember,
  TeamPage,
  Testimonial,
} from "./types";

const unsplash = (id: string, width = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=85`;

const navigation = [
  { label: "Trang Chủ", href: "/" },
  { label: "Khoá Học", href: "/courses" },
  { label: "Giảng Viên", href: "/staffs" },
  { label: "Thư Viện", href: "/gallery" },
  { label: "Dịch Vụ", href: "/services" },
  { label: "Tin Tức", href: "/news" },
];

export const siteSettings: SiteSettings = {
  announcementBar: {
    enabled: true,
    message: "Đăng ký tư vấn miễn phí cùng Skill & Mix.",
    linkLabel: "Đăng ký ngay",
    linkHref: "/contact-us",
  },
  navigation,
  headerCta: { label: "Đăng Ký Ngay", href: "/contact-us" },
  contact: {
    address: "643 Nguyen Kiem Street\nDuc Nhuan Ward, Ho Chi Minh City",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=643+Nguyen+Kiem+Street+Duc+Nhuan+Ward+Ho+Chi+Minh+City",
    email: "hello@skillandmix.com",
    phone: "+84 28 3822 0148",
    hours: "Monday to Friday\n10:00 to 18:00",
  },
  social: { handle: "@skillandmix", url: "https://instagram.com" },
  footer: {
    tagline: "Skill & Mix Academy",
    headline: "Sẵn Sàng Bắt Đầu Hành Trình Bartender?",
    ctaLabel: "Đăng Ký Tư Vấn Ngay",
    addressLabel: "Địa Chỉ",
    contactLabel: "Liên Hệ",
    linksLabel: "Khám Phá",
    copyright: "© 2026 Skill & Mix Academy.",
  },
  seo: {
    siteName: "Skill & Mix",
    description: "A hands-on academy for better drinks, sharper service, and braver ideas.",
    shareImage: {
      url: unsplash("1574096079513-d8259312b785", 1200),
      alt: "Bartending class in progress at Skill & Mix",
    },
  },
  theme: {
    white: "#FFFFFF",
    black: "#111111",
    red: "#D7141A",
  },
};

export const homePage: HomePage = {
  hero: {
    kickerLeft: "Trung tâm đào tạo bartender tại TP.HCM",
    kickerRight: "Kỹ năng thực chiến · Kết nối nghề nghiệp",
    titleLineOne: "LEARN THE",
    titleWord: "SKILL.",
    titleEmphasis: "MASTER",
    titleLineThree: "THE MIX.",
    summary: "Trung tâm đào tạo bartender tại TP.HCM – kỹ năng thực chiến, kết nối nghề nghiệp.",
    buttonLabel: "Khám Phá Khoá Học",
    imageLeft: { url: unsplash("1574096079513-d8259312b785", 1000), alt: "Bartending class in progress" },
    imageRight: { url: unsplash("1551024709-8f23befc6f87", 1000), alt: "Finished cocktail" },
    burst: "Học\nthật",
    note: "Tư vấn miễn phí.\nHọc thử trước khi quyết định.",
  },
  marquee: "Học Thật / Làm Thật / Sẵn Sàng Đi Làm",
  manifesto: {
    eyebrow: "Về Skill & Mix",
    title: "Tại Sao Chọn Skill & Mix?",
    copy: "Skill & Mix không chỉ dạy cách pha chế – chúng tôi đào tạo bartender tự tin, chuyên nghiệp và sẵn sàng đi làm ngay. Nắm vững lý thuyết và thực hành, học từ bartender đang làm việc thực tế, kết nối cơ hội việc làm và lịch học linh hoạt.",
    image: { url: unsplash("1513558161293-cdaf765ed2fd"), alt: "Friends raising cocktails around a table" },
    stamp: "HỌC\nTHẬT",
    linkLabel: "Xem Thêm Về Chúng Tôi",
  },
  featuredInstructor: {
    eyebrow: "Giảng viên nổi bật",
    title: "Học trực tiếp cùng đội ngũ Skill & Mix.",
    person: "grace-truong",
    linkLabel: "Gặp Grace",
  },
  featuredCourses: {
    eyebrow: "Khoá học nổi bật",
    title: "Các Khoá Học Tại Skill & Mix",
    linkLabel: "Xem Chi Tiết",
  },
  testimonials: { eyebrow: "Học viên nói gì" },
};

export const aboutPage: AboutPage = {
  intro: {
    eyebrow: "Inside Skill & Mix",
    title: "A SCHOOL FOR THIRSTY MINDS.",
    copy: "We built the class we wished existed: practical, demanding, generous, and a little bit chaotic.",
    accent: "red",
  },
  story: {
    eyebrow: "One tiny bar. One big idea.",
    title: "It started with six stools and a Tuesday night class.",
    copy: "In 2026, Minh Anh pushed the bottles aside after service and invited a few curious regulars behind the bar. They asked better questions than most training manuals. Skill & Mix grew from there.",
    imageOne: { url: unsplash("1470337458703-46ad1756a187"), alt: "The warmly lit bar where Skill & Mix began" },
    imageTwo: {
      url: unsplash("1544145945-f90425340c7e", 1000),
      alt: "Cocktail ingredients and glassware on a work bench",
    },
    imageOneCaption: "Our first classroom, 2026",
    stamp: "Est. 2026\nfresh pour",
  },
  marquee: "Palate first / Ego last",
  values: {
    title: "House rules",
    items: [
      { title: "Taste before theory", copy: "Your palate is the tool. We train it before we ask you to memorize anything." },
      { title: "Clean is fast", copy: "Good systems make speed feel calm. Every class builds habits that survive a busy shift." },
      { title: "Hospitality wins", copy: "A technically perfect drink can still be a bad experience. People come first." },
      { title: "Stay curious", copy: "The minute you know everything is the minute your drinks get boring." },
    ],
  },
};

export const coursesPage: CoursesPage = {
  intro: {
    eyebrow: "Khóa học",
    title: "KHÓA HỌC BARTENDER TẠI SKILL & MIX",
    copy: "Từ nền tảng cơ bản đến những kỹ năng chuyên sâu, các khóa học tại Skill & Mix được xây dựng theo từng mục tiêu và trình độ. Học viên được tiếp cận kiến thức, thực hành kỹ năng và từng bước phát triển năng lực phù hợp với định hướng của mình.",
    accent: "red",
  },
  catalog: { viewCourseLabel: "Xem khoá học", stickerLabel: "hands on" },
  marquee: "Small class / Big practice",
  faq: {
    eyebrow: "FAQ",
    title: "Câu Hỏi Thường Gặp",
    items: [
      {
        question: "Tôi chưa biết gì về pha chế, có học được không?",
        answer: "Hoàn toàn có thể. Khóa học được xây dựng theo từng cấp độ, trong đó khóa Bartender Cơ Bản phù hợp với người mới bắt đầu.",
      },
      {
        question: "Skill & Mix có hỗ trợ giới thiệu việc làm không?",
        answer: "Skill & Mix có hỗ trợ kết nối và giới thiệu cơ hội phù hợp cho học viên sau khi hoàn thành khóa học, tùy theo năng lực và nhu cầu tuyển dụng tại từng thời điểm.",
      },
      {
        question: "Tôi có thể học thử trước khi đăng ký không?",
        answer: "Bạn có thể đăng ký tham quan hoặc tham gia buổi trải nghiệm theo lịch của Skill & Mix để tìm hiểu thêm về phương pháp học và môi trường đào tạo.",
      },
      {
        question: "Lịch học có linh hoạt không?",
        answer: "Lịch học được sắp xếp theo từng khóa và từng lớp. Bạn có thể liên hệ để được tư vấn lịch học phù hợp với thời gian của mình.",
      },
      {
        question: "Tôi nên bắt đầu với khóa học nào?",
        answer: "Đội ngũ Skill & Mix sẽ tư vấn dựa trên nền tảng hiện tại, mục tiêu học và định hướng của bạn để lựa chọn khóa học phù hợp.",
      },
    ],
  },
  help: {
    eyebrow: "Câu hỏi thường gặp",
    title: "Bạn chưa biết nên bắt đầu với khóa học nào?",
    linkLabel: "Liên hệ để được tư vấn",
  },
  detail: {
    backLabel: "Tất cả khóa học",
    durationLabel: "Thời lượng",
    tuitionLabel: "Học phí",
    classSizeLabel: "Sĩ số",
    reserveLabel: "Đăng ký tư vấn",
    syllabusEyebrow: "Nội dung khóa học",
    syllabusTitle: "Bạn sẽ học",
    syllabusCopy: "Mỗi khóa học kết hợp kiến thức nền tảng, hướng dẫn trực tiếp và thực hành liên tục.",
    intakeLabel: "Lịch khai giảng",
  },
};

export const teamPage: TeamPage = {
  intro: {
    eyebrow: "Giảng viên",
    title: "GẶP GỠ ĐỘI NGŨ SKILL & MIX",
    copy: "Đội ngũ giảng viên của Skill & Mix là những người đang trực tiếp làm việc và tích lũy kinh nghiệm trong ngành Beverage & Hospitality. Mỗi người mang đến những góc nhìn, chuyên môn và trải nghiệm thực tế riêng trong quá trình đào tạo.",
    accent: "black",
  },
  cardLinkLabel: "Gặp",
  note: {
    eyebrow: "Học cùng đội ngũ",
    title: "Muốn Học Trực Tiếp Cùng Đội Ngũ Skill & Mix?",
    copy: "Mỗi hành trình học cần một người dẫn dắt phù hợp. Tại Skill & Mix, đội ngũ giảng viên đồng hành cùng học viên từ những kỹ năng nền tảng đến quá trình rèn luyện và phát triển theo mục tiêu riêng.",
    linkLabel: "Đăng Ký Tư Vấn",
  },
  profile: {
    backLabel: "All staff",
    profileLabel: "Profile",
    stamp: "Skill\n& Mix\nfaculty",
    bioLabel: "Behind the apron",
    achievementsEyebrow: "Awards & achievements",
    achievementsTitle: "A few things worth raising a glass to.",
    practiceEyebrow: "At the workbench",
    practiceTitle: "What {name} teaches.",
    offDutyLabel: "Off duty",
    favoritePourLabel: "Favorite pour:",
    nextLabel: "Next behind the bar",
  },
};

export const servicesPage: ServicesPage = {
  intro: {
    eyebrow: "Beyond the classroom",
    title: "WE BRING THE BAR TO THE BRIEF.",
    copy: "Private workshops, sharper menus, stronger teams. Tell us what needs mixing.",
    accent: "red",
  },
  itemLinkLabel: "Start a conversation",
  banner: { eyebrow: "Need something stranger?", title: "We like a brief with a little bite." },
};

export const newsPage: NewsPage = {
  intro: {
    eyebrow: "Tin tức",
    title: "TIN TỨC TỪ SKILL & MIX",
    copy: "Lịch khai giảng, sự kiện, workshop và những câu chuyện từ quầy bar của Skill & Mix.",
    accent: "black",
  },
  readMoreLabel: "Đọc tiếp",
  emptyLabel: "Chưa có bài viết nào. Quay lại sau nhé.",
  detail: { backLabel: "Tất cả tin tức", publishedLabel: "Đăng ngày", moreTitle: "Tin khác" },
};

export const galleryPage: GalleryPage = {
  intro: {
    eyebrow: "Inside the lab",
    title: "MESSY HANDS. CLEAN DRINKS.",
    copy: "Classes, experiments, guest shifts, bad ideas that became good ideas, and the occasional perfect lemon peel.",
    accent: "black",
  },
  graffiti: "proof of\npractice",
  social: { copy: "More spills, drills, and questionable garnishes:" },
};

export const contactPage: ContactPage = {
  intro: {
    eyebrow: "Say hello",
    title: "QUESTIONS? GOOD.",
    copy: "Ask about a course, plan a private class, bring us a strange brief, or just come see the room.",
    accent: "red",
  },
  panels: {
    visitTitle: "Come by",
    visitLinkLabel: "Open maps",
    emailTitle: "Write us",
    emailNote: "We answer within two working days. Usually faster.",
    phoneTitle: "Call",
  },
  form: {
    eyebrow: "What's on your mind?",
    title: "Drop us a line.",
    nameLabel: "Name",
    phoneLabel: "Phone",
    coursesLabel: "Course",
    messageLabel: "Message",
    messagePlaceholder: "Tell us everything...",
    submitLabel: "Send it",
    successTitle: "Message mixed.",
    successCopy: "We'll get back to you shortly.",
  },
};

export const entryPopup: EntryPopup = {
  enabled: false,
  dismissLabel: "Để sau",
  slides: [
    {
      active: true,
      displayMode: "image",
      eyebrow: "Ưu đãi hiện tại",
      title: "Đăng Ký Sớm – Giá Tốt Hơn",
      copy: "Đăng ký trước hạn để nhận mức giảm, đặt cọc giữ chỗ và ưu đãi theo số suất còn lại.",
      image: { url: unsplash("1551024709-8f23befc6f87", 1000), alt: "Finished cocktail" },
      ctaLabel: "Xem Ưu Đãi",
      ctaHref: "/contact-us",
    },
  ],
};

export const services: Service[] = [
  {
    title: "Private Classes",
    label: "8 to 24 guests",
    copy: "A hands-on class built around your group, from first date to full team offsite. Everyone leaves knowing what they made and why it worked.",
    image: { url: unsplash("1513558161293-cdaf765ed2fd", 1200), alt: "Guests raising cocktails at a private class" },
  },
  {
    title: "Menu Development",
    label: "For bars & restaurants",
    copy: "Concept, costing, prep systems, training, and launch. We make menus that sound like you and work on a real Friday night.",
    image: { url: unsplash("1510812431401-41d2bd2722f3", 1200), alt: "Glasses lined up during menu tasting" },
  },
  {
    title: "Bar Team Training",
    label: "On site or at Skill & Mix",
    copy: "A focused reset for service teams: technique, station systems, hospitality language, and drills built around your actual operation.",
    image: { url: unsplash("1574096079513-d8259312b785", 1200), alt: "Bartenders training behind the bar" },
  },
];

export const testimonials: Testimonial[] = [
  { quote: "Học rất thực tế, làm nhiều hơn ngồi nghe. Sau khóa mình tự tin hơn hẳn khi đứng quầy.", author: "Minh Tú", role: "Học viên · 22 tuổi" },
  { quote: "Trước khi học mình không biết gì về bartending. Giờ mình có thể tự tin pha những món cơ bản.", author: "Thảo Vy", role: "Học viên · 20 tuổi" },
  { quote: "Không khí lớp vui, thầy sửa từng động tác và không làm mình ngại khi hỏi.", author: "Hoàng Nam", role: "Học viên · 25 tuổi" },
  { quote: "Mình thích nhất là được thực hành liên tục. Học xong có thể áp dụng ngay khi đi làm.", author: "Bảo Anh", role: "Khoá Bartender Cơ Bản" },
  { quote: "Lớp nhỏ nên được hướng dẫn rất kỹ. Mỗi buổi đều thấy tay mình chắc hơn một chút.", author: "Linh Chi", role: "Học viên" },
  { quote: "Kiến thức dễ hiểu, không quá học thuật. Mình đi học sau giờ làm vẫn theo kịp.", author: "Quốc Huy", role: "Học viên buổi tối" },
  { quote: "Từ cách cầm jigger đến setup quầy đều được chỉ rõ. Những chi tiết nhỏ thật sự hữu ích.", author: "Gia Hân", role: "Khoá Bar Skill" },
  { quote: "Mình đăng ký vì tò mò, cuối cùng lại tìm được một công việc mà mình thật sự thích.", author: "Tuấn Kiệt", role: "Cựu học viên" },
  { quote: "Giảng viên gần gũi và feedback thẳng. Sai ở đâu là được sửa ngay ở đó.", author: "Ngọc Mai", role: "Khoá Nâng Cao" },
  { quote: "Buổi nào cũng vui nhưng vẫn học được rất nhiều. Đây là khóa học mình sẽ giới thiệu cho bạn bè.", author: "Đức Anh", role: "Học viên" },
];

export const courses: Course[] = [
  {
    "slug": "bartender-co-ban",
    "title": "Bartender Cơ Bản",
    "level": "Người mới 100%, sinh viên, người muốn chuyển ngành",
    "duration": "2 tháng (8 tuần)",
    "price": "Liên hệ",
    "classSize": "Tối đa 6 học viên/lớp",
    "nextIntake": "Liên hệ để nhận lịch gần nhất",
    "schedule": "Lịch học theo từng lớp và lịch giảng viên",
    "location": "TP. Hồ Chí Minh",
    "summary": "Khóa học dành cho người mới bắt đầu, giúp xây dựng kiến thức nền tảng, kỹ thuật pha chế và quy trình làm việc tại quầy bar.",
    "imageCaption": "Skill & Mix Academy · TP.HCM",
    "accent": "red",
    "image": {
      "url": "https://images.unsplash.com/photo-1436076863939-06870fe779c2?auto=format&fit=crop&w=1400&q=88",
      "alt": "Học viên thực hành pha chế tại quầy với shaker và dụng cụ bartender"
    },
    "syllabus": [
      {
        "title": "Kiến thức nền tảng về rượu và cocktail"
      },
      {
        "title": "Làm quen với các dụng cụ và kỹ thuật pha chế cơ bản"
      },
      {
        "title": "Thực hành các công thức cocktail phổ biến"
      },
      {
        "title": "Kỹ năng giao tiếp và phục vụ khách hàng"
      },
      {
        "title": "Rèn luyện thao tác và quy trình làm việc tại quầy bar"
      },
      {
        "title": "Thực hành trong môi trường mô phỏng thực tế"
      }
    ]
  },
  {
    "slug": "bartender-nang-cao",
    "title": "Bartender Nâng Cao",
    "level": "Học viên đã hoàn thành khoá cơ bản, bartender muốn lên tay",
    "duration": "6 tuần",
    "price": "Liên hệ",
    "classSize": "Lớp thực hành chuyên sâu",
    "nextIntake": "Liên hệ để nhận lịch gần nhất",
    "schedule": "Lịch học theo từng lớp",
    "location": "TP. Hồ Chí Minh",
    "summary": "Khóa học dành cho học viên đã có nền tảng, tập trung vào kỹ thuật nâng cao, thiết kế menu và vận hành quầy bar chuyên nghiệp.",
    "imageCaption": "Skill & Mix Academy · TP.HCM",
    "accent": "black",
    "image": {
      "url": "https://images.unsplash.com/photo-1556855810-ac404aa91e85?auto=format&fit=crop&w=1400&q=88",
      "alt": "Bartender thực hành kỹ thuật nâng cao tại quầy bar"
    },
    "syllabus": [
      {
        "title": "Kỹ thuật nâng cao: layering, infusion, smoke"
      },
      {
        "title": "Thiết kế menu cocktail signature"
      },
      {
        "title": "Vận hành quầy bar: inventory, cost control"
      },
      {
        "title": "Mixology & pairing"
      },
      {
        "title": "Phong cách phục vụ tại các bar chuyên nghiệp"
      },
      {
        "title": "Thực hành tại bar thực tế (đối tác Skill & Mix)"
      }
    ]
  },
  {
    "slug": "flair-bartending",
    "title": "Flair Bartending",
    "level": "Bartender muốn nâng cao kỹ năng biểu diễn, kiểm soát dụng cụ và tạo thêm dấu ấn cá nhân trong quá trình làm việc",
    "duration": "8 buổi",
    "price": "Liên hệ",
    "classSize": "Lớp thực hành",
    "nextIntake": "Liên hệ để nhận lịch gần nhất",
    "schedule": "Lịch học theo từng lớp",
    "location": "TP. Hồ Chí Minh",
    "summary": "Phát triển kỹ năng biểu diễn, khả năng kiểm soát dụng cụ và dấu ấn cá nhân thông qua luyện tập liên tục.",
    "imageCaption": "Skill & Mix Academy · TP.HCM",
    "accent": "red",
    "image": {
      "url": "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=1400&q=88",
      "alt": "Flair bartender biểu diễn và kiểm soát dụng cụ"
    },
    "syllabus": [
      {
        "title": "Các kỹ thuật Flair cơ bản và cách kiểm soát dụng cụ"
      },
      {
        "title": "Phát triển phong cách biểu diễn phù hợp với cá nhân"
      },
      {
        "title": "Luyện tập theo chủ đề và từng mục tiêu cụ thể"
      },
      {
        "title": "Hoàn thiện kỹ năng thông qua thực hành liên tục"
      }
    ]
  },
  {
    "slug": "bar-skill",
    "title": "Bar Skill",
    "level": "Bartender muốn rèn luyện kỹ năng thao tác, kiểm soát dụng cụ và nâng cao sự linh hoạt khi làm việc sau quầy bar",
    "duration": "8 buổi",
    "price": "Liên hệ",
    "classSize": "Lớp thực hành",
    "nextIntake": "Liên hệ để nhận lịch gần nhất",
    "schedule": "Lịch học theo từng lớp",
    "location": "TP. Hồ Chí Minh",
    "summary": "Rèn luyện khả năng sử dụng dụng cụ, tốc độ, độ chính xác và sự mượt mà khi làm việc sau quầy bar.",
    "imageCaption": "Skill & Mix Academy · TP.HCM",
    "accent": "red",
    "image": {
      "url": "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1400&q=88",
      "alt": "Học viên luyện tập kỹ năng Bar Skill với dụng cụ bartender"
    },
    "syllabus": [
      {
        "title": "Kỹ thuật sử dụng và kiểm soát các dụng cụ bartender"
      },
      {
        "title": "Rèn luyện kỹ năng với Shaker, Jigger, Pour và Bar Spoon"
      },
      {
        "title": "Thực hành các kỹ thuật như Rolling, Shaking và Chill Glass"
      },
      {
        "title": "Phối hợp các kỹ năng trong quá trình pha chế"
      },
      {
        "title": "Rèn luyện tốc độ, độ chính xác và sự mượt mà trong thao tác"
      },
      {
        "title": "Ứng dụng kỹ năng vào quy trình làm việc tại quầy bar"
      }
    ]
  },
  {
    "slug": "mot-kem-mot",
    "title": "1 Kèm 1",
    "level": "Học viên muốn học theo lộ trình cá nhân, tập trung vào những kỹ năng và mục tiêu phù hợp với nhu cầu của mình",
    "duration": "Theo lộ trình cá nhân",
    "price": "Liên hệ",
    "classSize": "1 học viên",
    "nextIntake": "Liên hệ để nhận lịch gần nhất",
    "schedule": "Lịch học linh hoạt cùng giảng viên",
    "location": "TP. Hồ Chí Minh",
    "summary": "Lộ trình được xây dựng theo nền tảng, nhu cầu và mục tiêu riêng, với hướng dẫn trực tiếp từ giảng viên.",
    "imageCaption": "Skill & Mix Academy · TP.HCM",
    "accent": "black",
    "image": {
      "url": "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=88",
      "alt": "Học viên học và thực hành trực tiếp một kèm một cùng giảng viên"
    },
    "syllabus": [
      {
        "title": "Nội dung được xây dựng dựa trên nền tảng và mục tiêu của từng học viên"
      },
      {
        "title": "Rèn luyện kỹ thuật và kỹ năng theo nhu cầu cá nhân"
      },
      {
        "title": "Thực hành trực tiếp cùng giảng viên"
      },
      {
        "title": "Được hướng dẫn và điều chỉnh thao tác trong quá trình học"
      },
      {
        "title": "Tập trung cải thiện những kỹ năng học viên cần phát triển"
      },
      {
        "title": "Xây dựng lộ trình học phù hợp với định hướng cá nhân"
      }
    ]
  }
];

export const staff: StaffMember[] = [
  {
    "slug": "grace-truong",
    "name": "Grace Trương",
    "shortName": "Grace",
    "role": "Group Beverage Manager & Training Lead",
    "note": "Hơn 10 năm kinh nghiệm trong Beverage & Hospitality.",
    "bio": [
      "Hơn 10 năm kinh nghiệm trong lĩnh vực Beverage & Hospitality, từng đảm nhiệm các vị trí quản lý, xây dựng concept đồ uống và đào tạo đội ngũ tại nhiều mô hình F&B.",
      "Kinh nghiệm tại Tipsy Entertainment, Rémy Cointreau Vietnam và Tribe Hospitality Group."
    ],
    "quote": "Hơn 10 năm kinh nghiệm trong Beverage & Hospitality.",
    "specialties": [
      "Beverage Management",
      "Training",
      "Concept Development"
    ],
    "teachingFocus": "Quản lý đồ uống, xây dựng concept và đào tạo đội ngũ.",
    "favoritePour": "Chưa cập nhật",
    "achievements": [
      {
        "year": "2016",
        "title": "Champion",
        "organization": "Patron Tequila Competition"
      },
      {
        "year": "2018",
        "title": "Top 3",
        "organization": "Bacardi Vietnam Competition"
      },
      {
        "year": "2019",
        "title": "Top 10",
        "organization": "Bacardi Legacy South Asia"
      },
      {
        "year": "2017",
        "title": "Top 10",
        "organization": "OPIHR Gin Vietnam"
      },
      {
        "year": "2017",
        "title": "Top 10",
        "organization": "Fosters Gin Vietnam"
      }
    ],
    "image": {
      "url": "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?auto=format&fit=crop&w=1000&q=88",
      "alt": "Grace Trương, Group Beverage Manager & Training Lead"
    }
  },
  {
    "slug": "duong-minh-tri",
    "name": "Dương Minh Trí",
    "shortName": "Minh Trí",
    "role": "Flair Bartender / Instructor",
    "note": "Chuyên về Flair Bartending và biểu diễn kỹ thuật pha chế.",
    "bio": [
      "Có kinh nghiệm tham gia và đạt thành tích tại nhiều cuộc thi Flair trong nước và quốc tế.",
      "Chuyên đào tạo kỹ năng Flair, kiểm soát dụng cụ và phát triển khả năng biểu diễn sau quầy bar."
    ],
    "quote": "Kiểm soát dụng cụ là nền tảng của một màn trình diễn tự tin.",
    "specialties": [
      "Flair Bartending",
      "Tool Control",
      "Performance"
    ],
    "teachingFocus": "Flair, kiểm soát dụng cụ và phong cách biểu diễn cá nhân.",
    "favoritePour": "Chưa cập nhật",
    "achievements": [
      {
        "year": "2025",
        "title": "Top 6",
        "organization": "Barchef 8 Philippine Flair Open"
      },
      {
        "year": "2025",
        "title": "Top 6",
        "organization": "The Mondo Flair Master Thailand"
      },
      {
        "year": "2024",
        "title": "Top 7",
        "organization": "World Flair Championship"
      },
      {
        "year": "2023",
        "title": "Top 10",
        "organization": "World Flair Championship"
      },
      {
        "year": "2023",
        "title": "Champion",
        "organization": "Vietnam Flair Championship"
      },
      {
        "year": "2023",
        "title": "Champion",
        "organization": "Flair Forever"
      },
      {
        "year": "2023",
        "title": "Champion",
        "organization": "Vietnam Flair Show"
      },
      {
        "year": "2022",
        "title": "Champion",
        "organization": "Monkey Shoulder Flair Championship"
      },
      {
        "year": "2022",
        "title": "Top 2",
        "organization": "Vietnam Flair Championship"
      },
      {
        "year": "2019",
        "title": "Champion",
        "organization": "The Cocktail HCHC Open"
      },
      {
        "year": "2018",
        "title": "Champion",
        "organization": "Flair Competition Hutech"
      }
    ],
    "image": {
      "url": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=88",
      "alt": "Dương Minh Trí, Flair Bartender / Instructor"
    }
  },
  {
    "slug": "hoai-le",
    "name": "Hoài Lê",
    "shortName": "Hoài",
    "role": "Head Bartender · Chill Sky Bar",
    "note": "Mixology Specialist / Instructor.",
    "bio": [
      "Hiện đang làm việc tại Chill Sky Bar với vai trò Head Bartender.",
      "Mixology Specialist / Instructor, chuyên môn Mixology và Spirit Knowledge."
    ],
    "quote": "Hiểu nguyên liệu để sáng tạo đồ uống có chủ đích.",
    "specialties": [
      "Mixology",
      "Spirit Knowledge"
    ],
    "teachingFocus": "Mixology và Spirit Knowledge.",
    "favoritePour": "Chưa cập nhật",
    "achievements": [
      {
        "year": "Hiện tại",
        "title": "Head Bartender",
        "organization": "Chill Sky Bar"
      }
    ],
    "image": {
      "url": "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=1000&q=88",
      "alt": "Hoài Lê, Head Bartender · Chill Sky Bar"
    }
  }
];

export const gallery: GalleryItem[] = [
  {
    "image": {
      "url": "https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=1200&q=88",
      "alt": "After class"
    },
    "caption": "After class"
  },
  {
    "image": {
      "url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=88",
      "alt": "Acid test"
    },
    "caption": "Acid test"
  },
  {
    "image": {
      "url": "https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1200&q=88",
      "alt": "Service drill"
    },
    "caption": "Service drill"
  },
  {
    "image": {
      "url": "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=88",
      "alt": "Good ice"
    },
    "caption": "Good ice"
  },
  {
    "image": {
      "url": "https://images.unsplash.com/photo-1556855810-ac404aa91e85?auto=format&fit=crop&w=1200&q=88",
      "alt": "Final round"
    },
    "caption": "Final round"
  },
  {
    "image": {
      "url": "https://images.unsplash.com/photo-1436076863939-06870fe779c2?auto=format&fit=crop&w=1200&q=88",
      "alt": "Tuesday, 8:42"
    },
    "caption": "Tuesday, 8:42"
  },
  {
    "image": {
      "url": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=88",
      "alt": "Research"
    },
    "caption": "Research"
  },
  {
    "image": {
      "url": "https://images.unsplash.com/photo-1486947799489-3fabdd7d32a6?auto=format&fit=crop&w=1200&q=88",
      "alt": "First shake"
    },
    "caption": "First shake"
  },
  {
    "image": {
      "url": "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=1200&q=88",
      "alt": "Clean station"
    },
    "caption": "Clean station"
  }
];
