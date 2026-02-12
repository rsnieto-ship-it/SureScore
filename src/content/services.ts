import { Service } from "@/types";

export const services: Service[] = [
  {
    id: "online-solutions",
    title: "Online Solutions",
    description:
      "Comprehensive digital platform providing diagnostic assessments, personalized learning paths, and real-time progress tracking for district-wide implementation.",
    href: "/services/online-solutions",
    features: [
      "District-wide diagnostic testing",
      "Real-time student progress dashboards",
      "TEKS-aligned digital curriculum",
      "Administrator analytics portal",
    ],
  },
  {
    id: "teacher-training",
    title: "Teacher Training",
    description:
      "Professional development programs that equip your educators with proven test prep strategies and instructional techniques to maximize student outcomes.",
    href: "/services/teacher-training",
    features: [
      "On-site professional development",
      "Train-the-trainer certification",
      "Ongoing coaching and support",
      "Best practices workshops",
    ],
  },
  {
    id: "customizable-curriculum",
    title: "Customizable Curriculum",
    description:
      "Flexible, TEKS-aligned curriculum solutions that adapt to your district's specific needs, timelines, and student population demographics.",
    href: "/services/customizable-curriculum",
    features: [
      "TEKS and CCMR aligned content",
      "Modular implementation options",
      "Bilingual resources available",
      "Differentiated instruction materials",
    ],
  },
  {
    id: "district-partnership",
    title: "District Partnership",
    description:
      "End-to-end partnership model combining online solutions, teacher training, and curriculum to maximize your district's CCMR outcomes.",
    href: "/services/district-partnership",
    features: [
      "Dedicated district success manager",
      "Custom implementation planning",
      "Quarterly performance reviews",
      "ROI and CCMR impact reporting",
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
    id: "strategy-of-the-day",
    title: "Strategy of the Day",
    description:
      "A teacher-led, gamified daily test prep experience delivering focused TSIA2 skill-building to entire grade levels in under ten minutes. Designed to keep teachers at the center of instruction while driving measurable college readiness gains.",
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
