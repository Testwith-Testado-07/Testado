import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Privacy policy — Testado",
  description: "How Testado collects, uses and protects personal information.",
};

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Who we are",
    body: (
      <p>
        Testado (testado.in) connects businesses that want to validate products, services and ideas with everyday
        people who test them and share honest feedback. This policy explains what personal information we collect,
        why, and what choices you have.
      </p>
    ),
  },
  {
    title: "What we collect",
    body: (
      <>
        <p>We only collect what you give us or what the service needs to work:</p>
        <ul>
          <li>
            <strong>Account details:</strong> your name, email address, password (stored securely by our
            authentication provider, never in plain text) and whether you are a product owner or a tester.
          </li>
          <li>
            <strong>Profile details you add:</strong> for testers, age range, gender, country, interests and the
            devices you use; for product owners, company name, industry and website.
          </li>
          <li>
            <strong>Activity on Testado:</strong> campaigns you create, and the product tests you apply to along
            with the status of those applications.
          </li>
          <li>
            <strong>Enquiry and application forms:</strong> the details you type into the business request and
            tester application forms, such as your name, email, phone number, city and answers.
          </li>
          <li>
            <strong>Technical data:</strong> a one-way scrambled (hashed) version of your IP address when you submit
            a public form, used only to block spam. We cannot turn it back into your IP address.
          </li>
        </ul>
        <p>We do not use advertising trackers or third-party analytics on this website.</p>
      </>
    ),
  },
  {
    title: "How we use it",
    body: (
      <ul>
        <li>To create and secure your account and keep you signed in.</li>
        <li>To match testers with product tests that fit their profile.</li>
        <li>To let product owners review applications to their own campaigns.</li>
        <li>To reply to enquiries and tester applications.</li>
        <li>To protect the website from spam and abuse.</li>
      </ul>
    ),
  },
  {
    title: "Who can see it",
    body: (
      <>
        <p>We never sell your personal information. It is shared only where needed to run Testado:</p>
        <ul>
          <li>
            <strong>Product owners</strong> see the name of each tester who applies to their campaign, and the
            status of that application. They cannot see other owners&rsquo; campaigns or applications.
          </li>
          <li>
            <strong>Service providers</strong> that host and run the website for us: Supabase (database and sign-in),
            Vercel (website hosting), and Resend and EmailJS (sending emails). They process data only on our behalf.
          </li>
          <li>When the law requires us to.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Cookies",
    body: (
      <p>
        We use only the cookies needed to keep you signed in. Without them your account cannot work. We do not use
        cookies for advertising or tracking.
      </p>
    ),
  },
  {
    title: "How long we keep it",
    body: (
      <p>
        We keep your account and profile while your account is active. Spam-protection records are deleted
        automatically within 24 hours. Form enquiries are kept as long as needed to respond and follow up. You can
        ask us to delete your data at any time.
      </p>
    ),
  },
  {
    title: "Your choices and rights",
    body: (
      <p>
        You can view and update most of your details from your profile. You can also ask us to access, correct or
        delete your personal information, or withdraw consent, in line with India&rsquo;s Digital Personal Data
        Protection Act, 2023. Contact us using the details below and we will respond as soon as possible.
      </p>
    ),
  },
  {
    title: "Age",
    body: <p>Testado is for people aged 18 and over. We do not knowingly collect information from anyone younger.</p>,
  },
  {
    title: "Security",
    body: (
      <p>
        Data is sent over encrypted connections (HTTPS), and access to it is restricted by account so that users can
        only see what they are allowed to. No system is perfectly secure, so please use a strong, unique password.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    body: <p>If we change this policy, we will update it on this page and change the date at the top.</p>,
  },
  {
    title: "Contact us",
    body: (
      <p>
        For any privacy question or request, reach us through the <Link href="/contact">contact page</Link>, call
        +91 9325694956, or message us on Instagram at{" "}
        <a href="https://www.instagram.com/testwithtestado/" target="_blank" rel="noopener noreferrer">
          @testwithtestado
        </a>
        .
      </p>
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
          <p className="mt-4 text-sm text-muted-foreground">Last updated 16 November 2026</p>

          <div className="mt-12 space-y-10 text-[15px] leading-relaxed text-[var(--text-body)] [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_li]:mt-2 [&_p+p]:mt-3 [&_p+ul]:mt-3 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul+p]:mt-3">
            {SECTIONS.map(({ title, body }) => (
              <section key={title}>
                <h2 className="mb-3 text-xl font-medium text-foreground">{title}</h2>
                {body}
              </section>
            ))}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
