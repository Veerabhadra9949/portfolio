import { useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  Menu,
  X,
} from "lucide-react";
import { projects, type Project } from "./data";

function ProjectCard({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (project: Project) => void;
}) {
  return (
    <button
      className={`project-card project-card--${project.accent}`}
      onClick={() => onSelect(project)}
      aria-label={`View ${project.name} project details`}
    >
      <div className="project-image">
        <img src={project.image} alt={project.imageAlt} loading="lazy" />
        <span className="project-open" aria-hidden="true">
          <ArrowUpRight size={20} />
        </span>
        <span className="project-number">{project.number}</span>
      </div>
      <div className="project-meta">
        <div>
          <p className="eyebrow">{project.type}</p>
          <h3>{project.name}</h3>
        </div>
        <span className="project-year">{project.year}</span>
      </div>
    </button>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <div className="announcement">
        <span className="status-dot" />
        <span>OPEN TO SELECT PROJECTS</span>
        <span className="announcement-divider">✳</span>
        <span>REMOTE · WORLDWIDE</span>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" onClick={closeMenu} aria-label="Go to home">
          vee<span>.</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label="Main navigation">
          <a href="#work" onClick={closeMenu}>
            Work <span>03</span>
          </a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#services" onClick={closeMenu}>What I do</a>
          <a className="nav-contact" href="#contact" onClick={closeMenu}>
            Let&apos;s talk <ArrowUpRight size={15} />
          </a>
        </nav>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow hero-kicker">
            <Asterisk size={16} strokeWidth={2.5} />
            INDEPENDENT DEVELOPER & DESIGNER
          </p>
          <h1>
            Making the
            <br />
            internet feel
            <br />
            <span className="serif-word">more human.</span>
          </h1>
          <div className="hero-bottom">
            <p>
              I&apos;m Veerabhadra — a digital maker building thoughtful websites and
              products for a more considered world.
            </p>
            <a className="round-link" href="#work" aria-label="Explore selected work">
              <ArrowDown size={21} />
            </a>
          </div>
        </div>
        <div className="hero-art" aria-label="Abstract graphic composition">
          <div className="hero-art-grid" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-sun">
            <span>MAKE</span>
            <span>IT</span>
            <span>MATTER</span>
          </div>
          <span className="hero-art-note">A LITTLE MORE INTENTION, PLEASE.</span>
          <span className="hero-art-index">FIG. 01 / 25</span>
          <div className="hero-spark">✳</div>
        </div>
        <div className="hero-caption">
          <span>DESIGNING WITH FEELING</span>
          <span>BUILDING WITH PURPOSE</span>
          <span>SCROLL TO EXPLORE <ArrowDownRight size={14} /></span>
        </div>
      </section>

      <section className="work-section section-shell" id="work">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span className="section-index">01 /</span> SELECTED WORK</p>
            <h2>A few good things.</h2>
          </div>
          <p className="section-intro">
            A selection of digital ideas, thoughtfully brought to life.
            <br />
            Each one starts with a little curiosity.
          </p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.number} project={project} onSelect={setSelectedProject} />
          ))}
        </div>
        <div className="work-footnote">
          <span>THREE SMALL WORLDS, BUILT WITH CARE.</span>
          <span>MORE GOOD THINGS IN THE WORKS <ArrowRight size={14} /></span>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="section-shell about-inner">
          <div className="about-label">
            <p className="eyebrow"><span className="section-index">02 /</span> A LITTLE ABOUT ME</p>
            <span className="about-symbol">✳</span>
          </div>
          <div className="about-content">
            <h2>
              Good work happens
              <br />
              when <span className="serif-word">curiosity</span>
              <br />
              meets <span className="serif-word">craft.</span>
            </h2>
            <div className="about-description">
              <p>
                I care about the details you notice and the ones you don&apos;t. From the
                first sketch to the final line of code, I bring a mix of design thinking,
                technical craft, and a healthy dose of curiosity to every project.
              </p>
              <p>
                I like working with good people to make useful things feel a little
                unexpected — and a lot more memorable.
              </p>
              <a className="text-link" href="mailto:hello@example.com">
                A little more about me <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="values-row">
            <span>GOOD QUESTIONS FIRST</span>
            <span>DETAILS ARE THE DESIGN</span>
            <span>ALWAYS ROOM TO PLAY</span>
            <span>✳</span>
          </div>
        </div>
      </section>

      <section className="services-section section-shell" id="services">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span className="section-index">03 /</span> WHAT I BRING</p>
            <h2>From first thought<br />to final detail.</h2>
          </div>
          <p className="section-intro">
            A nimble, hands-on approach for ideas that deserve
            <br />
            a little extra thought.
          </p>
        </div>
        <div className="service-list">
          {[
            ["01", "Digital experiences", "Websites, landing pages, and the little interactions that make them sing."],
            ["02", "Product & prototyping", "Turning early ideas into clear, useful products people want to use."],
            ["03", "Creative development", "Thoughtful frontend craft, expressive motion, and playful experiments."],
          ].map(([number, title, description]) => (
            <article className="service-row" key={number}>
              <span className="service-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <ArrowUpRight className="service-arrow" size={20} />
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-shell contact-inner">
          <p className="eyebrow"><span className="section-index">04 /</span> HAVE A GOOD ONE IN MIND?</p>
          <h2>
            Let&apos;s make
            <br />
            <span className="serif-word">something</span> matter.
          </h2>
          <a className="contact-button" href="mailto:hello@example.com?subject=Let%27s%20make%20something">
            Start a conversation <ArrowUpRight size={18} />
          </a>
          <div className="contact-orbit" aria-hidden="true">✳</div>
          <div className="contact-bottom">
            <span>GOOD IDEAS LOOK BETTER SHARED.</span>
            <span>BASED ON EARTH · AVAILABLE EVERYWHERE</span>
          </div>
        </div>
      </section>

      <footer className="site-footer section-shell">
        <a className="wordmark" href="#top">vee<span>.</span></a>
        <span>MADE WITH CARE & A LITTLE CURIOSITY © 2025</span>
        <div className="footer-links">
          <a href="https://github.com/" target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={12} /></a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LINKEDIN <ArrowUpRight size={12} /></a>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>

      {selectedProject && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setSelectedProject(null)}
        >
          <section
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Close project details"
            >
              <X size={20} />
            </button>
            <img src={selectedProject.image} alt={selectedProject.imageAlt} />
            <div className="modal-content">
              <p className="eyebrow">{selectedProject.type} · {selectedProject.year}</p>
              <h2 id="modal-title">{selectedProject.name}</h2>
              <p>{selectedProject.description}</p>
              <div className="tag-list">
                {selectedProject.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <a className="text-link" href="#contact" onClick={() => setSelectedProject(null)}>
                Have a project like this? <ArrowUpRight size={16} />
              </a>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
