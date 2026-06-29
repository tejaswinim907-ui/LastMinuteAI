function StatsCard({ title, value, color }) {
  return (
    <div className={`rounded-xl shadow-lg p-6 ${color}`}>
      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="text-4xl font-bold text-white mt-3">
        {value}
      </p>
    </div>
  );
}

export default StatsCard;