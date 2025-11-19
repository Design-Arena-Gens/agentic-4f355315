export type ContentTone =
  | "Inspirational"
  | "Informative"
  | "Playful"
  | "Authoritative"
  | "Bold"
  | "Empathetic";

export type ContentFormat =
  | "Article"
  | "Newsletter"
  | "Social Thread"
  | "Landing Page"
  | "Video Script"
  | "Email Sequence";

export interface GenerationRequest {
  brand: string;
  audience: string;
  objective: string;
  format: ContentFormat;
  tone: ContentTone;
  keywords: string[];
  callToAction: string;
  channels: string[];
  creativeBrief: string;
  lengthPreference: "Short" | "Medium" | "Long";
}

export interface AgentArtifact {
  id: string;
  title: string;
  description: string;
  body: string;
}

export interface GenerationResponse {
  headlineOptions: string[];
  missionSummary: string;
  creativeAngle: string;
  audienceInsights: string[];
  outline: string[];
  draft: string;
  distributionPlan: AgentArtifact[];
  callToActionVariants: string[];
  sources: string[];
}
