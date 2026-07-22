import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy | SureScore",
  description:
    "How SureScore collects, uses, and protects information, including student data handled on behalf of partner school districts.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="py-16 bg-gradient-to-br from-[var(--primary-800)] to-[var(--primary-600)]">
          <Container>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-4">
                Privacy Policy
              </h1>
              <p className="text-white/80">Effective Date: July 22, 2026</p>
            </div>
          </Container>
        </section>

        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto space-y-10 text-gray-600 leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:font-[family-name:var(--font-montserrat)] [&_h2]:text-gray-900 [&_h2]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_p]:mb-4">
              <div>
                <h2>1. Introduction</h2>
                <p>
                  SureScore, Inc. (&quot;SureScore,&quot; &quot;we,&quot;
                  &quot;us,&quot; or &quot;our&quot;) provides college and
                  career readiness solutions to school districts, schools,
                  students, and families. This Privacy Policy describes how we
                  collect, use, and protect information through the SureScore
                  platform and services we provide to our partner school
                  districts, and through our website at surescore.com.
                </p>
              </div>

              <div>
                <h2>2. Information We Collect Through Our Services</h2>
                <p>
                  When a school district engages SureScore, we collect and
                  process information as authorized by the district under our
                  service agreement:
                </p>
                <ul>
                  <li>
                    <strong>Student education records provided by the
                    district:</strong> student academic records such as grades,
                    test scores, absences, behavior records, TSIA scores,
                    SAT/ACT scores, course schedules, graduation plans, and
                    other academic data reasonably needed to provide services,
                    generate reports, and deliver analytics.
                  </li>
                  <li>
                    <strong>Account information for authorized users:</strong>
                    {" "}name, school email address, and role for the students,
                    educators, and administrators the district authorizes to
                    access the platform.
                  </li>
                  <li>
                    <strong>Platform usage information:</strong> log-in
                    activity and feature usage, which we use to operate,
                    support, secure, and improve the services and to report
                    program participation to the district.
                  </li>
                </ul>
                <p>
                  We collect only the data reasonably needed to provide the
                  contracted services, and the scope of data collected is
                  agreed upon with each district.
                </p>
              </div>

              <div>
                <h2>3. Student Data and School District Partnerships</h2>
                <p>
                  For all student data we receive under a district agreement:
                </p>
                <ul>
                  <li>
                    Student data remains the property of, and under the control
                    of, the school district. We act as a &quot;school
                    official&quot; with a legitimate educational interest under
                    the Family Educational Rights and Privacy Act (FERPA), 20
                    U.S.C. § 1232g.
                  </li>
                  <li>
                    Our collection, use, and handling of student data is
                    governed by the applicable Data Privacy Agreement
                    (&quot;DPA&quot;) or service agreement executed with the
                    district. If any term of this Privacy Policy conflicts with
                    an executed DPA, the DPA controls with respect to that
                    district&apos;s student data.
                  </li>
                  <li>
                    We use student data solely to provide the contracted
                    services. We do not sell student data, use it for targeted
                    advertising, or build profiles of students for any purpose
                    other than the authorized educational purpose.
                  </li>
                  <li>
                    We comply with applicable student privacy laws, including
                    FERPA, the Children&apos;s Online Privacy Protection Act
                    (COPPA), and Texas Education Code Chapter 32, Subchapter D
                    (Texas Student Data Privacy).
                  </li>
                  <li>
                    Upon termination of a district agreement, or at the
                    district&apos;s request, we return or securely delete
                    student data in accordance with the applicable DPA.
                  </li>
                </ul>
              </div>

              <div>
                <h2>4. Children&apos;s Privacy</h2>
                <p>
                  Our services are made available to students, including
                  children under 13, only through their school or school
                  district. For children under 13, we collect personal
                  information only when a school or district has authorized us
                  to do so on the basis of school consent consistent with the
                  Children&apos;s Online Privacy Protection Act (COPPA). We do
                  not knowingly collect personal information directly from
                  children under 13 through our public website.
                </p>
                <p>
                  We do not use children&apos;s personal information for
                  targeted advertising or sell it to third parties. Parents and
                  guardians who wish to review or request deletion of their
                  child&apos;s information should contact their school
                  district, which owns and controls the records, or contact us
                  at info@surescore.com.
                </p>
              </div>

              <div>
                <h2>5. Information We Collect on Our Website and in Our Communications</h2>
                <p>
                  When you visit surescore.com or interact with our
                  communications, we may collect the following information:
                </p>
                <ul>
                  <li>
                    <strong>Information you provide:</strong> name, email
                    address, phone number, school district, and role when you
                    submit a contact form, request a demo, register for an
                    event, or subscribe to our newsletter.
                  </li>
                  <li>
                    <strong>Website usage information:</strong> standard
                    technical data such as IP address, browser type, pages
                    visited, and referring pages, collected through server
                    logs to help us understand how the site is used and
                    improve it.
                  </li>
                  <li>
                    <strong>Email and newsletter engagement:</strong> our
                    emails and newsletters include tracking that records when
                    a recipient opens a message and which links they click.
                    For newsletter content hosted on our site, we also measure
                    page views and reading engagement (such as time on page
                    and scroll depth), which may be associated with your email
                    address. We use this information to understand what
                    content is useful and to improve our communications.
                  </li>
                </ul>
                <p>
                  We use first-party tracking for the purposes described
                  above. We do not use third-party advertising trackers or ad
                  networks on our website, and we do not permit third parties
                  to collect information across our site for advertising
                  purposes. Because we do not track visitors across
                  third-party websites, our website does not respond to
                  &quot;Do Not Track&quot; browser signals.
                </p>
              </div>

              <div>
                <h2>6. How We Use Information</h2>
                <ul>
                  <li>
                    To provide the services contracted by partner school
                    districts, including generating reports and analytics;
                  </li>
                  <li>To respond to inquiries and demo requests;</li>
                  <li>
                    To send newsletters and communications you have requested
                    (each email includes an unsubscribe link);
                  </li>
                  <li>To provide and improve our services and website;</li>
                  <li>
                    To comply with legal obligations and enforce our
                    agreements.
                  </li>
                </ul>
              </div>

              <div>
                <h2>7. How We Share Information</h2>
                <p>
                  We do not sell personal information. We share information only
                  with:
                </p>
                <ul>
                  <li>
                    Service providers who help us operate our business — such
                    as website hosting, database hosting, and email delivery
                    providers — who are bound to use the information only on
                    our behalf and for the purposes we specify;
                  </li>
                  <li>
                    School districts, with respect to data belonging to that
                    district under a service agreement;
                  </li>
                  <li>
                    Authorities when required by law, or to protect our legal
                    rights.
                  </li>
                </ul>
              </div>

              <div>
                <h2>8. Data Storage and Location</h2>
                <p>
                  All personal information and student data we collect is
                  stored and processed in the United States. We do not
                  transmit, transport, or store student or client data outside
                  the United States except on prior written authorization by
                  the client, consistent with our service agreements. Our
                  services and website are intended for users located in the
                  United States.
                </p>
              </div>

              <div>
                <h2>9. De-Identified and Aggregate Data</h2>
                <p>
                  We may use de-identified or aggregated data — data from which
                  all personally identifiable information has been removed —
                  to evaluate and improve our programs, develop and demonstrate
                  the effectiveness of our services, and produce research and
                  reporting. We will not attempt to re-identify de-identified
                  data, and we will not transfer de-identified student data to
                  any party unless that party agrees not to attempt
                  re-identification.
                </p>
              </div>

              <div>
                <h2>10. Data Security</h2>
                <p>
                  We maintain administrative, technical, and physical safeguards
                  designed to protect the information we hold, including access
                  controls, encryption of data in transit, and restricting
                  access to personal information to personnel who need it to
                  perform their work. No method of transmission over the
                  Internet or method of electronic storage is completely
                  secure, and while we use commercially reasonable safeguards,
                  we cannot guarantee absolute security. In the event of a
                  breach involving student data, we will notify the affected
                  district in accordance with the applicable DPA and
                  applicable law.
                </p>
              </div>

              <div>
                <h2>11. Data Retention</h2>
                <p>
                  We retain personal information only as long as needed for the
                  purposes described in this policy or as required by our
                  agreements and applicable law. Student data is retained and
                  disposed of as directed by the owning school district and the
                  applicable DPA.
                </p>
              </div>

              <div>
                <h2>12. Business Transfers</h2>
                <p>
                  If SureScore is involved in a merger, acquisition,
                  reorganization, or sale of some or all of its assets,
                  information we hold may be transferred as part of that
                  transaction. Any successor will remain bound by the
                  commitments in this Privacy Policy with respect to
                  previously collected information. Student data held under a
                  district agreement will remain subject to the applicable
                  DPA, and affected districts will be notified as required by
                  those agreements and applicable law.
                </p>
              </div>

              <div>
                <h2>13. Your Choices</h2>
                <p>
                  You may unsubscribe from our newsletter at any time using the
                  link in any email. You may request access to, correction of,
                  or deletion of personal information you have provided to us
                  through the website by contacting us at info@surescore.com.
                  Requests concerning student education records should be
                  directed to the student&apos;s school district.
                </p>
              </div>

              <div>
                <h2>14. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will
                  post the updated policy on this page with a revised effective
                  date. Material changes affecting student data handled under a
                  district agreement will be communicated to the district as
                  required by the applicable DPA.
                </p>
              </div>

              <div>
                <h2>15. Contact Us</h2>
                <p>
                  SureScore, Inc.
                  <br />
                  4301 W Wm Cannon, Ste. B150, Austin, Texas 78749
                  <br />
                  Email: info@surescore.com
                  <br />
                  Phone: 888-545-TEST (8378)
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
