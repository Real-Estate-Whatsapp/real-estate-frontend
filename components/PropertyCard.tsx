"use client";

import { useState } from 'react';
import Modal from './Modal';
import type { PropertyItem } from '../lib/types';

export default function PropertyCard({ item }: { item: PropertyItem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to format currency
  const formatCurrency = (value: number | undefined) => {
    if (!value && value !== 0) return 'N/A';
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value?.toLocaleString()}`;
  };

  // Check if card has essential data
  const hasEssentialData = item?.address || item?.type;

  if (!hasEssentialData) {
    return null;
  }

  const phoneNumber = item.sourceMeta?.phone || item.contact?.phone || '';

  return (
    <div className="mx-auto h-full w-full max-w-lg">
      <div className="group flex h-full flex-col overflow-hidden rounded-[20px] sm:rounded-[28px] border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-md relative">
        
        {/* Header Section */}
        <div className="border-b border-stone-100 bg-stone-50/50 px-3 py-3 sm:px-6 sm:py-6">
          <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] font-mono font-medium text-slate-400">ID: {item._id || item.id || 'N/A'}</span>
              </div>
              <h2 className="max-w-[20ch] text-lg sm:text-2xl font-bold leading-tight sm:leading-[1.1] tracking-tight text-slate-900">
                {item.address?.locality || 'Property'}
              </h2>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500 flex items-center gap-1 line-clamp-1">
                📍 {item.address?.society && `${item.address.society} • `}
                {item.address?.city || 'Location'}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:justify-end">
              {item.listingType && (
                <span className="rounded-md bg-[#2157f2] px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
                  {item.listingType.toUpperCase()}
                </span>
              )}
              {item.segment && (
                <span className="rounded-md bg-[#5a3df0] px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
                  {item.segment.toUpperCase()}
                </span>
              )}
            </div>
          </div>
          
          {/* Property Type & Transaction Type */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            {item.type && (
              <div className="rounded-md sm:rounded-lg border border-stone-200 bg-white px-2 py-1 sm:px-3 sm:py-1.5 font-medium text-slate-700">
                🏢 {item.type}
              </div>
            )}
            {item.transactionType && (
              <div className="rounded-md sm:rounded-lg border border-stone-200 bg-white px-2 py-1 sm:px-3 sm:py-1.5 font-medium text-slate-700">
                {item.transactionType === 'sell' && '🏷️ Sell'}
                {item.transactionType === 'rent' && '🔑 Rent'}
                {item.transactionType === 'buy' && '💳 Buy'}
                {item.transactionType === 'selfRent' && '🏠 Self Rent'}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-3 py-4 sm:px-6 sm:py-6">
          
          {/* Configuration Section */}
          {(item.configuration?.bedrooms || item.configuration?.bathrooms) && (
            <div className="mb-4 sm:mb-6">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {item.configuration?.bedrooms !== null && item.configuration?.bedrooms !== undefined && (
                  <div className="rounded-xl sm:rounded-2xl border border-slate-100 sm:border-slate-200/80 bg-slate-50/50 sm:bg-slate-50 p-2 sm:p-4 text-center">
                    <p className="text-xl sm:text-3xl font-bold sm:font-semibold text-[#2157f2]">🛏️ {item.configuration.bedrooms}</p>
                    <p className="text-[10px] sm:text-xs uppercase sm:capitalize sm:mt-1 text-slate-500">Bedrooms</p>
                  </div>
                )}
                {item.configuration?.bathrooms !== null && item.configuration?.bathrooms !== undefined && (
                  <div className="rounded-xl sm:rounded-2xl border border-violet-100 sm:border-violet-200/80 bg-violet-50/50 sm:bg-violet-50 p-2 sm:p-4 text-center">
                    <p className="text-xl sm:text-3xl font-bold sm:font-semibold text-[#6d28d9]">🛁 {item.configuration.bathrooms}</p>
                    <p className="text-[10px] sm:text-xs uppercase sm:capitalize sm:mt-1 text-slate-500">Bathrooms</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Area Section */}
          {(item.area?.superBuiltup || item.area?.carpet || item.area?.plot) && (
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col gap-1.5 sm:space-y-2">
                {item.area?.superBuiltup && (
                  <div className="flex items-center justify-between rounded-lg sm:rounded-2xl border border-stone-100 sm:border-stone-200/80 bg-stone-50 px-3 py-2 sm:px-4 sm:py-3">
                    <span className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 sm:gap-2">📏 Super Built-up</span>
                    <span className="text-xs sm:text-sm font-bold sm:font-semibold text-slate-900">
                      {item.area.superBuiltup.toLocaleString()} {item.area?.unit || 'sqft'}
                    </span>
                  </div>
                )}
                {item.area?.carpet && (
                  <div className="flex items-center justify-between rounded-lg sm:rounded-2xl border border-stone-100 sm:border-stone-200/80 bg-stone-50 px-3 py-2 sm:px-4 sm:py-3">
                    <span className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 sm:gap-2">📐 Carpet Area</span>
                    <span className="text-xs sm:text-sm font-bold sm:font-semibold text-slate-900">
                      {item.area.carpet.toLocaleString()} {item.area?.unit || 'sqft'}
                    </span>
                  </div>
                )}
                {item.area?.plot && (
                  <div className="flex items-center justify-between rounded-lg sm:rounded-2xl border border-stone-100 sm:border-stone-200/80 bg-stone-50 px-3 py-2 sm:px-4 sm:py-3">
                    <span className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 sm:gap-2">🗺️ Plot Area</span>
                    <span className="text-xs sm:text-sm font-bold sm:font-semibold text-slate-900">
                      {item.area.plot.toLocaleString()} {item.area?.unit || 'sqft'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Financial Details */}
          {(item.financial?.rent || item.financial?.maintenance || item.financial?.bookingAmount) && (
            <div className="mb-4 sm:mb-6">
              <div className="space-y-1.5 sm:space-y-2">
                {item.financial?.rent && (
                  <div className="flex items-center justify-between rounded-lg sm:rounded-2xl bg-orange-50/70 sm:bg-orange-50 px-3 py-2 sm:px-4 sm:py-3">
                    <span className="text-xs sm:text-sm text-slate-600">Monthly Rent</span>
                    <span className="text-xs sm:text-sm sm:font-semibold font-bold text-orange-600">{formatCurrency(item.financial.rent)}</span>
                  </div>
                )}
                {item.financial?.maintenance && (
                  <div className="flex items-center justify-between rounded-lg sm:rounded-2xl bg-orange-50/70 sm:bg-orange-50 px-3 py-2 sm:px-4 sm:py-3">
                    <span className="text-xs sm:text-sm text-slate-600">Maintenance</span>
                    <span className="text-xs sm:text-sm sm:font-semibold font-bold text-orange-600">{formatCurrency(item.financial.maintenance)}</span>
                  </div>
                )}
                {item.financial?.bookingAmount && (
                  <div className="flex items-center justify-between rounded-lg sm:rounded-2xl bg-orange-50/70 sm:bg-orange-50 px-3 py-2 sm:px-4 sm:py-3">
                    <span className="text-xs sm:text-sm text-slate-600">Booking Amount</span>
                    <span className="text-xs sm:text-sm sm:font-semibold font-bold text-orange-600">{formatCurrency(item.financial.bookingAmount)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Building Details */}
          {(item.building?.totalFloors || item.building?.propertyAge || item.building?.facing || item.building?.roadWidth || item.building?.furnishing) && (
            <div className="mb-4 sm:mb-6">
              <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 sm:text-gray-700 uppercase tracking-wider mb-2 sm:mb-3">
                Building Details
              </h3>
              <div className="space-y-0.5 sm:space-y-1.5">
                {item.building?.totalFloors && (
                  <div className="flex justify-between items-center py-1 sm:py-1.5">
                    <span className="text-xs sm:text-sm text-slate-500 sm:text-slate-600">Total Floors</span>
                    <span className="text-xs sm:text-sm sm:font-semibold font-bold text-slate-800 sm:text-slate-900">{item.building.totalFloors}</span>
                  </div>
                )}
                {item.address?.floor && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs text-slate-500">Floor Number</span>
                    <span className="text-xs font-bold text-slate-800">{item.address.floor}</span>
                  </div>
                )}
                {item.building?.propertyAge && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs text-slate-500">Property Age</span>
                    <span className="text-xs font-bold text-slate-800">{item.building.propertyAge} years</span>
                  </div>
                )}
                {item.building?.facing && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs text-slate-500">Facing</span>
                    <span className="text-xs font-bold text-slate-800 capitalize">{item.building.facing}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Amenities & Features */}
          {(item.amenities || item.condition || item.plotDetails) && (
            <div className="mb-2 sm:mb-5">
              <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 sm:text-gray-700 uppercase tracking-wider mb-2 mt-2 sm:mt-0 sm:mb-3">
                Features & Amenities
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {item.amenities?.lift && <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-emerald-50 sm:bg-emerald-100 text-emerald-700 border sm:border-0 border-emerald-100 text-[10px] sm:text-xs font-bold sm:font-semibold rounded-md sm:rounded-full">🛗 Lift</span>}
                {item.amenities?.parking && <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-emerald-50 sm:bg-emerald-100 text-emerald-700 border sm:border-0 border-emerald-100 text-[10px] sm:text-xs font-bold sm:font-semibold rounded-md sm:rounded-full">🅿️ Parking</span>}
                {item.amenities?.gated && <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-emerald-50 sm:bg-emerald-100 text-emerald-700 border sm:border-0 border-emerald-100 text-[10px] sm:text-xs font-bold sm:font-semibold rounded-md sm:rounded-full">🚪 Gated</span>}
                {item.amenities?.corner && <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-emerald-50 sm:bg-emerald-100 text-emerald-700 border sm:border-0 border-emerald-100 text-[10px] sm:text-xs font-bold sm:font-semibold rounded-md sm:rounded-full">📐 Corner</span>}
                {item.condition?.renovated && <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-50 sm:bg-blue-100 text-blue-700 border sm:border-0 border-blue-100 text-[10px] sm:text-xs font-bold sm:font-semibold rounded-md sm:rounded-full">✨ Renovated</span>}
                {item.condition?.newlyBuilt && <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-50 sm:bg-blue-100 text-blue-700 border sm:border-0 border-blue-100 text-[10px] sm:text-xs font-bold sm:font-semibold rounded-md sm:rounded-full">🆕 Newly Built</span>}
              </div>
            </div>
          )}

        </div>

        {/* Broker/Source Information Footer */}
        <div className="mt-auto border-t border-stone-100 bg-stone-50/30 px-3 py-3 sm:px-6 sm:py-4 flex flex-col gap-2 sm:gap-3">
          <div className="flex items-center justify-between">
            {item.sourceMeta?.brokerName ? (
              <div>
                <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400">Broker</p>
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.sourceMeta.brokerName}</p>
              </div>
            ) : <div/>}

            {phoneNumber && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded-lg sm:rounded-xl bg-[#14202d] px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold sm:font-semibold text-white shadow-sm transition hover:bg-[#1d2d40] active:scale-95 sm:hover:-translate-y-0.5 flex items-center gap-1.5 sm:gap-2"
              >
                📞 Contact
              </button>
            )}
          </div>
          <div className="text-center pt-1.5 border-t border-stone-200/50 w-full mt-1">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">Powered by Terragi</span>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Contact Actions">
        <div className="flex flex-col gap-4 mt-4">
          <div className="rounded-2xl bg-stone-50 p-4 text-center border border-stone-200">
            <p className="text-sm text-stone-500 mb-1">Phone Number</p>
            <p className="text-lg font-bold text-slate-900">{phoneNumber}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#2157f2] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(33,87,242,0.3)]"
            >
              📞 Call Now
            </a>
            <a
              href={`https://wa.me/${phoneNumber.replace(/\\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(37,211,102,0.3)]"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </Modal>

    </div>
  );
}
