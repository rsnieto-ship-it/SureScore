import { Service } from "@/types";

export const services: Service[] = [
  {
    id: "ai-tutor",
    title: "AI Tutors",
    description:
      "The personal tutor every student deserves. AI-powered, Socratic mastery-based learning for TSIA2, SAT, and ACT — with more subjects coming soon. Personalized to each student's gaps, available 24/7.",
    href: "/services/ai-tutor",
    features: [
      "Personalized learning paths",
      "Socratic mastery method",
      "TSIA2, SAT & ACT aligned",
      "Available 24/7",
      "Adaptive difficulty",
      "Zero teacher burden",
    ],
  },
  {
    id: "tia-platform",
    title: "TIA Data Platform",
    description:
      "Streamline Teacher Incentive Allotment workflows — automated roster matching, multi-vendor assessment integration, TEA-aligned growth calculations, and submission-ready 30-column output files.",
    href: "/services/tia-platform",
    features: [
      "12 vendor integrations",
      "Automatic roster-to-assessment linking",
      "Built-in growth models",
      "Error/gap flagging",
      "30-column TEA output",
      "Roster Verification Portal",
    ],
  },
  {
    id: "district-partnership",
    title: "District Partnership",
    description:
      "End-to-end partnership combining online solutions, teacher training, and customizable curriculum to maximize your district's CCMR outcomes.",
    href: "/services/district-partnership",
    features: [
      "Dedicated district success manager",
      "On-site teacher training & certification",
      "TEKS-aligned customizable curriculum",
      "Quarterly performance reviews",
      "ROI and CCMR impact reporting",
      "Bilingual resources available",
    ],
  },
  {
    id: "strategy-of-the-day",
    title: "Strategy of the Day",
    description:
      "Teacher-led, gamified daily TSIA2 skill-building for entire grade levels in under ten minutes. Low-friction, high-impact.",
    href: "/services/strategy-of-the-day",
    features: [
      "Teacher-led gamified instruction",
      "Grade-wide participation",
      "Under 10 min/day",
      "TSIA2 skill focus",
      "Data-driven tracking",
      "Low-friction implementation",
    ],
  },
];

export const stats = [
  { value: "30+", label: "Years in Texas Education" },
  { value: "179", label: "Avg. SAT Point Increase" },
  { value: "3.1", label: "Avg. ACT Point Increase" },
  { value: "70+", label: "Partner Districts" },
];

export const ccmrMetrics = [
  {
    title: "SAT/ACT Performance",
    description: "Boost student scores to meet CCMR benchmarks",
    benchmark: "SAT 480+ EBRW, 530+ Math | ACT 19+",
  },
  {
    title: "TSIA2 College Ready",
    description: "Prepare students to demonstrate college readiness",
    benchmark: "ELAR 945+ | Math 950+",
  },
  {
    title: "AP/IB Success",
    description: "Support advanced course completion",
    benchmark: "Score of 3+ on AP exams",
  },
  {
    title: "Industry Certifications",
    description: "Complement academic preparation",
    benchmark: "State-approved certifications",
  },
];
