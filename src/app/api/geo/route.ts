import { NextResponse } from "next/server";
import { resolveCountry } from "@/lib/geo";
import { languageForCountry } from "@/lib/country-language-map";

export async function GET(request: Request) {
  const country = await resolveCountry(request.headers);
  const lang = languageForCountry(country);
  return NextResponse.json({ country, lang });
}
