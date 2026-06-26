// Single source of truth for all portfolio content.
// Plain typed consts — no component hardcodes copy; edit here only.

export interface Job {
  role: string;
  company: string;
  location?: string;
  start: string;
  end: string;
  highlights: string[]; // max 3, pre-trimmed
  featured?: boolean;
}

export interface SkillGroup {
  category: "Frontend" | "Backend" | "Mobile" | "Tools";
  skills: string[];
}

export interface Project {
  index: string; // "01"
  title: string;
  blurb: string;
  role: string;
  year: string;
  stack: string[];
  featured?: boolean;
  image?: string; // /public path; owner to supply
  href?: string; // live / case-study link
}

export interface Stat {
  value: number;
  suffix?: string; // "+", "k", etc.
  label: string;
}

export interface ProcessStep {
  index: string;
  title: string;
  body: string;
}

export interface Resume {
  identity: {
    name: string;
    title: string;
    location: string;
    email: string;
    wordmark: string;
    resumeFileId: string;
  };
  hero: { headline: string; subline: string };
  about: {
    bio: string;
    education: { school: string; degree: string; period: string; gpa: string };
    certification: { name: string; issuer: string; valid: string };
  };
  stats: Stat[];
  projects: Project[];
  experience: Job[];
  skills: SkillGroup[];
  process: ProcessStep[];
  contact: {
    headline: string;
    invite: string;
    socials: { github: string; linkedin: string };
  };
  footer: { tagline: string };
}

