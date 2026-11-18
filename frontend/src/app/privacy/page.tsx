import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Privacy policy — Testado",
  description: "How Testado collects, uses, shares and protects personal information.",
};

/**
 * Operator details for sections 2 and 13. Fill these in once confirmed;
 * a line stays hidden while its value is empty so no placeholder text is published.
 */
const OPERATOR = {
  legalName: "Aarav Shah (Testado)",
  address: "",
  privacyEmail: "testwithtestado@gmail.com",
  phone: "+91 9325694956",
};

function OperatorDetails() {
  return (
    <ul className="list-none! pl-0!">
      {OPERATOR.legalName && (
        <li>
          <strong>Operated by:</strong> {OPERATOR.legalName}
        </li>
      )}
      {OPERATOR.address && (
        <li>
          <strong>Business address:</strong> {OPERATOR.address}
        </li>
      )}
      <li>
        <strong>Website:</strong> <a href="https://testado.in">https://testado.in</a>
      </li>
      {OPERATOR.privacyEmail && (
        <li>
          <strong>Email:</strong> <a href={`mailto:${OPERATOR.privacyEmail}`}>{OPERATOR.privacyEmail}</a>
        </li>
      )}
      <li>
        <strong>Phone:</strong> <a href={`tel:${OPERATOR.phone.replace(/\s/g, "")}`}>{OPERATOR.phone}</a>
      </li>
    </ul>
  );
}

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. Introduction",
    body: (
      <>
        <p>
          Testado (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo; or &ldquo;the Platform&rdquo;) respects your
          privacy and is committed to handling your personal information responsibly.
        </p>
        <p>
          Testado is a platform that connects businesses with relevant people to test products, services, concepts
          and ideas. We collect information from businesses and individuals who register to participate in testing
          opportunities.
        </p>
        <p>
          This Privacy Policy explains what information we collect, why we collect it, how it is used, when it may be
          shared and what choices you have regarding your information.
        </p>
      </>
    ),
  },
  {
    title: "2. Who we are",
    body: (
      <>
        <p>Testado is operated by:</p>
        <OperatorDetails />
        <p>For privacy-related questions, requests or complaints, you may contact us using the details above.</p>
      </>
    ),
  },
  {
    title: "3. Information we collect",
    body: (
      <>
        <p>Depending on how you use Testado, we may collect the following categories of information.</p>
        <h3>A. Information from testers</h3>
        <p>When you register to participate as a tester, we may collect:</p>
        <ul>
          <li>Full name</li>
          <li>Email address</li>
          <li>Mobile number</li>
          <li>City or general location</li>
          <li>Confirmation that you meet the 18+ eligibility requirement</li>
          <li>Product categories and areas of interest</li>
          <li>Testing preferences and availability</li>
          <li>Responses provided during registration</li>
        </ul>
        <h3>B. Information from businesses</h3>
        <p>When a business submits a product, service or idea for testing, we may collect:</p>
        <ul>
          <li>Name of the business representative</li>
          <li>Business or company name</li>
          <li>Email address and mobile number</li>
          <li>Product, service or concept details</li>
          <li>Intended target audience</li>
          <li>Business or product stage</li>
          <li>Specific research questions and feedback requirements</li>
          <li>Other information voluntarily submitted through our forms or communications</li>
        </ul>
        <h3>C. Testing and feedback information</h3>
        <p>When a participant takes part in a testing opportunity, we may collect:</p>
        <ul>
          <li>Responses to testing questions</li>
          <li>Product or service ratings</li>
          <li>Written feedback and suggestions</li>
          <li>Participation and project-related information</li>
          <li>Communications relating to the testing activity</li>
        </ul>
        <h3>D. Technical information</h3>
        <p>
          When you visit our website, certain technical information may be collected, depending on the services and
          website technologies we use. This may include:
        </p>
        <ul>
          <li>Browser and device information</li>
          <li>IP address</li>
          <li>Website usage and interaction information</li>
          <li>Cookies and similar technologies, where enabled</li>
        </ul>
        <h3>E. Reward and payment information</h3>
        <p>
          Where a participant is eligible for a reward, we may collect the minimum payment information required to
          process that reward, or use an authorised payment service provider for that purpose.
        </p>
        <p>
          <strong>Testado will never ask you to disclose your UPI PIN, banking password or payment OTP to receive a
          reward.</strong>
        </p>
      </>
    ),
  },
  {
    title: "4. How we use your information",
    body: (
      <>
        <p>We use the information collected for legitimate platform and business purposes, including:</p>
        <ul>
          <li>Creating and managing tester and business registrations.</li>
          <li>Assessing participant suitability for specific testing opportunities.</li>
          <li>Matching businesses with relevant participants.</li>
          <li>Coordinating product, service and idea testing.</li>
          <li>Collecting, organising and analysing participant responses.</li>
          <li>Preparing insights, research summaries and reports for businesses.</li>
          <li>Communicating project updates and registration information.</li>
          <li>Processing eligible participant rewards.</li>
          <li>Responding to support requests and resolving complaints.</li>
          <li>Maintaining website functionality, security and reliability.</li>
          <li>Preventing fraudulent, misleading or unauthorised activity.</li>
          <li>Meeting applicable legal and regulatory requirements.</li>
        </ul>
        <p>
          We will not intentionally use your personal information for purposes unrelated to the purpose communicated
          to you without obtaining any additional permission required by law.
        </p>
      </>
    ),
  },
  {
    title: "5. How information may be shared",
    body: (
      <>
        <p>Testado operates a two-sided platform, so some information must be shared to make testing activities possible.</p>
        <h3>A. With businesses</h3>
        <p>Businesses may receive feedback, ratings, research summaries and insights generated through their testing projects.</p>
        <p>Where reasonably possible, participant feedback will be presented in aggregated or de-identified form.</p>
        <p>
          A tester&rsquo;s name, direct contact information or other identifying details will not be shared with a
          business by default unless this is clearly explained to the participant and the necessary permission or
          other lawful basis has been established.
        </p>
        <h3>B. With selected test participants</h3>
        <p>
          Participants selected for a project may receive relevant information about the product, service, concept
          or testing activity.
        </p>
        <p>
          Business information will only be shared to the extent reasonably necessary to carry out the testing
          activity, subject to any confidentiality arrangements and project-specific disclosures.
        </p>
        <h3>C. With service providers</h3>
        <p>
          We may use external service providers for website hosting, databases, form management, email
          communication, analytics, payment processing and technical support.
        </p>
        <p>These providers may process information on our behalf where necessary to provide their services.</p>
        <h3>D. Legal requirements</h3>
        <p>
          We may disclose information when required to comply with applicable law, a valid legal request or an order
          from an authorised authority, or when reasonably necessary to protect the rights and security of Testado
          and its users.
        </p>
        <p>
          <strong>Testado does not intend to sell personal information as a commercial data product.</strong>
        </p>
      </>
    ),
  },
  {
    title: "6. Data storage and retention",
    body: (
      <>
        <p>
          We retain personal information only for as long as reasonably necessary for the purposes described in this
          policy, to maintain relevant business records and to meet applicable legal obligations.
        </p>
        <p>The retention period may depend on:</p>
        <ul>
          <li>Whether a tester or business account remains active.</li>
          <li>Whether a testing project is ongoing or completed.</li>
          <li>Whether the information is required for reporting, payment or dispute resolution.</li>
          <li>Whether a legal obligation requires further retention.</li>
        </ul>
        <p>
          Information that is no longer reasonably required will be deleted or anonymised, subject to applicable
          legal retention requirements.
        </p>
        <p>
          Records used to protect our forms from spam store only a one-way scrambled (hashed) version of the IP
          address and are deleted automatically within 24 hours.
        </p>
      </>
    ),
  },
  {
    title: "7. Data security",
    body: (
      <>
        <p>
          We take reasonable steps to protect personal information against unauthorised access, disclosure,
          alteration, loss or misuse.
        </p>
        <p>
          Depending on the technology and services used, these measures may include access controls, restricted
          permissions, secure hosting, backups and appropriate security practices.
        </p>
        <p>Access to personal information should be limited to individuals and service providers who need it to perform authorised work.</p>
        <p>
          No website or electronic system can be guaranteed to be completely secure. If a personal data breach
          occurs, we will take appropriate steps in accordance with applicable law.
        </p>
      </>
    ),
  },
  {
    title: "8. Cookies and website technologies",
    body: (
      <>
        <p>
          Testado uses essential cookies and similar technologies to keep you signed in, keep the website secure and
          remember whether you have accepted this Privacy Policy.
        </p>
        <p>
          We do not currently use analytics or advertising cookies. If we add them in the future, we will update
          this section.
        </p>
        <p>
          You may be able to manage cookies through your browser settings. Some website functions, such as signing
          in, will not work if essential cookies are disabled.
        </p>
      </>
    ),
  },
  {
    title: "9. Your choices and privacy rights",
    body: (
      <>
        <p>Subject to applicable law, you may request to:</p>
        <ul>
          <li>Know what personal information we hold about you.</li>
          <li>Correct inaccurate or incomplete information.</li>
          <li>Request deletion of information that we no longer need or are legally required to retain.</li>
          <li>Withdraw consent where processing is based on your consent.</li>
          <li>Raise questions or complaints about how your information is handled.</li>
        </ul>
        <p>To make a request, contact us using the privacy contact details in Section 2.</p>
        <p>We may need to verify your identity before acting on a request. We will respond in accordance with applicable legal requirements.</p>
      </>
    ),
  },
  {
    title: "10. Participant eligibility",
    body: (
      <>
        <p>The Testado tester programme is intended exclusively for individuals aged 18 or above.</p>
        <p>Individuals under the age of 18 are not eligible to register as Testado testers or participate in tester opportunities.</p>
        <p>
          If we become aware that personal information has been submitted by an ineligible individual, we will take
          appropriate steps to review and address the information in accordance with applicable law.
        </p>
      </>
    ),
  },
  {
    title: "11. Third-party websites and services",
    body: (
      <>
        <p>Our website may contain links to third-party websites, platforms or services.</p>
        <p>
          Testado is not responsible for the privacy practices, content or security arrangements of independent
          third-party websites. Users should review the relevant privacy policies before providing information to
          those services.
        </p>
      </>
    ),
  },
  {
    title: "12. Changes to this privacy policy",
    body: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our platform, business
          operations, technology or applicable laws.
        </p>
        <p>The revised version will be published on this page with an updated &ldquo;Last updated&rdquo; date.</p>
        <p>
          Where required, we will provide additional notice or seek further permission before making material
          changes to how personal information is used.
        </p>
      </>
    ),
  },
  {
    title: "13. Contact and grievances",
    body: (
      <>
        <p>For questions, requests, privacy concerns or complaints relating to this Privacy Policy, contact:</p>
        <p>
          <strong>Testado — Privacy Team</strong>
        </p>
        <OperatorDetails />
        <p>We aim to review and respond to privacy-related requests within the time required by applicable law.</p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <main className="px-4 pt-32 pb-24 sm:px-10 lg:pt-40">
        <article className="mx-auto max-w-3xl">
          <h1 className="font-serif text-[clamp(36px,4.5vw,52px)] leading-[1.1] font-medium tracking-[-0.02em] text-ink">
            Privacy policy
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Effective 16 November 2026 · Last updated 16 November 2026
          </p>

          <div className="mt-12 space-y-12 text-[15px] leading-relaxed text-[var(--text-body)] [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_li]:mt-1.5 [&_p+p]:mt-3 [&_p+ul]:mt-3 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul+p]:mt-3">
            {SECTIONS.map(({ title, body }) => (
              <section key={title}>
                <h2 className="mb-4 text-xl font-medium text-foreground">{title}</h2>
                {body}
              </section>
            ))}
          </div>

          <p className="mt-16 border-t border-border pt-6 text-sm text-muted-foreground">
            Testado · Real people. Real insights. Real problems.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
