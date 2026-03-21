export default function PropertyCard({ item }: any) {
  // Helper function to check if a section has any data
  const hasData = (obj: any) => obj && Object.values(obj).some(val => val !== null && val !== undefined && val !== '');

  // Helper to format numbers
  const formatNumber = (num: any) => {
    if (!num) return 'N/A';
    return Number(num).toLocaleString('en-IN');
  };

  // Helper to render key-value pairs
  const renderDetail = (label: string, value: any, prefix = '', suffix = '') => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'boolean') value = value ? 'Yes' : 'No';
    return (
      <p key={label} className="text-sm text-gray-700">
        <span className="font-medium text-gray-800">{label}:</span> {prefix}{value}{suffix}
      </p>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition duration-300 border border-gray-200">

      {/* HEADER SECTION */}
      <div className="border-b pb-3 mb-4">
        {/* Listing Type Badge */}
        {item.listingType && (
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2"
            style={{
              backgroundColor: item.listingType === 'inventory' ? '#dcfce7' : '#dbeafe',
              color: item.listingType === 'inventory' ? '#166534' : '#0c4a6e'
            }}>
            {item.listingType === 'inventory' ? '📦 Available' : '🔍 Requirement'}
          </span>
        )}

        {/* Locality */}
        <h2 className="text-xl font-bold text-gray-900">
          {item.address?.locality || 'Location Not Specified'}
        </h2>

        {/* Type + Segment */}
        {(item.type || item.segment) && (
          <p className="text-sm text-gray-600 mt-1">
            {item.type && <span className="capitalize">{item.type.replace('-', ' ')}</span>}
            {item.type && item.segment && <span> • </span>}
            {item.segment && <span className="capitalize">{item.segment}</span>}
          </p>
        )}
      </div>

      {/* TRANSACTION TYPE */}
      {item.transactionType && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm">
            <span className="font-semibold text-blue-900">Transaction:</span>
            <span className="text-blue-800 ml-1 capitalize">{item.transactionType}</span>
          </p>
        </div>
      )}

      {/* ADDRESS DETAILS */}
      {hasData(item.address) && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">📍 Location Details</h3>
          <div className="space-y-1 text-sm text-gray-700">
            {item.address?.city && <p><span className="font-medium">City:</span> {item.address.city}</p>}
            {item.address?.society && <p><span className="font-medium">Society:</span> {item.address.society}</p>}
            {item.address?.tower && <p><span className="font-medium">Tower:</span> {item.address.tower}</p>}
            {item.address?.unitNumber && <p><span className="font-medium">Unit:</span> {item.address.unitNumber}</p>}
            {item.address?.floor && <p><span className="font-medium">Floor:</span> {item.address.floor}</p>}
            {item.address?.floorType && <p><span className="font-medium">Floor Type:</span> <span className="capitalize">{item.address.floorType}</span></p>}
          </div>
        </div>
      )}

      {/* CONFIGURATION */}
      {hasData(item.configuration) && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">🏠 Configuration</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {item.configuration?.bedrooms !== undefined && item.configuration?.bedrooms !== null && (
              <div className="bg-gray-100 p-2 rounded">
                <p className="font-medium text-gray-800">{item.configuration.bedrooms}</p>
                <p className="text-xs text-gray-600">Bedrooms</p>
              </div>
            )}
            {item.configuration?.bathrooms !== undefined && item.configuration?.bathrooms !== null && (
              <div className="bg-gray-100 p-2 rounded">
                <p className="font-medium text-gray-800">{item.configuration.bathrooms}</p>
                <p className="text-xs text-gray-600">Bathrooms</p>
              </div>
            )}
            {item.configuration?.balconies !== undefined && item.configuration?.balconies !== null && (
              <div className="bg-gray-100 p-2 rounded">
                <p className="font-medium text-gray-800">{item.configuration.balconies}</p>
                <p className="text-xs text-gray-600">Balconies</p>
              </div>
            )}
            {item.configuration?.study && (
              <div className="bg-green-100 p-2 rounded text-green-800">
                <p className="font-medium text-xs">✓ Study Room</p>
              </div>
            )}
            {item.configuration?.servantRoom && (
              <div className="bg-green-100 p-2 rounded text-green-800">
                <p className="font-medium text-xs">✓ Servant Room</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AREA DETAILS */}
      {hasData(item.area) && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">📐 Area</h3>
          <div className="space-y-1 text-sm text-gray-700">
            {item.area?.superBuiltup && <p><span className="font-medium">Super Built-up:</span> {formatNumber(item.area.superBuiltup)} {item.area?.unit || 'sqft'}</p>}
            {item.area?.carpet && <p><span className="font-medium">Carpet:</span> {formatNumber(item.area.carpet)} {item.area?.unit || 'sqft'}</p>}
            {item.area?.plot && <p><span className="font-medium">Plot:</span> {formatNumber(item.area.plot)} {item.area?.unit || 'sqft'}</p>}
          </div>
        </div>
      )}

      {/* FINANCIAL DETAILS */}
      {hasData(item.financial) && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">💰 Financial</h3>
          <div className="space-y-2">
            {item.financial?.price && (
              <div className="p-2 bg-green-50 rounded border border-green-200">
                <p className="text-green-900 font-bold">₹ {formatNumber(item.financial.price)}</p>
                {item.financial?.pricePerSqft && (
                  <p className="text-xs text-green-700">₹ {formatNumber(item.financial.pricePerSqft)}/sqft</p>
                )}
              </div>
            )}
            {item.financial?.rent && (
              <p className="text-sm"><span className="font-medium">Rent:</span> ₹ {formatNumber(item.financial.rent)}/month</p>
            )}
            {item.financial?.deposit && (
              <p className="text-sm"><span className="font-medium">Deposit:</span> ₹ {formatNumber(item.financial.deposit)}</p>
            )}
            {item.financial?.maintenance && (
              <p className="text-sm"><span className="font-medium">Maintenance:</span> ₹ {formatNumber(item.financial.maintenance)} {item.financial?.maintenanceIncluded ? '(Included)' : ''}</p>
            )}
            {item.financial?.bookingAmount && (
              <p className="text-sm"><span className="font-medium">Booking Amount:</span> ₹ {formatNumber(item.financial.bookingAmount)}</p>
            )}
            {item.financial?.tpr && (
              <p className="text-sm"><span className="font-medium">TPR:</span> ₹ {formatNumber(item.financial.tpr)}</p>
            )}
            {item.financial?.assuredIncome && (
              <p className="text-sm text-green-700"><span className="font-medium">✓ Assured Income</span></p>
            )}
          </div>
        </div>
      )}

      {/* BUILDING DETAILS */}
      {hasData(item.building) && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">🏢 Building</h3>
          <div className="space-y-1 text-sm text-gray-700">
            {item.building?.totalFloors && <p><span className="font-medium">Total Floors:</span> {item.building.totalFloors}</p>}
            {item.building?.propertyAge && <p><span className="font-medium">Property Age:</span> {item.building.propertyAge} years</p>}
            {item.building?.facing && <p><span className="font-medium">Facing:</span> {item.building.facing}</p>}
            {item.building?.roadWidth && <p><span className="font-medium">Road Width:</span> {item.building.roadWidth}m</p>}
            {item.building?.furnishing && <p><span className="font-medium">Furnishing:</span> <span className="capitalize">{item.building.furnishing.replace('-', ' ')}</span></p>}
          </div>
        </div>
      )}

      {/* AMENITIES */}
      {hasData(item.amenities) && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">✨ Amenities</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {item.amenities?.lift && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">✓ Lift</span>}
            {item.amenities?.parking && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">✓ Parking ({item.amenities.parking})</span>}
            {item.amenities?.gated && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">✓ Gated</span>}
            {item.amenities?.corner && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">✓ Corner Plot</span>}
            {item.amenities?.basement && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">✓ Basement</span>}
            {item.amenities?.parkFacing && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">✓ Park Facing</span>}
            {item.amenities?.poolFacing && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">✓ Pool Facing</span>}
            {item.amenities?.wideRoad && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">✓ Wide Road</span>}
          </div>
        </div>
      )}

      {/* LEGAL */}
      {hasData(item.legal) && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">⚖️ Legal</h3>
          <div className="space-y-1 text-sm">
            {item.legal?.nocAvailable && <p className="text-green-700">✓ NOC Available</p>}
            {item.legal?.registryAvailable && <p className="text-green-700">✓ Registry Available</p>}
            {item.legal?.freeHold && <p className="text-green-700">✓ Free Hold</p>}
          </div>
        </div>
      )}

      {/* MEDIA */}
      {hasData(item.media) && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">📸 Media</h3>
          <div className="space-y-1 text-sm">
            {item.media?.photosAvailable && <p className="text-blue-700">📷 Photos Available</p>}
            {item.media?.videosAvailable && <p className="text-blue-700">🎥 Videos Available</p>}
          </div>
        </div>
      )}

      {/* PROJECT INFO */}
      {hasData(item.project) && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">🏗️ Project</h3>
          <div className="space-y-1 text-sm text-gray-700">
            {item.project?.name && <p><span className="font-medium">Name:</span> {item.project.name}</p>}
            {item.project?.developer && <p><span className="font-medium">Developer:</span> {item.project.developer}</p>}
            {item.project?.unitTag && <p><span className="font-medium">Unit Tag:</span> {item.project.unitTag}</p>}
          </div>
        </div>
      )}

      {/* REQUIREMENT (For requirement listings) */}
      {item.listingType === 'requirement' && hasData(item.requirement) && (
        <div className="mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">🔍 Requirement Details</h3>
          <div className="space-y-1 text-sm text-yellow-900">
            {item.requirement?.project && <p><span className="font-medium">Project:</span> {item.requirement.project}</p>}
            {item.requirement?.towers && item.requirement.towers.length > 0 && (
              <p><span className="font-medium">Towers:</span> {item.requirement.towers.join(', ')}</p>
            )}
            {item.requirement?.units && item.requirement.units.length > 0 && (
              <p><span className="font-medium">Units:</span> {item.requirement.units.join(', ')}</p>
            )}
            {item.requirement?.minFloor && <p><span className="font-medium">Min Floor:</span> {item.requirement.minFloor}</p>}
            {item.requirement?.premiumBudget?.min && (
              <p><span className="font-medium">Budget Range:</span> ₹ {formatNumber(item.requirement.premiumBudget.min)} - ₹ {formatNumber(item.requirement.premiumBudget.max)}</p>
            )}
          </div>
        </div>
      )}

      {/* BROKER INFO */}
      {hasData(item.sourceMeta) && (
        <div className="border-t pt-3 mt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">👤 Source Information</h3>
          <div className="space-y-1 text-sm text-gray-700">
            {item.sourceMeta?.brokerName && <p><span className="font-medium">Broker:</span> {item.sourceMeta.brokerName}</p>}
            {item.sourceMeta?.phone && <p><span className="font-medium">📞 Phone:</span> <a href={`tel:${item.sourceMeta.phone}`} className="text-blue-600 hover:underline">{item.sourceMeta.phone}</a></p>}
            {item.sourceMeta?.companyName && <p><span className="font-medium">Company:</span> {item.sourceMeta.companyName}</p>}
            {/* {item.sourceMeta?.groupId && <p><span className="font-medium">Group ID:</span> {item.sourceMeta.groupId}</p>} */}
            {item.sourceMeta?.receivedAt && <p><span className="font-medium">Received:</span> {new Date(item.sourceMeta.receivedAt).toLocaleDateString('en-IN')}</p>}
          </div>
        </div>
      )}

      {/* CONDITION */}
      {hasData(item.condition) && (
        <div className="mt-3 flex gap-2 text-xs">
          {item.condition?.newlyBuilt && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">🆕 Newly Built</span>}
          {item.condition?.renovated && <span className="bg-green-100 text-green-800 px-2 py-1 rounded">♻️ Renovated</span>}
        </div>
      )}

      {/* RAW MESSAGE (if no other data) */}
      {!hasData({ ...item, listingType: null, segment: null, type: null, transactionType: null }) && item.rawMessage && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-700">
          <p className="text-xs font-semibold text-gray-600 mb-1">Raw Message:</p>
          <p>{item.rawMessage}</p>
        </div>
      )}

    </div>
  );
}