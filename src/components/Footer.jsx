export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="wrap footer-inner">
        <div className="footer-message">
          <h2>If you'd like to join me in this campaign, thank you for your support.</h2>
          <p className="footer-signature">— Balamurugan Nagarajan, campaign creator</p>
        </div>
        <div className="footer-contact">
          <h3>Contact</h3>
          <ul className="contact-list">
            <li>
              <span className="contact-label">Phone</span>
              <a href="tel:+919150800518">+91 91508 00518</a>
            </li>
            <li>
              <span className="contact-label">Email</span>
              <a href="mailto:balamurugannagarajan.vm@gmail.com">
                balamurugannagarajan.vm@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <p>Second Heart — a community campaign for heart patients.</p>
      </div>
    </footer>
  );
}
