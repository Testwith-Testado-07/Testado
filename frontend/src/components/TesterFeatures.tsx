const features = [
  {
    number: "01",
    eyebrow: "Always free",
    title: "Join with nothing to pay.",
    description:
      "Create your profile and receive test invitations with no registration fees, subscriptions, or deposits.",
  },
  {
    number: "02",
    eyebrow: "Real rewards",
    title: "Your feedback is worth something.",
    description:
      "Share honest reactions to products and ideas, and earn direct payouts or rewards for each eligible test you complete.",
    featured: true,
  },
  {
    number: "03",
    eyebrow: "On your time",
    title: "Testing that fits your day.",
    description:
      "Explore apps, websites, and products when a suitable opportunity comes up, from your phone or laptop.",
  },
];

export default function TesterFeatures() {
  return (
    <div className="tester-features" aria-labelledby="tester-features-title">
      <div className="tester-features__intro">
        <span className="section-label">The Testado difference</span>
        <h2 id="tester-features-title">A better way to test, earn, and share.</h2>
        <p>Good feedback should be easy to give—and worthwhile to share.</p>
      </div>

      <div className="tester-features__grid">
        {features.map((feature) => (
          <article
            className={`tester-feature-card${feature.featured ? " tester-feature-card--featured" : ""}`}
            key={feature.number}
          >
            <span className="tester-feature-card__number">{feature.number}</span>
            <div>
              <span className="tester-feature-card__eyebrow">{feature.eyebrow}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
