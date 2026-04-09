import React from 'react';

export default function PropertyCard({ item }: any) {
  // Helper function to format currency
  const formatCurrency = (value: number | undefined) => {
    if (!value && value !== 0) return 'N/A';
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value?.toLocaleString()}`;
  };

  // Helper function to render field only if it has value
  const renderField = (label: string, value: any, icon?: string, isCurrency = false) => {
    if (value === null || value === undefined || value === '') return null;
    
    const displayValue = isCurrency ? formatCurrency(value) : value;
    
    return (
      <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
        <span className="text-sm text-gray-600 flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          {label}
        </span>
        <span className="text-sm font-semibold text-gray-800">{displayValue}</span>
      </div>
    );
  };

  // Check if card has essential data
  const hasEssentialData = item?.address || item?.type || item?.financial?.price;

  if (!hasEssentialData) {
    return null;
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Main Card Container */}
      <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {item.address?.locality || 'Property'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {item.address?.society && `${item.address.society} • `}
                {item.address?.city || 'Location'}
              </p>
            </div>
            <div className="flex gap-2">
              {item.listingType && (
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  {item.listingType.toUpperCase()}
                </span>
              )}
              {item.segment && (
                <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                  {item.segment.toUpperCase()}
                </span>
              )}
            </div>
          </div>
          
          {/* Property Type & Transaction Type */}
          <div className="flex items-center gap-3 text-sm">
            {item.type && (
              <div className="px-3 py-1 bg-white rounded-lg text-gray-700 font-medium">
                {item.type}
              </div>
            )}
            {item.transactionType && (
              <div className="px-3 py-1 bg-white rounded-lg text-gray-700 font-medium">
                {item.transactionType === 'sell' && '🏷️ Sell'}
                {item.transactionType === 'rent' && '🔑 Rent'}
                {item.transactionType === 'buy' && '💳 Buy'}
                {item.transactionType === 'selfRent' && '🏠 Self Rent'}
              </div>
            )}
          </div>
        </div>

        {/* Price Section - Prominent */}
        {item.financial?.price && (
          <div className="px-6 py-5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <p className="text-xs text-gray-600 mb-1">Total Price</p>
            <p className="text-4xl font-black text-green-600">
              {formatCurrency(item.financial.price)}
            </p>
            {item.financial?.pricePerSqft && (
              <p className="text-xs text-gray-600 mt-2">
                ₹{item.financial.pricePerSqft.toLocaleString()} per sqft
              </p>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="px-6 py-5">
          
          {/* Configuration Section */}
          {(item.configuration?.bedrooms || item.configuration?.bathrooms) && (
            <div className="mb-5">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                Configuration
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {item.configuration?.bedrooms !== null && item.configuration?.bedrooms !== undefined && (
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">{item.configuration.bedrooms}</p>
                    <p className="text-xs text-gray-600 mt-1">Bedrooms</p>
                  </div>
                )}
                {item.configuration?.bathrooms !== null && item.configuration?.bathrooms !== undefined && (
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-purple-600">{item.configuration.bathrooms}</p>
                    <p className="text-xs text-gray-600 mt-1">Bathrooms</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Area Section */}
          {(item.area?.superBuiltup || item.area?.carpet || item.area?.plot) && (
            <div className="mb-5">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                Area Details
              </h3>
              <div className="space-y-2">
                {item.area?.superBuiltup && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Super Built-up</span>
                    <span className="font-semibold text-gray-900">
                      {item.area.superBuiltup.toLocaleString()} {item.area?.unit || 'sqft'}
                    </span>
                  </div>
                )}
                {item.area?.carpet && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Carpet Area</span>
                    <span className="font-semibold text-gray-900">
                      {item.area.carpet.toLocaleString()} {item.area?.unit || 'sqft'}
                    </span>
                  </div>
                )}
                {item.area?.plot && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Plot Area</span>
                    <span className="font-semibold text-gray-900">
                      {item.area.plot.toLocaleString()} {item.area?.unit || 'sqft'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Financial Details */}
          {(item.financial?.rent || item.financial?.maintenance || item.financial?.bookingAmount) && (
            <div className="mb-5">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                Financial Details
              </h3>
              <div className="space-y-2">
                {item.financial?.rent && (
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm text-gray-600">Monthly Rent</span>
                    <span className="font-semibold text-orange-600">{formatCurrency(item.financial.rent)}</span>
                  </div>
                )}
                {item.financial?.maintenance && (
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm text-gray-600">Maintenance</span>
                    <span className="font-semibold text-orange-600">{formatCurrency(item.financial.maintenance)}</span>
                  </div>
                )}
                {item.financial?.bookingAmount && (
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm text-gray-600">Booking Amount</span>
                    <span className="font-semibold text-orange-600">{formatCurrency(item.financial.bookingAmount)}</span>
                  </div>
                )}
                {item.financial?.bookingRate && (
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm text-gray-600">Booking Rate (%)</span>
                    <span className="font-semibold text-orange-600">{item.financial.bookingRate}%</span>
                  </div>
                )}
                {item.financial?.tpr && (
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm text-gray-600">TPR (%)</span>
                    <span className="font-semibold text-orange-600">{item.financial.tpr}%</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Building Details */}
          {(item.building?.totalFloors || item.building?.propertyAge || item.building?.facing || item.building?.roadWidth || item.building?.furnishing) && (
            <div className="mb-5">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                Building Details
              </h3>
              <div className="space-y-2">
                {item.building?.totalFloors && (
                  <div className="flex justify-between items-center p-2">
                    <span className="text-sm text-gray-600">Total Floors</span>
                    <span className="font-semibold text-gray-900">{item.building.totalFloors}</span>
                  </div>
                )}
                {item.address?.floor && (
                  <div className="flex justify-between items-center p-2">
                    <span className="text-sm text-gray-600">Floor Number</span>
                    <span className="font-semibold text-gray-900">{item.address.floor}</span>
                  </div>
                )}
                {item.address?.floorType && (
                  <div className="flex justify-between items-center p-2">
                    <span className="text-sm text-gray-600">Floor Type</span>
                    <span className="font-semibold text-gray-900 capitalize">{item.address.floorType}</span>
                  </div>
                )}
                {item.building?.propertyAge && (
                  <div className="flex justify-between items-center p-2">
                    <span className="text-sm text-gray-600">Property Age</span>
                    <span className="font-semibold text-gray-900">{item.building.propertyAge} years</span>
                  </div>
                )}
                {item.building?.facing && (
                  <div className="flex justify-between items-center p-2">
                    <span className="text-sm text-gray-600">Facing</span>
                    <span className="font-semibold text-gray-900 capitalize">{item.building.facing}</span>
                  </div>
                )}
                {item.building?.roadWidth && (
                  <div className="flex justify-between items-center p-2">
                    <span className="text-sm text-gray-600">Road Width</span>
                    <span className="font-semibold text-gray-900">{item.building.roadWidth}ft</span>
                  </div>
                )}
                {item.building?.furnishing && (
                  <div className="flex justify-between items-center p-2">
                    <span className="text-sm text-gray-600">Furnishing</span>
                    <span className="font-semibold text-gray-900 capitalize">{item.building.furnishing}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Amenities & Features */}
          {(item.amenities || item.condition || item.plotDetails) && (
            <div className="mb-5">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                Features & Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.amenities?.lift && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">🛗 Lift</span>}
                {item.amenities?.parking && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">🅿️ Parking ({item.amenities.parking})</span>}
                {item.amenities?.gated && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">🚪 Gated</span>}
                {item.amenities?.corner && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">📐 Corner</span>}
                {item.amenities?.basement && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">⬇️ Basement</span>}
                {item.amenities?.parkFacing && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">🌳 Park Facing</span>}
                {item.amenities?.poolFacing && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">🏊 Pool Facing</span>}
                {item.amenities?.wideRoad && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">🛣️ Wide Road</span>}
                {item.condition?.renovated && <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">✨ Renovated</span>}
                {item.condition?.newlyBuilt && <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">🆕 Newly Built</span>}
              </div>
            </div>
          )}

          {/* Legal & Payment Details */}
          {(item.legal || item.payment) && (
            <div className="mb-5">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                Legal & Payment
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.legal?.nocAvailable && <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">📄 NOC Available</span>}
                {item.legal?.registryAvailable && <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">✅ Registry Available</span>}
                {item.legal?.freeHold && <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">🏛️ Freehold</span>}
                {item.payment?.maintenanceIncluded && <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">🔧 Maintenance Included</span>}
                {item.payment?.assuredIncome && <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">💰 Assured Income</span>}
              </div>
            </div>
          )}

          {/* Media Availability */}
          {(item.media?.photosAvailable || item.media?.videosAvailable) && (
            <div className="mb-5 p-3 bg-blue-50 rounded-lg flex items-center gap-3">
              {item.media?.photosAvailable && <span className="text-sm font-semibold text-blue-700">📸 Photos Available</span>}
              {item.media?.videosAvailable && <span className="text-sm font-semibold text-blue-700">🎥 Videos Available</span>}
            </div>
          )}

          {/* Plot & Requirement Details */}
          {(item.plotDetails || item.requirement) && (
            <div className="mb-5">
              {item.plotDetails && (
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                    Plot Details
                  </h3>
                  <div className="space-y-2">
                    {item.plotDetails.openSides && (
                      <div className="flex justify-between items-center p-2">
                        <span className="text-sm text-gray-600">Open Sides</span>
                        <span className="font-semibold text-gray-900">{item.plotDetails.openSides}</span>
                      </div>
                    )}
                    {item.plotDetails.roadFront && (
                      <div className="flex justify-between items-center p-2">
                        <span className="text-sm text-gray-600">Road Front</span>
                        <span className="font-semibold text-gray-900">{item.plotDetails.roadFront}ft</span>
                      </div>
                    )}
                    {item.plotDetails.floors && (
                      <div className="flex justify-between items-center p-2">
                        <span className="text-sm text-gray-600">Approved Floors</span>
                        <span className="font-semibold text-gray-900">{item.plotDetails.floors}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {item.requirement && (
                <div>
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
                    Requirements
                  </h3>
                  <div className="space-y-2">
                    {item.requirement.project && (
                      <div className="flex justify-between items-center p-2">
                        <span className="text-sm text-gray-600">Project</span>
                        <span className="font-semibold text-gray-900">{item.requirement.project}</span>
                      </div>
                    )}
                    {item.requirement.towers && (
                      <div className="p-2">
                        <span className="text-sm text-gray-600">Towers: </span>
                        <span className="font-semibold text-gray-900">{item.requirement.towers?.join(', ')}</span>
                      </div>
                    )}
                    {item.requirement.units && (
                      <div className="p-2">
                        <span className="text-sm text-gray-600">Units: </span>
                        <span className="font-semibold text-gray-900">{item.requirement.units?.join(', ')}</span>
                      </div>
                    )}
                    {item.requirement.minFloor && (
                      <div className="flex justify-between items-center p-2">
                        <span className="text-sm text-gray-600">Floor Requirement</span>
                        <span className="font-semibold text-gray-900">{item.requirement.minFloor}</span>
                      </div>
                    )}
                    {item.requirement.premiumBudget && (
                      <div className="flex justify-between items-center p-2">
                        <span className="text-sm text-gray-600">Premium Budget</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(item.requirement.premiumBudget)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Broker/Source Information Footer */}
        {(item.sourceMeta || item.isActive !== false) && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4 mb-3">
              {item.sourceMeta?.brokerName && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Broker</p>
                  <p className="text-sm font-semibold text-gray-900">👤 {item.sourceMeta.brokerName}</p>
                </div>
              )}
              {item.sourceMeta?.phone && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Contact</p>
                  <p className="text-sm font-semibold text-blue-600">📞 {item.sourceMeta.phone}</p>
                </div>
              )}
              {item.sourceMeta?.companyName && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Company</p>
                  <p className="text-sm font-semibold text-gray-900">{item.sourceMeta.companyName}</p>
                </div>
              )}
              {item.sourceMeta?.source && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Source</p>
                  <p className="text-sm font-semibold text-gray-900">{item.sourceMeta.source}</p>
                </div>
              )}
            </div>
            {item.isActive === false && (
              <div className="p-2 bg-red-100 text-red-700 text-xs font-semibold rounded-lg text-center">
                ⚠️ Inactive Listing
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}