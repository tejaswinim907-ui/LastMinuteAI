function PriorityCard({ priority }) {

  if (!priority) return null;

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-2xl font-bold mb-4">
        🔥 AI Priority
      </h2>

      {priority.map((item, index) => (

        <div
          key={index}
          className="flex justify-between border-b py-3"
        >

          <span>{item.task}</span>

          <span className="font-bold text-red-600">
            {item.level}
          </span>

        </div>

      ))}

    </div>

  );

}

export default PriorityCard;