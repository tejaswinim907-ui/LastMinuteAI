import PriorityCard from "./PriorityCard";
import ScheduleCard from "./ScheduleCard";
import RiskCard from "./RiskCard";
import TipsCard from "./TipsCard";
import RescueCard from "./RescueCard";

function AIResult({ result }) {

  if (!result) {
    return (
      <div className="mt-8 bg-blue-50 rounded-xl p-6 text-center shadow">
        <h2 className="text-2xl font-bold">
          🤖 AI Assistant
        </h2>

        <p className="mt-3 text-gray-600">
          Add some tasks and click <b>AI Prioritize</b>.
        </p>
      </div>
    );
  }

  return (

    <div className="mt-8 space-y-6">

      <RiskCard risk={result.risk} />

      <PriorityCard priority={result.priority} />

      <ScheduleCard schedule={result.schedule} />

      <TipsCard tips={result.tips} />

      <RescueCard rescue={result.rescue} />

    </div>

  );

}

export default AIResult;