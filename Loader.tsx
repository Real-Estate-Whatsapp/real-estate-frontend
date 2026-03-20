export default function Loader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 animate-pulse rounded"></div>
      ))}
    </div>
  );
}