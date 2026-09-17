export default function Hero({ onOpenModal }) {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-inner">
        <p className="eyebrow-quiet">A crowdfunding campaign for heart patients</p>
        <h1 className="hero-title">Give someone a second heartbeat.</h1>
        <p className="hero-quote">
          <strong>Your BDX gives a heart new life.</strong>
        </p>

        <div className="hero-cta">
          <button className="btn btn-primary btn-large" onClick={onOpenModal}>
            Start helping with BDX
          </button>
        </div>

        <svg className="pulse-line" viewBox="0 0 900 120" preserveAspectRatio="none" aria-hidden="true">
          <polyline
            className="pulse-path"
            fill="none"
            strokeWidth="3"
            points="0,60 130,60 160,60 180,20 205,105 225,10 245,90 265,60 300,60 900,60"
          />
        </svg>
      </div>
    </section>
  );
}
