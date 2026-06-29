function TipsCard({ tips }) {

  if (!tips) return null;

  return (

    <div className="bg-green-100 rounded-xl shadow p-6">

      <h2 className="text-2xl font-bold">
        💡 AI Tips
      </h2>

      <ul className="list-disc ml-6 mt-4">

        {tips.map((tip,index)=>(

          <li key={index}>
            {tip}
          </li>

        ))}

      </ul>

    </div>

  );

}

export default TipsCard;