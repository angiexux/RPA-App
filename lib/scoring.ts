import { ModelRecommendation } from "@/lib/types";

export function roundScore(value: number) {
  return Math.round(value * 100) / 100;
}

export function computeComposite(input: {
  policy: number;
  capital: number;
  infrastructure: number;
  talent: number;
}) {
  const weighted =
    input.policy * 0.25 +
    input.capital * 0.3 +
    input.infrastructure * 0.25 +
    input.talent * 0.2;

  return roundScore(weighted);
}

export function recommendModel(score: number): ModelRecommendation {
  if (score >= 4) {
    return "Local Partner";
  }

  if (score >= 3) {
    return "Hybrid";
  }

  if (score >= 2) {
    return "New Build";
  }

  return "Premature";
}

export function modelColor(model: ModelRecommendation) {
  switch (model) {
    case "Local Partner":
      return "bg-teal-700 text-white";
    case "Hybrid":
      return "bg-amber-500 text-white";
    case "New Build":
      return "bg-orange-500 text-white";
    case "Premature":
      return "bg-red-500 text-white";
  }
}
