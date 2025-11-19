import { NextResponse } from "next/server";
import { generateContent } from "@/lib/agent";
import type { GenerationRequest } from "@/types/agent";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<GenerationRequest>;
    if (!payload) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    const required: (keyof GenerationRequest)[] = [
      "brand",
      "audience",
      "objective",
      "format",
      "tone",
      "keywords",
      "callToAction",
      "channels",
      "creativeBrief",
      "lengthPreference"
    ];

    for (const key of required) {
      if (payload[key] === undefined || payload[key] === null) {
        return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
      }
    }

    const response = generateContent(payload as GenerationRequest);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Agent generation failed", error);
    return NextResponse.json({ error: "Unable to generate content" }, { status: 500 });
  }
}
