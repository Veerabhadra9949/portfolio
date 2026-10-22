import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  Check,
  Code2,
  Layers3,
  Menu,
  MoveUpRight,
  Palette,
  Sparkles,
  X,
} from "lucide-react";
import { projects, type Project } from "./data";

type ContactStatus = { kind: "success" | "error"; message: string } | null;

function ProjectCard({
  project,
  onSelect,
  index,
}: {
  project: Project;
  onSelect: (project: Project) => void;
  index: number;
}) {
  return (
    <button
      className={`project-card project-card--${project.accent} reveal`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onClick={() => onSelect(project)}
      aria-label={`View ${project.name} project details`}
    >
      <div className="project-image">
        <img src={project.image} alt={project.imageAlt} loading="lazy" />
        <span className="project-open" aria-hidden="true">
          <ArrowUpRight size={20} />
        </span>
        <span className="project-number">{project.number} / 03</span>
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

function ContactForm() {
  const [status, setStatus] = useState<ContactStatus>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setSending(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Your message could not be sent. Please try again.");
      }

      form.reset();
      setStatus({ kind: "success", message: "Message sent. I’ll be in touch soon." });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again or email me directly.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-fields">
        <label>
          <span>Your name</span>
          <input name="name" autoComplete="name" placeholder="Jane Smith" minLength={2} maxLength={80} required />
        </label>
        <label>
          <span>Your email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            maxLength={254}
            required
          />
        </label>
        <label className="contact-message">
          <span>A little about your project</span>
          <textarea
            name="message"
            placeholder="What are you dreaming up?"
            minLength={10}
            maxLength={3000}
            rows={4}
            required
          />
        </label>
        <label className="contact-honeypot" aria-hidden="true">
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="contact-form-footer">
        <p className={`form-status${status ? ` form-status--${status.kind}` : ""}`} role="status" aria-live="polite">
          {status && (status.kind === "success" ? <Check size={15} /> : <Asterisk size={15} />)}
          {status?.message}
        </p>
        <button className="contact-button" type="submit" disabled={sending}>
          {sending ? "Sending…" : "Send a message"}
          <MoveUpRight size={17} />
        </button>
      </div>
    </form>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLElement>(null);
  const modalCloseButton = useRef<HTMLButtonElement>(null);
  const projectTrigger = useRef<HTMLElement | null>(null);

  const closeMenu = () => setMenuOpen(false);

  function openProject(project: Project) {
    projectTrigger.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    setSelectedProject(project);
  }

  function closeProject() {
    setSelectedProject(null);
    window.requestAnimationFrame(() => projectTrigger.current?.focus());
  }

  function moveScene(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: (event.clientX - bounds.left) / bounds.width - 0.5,
      y: (event.clientY - bounds.top) / bounds.height - 0.5,
    });
  }

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      document.documentElement.style.setProperty("--page-progress", `${progress}`);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeProject();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements.item(0);
      const lastElement = focusableElements.item(focusableElements.length - 1);

      if (!firstElement || !lastElement) {
        event.preventDefault();
      } else if (!modalRef.current.contains(document.activeElement)) {
        event.preventDefault();
        firstElement.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };
    document.body.classList.add("modal-open");
    modalCloseButton.current?.focus();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedProject]);

  return (
    <main>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="announcement">
        <span className="status-dot" />
        <span>AVAILABLE FOR SELECT PROJECTS</span>
        <span className="announcement-divider">✳</span>
        <span>BASED ON EARTH · WORKING EVERYWHERE</span>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" onClick={closeMenu} aria-label="Veerabhadra home">
          v<span className="wordmark-star">✳</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label="Main navigation">
          <a href="#work" onClick={closeMenu}>Work <span>03</span></a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a className="nav-contact" href="#contact" onClick={closeMenu}>
            Let&apos;s talk <ArrowUpRight size={15} />
          </a>
        </nav>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow hero-kicker">
            <Asterisk size={16} strokeWidth={2.5} />
            CREATIVE DEVELOPER · DIGITAL DESIGNER
          </p>
          <h1>
            The web,
            <br />
            with a little
            <br />
            <span className="serif-word">more wonder.</span>
          </h1>
          <div className="hero-bottom">
            <p>
              I&apos;m Veerabhadra — I design and build expressive digital experiences
              where thoughtful details meet a little bit of magic.
            </p>
            <a className="round-link" href="#work" aria-label="Explore selected work">
              <ArrowDown size={19} />
            </a>
          </div>
          <div className="hero-proof">
            <span className="proof-line" />
            <span>DESIGN-LED. CODE-CRAFTED. ALWAYS HUMAN.</span>
          </div>
        </div>

        <div
          className="hero-art reveal"
          onPointerMove={moveScene}
          onPointerLeave={() => setPointer({ x: 0, y: 0 })}
          role="img"
          aria-label="An interactive, three-dimensional glowing planet floating in an orbital field"
        >
          <div className="art-grain" aria-hidden="true" />
          <div className="scene-label scene-label--top" aria-hidden="true">A DIGITAL UNIVERSE</div>
          <div className="scene-label scene-label--bottom" aria-hidden="true">FIG. 01 — KEEP LOOKING UP</div>
          <div
            className="planet-system"
            style={{
              transform: `rotateX(${pointer.y * -11}deg) rotateY(${pointer.x * 15}deg)`,
            }}
            aria-hidden="true"
          >
            <div className="planet-orbit planet-orbit--one"><span className="orbit-moon" /></div>
            <div className="planet-orbit planet-orbit--two" />
            <div className="planet-orbit planet-orbit--three" />
            <div className="planet">
              <div className="planet-highlight" />
              <div className="planet-continent planet-continent--one" />
              <div className="planet-continent planet-continent--two" />
              <span className="planet-type">STAY<br />CURIOUS</span>
            </div>
            <div className="planet-spark planet-spark--one">✳</div>
            <div className="planet-spark planet-spark--two">✦</div>
          </div>
          <div className="scene-coordinate" aria-hidden="true">17° 23′ N<br />78° 29′ E</div>
        </div>
        <div className="hero-caption">
          <span>THOUGHTFUL BY DESIGN</span>
          <span>BUILT TO MAKE YOU FEEL</span>
          <a href="#work">SCROLL TO EXPLORE <ArrowDownRight size={14} /></a>
        </div>
      </section>

      <section className="work-section section-shell" id="work">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow"><span className="section-index">01 /</span> SELECTED WORK</p>
            <h2>Little worlds,<br /><span className="serif-word">big feelings.</span></h2>
          </div>
          <p className="section-intro">
            A few explorations in making the digital feel
            <br />
            a little more tactile, human, and alive.
          </p>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectCard key={project.number} project={project} index={index} onSelect={openProject} />
          ))}
        </div>
        <div className="work-footnote">
          <span>THREE SMALL WORLDS, BUILT WITH CARE.</span>
          <span>IDEAS TURNING INTO REALITY <ArrowRight size={14} /></span>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="section-shell about-inner">
          <div className="about-label reveal">
            <p className="eyebrow"><span className="section-index">02 /</span> THE PERSON BEHIND THE PIXELS</p>
            <span className="about-symbol" aria-hidden="true">✳</span>
          </div>
          <div className="about-content">
            <h2 className="reveal">
              A little logic.
              <br />
              A lot of <span className="serif-word">wonder.</span>
            </h2>
            <div className="about-description reveal">
              <p>
                I bring visual ideas and technology together to make useful things
                that feel different. The best digital experiences aren&apos;t just
                easy to use — they stay with you.
              </p>
              <p>
                From the first sketch to the last detail, I care about the small
                choices that turn a good idea into a memorable one.
              </p>
              <a className="text-link" href="mailto:hello@example.com">
                More about my approach <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="values-row">
            <span>CURIOUS BY DEFAULT</span>
            <span>DETAILS MATTER</span>
            <span>BUILT FOR PEOPLE</span>
            <span>✳</span>
          </div>
        </div>
      </section>

      <section className="services-section section-shell" id="services">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow"><span className="section-index">03 /</span> THE SWEET SPOT</p>
            <h2>Where ideas<br />become <span className="serif-word">real.</span></h2>
          </div>
          <p className="section-intro">
            A hands-on creative partner for the whole journey,
            <br />
            from the first “what if?” to launch day.
          </p>
        </div>
        <div className="service-list">
          {[
            { number: "01", title: "Digital experiences", description: "Websites and interfaces that feel considered, clear, and quietly unforgettable.", icon: <Palette size={20} /> },
            { number: "02", title: "Product & prototyping", description: "A rough idea made tangible, tested, and ready to grow into something real.", icon: <Layers3 size={20} /> },
            { number: "03", title: "Creative development", description: "Expressive frontend craft, playful motion, and a healthy respect for the details.", icon: <Code2 size={20} /> },
          ].map((service) => (
            <article
              className="service-row reveal"
              key={service.number}
              style={{ transitionDelay: `${Number(service.number) * 80}ms` }}
            >
              <span className="service-number">{service.number}</span>
              <span className="service-icon" aria-hidden="true">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ArrowUpRight className="service-arrow" size={19} aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-shell contact-inner">
          <div className="contact-heading reveal">
            <div>
              <p className="eyebrow"><span className="section-index">04 /</span> HAVE A GOOD ONE IN MIND?</p>
              <h2>
                Let&apos;s make
                <br />
                <span className="serif-word">something</span> matter.
              </h2>
            </div>
            <div className="contact-orbit" aria-hidden="true">
              <Sparkles size={22} />
              <span>GOOD THINGS<br />START HERE</span>
            </div>
          </div>
          <div className="contact-body">
            <div className="contact-aside reveal">
              <p>Have an idea you can&apos;t stop thinking about? Tell me a little about it and we can take it from there.</p>
              <a className="direct-email" href="mailto:hello@example.com">
                Prefer email? Say hello <ArrowUpRight size={15} />
              </a>
            </div>
            <div className="contact-form-reveal reveal">
              <ContactForm />
            </div>
          </div>
          <div className="contact-bottom">
            <span>GOOD IDEAS LOOK BETTER SHARED.</span>
            <span>BASED ON EARTH · AVAILABLE EVERYWHERE</span>
          </div>
        </div>
      </section>

      <footer className="site-footer section-shell">
        <a className="wordmark" href="#top" aria-label="Back to top">v<span className="wordmark-star">✳</span></a>
        <span>MADE WITH CARE & A LITTLE CURIOSITY © {new Date().getFullYear()}</span>
        <div className="footer-links">
          <a href="https://github.com/" target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={12} /></a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LINKEDIN <ArrowUpRight size={12} /></a>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>

      {selectedProject && (
        <div className="modal-backdrop" role="presentation" onClick={closeProject}>
          <section
            className="project-modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              ref={modalCloseButton}
              onClick={closeProject}
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
