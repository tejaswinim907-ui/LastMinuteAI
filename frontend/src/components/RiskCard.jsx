function RiskCard({ risk }) {

  if (!risk) return null;

  return (

    <div className="bg-red-100 rounded-xl shadow p-6">

      <h2 className="text-2xl font-bold">
        🚨 Risk Level
      </h2>

      <p className="text-xl mt-4 text-red-700 font-bold">
        {risk}
      </p>

    </div>

  );

}

export default RiskCard;