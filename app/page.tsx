"use client";

import { FormEvent, useMemo, useState } from "react";
import { GenerationOutput } from "@/components/GenerationOutput";
import type { GenerationResponse } from "@/types/agent";
import type { ContentFormat, ContentTone } from "@/types/agent";

type LengthPreference = "Short" | "Medium" | "Long";

type AgentStepState = "idle" | "running" | "complete";

const toneOptions: ContentTone[] = [
  "Inspirational",
  "Informative",
  "Playful",
  "Authoritative",
  "Bold",
  "Empathetic"
];

const formatOptions: ContentFormat[] = [
  "Article",
  "Newsletter",
  "Social Thread",
  "Landing Page",
  "Video Script",
  "Email Sequence"
];

const lengthOptions: LengthPreference[] = ["Short", "Medium", "Long"];

const defaultChannels = ["LinkedIn", "Email", "Blog", "Twitter/X", "YouTube"];

export default function Home() {
  const [brand, setBrand] = useState("Supernova Studio");
  const [audience, setAudience] = useState("product marketing leaders");
  const [objective, setObjective] = useState("launch sequencing for a flagship feature");
  const [format, setFormat] = useState<ContentFormat>("Article");
  const [tone, setTone] = useState<ContentTone>("Inspirational");
  const [lengthPreference, setLengthPreference] = useState<LengthPreference>("Medium");
  const [keywords, setKeywords] = useState("go-to-market momentum, customer proof, strategic narrative");
  const [callToAction, setCallToAction] = useState("Book a strategy lab");
  const [channels, setChannels] = useState<string[]>(["LinkedIn", "Email"]);
  const [customChannel, setCustomChannel] = useState("");
  const [creativeBrief, setCreativeBrief] = useState(
    "Highlight the transition from feature launches to narrative-driven campaigns that scale."
  );

  const [response, setResponse] = useState<GenerationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agentSteps = useMemo(() => {
    const base: { title: string; description: string; key: keyof GenerationResponse | "outline" }[] = [
      { title: "Strategy Intelligence", description: "Clarify mission, audience, and tone", key: "missionSummary" },
      { title: "Concept Engine", description: "Select angles, story spine, key headlines", key: "creativeAngle" },
      { title: "Writer Room", description: "Draft long-form asset with structure", key: "draft" },
      { title: "Distribution Orchestrator", description: "Generate channel-specific derivatives", key: "distributionPlan" }
    ];

    return base.map((step) => {
      let state: AgentStepState = "idle";
      if (loading) {
        state = step.title === "Strategy Intelligence" ? "running" : "idle";
      } else if (response) {
        state = step.key === "distributionPlan" ? "complete" : "complete";
      }
      return { ...step, state };
    });
  }, [loading, response]);

  const handleChannelToggle = (value: string) => {
    setChannels((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleAddCustomChannel = () => {
    const trimmed = customChannel.trim();
    if (!trimmed) return;
    setChannels((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setCustomChannel("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const keywordList = keywords
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean);
      const channelList = channels.map((item) => item.trim()).filter(Boolean);

      const payload = {
        brand,
        audience,
        objective,
        format,
        tone,
        keywords: keywordList,
        callToAction,
        channels: channelList,
        creativeBrief,
        lengthPreference
      } as const;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error((await res.json()).error || "Failed to generate content");
      }

      const data = (await res.json()) as GenerationResponse;
      setResponse(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to generate content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="shell">
        <header className="hero">
          <div>
            <p className="agent-tag">Agentic workflow</p>
            <h1>Orchestrate a full-stack content launch</h1>
            <p className="muted">
              Feed the agent a tight brief and watch it synthesize strategy, creative, and
              distribution assets in one pass.
            </p>
          </div>
        </header>

        <div className="grid-layout">
          <form className="panel" onSubmit={handleSubmit}>
            <div className="panel-header">Creative Brief</div>
            <div className="form-grid">
              <label>
                <span>Brand / Product</span>
                <input value={brand} onChange={(event) => setBrand(event.target.value)} required />
              </label>

              <label>
                <span>Target Audience</span>
                <input
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                  required
                />
              </label>

              <label>
                <span>Primary Objective</span>
                <input
                  value={objective}
                  onChange={(event) => setObjective(event.target.value)}
                  required
                />
              </label>

              <label>
                <span>Content Format</span>
                <select value={format} onChange={(event) => setFormat(event.target.value as ContentFormat)}>
                  {formatOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Tone</span>
                <select value={tone} onChange={(event) => setTone(event.target.value as ContentTone)}>
                  {toneOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Length Preference</span>
                <select
                  value={lengthPreference}
                  onChange={(event) => setLengthPreference(event.target.value as LengthPreference)}
                >
                  {lengthOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="stacked">
              <span>Keywords & Proof Points</span>
              <textarea
                value={keywords}
                onChange={(event) => setKeywords(event.target.value)}
                rows={3}
                placeholder="Comma separated list"
              />
            </label>

            <label className="stacked">
              <span>Call to Action</span>
              <input value={callToAction} onChange={(event) => setCallToAction(event.target.value)} />
            </label>

            <label className="stacked">
              <span>Creative Brief Notes</span>
              <textarea
                value={creativeBrief}
                onChange={(event) => setCreativeBrief(event.target.value)}
                rows={4}
              />
            </label>

            <fieldset className="channels">
              <legend>Distribution Channels</legend>
              <div className="channel-options">
                {defaultChannels.map((channel) => (
                  <label key={channel} className={channels.includes(channel) ? "selected" : ""}>
                    <input
                      type="checkbox"
                      checked={channels.includes(channel)}
                      onChange={() => handleChannelToggle(channel)}
                    />
                    <span>{channel}</span>
                  </label>
                ))}
              </div>
              <div className="custom-channel">
                <input
                  value={customChannel}
                  onChange={(event) => setCustomChannel(event.target.value)}
                  placeholder="Add channel"
                />
                <button type="button" onClick={handleAddCustomChannel}>
                  Add
                </button>
              </div>
              {channels.length > 0 && (
                <p className="muted">Active: {channels.join(", ")}</p>
              )}
            </fieldset>

            <div className="actions">
              <button type="submit" disabled={loading}>
                {loading ? "Generating…" : "Run Agent"}
              </button>
              {error && <p className="error">{error}</p>}
            </div>
          </form>

          <aside className="aside">
            <div className="panel steps">
              <div className="panel-header">Agent Pipeline</div>
              <ol>
                {agentSteps.map((step) => (
                  <li key={step.title} data-state={step.state}>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                    <span className="status" />
                  </li>
                ))}
              </ol>
            </div>
            <GenerationOutput data={response} loading={loading} />
          </aside>
        </div>
      </div>
    </main>
  );
}
