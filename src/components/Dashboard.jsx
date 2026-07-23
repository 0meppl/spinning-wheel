import { useState, useEffect } from "react";
import { getStats } from "../utils/stats";
import "../styles/dashboard.css";

// ── Passwort-Gate ─────────────────────────────────────────────────────────────
// SHA-256 von "admin" – ändere auf https://emn178.github.io/online-tools/sha256.html
// und ersetze den String unten mit deinem eigenen Hash.
const PW_HASH = import.meta.env.VITE_PW_HASH;

async function hashInput(str) {
  const buf  = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function PasswordGate({ onAuth }) {
  const [pw, setPw]     = useState("");
  const [err, setErr]   = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    const h = await hashInput(pw);
    if (h === PW_HASH) { sessionStorage.setItem("dash-auth", "1"); onAuth(); }
    else { setErr(true); setBusy(false); setPw(""); }
  };

  return (
    <div className="gate">
      <div className="gateBox">
        <span className="gateLabel">Dashboard</span>
        <input
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="Passwort"
          className={err ? "gateInput err" : "gateInput"}
          autoFocus
        />
        {err && <p className="gateErr">Falsches Passwort.</p>}
        <button className="gateBtn" onClick={submit} disabled={busy || !pw}>
          Einloggen
        </button>
      </div>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = ["Übersicht", "Traffic", "Statistiken", "Notizen", "Aufgaben", "Links"];

// ── Übersicht ─────────────────────────────────────────────────────────────────
function Overview({ stats, traffic }) {
  const thisMonth = (() => {
    const prefix = new Date().toISOString().slice(0, 7);
    return Object.entries(stats.daily ?? {})
      .filter(([d]) => d.startsWith(prefix))
      .reduce((a, [, v]) => a + v, 0);
  })();

  const topMode = Object.entries(stats.byMode ?? {})
    .sort((a, b) => b[1].count - a[1].count)[0];

  const cards = [
    { label: "Spins gesamt",       value: stats.total ?? 0 },
    { label: "Spins diesen Monat", value: thisMonth },
    { label: "Beliebtester Modus", value: topMode ? topMode[0] : "—" },
    { label: "Besuche (GoatC.)",   value: traffic?.total ?? "nicht konfiguriert" },
  ];

  return (
    <div className="section">
      <h2 className="sectionTitle">Übersicht</h2>
      <div className="cardGrid">
        {cards.map(c => (
          <div key={c.label} className="statCard">
            <span className="statValue">{c.value}</span>
            <span className="statLabel">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Traffic (GoatCounter) ─────────────────────────────────────────────────────
function Traffic({ config, onSave }) {
  const [site,  setSite]  = useState(config.site  ?? "");
  const [token, setToken] = useState(config.token ?? "");
  const [data,  setData]  = useState(null);
  const [err,   setErr]   = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch30Days = async () => {
    if (!config.site || !config.token) return;
    setLoading(true); setErr(null);
    try {
      const end   = new Date().toISOString().slice(0, 10);
      const start = new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10);
      const res = await fetch(
        `https://${config.site}.goatcounter.com/api/v0/stats/hits?start=${start}&end=${end}`,
        { headers: { Authorization: `Bearer ${config.token}` } }
      );
      if (!res.ok) throw new Error(`${res.status}`);
      const json = await res.json();
      setData(json);
    } catch(e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch30Days(); }, [config]);

  if (!config.site) return (
    <div className="section">
      <h2 className="sectionTitle">Traffic</h2>
      <div className="setupBox">
        <p className="setupInfo">
          Für Traffic-Daten wird <strong>GoatCounter</strong> benötigt (kostenlos).<br />
          1. Account anlegen auf <a href="https://www.goatcounter.com" target="_blank" rel="noreferrer">goatcounter.com</a><br />
          2. Script in <code>index.html</code> einfügen:<br />
          <code className="codeBlock">{"<script data-goatcounter=\"https://DEIN-SITE.goatcounter.com/count\" async src=\"//gc.zgo.at/count.js\"></script>"}</code><br />
          3. API-Token unter Settings → API generieren und hier eintragen.
        </p>
        <div className="setupForm">
          <input value={site}  onChange={e => setSite(e.target.value)}  placeholder="Site-Code (z.B. meinrad)" />
          <input value={token} onChange={e => setToken(e.target.value)} placeholder="API-Token" type="password" />
          <button onClick={() => onSave({ site, token })} disabled={!site || !token}>Speichern</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="section">
      <div className="sectionRow">
        <h2 className="sectionTitle">Traffic</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="smallBtn" onClick={fetch30Days} disabled={loading}>{loading ? "Lädt…" : "Aktualisieren"}</button>
          <button className="smallBtn danger" onClick={() => onSave({})}>Trennen</button>
        </div>
      </div>

      {err && <p className="infoErr">Fehler: {err}</p>}

      {data && (
        <div>
          <div className="cardGrid" style={{ marginBottom: 20 }}>
            <div className="statCard">
              <span className="statValue">{data.hits?.reduce((a, d) => a + (d.count ?? 0), 0) ?? 0}</span>
              <span className="statLabel">Besuche (30 Tage)</span>
            </div>
            <div className="statCard">
              <span className="statValue">{data.hits?.reduce((a, d) => a + (d.count_unique ?? 0), 0) ?? 0}</span>
              <span className="statLabel">Unique Visitors</span>
            </div>
          </div>

          {/* Tages-Balkendiagramm */}
          <div className="barChart">
            {(data.hits ?? []).slice(-30).map((d, i) => {
              const max = Math.max(...(data.hits ?? []).map(h => h.count ?? 0), 1);
              return (
                <div key={i} className="barCol" title={`${d.day}: ${d.count}`}>
                  <div className="bar" style={{ height: `${Math.max(2, ((d.count ?? 0) / max) * 80)}px` }} />
                  {i % 7 === 0 && <span className="barLabel">{d.day?.slice(5)}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="configNote">GoatCounter: <strong>{config.site}</strong></p>
    </div>
  );
}

// ── Glücksrad-Statistiken ─────────────────────────────────────────────────────
function Stats({ stats }) {
  const modes   = Object.entries(stats.byMode ?? {}).sort((a, b) => b[1].count - a[1].count);
  const last30  = (() => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      days.push({ day: d.slice(5), count: stats.daily?.[d] ?? 0 });
    }
    return days;
  })();
  const max = Math.max(...last30.map(d => d.count), 1);

  return (
    <div className="section">
      <h2 className="sectionTitle">Glücksrad-Statistiken</h2>

      {stats.total
        ? (
          <>
            <div className="barChart" style={{ marginBottom: 24 }}>
              {last30.map((d, i) => (
                <div key={i} className="barCol" title={`${d.day}: ${d.count}`}>
                  <div className="bar" style={{ height: `${Math.max(2, (d.count / max) * 80)}px` }} />
                  {i % 7 === 0 && <span className="barLabel">{d.day}</span>}
                </div>
              ))}
            </div>

            <table className="table">
              <thead>
                <tr><th>Modus</th><th>Spins</th><th>Top-Gewinner</th></tr>
              </thead>
              <tbody>
                {modes.map(([mode, data]) => {
                  const top = Object.entries(data.winners ?? {}).sort((a, b) => b[1] - a[1])[0];
                  return (
                    <tr key={mode}>
                      <td>{mode}</td>
                      <td>{data.count}</td>
                      <td>{top ? `${top[0]} (${top[1]}×)` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )
        : <p className="empty">Noch keine Spins aufgezeichnet.</p>
      }
    </div>
  );
}

// ── Notizen ───────────────────────────────────────────────────────────────────
function Notes() {
  const [text, setText] = useState(() => localStorage.getItem("dash-notes") ?? "");
  const save = (v) => { setText(v); localStorage.setItem("dash-notes", v); };

  return (
    <div className="section">
      <h2 className="sectionTitle">Notizen</h2>
      <textarea
        className="notesArea"
        value={text}
        onChange={e => save(e.target.value)}
        placeholder="Freies Textfeld – wird automatisch gespeichert."
      />
    </div>
  );
}

// ── Aufgaben ──────────────────────────────────────────────────────────────────
function Tasks() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dash-tasks") ?? "[]"); } catch { return []; }
  });
  const [input, setInput] = useState("");

  const save = (t) => { setTasks(t); localStorage.setItem("dash-tasks", JSON.stringify(t)); };
  const add  = () => {
    const v = input.trim();
    if (!v) return;
    save([...tasks, { id: Date.now(), text: v, done: false }]);
    setInput("");
  };
  const toggle = (id) => save(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id) => save(tasks.filter(t => t.id !== id));

  const open = tasks.filter(t => !t.done);
  const done = tasks.filter(t =>  t.done);

  return (
    <div className="section">
      <h2 className="sectionTitle">Aufgaben</h2>
      <div className="inputRow" style={{ marginBottom: 12 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="Neue Aufgabe" />
        <button onClick={add}>+</button>
      </div>
      {tasks.length === 0
        ? <p className="empty">Keine Aufgaben.</p>
        : (
          <>
            <ul className="taskList">
              {open.map(t => (
                <li key={t.id} className="taskItem">
                  <input type="checkbox" checked={false} onChange={() => toggle(t.id)} />
                  <span>{t.text}</span>
                  <button className="removeBtn" onClick={() => remove(t.id)}>×</button>
                </li>
              ))}
            </ul>
            {done.length > 0 && (
              <>
                <p className="doneHeader">Erledigt ({done.length})</p>
                <ul className="taskList done">
                  {done.map(t => (
                    <li key={t.id} className="taskItem">
                      <input type="checkbox" checked onChange={() => toggle(t.id)} />
                      <span>{t.text}</span>
                      <button className="removeBtn" onClick={() => remove(t.id)}>×</button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )
      }
    </div>
  );
}

// ── Links ─────────────────────────────────────────────────────────────────────
function Links() {
  const [links, setLinks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dash-links") ?? "[]"); } catch { return []; }
  });
  const [url,   setUrl]   = useState("");
  const [label, setLabel] = useState("");

  const save   = (l) => { setLinks(l); localStorage.setItem("dash-links", JSON.stringify(l)); };
  const add    = () => {
    const u = url.trim(), l = label.trim();
    if (!u) return;
    const href = u.startsWith("http") ? u : `https://${u}`;
    save([...links, { id: Date.now(), href, label: l || href }]);
    setUrl(""); setLabel("");
  };
  const remove = (id) => save(links.filter(l => l.id !== id));

  return (
    <div className="section">
      <h2 className="sectionTitle">Links</h2>
      <div className="linkInput">
        <input value={url}   onChange={e => setUrl(e.target.value)}   onKeyDown={e => e.key === "Enter" && add()} placeholder="URL" style={{ flex: 2 }} />
        <input value={label} onChange={e => setLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="Bezeichnung (optional)" style={{ flex: 1 }} />
        <button onClick={add}>+</button>
      </div>
      {links.length === 0
        ? <p className="empty">Keine Links gespeichert.</p>
        : (
          <ul className="linkList">
            {links.map(l => (
              <li key={l.id} className="linkItem">
                <a href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
                <span className="linkHref">{l.href}</span>
                <button className="removeBtn" onClick={() => remove(l.id)}>×</button>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard({ onExit }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("dash-auth") === "1");
  const [tab, setTab]       = useState("Übersicht");
  const [stats, setStats]   = useState({});
  const [traffic, setTraffic] = useState(null);
  const [gcConfig, setGcConfig] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dash-gc") ?? "{}"); } catch { return {}; }
  });

  const saveGcConfig = (cfg) => {
    setGcConfig(cfg);
    localStorage.setItem("dash-gc", JSON.stringify(cfg));
  };

  useEffect(() => {
    if (authed) setStats(getStats());
  }, [authed, tab]);

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />;

  return (
    <div className="dashboard">
      <div className="dashNav">
        <span className="dashTitle">Dashboard</span>
        <div className="dashTabs">
          {TABS.map(t => (
            <button key={t} className={`dashTab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <button className="dashExit" onClick={onExit}>← Zurück</button>
      </div>

      <div className="dashContent">
        {tab === "Übersicht"   && <Overview    stats={stats} traffic={traffic} />}
        {tab === "Traffic"     && <Traffic     config={gcConfig} onSave={saveGcConfig} />}
        {tab === "Statistiken" && <Stats       stats={stats} />}
        {tab === "Notizen"     && <Notes />}
        {tab === "Aufgaben"    && <Tasks />}
        {tab === "Links"       && <Links />}
      </div>
    </div>
  );
}