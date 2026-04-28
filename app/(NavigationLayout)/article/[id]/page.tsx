// "use client";

import React from "react";
// import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Sparkles,
  Microscope,
  Leaf,
  BadgeCheck,
  ExternalLink,
} from "lucide-react";
import { motion } from "motion/react";
import { MOCK_SUMMARIES } from "@/src/types";
import { findByID } from "@/actions/summarize.prisma";
import SingleArticle from "@/components/SingleArticle";

export default async function ArticleDetail({
  params,
}: {
  params: { id: Promise<string> };
}) {
  // const params = useParams();
  // const id = params.id as string;
  // const router = useRouter();
  // const summary = MOCK_SUMMARIES.find((s) => s.id === id);
  const { id } = await params;
  const selectedSummary = await findByID(Number(id));
  console.log(id, "summary");
  if (!selectedSummary) {
    return (
      <div className="px-6 max-w-2xl mx-auto space-y-12">
        <h1>No Summary Found</h1>
      </div>
    );
  }
  return <SingleArticle summary={selectedSummary} />;
}
