import { notFound } from "next/navigation";
import { CapitalFlowTracker } from "@/components/modules/CapitalFlowTracker";
import { ClimatePipeline } from "@/components/modules/ClimatePipeline";
import { CsoHealthMonitor } from "@/components/modules/CsoHealthMonitor";
import { DafMonitor } from "@/components/modules/DafMonitor";
import { EuropeanCuts } from "@/components/modules/EuropeanCuts";
import { ExpansionScreener } from "@/components/modules/ExpansionScreener";
import { FeasibilityScorecard } from "@/components/modules/FeasibilityScorecard";
import { FundingGapDashboard } from "@/components/modules/FundingGapDashboard";
import { IntelligenceFeed } from "@/components/modules/IntelligenceFeed";
import { MajorFunderTracker } from "@/components/modules/MajorFunderTracker";
import { ModelMatrix } from "@/components/modules/ModelMatrix";
import { PhilanthropyIndex } from "@/components/modules/PhilanthropyIndex";
import { PilotRoiTracker } from "@/components/modules/PilotRoiTracker";
import { ProjectRiskDashboard } from "@/components/modules/ProjectRiskDashboard";
import { RegulatoryRiskMonitor } from "@/components/modules/RegulatoryRiskMonitor";
import { SocialPipeline } from "@/components/modules/SocialPipeline";
import { UsaidWithdrawal } from "@/components/modules/UsaidWithdrawal";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  /* Navigation order: Core → Policy → Capital Flow → Infrastructure → Talent → Pilot */
  switch (slug) {
    case "expansion-screener":
      return <ExpansionScreener />;
    case "feasibility-scorecard":
      return <FeasibilityScorecard />;
    case "model-matrix":
      return <ModelMatrix />;
    case "regulatory-risk":
      return <RegulatoryRiskMonitor />;
    case "intelligence-feed":
      return <IntelligenceFeed />;
    case "cso-health":
      return <CsoHealthMonitor />;
    case "capital-flow":
      return <CapitalFlowTracker />;
    case "usaid-withdrawal":
      return <UsaidWithdrawal />;
    case "european-cuts":
      return <EuropeanCuts />;
    case "funding-gap":
      return <FundingGapDashboard />;
    case "daf-monitor":
      return <DafMonitor />;
    case "philanthropy-index":
      return <PhilanthropyIndex />;
    case "major-funder-tracker":
      return <MajorFunderTracker />;
    case "climate-pipeline":
      return <ClimatePipeline />;
    case "social-pipeline":
      return <SocialPipeline />;
    case "project-risk":
      return <ProjectRiskDashboard />;
    case "pilot-roi":
      return <PilotRoiTracker />;
    default:
      notFound();
  }
}
