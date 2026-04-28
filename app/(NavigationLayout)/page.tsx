import LatestSummary from "@/components/LatestSummary";
import InputSection from "@/components/InputSection";

export default function Home() {
  return (
    <div className="px-6 max-w-4xl mx-auto space-y-12">
      {/* Input Section */}
      <InputSection />
      <LatestSummary />
    </div>
  );
}
