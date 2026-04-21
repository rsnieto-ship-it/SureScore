"use client";

import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent } from "@/components/ui";
import { CTA } from "@/components/sections";

const successStories = [
  {
    name: "Alex Rodriguez",
    school: "University of Texas at Austin",
    scoreImprovement: "+240 SAT",
    quote:
      "SureScore transformed my approach to test-taking. I went from feeling overwhelmed to confident and prepared. The strategies I learned helped me not just on the SAT, but in my college classes too.",
    year: "Class of 2024",
  },
  {
    name: "Emily Chen",
    school: "Rice University",
    scoreImprovement: "+7 ACT",
    quote:
      "The personalized attention at SureScore made all the difference. My tutor identified my weak areas and we worked on them systematically. I'm now pursuing my dream of studying biomedical engineering.",
    year: "Class of 2024",
  },
  {
    name: "Marcus Johnson",
    school: "Texas A&M University",
    scoreImprovement: "+180 SAT",
    quote:
      "I was skeptical about test prep at first, but SureScore's data-driven approach showed me exactly where I needed to improve. The practice tests were incredibly helpful.",
    year: "Class of 2023",
  },
  {
    name: "Sofia Martinez",
    school: "Stanford University",
    scoreImprovement: "+8 ACT",
    quote:
      "The Advanced Prep program pushed me to achieve scores I didn't think were possible. The instructors knew exactly how to challenge me while keeping me motivated.",
    year: "Class of 2023",
  },
  {
    name: "David Kim",
    school: "MIT",
    scoreImprovement: "1580 SAT",
    quote:
      "SureScore's math strategies were game-changing. I went from good to exceptional, which made a real difference in my applications to competitive engineering programs.",
    year: "Class of 2022",
  },
  {
    name: "Jordan Williams",
    school: "University of Houston",
    scoreImprovement: "Passed TSIA2",
    quote:
      "Thanks to SureScore's TSIA2 prep, I was able to skip remedial courses and go straight into college-level classes. That saved me time and money.",
    year: "Class of 2024",
  },
];

const collegeLogos = [
  "University of Texas",
  "Rice University",
  "Texas A&M",
  "Stanford",
  "MIT",
  "Harvard",
  "Yale",
  "Princeton",
  "Duke",
  "Northwestern",
  "USC",
  "UCLA",
];

export default function AlumniPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-[var(--primary-800)] to-[var(--primary-600)]">
          <Container>
            <div
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                Success Stories
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                Our{" "}
                <span className="text-[var(--secondary-300)]">Alumni</span>
              </h1>
              <p className="text-xl text-white/80">
                Meet the students who achieved their goals with SureScore and went
                on to attend top universities across the nation.
              </p>
            </div>
          </Container>
        </section>

        {/* Stats Banner */}
        <section className="py-12 bg-[var(--primary-900)]">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "50,000+", label: "Students Helped" },
                { value: "200+", label: "Average SAT Increase" },
                { value: "95%", label: "Goal Achievement Rate" },
                { value: "100+", label: "Universities Attended" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                >
                  <div className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-space-grotesk)] text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[var(--secondary-300)] text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Success Stories */}
        <section className="py-24 bg-white">
          <Container>
            <div
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Student Success Stories
              </h2>
              <p className="text-lg text-gray-600">
                Real stories from real students who achieved their dreams with SureScore.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <div
                  key={story.name}
                >
                  <Card className="h-full" hover="lift">
                    <CardContent className="p-6">
                      {/* Quote */}
                      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                        &quot;{story.quote}&quot;
                      </p>

                      {/* Score Badge */}
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--secondary-100)] text-[var(--secondary-700)] rounded-full text-sm font-medium mb-4">
                        {story.scoreImprovement}
                      </div>

                      {/* Student Info */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary-400)] to-[var(--secondary-400)] rounded-full flex items-center justify-center text-white font-bold">
                          {story.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {story.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {story.school}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Universities */}
        <section className="py-24 bg-gray-50">
          <Container>
            <div
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-6">
                Where Our Students Go
              </h2>
              <p className="text-lg text-gray-600">
                SureScore alumni attend top universities across the country.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {collegeLogos.map((college, index) => (
                <div
                  key={college}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <span className="text-sm text-gray-600 font-medium">
                    {college}
                  </span>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
