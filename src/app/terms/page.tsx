import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Service | SureScore",
  description:
    "The Terms of Use governing access to the SureScore platform, software, and services.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <section className="py-16 bg-gradient-to-br from-[var(--primary-800)] to-[var(--primary-600)]">
          <Container>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-4">
                Terms of Use
              </h1>
            </div>
          </Container>
        </section>

        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto space-y-10 text-gray-600 leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:font-[family-name:var(--font-montserrat)] [&_h2]:text-gray-900 [&_h2]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-[lower-alpha] [&_ol]:pl-6 [&_ol]:space-y-2 [&_p]:mb-4">
              <div>
                <p>
                  SureScore, Inc., a Texas corporation, owns the SureScore
                  platform and all associated sub-domains of www.SureScore.com.
                  This is a legally binding agreement. If you are entering into
                  this Agreement on behalf of a school, school district,
                  college, university, state agency, or another legal entity,
                  you represent that you have the authority to bind the
                  represented entity to this Agreement. If you do not have such
                  authority, you must not accept this Agreement and may not use
                  the Site, Software or Services.
                </p>
              </div>

              <div>
                <h2>1. Grant of License</h2>
                <p>
                  SureScore, Inc. hereby grants to Client a limited,
                  non-exclusive, non-sublicensable, and non-transferable
                  license to access and use the SureScore, Inc. software
                  platform for the Client&apos;s own business purposes. Client
                  may provide individual accounts to Authorized Users, as
                  agreed upon by SureScore, Inc. and Client, to access the
                  SureScore, Inc. platform. Subject to this Agreement and the
                  Privacy Policy outlined in Section 4, Client grants
                  SureScore, Inc. authorization to obtain, load, store,
                  transmit, analyze, and display Client User Data, including
                  but not limited to student academic records such as grades,
                  test scores, absences, behavior issues, TSIA scores, SAT/ACT
                  scores, course schedules, graduation plans, and other
                  academic data as reasonably requested by SureScore, Inc.,
                  for the purpose of providing services, generating reports,
                  and delivering analytics.
                </p>
              </div>

              <div>
                <h2>2. License Terms and Fees</h2>
                <p>
                  The License Term is effective when executed by both parties
                  and will last for a term of 12 months. Thereafter, this
                  License shall automatically be renewed for successive 12
                  months unless Client gives SureScore, Inc., written notice at
                  least 60 days before the day on which the license or renewal
                  would expire of its intention not to renew this license.
                  Client agrees to pay SureScore, Inc., or one of SureScore,
                  Inc. authorized resellers, the full scope of fees in
                  accordance with the terms outlined in the signed agreement.
                  All License Fees are nonrefundable, and due upon invoice
                  irrespective of date Client fulfills data submission
                  requirements necessary to launch Client site.
                </p>
              </div>

              <div>
                <h2>3. Data Security</h2>
                <p>
                  SureScore, Inc. agrees that use, storage, and access to
                  Client Data shall be performed with that degree of skill,
                  care, and judgment customarily accepted as sound, quality,
                  and professional practices. SureScore, Inc. agrees to
                  implement and maintain safeguards necessary that ensure the
                  confidentiality, availability, and integrity of Client Data.
                  If any of these safeguards represent a change to a System,
                  these changes shall be implemented by SureScore, Inc. in
                  accordance with SureScore, Inc.&apos;s approved field
                  modification process.
                </p>
              </div>

              <div>
                <h2>4. Use of, Storage of, or Access to Student and Client Data</h2>
                <p>SureScore, Inc. shall only use, store, or access Client Data:</p>
                <ol>
                  <li>
                    In accordance with, and only to the extent permissible
                    under this Agreement and the Contract; and
                  </li>
                  <li>
                    In full compliance with any and all applicable laws,
                    regulations, rules, or standards including to the extent
                    applicable, but without limitation: Family Educational
                    Rights and Privacy Act (FERPA), Export Administration
                    Regulations (EAR), International Traffic in Arms
                    Regulations (ITAR), Health Insurance Portability and
                    Accountability Act (HIPAA), the Gramm-Leach-Bliley
                    Financial Services Modernization Act (GLB), Federal Trade
                    Commission Red Flags Rule, and the Social Security Act.
                  </li>
                  <li>
                    For Client Data subject to FERPA, SureScore, Inc. will be
                    considered a &quot;school official&quot; with a
                    &quot;legitimate educational interest&quot; as those terms
                    are used in FERPA and its implementing regulations.
                  </li>
                  <li>
                    Any transmission, transportation, or storage of Client
                    Data outside the United States is prohibited except on
                    prior written authorization by the Client.
                  </li>
                </ol>
              </div>

              <div>
                <h2>5. Third-Party Rights</h2>
                <p>
                  During the License Terms of this Agreement, Client may
                  integrate third-party Users into SureScore, Inc. platform to
                  provide Client Users with enhanced data insight. Client may
                  also integrate third-party Users to promote opportunities,
                  goods, or services to Client Users. Any such activity, and
                  any terms, conditions, warranties or representations
                  associated with such activity, is solely between Client and
                  the applicable third-party. SureScore, Inc. shall have no
                  liability, obligation or responsibility for any such
                  correspondence, purchase or promotion between Client and any
                  such third-party. SureScore, Inc. and its affiliates do not
                  control the third-party sites, and SureScore, Inc. and its
                  affiliates shall not be held responsible for any content,
                  products, data storage practices, or any other material from
                  the third-party Users and their affiliates.
                </p>
              </div>

              <div>
                <h2>6. Termination</h2>
                <p>
                  SureScore, Inc. shall have the right to immediately terminate
                  this License if Client fails to perform any obligation
                  required of Client under this License or if Client becomes
                  bankrupt or insolvent.
                </p>
              </div>

              <div>
                <h2>7. Return or Destruction of Software Upon Termination</h2>
                <p>
                  Upon termination of this License, Client shall return to
                  SureScore, Inc. or destroy the original and all copies of the
                  Software including partial copies and modifications.
                  SureScore, Inc. shall have a reasonable opportunity to
                  conduct an inspection of Client&apos;s place of business to
                  assure compliance with this provision.
                </p>
              </div>

              <div>
                <h2>8. Title to Software</h2>
                <p>
                  SureScore, Inc. retains copyright and ownership of the
                  Software and all related works including, but not limited to,
                  discoveries, inventions, patents, enhancements, modifications
                  and updates of the Software.
                </p>
              </div>

              <div>
                <h2>9. Modifications and Enhancements</h2>
                <p>
                  Client will make no efforts to reverse engineer the Software,
                  or make any modifications or enhancements without SureScore,
                  Inc.&apos;s express written consent.
                </p>
              </div>

              <div>
                <h2>10. Warranty Limitations</h2>
                <p>
                  The software is provided &quot;as is&quot;. SureScore, Inc.,
                  disclaims all warranties, including but not limited to, all
                  express or implied warranties of Merchantability and Fitness
                  for a particular purpose.
                </p>
              </div>

              <div>
                <h2>11. Remedy Limitations</h2>
                <p>
                  SureScore, Inc.&apos;s entire liability and SureScore,
                  Inc.&apos;s sole and exclusive remedy for breach of the
                  foregoing warranty shall be SureScore&apos;s option to
                  either: return to Client the license fee for the period in
                  which the Software did not perform according to this
                  warranty, or repair the defects of the Software.
                </p>
              </div>

              <div>
                <h2>12. Damage Limitations</h2>
                <p>
                  Neither party shall be liable to the other for indirect,
                  special, consequential or incidental damages, including loss
                  of profits, and SureScore, Inc.&apos;s liability to Client
                  for any other damages relating to or arising out of this
                  agreement whether in contract, tort, or otherwise will be
                  limited to the amount received by SureScore, Inc. from Client
                  as compensation for the software during the six (6) month
                  period immediately prior to the time such claim arose.
                </p>
              </div>

              <div>
                <h2>13. Confidentiality</h2>
                <p>
                  Client will treat the Software as a trade secret and
                  proprietary know-how belonging to SureScore, Inc. that is
                  being made available to Client in confidence. Client agrees
                  to treat the Software with at least the same care as it
                  treats its own confidential or proprietary information.
                </p>
              </div>

              <div>
                <h2>14. Mediation and Venue</h2>
                <p>
                  In the event a dispute arises between the parties to this
                  agreement, upon thirty (30) day notice, the parties agree to
                  participate in a &frac12; day mediation in Travis County,
                  Texas. The parties agree to share equally in the costs
                  associated with the mediation. Said mediation shall be
                  administered by an agreed upon Mediator located in Travis
                  County, Texas. In the event the dispute is not resolved at
                  Mediation, either party may only file suit regarding the
                  dispute in Travis County, Texas.
                </p>
              </div>

              <div>
                <h2>15. Attorney Fees</h2>
                <p>
                  If any legal action is necessary to enforce this License, the
                  prevailing party shall be entitled to reasonable attorney
                  fees, costs and expenses in addition to any other relief to
                  which it may be entitled.
                </p>
              </div>

              <div>
                <h2>16. General Provisions</h2>
                <p>
                  (a) Complete Agreement: This License Agreement together with
                  all schedules referred to in this Agreement, all of which are
                  incorporated herein by reference, constitutes the sole and
                  entire Agreement between the parties. This Agreement
                  supersedes all prior understandings, agreements,
                  representations and documentation relating to the subject
                  matter of this Agreement.
                </p>
                <p>
                  (b) Modifications: Modifications and amendments to this
                  Agreement, including any exhibit, schedule or attachment
                  hereto, shall be enforceable only if in writing and signed by
                  authorized representatives of both parties.
                </p>
                <p>
                  (c) Applicable law: This License will be governed by the laws
                  of the State of Texas.
                </p>
                <p>
                  (d) Notices: All notices and other communications given in
                  connection with this License shall be in writing and shall be
                  deemed given as follows:
                </p>
                <ul>
                  <li>
                    When delivered personally to the recipient&apos;s address
                    as appearing in the introductory paragraph to this License;
                    or
                  </li>
                  <li>
                    Three days after being deposited in the United States mail,
                    postage prepaid to the recipient&apos;s address as
                    appearing in the introductory paragraph to this License; or
                  </li>
                  <li>
                    When sent by fax or telex to the last fax or telex number
                    of the recipient known to the party giving notice. Notice
                    is effective upon receipt provided that a duplicate copy of
                    the notice is promptly given by first-class or certified
                    mail or the recipient delivers a written confirmation of
                    receipt. Any party may change its address appearing in the
                    introductory paragraph to this License by given notice of
                    the change in accordance with this paragraph.
                  </li>
                </ul>
                <p>
                  (e) No Agency: Nothing contained herein will be construed as
                  creating any agency, partnership, joint venture or other form
                  of joint enterprise between the parties.
                </p>
              </div>

              <div>
                <h2>17. Assignment</h2>
                <p>
                  The rights conferred by this License shall not be assignable
                  by the Client without SureScore, Inc.&apos;s prior written
                  consent. SureScore, Inc. may impose a reasonable license fee
                  on any such assignment.
                </p>
              </div>

              <div>
                <h2>Contact Us</h2>
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
