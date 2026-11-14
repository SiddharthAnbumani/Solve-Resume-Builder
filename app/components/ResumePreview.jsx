import RichText from "./RichText";
import { fontScale, fontStack } from "../lib/fonts";
import { ph } from "../lib/placeholders";
import { themes } from "../lib/templates";

// Every template shares this structure; only the class tokens in
// lib/templates.js differ. Sizes are in pt so print matches the screen.

// An entry counts as blank when every field (except its default label) is empty.
const isBlank = (item) =>
  Object.entries(item).every(
    ([k, v]) => k === "id" || k === "gpaLabel" || !String(v ?? "").trim()
  );

function Section({ t, title, ghost, children }) {
  return (
    <section className={`${t.section} ${ghost ? "print:hidden" : ""}`}>
      <h2 className={`break-after-avoid ${t.h2}`}>{title}</h2>
      <div className={t.body}>{children}</div>
    </section>
  );
}

function Row({ left, right }) {
  return (
    <div className="flex items-baseline justify-between gap-[12pt]">
      <div className="min-w-0">{left}</div>
      {right ? <div className="shrink-0 font-bold">{right}</div> : null}
    </div>
  );
}

export default function ResumePreview({ data, template = "classic", font = "default" }) {
  const t = themes[template] ?? themes.classic;
  // A font chosen in the editor replaces the template's own fonts everywhere,
  // including the contact line.
  const stack = fontStack(font);
  const { basics, summary, education, skills, experience, projects } = data;
  const real = (v) => String(v ?? "").trim();
  const contactReal = [basics.phone, basics.location, basics.email].filter(real);
  const contactGhost = contactReal.length === 0;
  const contact = contactGhost ? [ph.phone, ph.location, ph.email] : contactReal;
  const filled = basics.links.filter((l) => l.url);
  const linksGhost =
    filled.length === 0 && basics.links.some((l) => l.url || l.label);
  const linkList = linksGhost
    ? ph.links.slice(0, Math.max(1, Math.min(2, basics.links.length)))
    : filled;
  const summaryGhost = !real(summary.text);

  return (
    <article
      className={`resume-paper text-black ${t.root}`}
      style={stack ? { fontFamily: stack, zoom: fontScale(font) } : { fontFamily: t.family }}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <header className={`mt-[6pt] ${t.header}`}>
        <h1 className={t.name} {...(real(basics.name) ? {} : { "data-ph": "" })}>
          {real(basics.name) ? basics.name : ph.name}
        </h1>
        <p
          className={`${t.contact} ${contactGhost ? "print:hidden" : ""}`}
          style={!stack && t.contactFamily ? { fontFamily: t.contactFamily } : undefined}
          {...(contactGhost ? { "data-ph": "" } : {})}
        >
          {contact.map((item, i) => (
            <span key={i}>
              {i > 0 && " | "}
              {!contactGhost && item === basics.email ? (
                <a href={`mailto:${item}`} className={t.link}>
                  {item}
                </a>
              ) : (
                item
              )}
            </span>
          ))}
        </p>
        {linkList.length > 0 && (
          <p
            className={`${t.links} ${linksGhost ? "print:hidden" : ""}`}
            {...(linksGhost ? { "data-ph": "" } : {})}
          >
            {linkList.map((l, i) => (
              <span key={linksGhost ? i : l.id}>
                {i > 0 && " | "}
                {linksGhost ? (
                  l
                ) : (
                  <a href={l.url} className={t.link}>
                    {l.label ? `${l.label} - ${l.url}` : l.url}
                  </a>
                )}
              </span>
            ))}
          </p>
        )}
      </header>

      {summary.visible && (
        <Section t={t} title={summary.title} ghost={summaryGhost}>
          <p
            className={`${t.align} ${t.big}`}
            {...(summaryGhost ? { "data-ph": "" } : {})}
          >
            <RichText text={summaryGhost ? ph.summary : summary.text} />
          </p>
        </Section>
      )}

      {education.visible && education.items.length > 0 && (
        <Section t={t} title={education.title} ghost={education.items.every(isBlank)}>
          <div className="space-y-[10pt]">
            {education.items.map((item) => {
              const ghost = isBlank(item);
              const e = ghost ? { ...item, ...ph.education, gpaLabel: item.gpaLabel } : item;
              return (
              <div key={item.id} className="break-inside-avoid" {...(ghost ? { "data-ph": "" } : {})}>
                <Row
                  left={
                    <>
                      <strong>{e.institution}</strong>
                      {e.location && `, ${e.location}`}
                    </>
                  }
                  right={e.date}
                />
                {e.degree && <div className="italic">{e.degree}</div>}
                {e.gpa && (
                  <div>
                    <strong>{e.gpaLabel || "GPA"}</strong>: {e.gpa}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </Section>
      )}

      {skills.visible && skills.items.length > 0 && (
        <Section t={t} title={skills.title} ghost={skills.items.every(isBlank)}>
          <div className={t.gap}>
            {skills.items.map((item) => {
              const ghost = isBlank(item);
              const s = ghost ? { ...item, ...ph.skills } : item;
              return (
              <div key={item.id} className="break-inside-avoid" {...(ghost ? { "data-ph": "" } : {})}>
                <h3 className={t.skillTitle}>{s.title}</h3>
                <p className={t.align}>
                  <RichText text={s.text} />
                </p>
              </div>
              );
            })}
          </div>
        </Section>
      )}

      {experience.visible && experience.items.length > 0 && (
        <Section t={t} title={experience.title} ghost={experience.items.every(isBlank)}>
          <div className={t.gap}>
            {experience.items.map((item) => {
              const ghost = isBlank(item);
              const x = ghost ? { ...item, ...ph.experience } : item;
              return (
              <div key={item.id} className="break-inside-avoid" {...(ghost ? { "data-ph": "" } : {})}>
                <Row
                  left={
                    <strong>
                      {x.role}
                      {x.company && ` – ${x.company}`}
                      {x.location && `, ${x.location}`}
                    </strong>
                  }
                  right={x.date}
                />
                <p className={t.align}>
                  <RichText text={x.text} />
                </p>
              </div>
              );
            })}
          </div>
        </Section>
      )}

      {projects.visible && projects.items.length > 0 && (
        <Section t={t} title={projects.title} ghost={projects.items.every(isBlank)}>
          <div className={t.bigGap}>
            {projects.items.map((item) => {
              const ghost = isBlank(item);
              const p = ghost ? { ...item, ...ph.projects } : item;
              return (
                <p
                  key={item.id}
                  className={`break-inside-avoid ${t.align} ${t.big}`}
                  {...(ghost ? { "data-ph": "" } : {})}
                >
                  <strong>{p.name}</strong>
                  {p.name && p.text && " - "}
                  <RichText text={p.text} />
                </p>
              );
            })}
          </div>
        </Section>
      )}
    </article>
  );
}
