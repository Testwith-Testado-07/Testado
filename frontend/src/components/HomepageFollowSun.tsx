const moments = [
  {
    number: "01",
    eyebrow: "A fresh perspective",
    title: "Start with the people you want to reach.",
    description:
      "Bring your idea to the audience whose needs, habits, and expectations matter to your next move.",
    scene: "homepage-sunrise-scene--dawn",
  },
  {
    number: "02",
    eyebrow: "As the day unfolds",
    title: "Listen to real reactions.",
    description:
      "Give people room to explore your product and share the honest feedback that surveys alone can miss.",
    scene: "homepage-sunrise-scene--day",
  },
  {
    number: "03",
    eyebrow: "A clearer horizon",
    title: "Move forward with more confidence.",
    description:
      "Turn recurring signals into practical insight on demand, friction, and what to improve next.",
    scene: "homepage-sunrise-scene--horizon",
  },
];

export default function HomepageFollowSun() {
  return (
    <section className="homepage-follow-sun" aria-labelledby="homepage-follow-sun-title">
      <div className="homepage-follow-sun__inner">
        <div className="homepage-follow-sun__intro">
          <span className="section-label">Perspectives in motion</span>
          <h2 id="homepage-follow-sun-title">
            Follow the sun.<br />
            <span>Find a clearer view.</span>
          </h2>
          <p>
            Wherever your audience is in its day, listening to real people can
            help bring your next market decision into focus.
          </p>
        </div>

        <div className="homepage-follow-sun__grid">
          {moments.map((moment) => (
            <article className="homepage-follow-sun__card" key={moment.number}>
              <div className={`homepage-sunrise-scene ${moment.scene}`} aria-hidden="true">
                <span className="homepage-sunrise-scene__glow" />
                <span className="homepage-sunrise-scene__sun" />
                <span className="homepage-sunrise-scene__planet">
                  <span className="homepage-sunrise-scene__latitude" />
                  <span className="homepage-sunrise-scene__longitude" />
                </span>
                <span className="homepage-sunrise-scene__horizon" />
              </div>

              <div className="homepage-follow-sun__copy">
                <span className="homepage-follow-sun__eyebrow">
                  <span>{moment.number}</span>
                  {moment.eyebrow}
                </span>
                <h3>{moment.title}</h3>
                <p>{moment.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
