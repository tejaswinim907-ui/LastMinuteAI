function RescueCard({ rescue }) {

  if (!rescue) return null;

  return (

    <div className="bg-yellow-100 rounded-xl shadow p-6">

      <h2 className="text-2xl font-bold">
        🚨 Rescue Mode
      </h2>

      <p className="mt-3">
        Work Hours: {rescue.work_hours || "0"}
      </p>

      <p>
        Available Hours: {rescue.available_hours || "0"}
      </p>

      <p className="font-bold text-red-700 mt-3">
        {rescue.status}
      </p>

      <h3 className="font-bold mt-4">
        Recommendation
      </h3>

      <ul className="list-disc ml-6">

        {rescue.recommendation.map((item,index)=>(

          <li key={index}>
            {item}
          </li>

        ))}

      </ul>

    </div>

  );

}

export default RescueCard;