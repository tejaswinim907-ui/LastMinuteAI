function ScheduleCard({ schedule }) {

  if (!schedule) return null;

  return (

    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-2xl font-bold mb-4">
        📅 Today's Schedule
      </h2>

      {schedule.map((item,index)=>(

        <div
          key={index}
          className="flex justify-between border-b py-3"
        >

          <span>{item.time}</span>

          <span>{item.task}</span>

        </div>

      ))}

    </div>

  );

}

export default ScheduleCard;