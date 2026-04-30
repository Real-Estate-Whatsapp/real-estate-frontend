import type { PropertyItem } from "./lib/types";

export default function PropertyCard({ item }: { item: PropertyItem }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition duration-300 border">

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800">
        {item.address?.locality}
      </h2>

      {/* Type + Segment */}
      <p className="text-sm text-gray-500 mt-1">
        {item.type} • {item.segment}
      </p>

      {/* Area */}
      <p className="mt-3 text-gray-700">
        <span className="font-medium">Area:</span>{" "}
        {item.area?.superBuiltup || "N/A"} sqft
      </p>

      {/* Price */}
      <p className="text-green-600 text-lg font-bold mt-3">
        ₹ {item.financial?.price?.toLocaleString()}
      </p>

      {/* 🔥 Broker Info */}
      <div className="mt-4 border-t pt-3">
        <p className="text-sm text-gray-700 font-medium">
          👤 {item.sourceMeta?.brokerName || "N/A"}
        </p>

        <p className="text-sm text-blue-600 mt-1">
          📞 {item.sourceMeta?.phone || "N/A"}
        </p>
      </div>

    </div>
  );
}
