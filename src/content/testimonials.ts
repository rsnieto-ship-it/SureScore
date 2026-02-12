import { Testimonial } from "@/types";

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Mario Rosales",
    role: "United ISD",
    content:
      "SureScore is a trusted partner who rolls up their sleeves and works directly with our campuses and teachers. They make sure our students have every opportunity to pursue their college dreams, and that level of commitment makes all the difference.",
    rating: 5,
  },
  {
    id: "2",
    name: "Shanta Duren",
    role: "DeSoto ISD",
    content:
      "SureScore's Boot Camp helped students who had never passed the TSIA suddenly become college ready. The excitement on our students' faces when they found out they passed — that was everything. The SureScore trainers genuinely connected with our kids, and it showed in the results.",
    rating: 5,
  },
  {
    id: "3",
    name: "Dr. Monica Luna",
    role: "Valley View ISD",
    content:
      "SureScore's TSIA Prep has become a vital part of our Teacher Incentive Allotment initiative. We're seeing more teachers earn designations and our CCMR rating climbing right alongside it. It's a win-win for our teachers, our students, and our district.",
    rating: 5,
  },
];

export const caseStudies = [
  {
    district: "Valley View ISD",
    students: "15,000",
    challenge: "Low CCMR ratings and inconsistent test prep across campuses",
    solution: "District-wide implementation with teacher training and online solutions",
    results: [
      "18% improvement in CCMR rating",
      "25% increase in SAT/ACT benchmark achievement",
      "92% teacher satisfaction with training",
    ],
  },
  {
    district: "Lone Star ISD",
    students: "8,500",
    challenge: "Limited resources for college readiness programs",
    solution: "Customizable curriculum with bilingual support",
    results: [
      "32% increase in TSIA2 college-ready students",
      "Reduced remediation rates by 40%",
      "Cost savings of $200K annually",
    ],
  },
];
