export default function Header({ onOpenModal }) {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" width="30" height="30">
              <path
                d="M20 33 C 8 25, 3 17, 8 11 C 12 6, 18 7, 20 13 C 22 7, 28 6, 32 11 C 37 17, 32 25, 20 33 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Second Heart
        </a>
        <nav className="site-nav" aria-label="Primary">
          <a href="#about">About</a>
          <a href="#how">How it works</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="btn btn-small" onClick={onOpenModal}>
          Start helping
        </button>
      </div>
    </header>
  );
}
