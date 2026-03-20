export default function Filters({ setFilter }: any) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      <select onChange={(e) => setFilter("type", e.target.value)} className="border p-2">
        <option value="">All Type</option>
        <option value="apartment">Apartment</option>
        <option value="office">Office</option>
      </select>

      <select onChange={(e) => setFilter("segment", e.target.value)} className="border p-2">
        <option value="">All Segment</option>
        <option value="residential">Residential</option>
        <option value="commercial">Commercial</option>
      </select>
    </div>
  );
}