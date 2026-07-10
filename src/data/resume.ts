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
  category: string;
  skills: string[];
}

export interface Social {
  name: string;
  url: string;
  iconSvg: string; // data:image/svg+xml;base64,... rendered via <img>
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
    socials: Social[];
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
    // Icons: Simple Icons paths, ink fill, base64 data-URIs (same shape as DB rows).
    socials: [
      {
        name: "GitHub",
        url: "https://github.com/wisnuwirayuda15",
        iconSvg:
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzJiMmEyNSI+PHBhdGggZD0iTTEyIC4yOTdjLTYuNjMgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAzIDMuNDM4IDkuOCA4LjIwNSAxMS4zODUuNi4xMTMuODItLjI1OC44Mi0uNTc3IDAtLjI4NS0uMDEtMS4wNC0uMDE1LTIuMDQtMy4zMzguNzI0LTQuMDQyLTEuNjEtNC4wNDItMS42MUM0LjQyMiAxOC4wNyAzLjYzMyAxNy43IDMuNjMzIDE3LjdjLTEuMDg3LS43NDQuMDg0LS43MjkuMDg0LS43MjkgMS4yMDUuMDg0IDEuODM4IDEuMjM2IDEuODM4IDEuMjM2IDEuMDcgMS44MzUgMi44MDkgMS4zMDUgMy40OTUuOTk4LjEwOC0uNzc2LjQxNy0xLjMwNS43Ni0xLjYwNS0yLjY2NS0uMy01LjQ2Ni0xLjMzMi01LjQ2Ni01LjkzIDAtMS4zMS40NjUtMi4zOCAxLjIzNS0zLjIyLS4xMzUtLjMwMy0uNTQtMS41MjMuMTA1LTMuMTc2IDAgMCAxLjAwNS0uMzIyIDMuMyAxLjIzLjk2LS4yNjcgMS45OC0uMzk5IDMtLjQwNSAxLjAyLjAwNiAyLjA0LjEzOCAzIC40MDUgMi4yOC0xLjU1MiAzLjI4NS0xLjIzIDMuMjg1LTEuMjMuNjQ1IDEuNjUzLjI0IDIuODczLjEyIDMuMTc2Ljc2NS44NCAxLjIzIDEuOTEgMS4yMyAzLjIyIDAgNC42MS0yLjgwNSA1LjYyNS01LjQ3NSA1LjkyLjQyLjM2LjgxIDEuMDk2LjgxIDIuMjIgMCAxLjYwNi0uMDE1IDIuODk2LS4wMTUgMy4yODYgMCAuMzE1LjIxLjY5LjgyNS41N0MyMC41NjUgMjIuMDkyIDI0IDE3LjU5MiAyNCAxMi4yOTdjMC02LjYyNy01LjM3My0xMi0xMi0xMiIvPjwvc3ZnPg==",
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/wisnuwirayuda/",
        iconSvg:
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzJiMmEyNSI+PHBhdGggZD0iTTIwLjQ0NyAyMC40NTJoLTMuNTU0di01LjU2OWMwLTEuMzI4LS4wMjctMy4wMzctMS44NTItMy4wMzctMS44NTMgMC0yLjEzNiAxLjQ0NS0yLjEzNiAyLjkzOXY1LjY2N0g5LjM1MVY5aDMuNDE0djEuNTYxaC4wNDZjLjQ3Ny0uOSAxLjYzNy0xLjg1IDMuMzctMS44NSAzLjYwMSAwIDQuMjY3IDIuMzcgNC4yNjcgNS40NTV2Ni4yODZ6TTUuMzM3IDcuNDMzYTIuMDYyIDIuMDYyIDAgMDEtMi4wNjMtMi4wNjUgMi4wNjQgMi4wNjQgMCAxMTIuMDYzIDIuMDY1em0xLjc4MiAxMy4wMTlIMy41NTVWOWgzLjU2NHYxMS40NTJ6TTIyLjIyNSAwSDEuNzcxQy43OTIgMCAwIC43NzQgMCAxLjcyOXYyMC41NDJDMCAyMy4yMjcuNzkyIDI0IDEuNzcxIDI0aDIwLjQ1MUMyMy4yIDI0IDI0IDIzLjIyNyAyNCAyMi4yNzFWMS43MjlDMjQgLjc3NCAyMy4yIDAgMjIuMjIyIDBoLjAwM3oiLz48L3N2Zz4=",
      },
    ],
  },
  footer: { tagline: "Built with React, Three.js & too much coffee." },
} satisfies Resume;
