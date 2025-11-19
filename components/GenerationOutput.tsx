"use client";

import { useState } from "react";
import type { GenerationResponse } from "@/types/agent";

interface Props {
  data: GenerationResponse | null;
  loading: boolean;
}

function copyToClipboard(text: string) {
  void navigator.clipboard.writeText(text);
}

export function GenerationOutput({ data, loading }: Props) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="panel">
        <div className="panel-header">Agent Output</div>
        <p className="muted">Orchestrating creative agents…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="panel">
        <div className="panel-header">Agent Output</div>
        <p className="muted">Submit a brief to activate the content agent.</p>
      </div>
    );
  }

  const handleCopy = (key: string, value: string) => {
    copyToClipboard(value);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="panel">
      <div className="panel-header">Agent Output</div>
      <section>
        <header className="section-header">
          <h2>Mission Summary</h2>
          <button type="button" onClick={() => handleCopy("mission", data.missionSummary)}>
            {copiedSection === "mission" ? "Copied" : "Copy"}
          </button>
        </header>
        <p>{data.missionSummary}</p>
      </section>

      <section>
        <header className="section-header">
          <h2>Creative Angle</h2>
          <button type="button" onClick={() => handleCopy("angle", data.creativeAngle)}>
            {copiedSection === "angle" ? "Copied" : "Copy"}
          </button>
        </header>
        <p>{data.creativeAngle}</p>
      </section>

      <section>
        <header className="section-header">
          <h2>Headline Options</h2>
          <button
            type="button"
            onClick={() => handleCopy("headline", data.headlineOptions.join("\n"))}
          >
            {copiedSection === "headline" ? "Copied" : "Copy"}
          </button>
        </header>
        <ul>
          {data.headlineOptions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <header className="section-header">
          <h2>Audience Insights</h2>
          <button
            type="button"
            onClick={() => handleCopy("audience", data.audienceInsights.join("\n"))}
          >
            {copiedSection === "audience" ? "Copied" : "Copy"}
          </button>
        </header>
        <ul>
          {data.audienceInsights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <header className="section-header">
          <h2>Outline</h2>
          <button
            type="button"
            onClick={() => handleCopy("outline", data.outline.join("\n"))}
          >
            {copiedSection === "outline" ? "Copied" : "Copy"}
          </button>
        </header>
        <ol>
          {data.outline.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section>
        <header className="section-header">
          <h2>Draft</h2>
          <button type="button" onClick={() => handleCopy("draft", data.draft)}>
            {copiedSection === "draft" ? "Copied" : "Copy"}
          </button>
        </header>
        <pre>{data.draft}</pre>
      </section>

      {data.distributionPlan.length > 0 && (
        <section>
          <header className="section-header">
            <h2>Distribution Plan</h2>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  "distribution",
                  data.distributionPlan
                    .map((item) => `${item.title}\n${item.description}\n${item.body}`)
                    .join("\n\n")
                )
              }
            >
              {copiedSection === "distribution" ? "Copied" : "Copy"}
            </button>
          </header>
          <div className="grid">
            {data.distributionPlan.map((artifact) => (
              <article key={artifact.id} className="artifact">
                <h3>{artifact.title}</h3>
                <p className="muted">{artifact.description}</p>
                <p>{artifact.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section>
        <header className="section-header">
          <h2>CTA Variants</h2>
          <button
            type="button"
            onClick={() => handleCopy("cta", data.callToActionVariants.join("\n"))}
          >
            {copiedSection === "cta" ? "Copied" : "Copy"}
          </button>
        </header>
        <ul>
          {data.callToActionVariants.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <header className="section-header">
          <h2>Suggested Sources</h2>
          <button
            type="button"
            onClick={() => handleCopy("sources", data.sources.join("\n"))}
          >
            {copiedSection === "sources" ? "Copied" : "Copy"}
          </button>
        </header>
        <ul>
          {data.sources.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