export const resume = {
  identity: {
    name: "Putu Wisnu Wirayuda Putra",
    title: "Front-End Software Engineer",
    location: "DKI Jakarta, Indonesia",
    email: "wisnuwirayuda15@gmail.com",
    wordmark: "Wisnu",
    resumeFileId: "19dgdpZ56FVvNO2gTAFcp9ByzPxg59S4I", // Google Drive file id
  },
  hero: {
    headline: "Front-End Engineer.",
    subline:
      "I build secure, scalable web interfaces — including a large-scale LMS serving 150,000+ active users.",
  },
  about: {
    bio: "I'm a front-end engineer based in Jakarta with two years of experience across roughly five production projects. I care about clean architecture, performance, and interfaces that feel effortless to use. Currently building at Coding Studio.",
    education: {
      school: "Telkom University",
      degree: "B.Sc. Information Systems",
      period: "2020 – 2024",
      gpa: "3.89 / 4.0",
    },
    certification: {
      name: "Web Development Certification",
      issuer: "National Professional Certification Board (BNSP)",
      valid: "Dec 2023 – Dec 2026",
    },
  },
  stats: [
    { value: 150000, suffix: "+", label: "Active users served" },
    { value: 2, suffix: " yrs", label: "Professional experience" },
    { value: 5, suffix: "+", label: "Production projects" },
    { value: 60, suffix: "+", label: "Students mentored" },
  ],
  projects: [
    {
      index: "01",
      title: "Large-Scale LMS Platform",
      blurb:
        "Front-end for a learning-management product serving 150,000+ active users — responsive, scalable interfaces with optimized rendering and asset loading for fast page loads.",
      role: "Front-End Engineer",
      year: "2025",
      stack: ["React.js", "Next.js", "Tailwind CSS", "TypeScript"],
      featured: true,
      // image: "/projects/lms.jpg", // [owner: add screenshot]
      // href: "", // [owner: add live/case-study link]
    },
    {
      index: "02",
      title: "Production Web App Suite",
      blurb:
        "Built and maintained user-centric interfaces across multiple production releases — features, security updates, and cross-browser consistency in an agile team.",
      role: "Front-End Engineer",
      year: "2025",
      stack: ["React.js", "styled-components", "SQL"],
      // image: "/projects/suite.jpg", // [owner]
    },
    {
      index: "03",
      title: "Practicum Learning Materials",
      blurb:
        "Designed and delivered hands-on web-development curricula (HTML, CSS, JS, PHP, Laravel) and reviewed 60+ students' projects as a lab assistant.",
      role: "Practicum Assistant",
      year: "2024",
      stack: ["Laravel", "PHP", "JavaScript"],
      // image: "/projects/practicum.jpg", // [owner]
    },
    {
      index: "04",
      title: "Your Next Project",
      blurb:
        "[Owner: replace this slot with a real project — title, blurb, stack, image in /public, and a live or case-study link.]",
      role: "—",
      year: "2026",
      stack: ["Add", "Your", "Stack"],
    },
  ],
  experience: [
    {
      role: "Software Engineer (Front-End)",
      company: "Coding Studio",
      location: "Bekasi",
      start: "Dec 2024",
      end: "Present",
      featured: true,
      highlights: [
        "Built responsive, scalable interfaces for production apps, including an LMS serving 150,000+ users.",
        "Cut page-load times by optimizing component rendering and asset loading.",
        "Shipped features, security updates, and fixes in an agile cross-functional team.",
      ],
    },
    {
      role: "Capstone Project Practicum Assistant",
      company: "EAD Lab, Telkom University",
      start: "Mar 2024",
      end: "May 2024",
      highlights: [
        "Mentored 60+ students on Git/GitHub and version-control practice.",
        "Authored learning materials and reviewed project submissions.",
      ],
    },
    {
      role: "Web Application Development Practicum Assistant",
      company: "EAD Lab, Telkom University",
      start: "Sep 2023",
      end: "Feb 2024",
      highlights: [
        "Taught HTML, CSS, JavaScript, PHP, and Laravel to 60+ students.",
        "Built course materials and evaluated project work.",
      ],
    },
    {
      role: "Algorithm & Programming Practicum Assistant",
      company: "Daspro Lab, Telkom University",
      start: "Sep 2023",
      end: "Feb 2024",
      highlights: [
        "Taught Python to 60+ students.",
        "Authored instructional materials and graded coursework.",
      ],
    },
    {
      role: "Forensic Science Technician",
      company: "Pusat Laboratorium Forensik Bareskrim Polri",
      start: "Jun 2023",
      end: "Aug 2023",
      highlights: [
        "Assisted digital-evidence analysis using forensic tooling.",
      ],
    },
    {
      role: "Social Media Designer",
      company: "ESD Lab, Telkom University",
      start: "Sep 2021",
      end: "Aug 2024",
      highlights: [
        "Produced Instagram content in Figma and other design tools.",
      ],
    },
  ],
  skills: [
    {
      category: "Frontend",
      skills: [
        "HTML",
        "CSS",
        "JavaScript",
        "React.js",
        "Next.js",
        "Svelte",
        "Vue",
        "Tailwind CSS",
        "Bootstrap",
        "styled-components",
      ],
    },
    { category: "Backend", skills: ["Golang", "PHP", "Laravel", "SQL"] },
    { category: "Mobile", skills: ["React Native", "Flutter"] },
    { category: "Tools", skills: ["Linux", "Windows"] },
  ],
  process: [
    {
      index: "01",
      title: "Discover",
      body: "Understand the product, users, and constraints before a line of code — align on what success looks like.",
    },
    {
      index: "02",
      title: "Build",
      body: "Translate requirements into clean, scalable interfaces with a component architecture that scales.",
    },
    {
      index: "03",
      title: "Optimize",
      body: "Profile rendering and asset loading, tighten performance, and ensure cross-browser, accessible consistency.",
    },
    {
      index: "04",
      title: "Ship",
      body: "Test, debug, and release — then maintain with features, security updates, and fixes for the long run.",
    },
  ],
  contact: {
    headline: "Let's build something.",
    invite: "Open to front-end roles and freelance work. Drop a line.",
    socials: {
      github: "https://github.com/wisnuwirayuda15",
      linkedin: "https://www.linkedin.com/in/wisnuwirayuda/",
    },
  },
  footer: { tagline: "Built with React, Three.js & too much coffee." },
} satisfies Resume;
