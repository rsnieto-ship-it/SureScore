import { TeamMember } from "@/types";

export const team: TeamMember[] = [
  {
    id: "roy",
    name: "Roy Nieto",
    role: "CEO & Founder",
    bio: "Roy Nieto founded SureScore Inc. in 1995 and serves as its Chief Executive Officer. With over 30 years of experience in college admissions, advisement, and test preparation, he has conducted hundreds of seminars to students, families, and school districts across the United States and Mexico. Prior to launching SureScore, he was drafted by the Houston Astros as a pitcher and played for three years in the minor leagues. He has served as director for the College Admissions Training Program at the National Hispanic Institute, and currently works with school districts on predictive analytics to improve education systems and college readiness outcomes.",
    image: "/images/team/roy.jpg",
  },
  {
    id: "elizabeth",
    name: "Elizabeth",
    role: "Director of Finance",
    bio: "Elizabeth oversees SureScore's financial operations, ensuring the company maintains the fiscal health needed to support its growing network of district partnerships. Her expertise in financial planning and administration helps SureScore deliver cost-effective solutions to school districts across Texas.",
    image: "/images/team/elizabeth.jpg",
  },
];

export const companyInfo = {
  founded: 1995,
  mission: "To empower Texas school districts with the tools, training, and curriculum they need to boost CCMR ratings and get more students college ready.",
  vision: "To be the most trusted partner for Texas school districts in achieving college readiness excellence, known for our comprehensive solutions and measurable results.",
  values: [
    {
      title: "Results-Driven",
      description: "We measure our success by your district's success. Our solutions are designed to deliver measurable CCMR improvements.",
    },
    {
      title: "Partnership-Focused",
      description: "We work alongside district administrators and teachers as true partners, providing ongoing support and collaboration.",
    },
    {
      title: "Data-Informed",
      description: "We use analytics to track district progress, identify intervention opportunities, and optimize implementation strategies.",
    },
    {
      title: "Excellence",
      description: "We hold ourselves to the highest standards in everything we do, from curriculum development to district support.",
    },
  ],
};
