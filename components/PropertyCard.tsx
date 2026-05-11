"use client";

import { useState } from 'react';
import Modal from './Modal';
import type { PropertyItem } from '../lib/types';

export default function PropertyCard({ item, displayId }: { item: PropertyItem; displayId?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to format currency
  const formatCurrency = (value: number | undefined) => {
    if (!value && value !== 0) return 'N/A';
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
    return `₹${value?.toLocaleString()}`;
  };

  const transactionLabels: Record<string, string> = {
    sell: '🏷️ Sell',
    rent: '🔑 Rent',
    buy: '💳 Buy',
    selfRent: '🏠 Self Rent',
  };

  // Check if card has essential data
  const hasEssentialData = item?.address || item?.type;

  if (!hasEssentialData) {
    return null;
  }

  const contactName = item.sourceMeta?.name || item.sourceMeta?.brokerName || item.contact?.name || '';
  const phoneNumber = item.sourceMeta?.phone || item.contact?.phone || '';
  const whatsappNumber = phoneNumber.replace(/\D/g, '');
  const transactionLabel = item.transactionType ? transactionLabels[item.transactionType] : undefined;

  return (
    <div className="mx-auto h-full w-full max-w-[430px] sm:max-w-none">
      <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-[0_16px_36px_rgba(15,23,42,0.1)]">
        
        {/* Header Section */}
        <div className="border-b border-stone-100 bg-[linear-gradient(180deg,#fffefa_0%,#faf7f0_100%)] p-4 sm:p-5">
          <div className="flex min-w-0 flex-col gap-3">
            <div className="min-w-0">
              <div className="mb-2 flex min-w-0 items-start justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {item.segment && (
                    <span className="inline-flex min-h-6 items-center rounded-md bg-[#5a3df0] px-2 text-[10px] font-bold uppercase text-white">
                      {item.segment.toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="max-w-[48%] break-all text-right font-mono text-[10px] font-medium leading-4 text-slate-400 sm:max-w-[52%]">
                  ID: {displayId || item.id || item._id || 'N/A'}
                </span>
              </div>
              {transactionLabel && (
                <div className="mb-2 inline-flex min-h-8 items-center rounded-md border border-stone-200 bg-white px-2.5 text-xs font-semibold text-slate-700 shadow-sm sm:text-sm">
                  {transactionLabel}
                </div>
              )}
              <h2 className="max-w-full break-words text-xl font-bold leading-snug text-slate-950 sm:text-2xl">
                📍 {item.address?.locality || 'Property'}
              </h2>
            </div>
          
            {/* Property Type */}
            {item.type && (
              <div className="inline-flex min-h-9 w-fit max-w-full items-center rounded-md border border-stone-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm sm:text-sm">
                🏢 {item.type}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 py-4 sm:px-5 sm:py-5">
          
          {/* Configuration Section */}
          {(item.configuration?.bedrooms || item.configuration?.bathrooms) && (
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-2.5">
                {item.configuration?.bedrooms !== null && item.configuration?.bedrooms !== undefined && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-center">
                    <p className="text-xl font-bold text-[#2157f2] sm:text-2xl">🛏️ {item.configuration.bedrooms}</p>
                    <p className="mt-1 text-[10px] font-medium uppercase text-slate-500 sm:text-xs">Bedrooms</p>
                  </div>
                )}
                {item.configuration?.bathrooms !== null && item.configuration?.bathrooms !== undefined && (
                  <div className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-3 text-center">
                    <p className="text-xl font-bold text-[#6d28d9] sm:text-2xl">🛁 {item.configuration.bathrooms}</p>
                    <p className="mt-1 text-[10px] font-medium uppercase text-slate-500 sm:text-xs">Bathrooms</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Area Section */}
          {(item.area?.superBuiltup || item.area?.carpet || item.area?.plot) && (
            <div className="mb-4">
              <div className="flex flex-col gap-2">
                {item.area?.superBuiltup && (
                  <div className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2">
                    <span className="flex items-center gap-2 text-xs text-slate-600 sm:text-sm">📏 Super Built-up</span>
                    <span className="shrink-0 text-right text-xs font-bold text-slate-900 sm:text-sm">
                      {item.area.superBuiltup.toLocaleString()} {item.area?.unit || 'sqft'}
                    </span>
                  </div>
                )}
                {item.area?.carpet && (
                  <div className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2">
                    <span className="flex items-center gap-2 text-xs text-slate-600 sm:text-sm">📐 Carpet Area</span>
                    <span className="shrink-0 text-right text-xs font-bold text-slate-900 sm:text-sm">
                      {item.area.carpet.toLocaleString()} {item.area?.unit || 'sqft'}
                    </span>
                  </div>
                )}
                {item.area?.plot && (
                  <div className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2">
                    <span className="flex items-center gap-2 text-xs text-slate-600 sm:text-sm">🗺️ Plot Area</span>
                    <span className="shrink-0 text-right text-xs font-bold text-slate-900 sm:text-sm">
                      {item.area.plot.toLocaleString()} {item.area?.unit || 'sqft'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Financial Details */}
          {(item.financial?.rent || item.financial?.maintenance || item.financial?.bookingAmount) && (
            <div className="mb-4">
              <div className="space-y-2">
                {item.financial?.rent && (
                  <div className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-orange-100 bg-orange-50 px-3 py-2">
                    <span className="text-xs text-slate-600 sm:text-sm">Monthly Rent</span>
                    <span className="shrink-0 text-right text-xs font-bold text-orange-600 sm:text-sm">{formatCurrency(item.financial.rent)}</span>
                  </div>
                )}
                {item.financial?.maintenance && (
                  <div className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-orange-100 bg-orange-50 px-3 py-2">
                    <span className="text-xs text-slate-600 sm:text-sm">Maintenance</span>
                    <span className="shrink-0 text-right text-xs font-bold text-orange-600 sm:text-sm">{formatCurrency(item.financial.maintenance)}</span>
                  </div>
                )}
                {item.financial?.bookingAmount && (
                  <div className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-orange-100 bg-orange-50 px-3 py-2">
                    <span className="text-xs text-slate-600 sm:text-sm">Booking Amount</span>
                    <span className="shrink-0 text-right text-xs font-bold text-orange-600 sm:text-sm">{formatCurrency(item.financial.bookingAmount)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Building Details */}
          {(item.building?.totalFloors || item.building?.propertyAge || item.building?.facing || item.building?.roadWidth || item.building?.furnishing) && (
            <div className="mb-4">
              <h3 className="mb-2 text-[10px] font-bold uppercase text-slate-500 sm:text-xs">
                Building Details
              </h3>
              <div className="divide-y divide-stone-100 rounded-lg border border-stone-200 bg-white px-3">
                {item.building?.totalFloors && (
                  <div className="flex min-h-9 items-center justify-between gap-3 py-1.5">
                    <span className="text-xs text-slate-600 sm:text-sm">Total Floors</span>
                    <span className="text-right text-xs font-bold text-slate-900 sm:text-sm">{item.building.totalFloors}</span>
                  </div>
                )}
                {item.address?.floor && (
                  <div className="flex min-h-9 items-center justify-between gap-3 py-1.5">
                    <span className="text-xs text-slate-600 sm:text-sm">Floor Number</span>
                    <span className="text-right text-xs font-bold text-slate-900 sm:text-sm">{item.address.floor}</span>
                  </div>
                )}
                {item.building?.propertyAge && (
                  <div className="flex min-h-9 items-center justify-between gap-3 py-1.5">
                    <span className="text-xs text-slate-600 sm:text-sm">Property Age</span>
                    <span className="text-right text-xs font-bold text-slate-900 sm:text-sm">{item.building.propertyAge} years</span>
                  </div>
                )}
                {item.building?.facing && (
                  <div className="flex min-h-9 items-center justify-between gap-3 py-1.5">
                    <span className="text-xs text-slate-600 sm:text-sm">Facing</span>
                    <span className="text-right text-xs font-bold capitalize text-slate-900 sm:text-sm">{item.building.facing}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Amenities & Features */}
          {(item.amenities || item.condition || item.plotDetails) && (
            <div>
              <h3 className="mb-2 text-[10px] font-bold uppercase text-slate-500 sm:text-xs">
                Features & Amenities
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {item.amenities?.lift && <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 sm:text-xs">🛗 Lift</span>}
                {item.amenities?.parking && <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 sm:text-xs">🅿️ Parking</span>}
                {item.amenities?.gated && <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 sm:text-xs">🚪 Gated</span>}
                {item.amenities?.corner && <span className="rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 sm:text-xs">📐 Corner</span>}
                {item.condition?.renovated && <span className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 sm:text-xs">✨ Renovated</span>}
                {item.condition?.newlyBuilt && <span className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 sm:text-xs">🆕 Newly Built</span>}
              </div>
            </div>
          )}

        </div>

        {/* Broker/Source Information Footer */}
        <div className="mt-auto flex flex-col gap-3 border-t border-stone-100 bg-stone-50/60 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex min-h-10 items-center justify-between gap-3">
            {item.sourceMeta?.brokerName ? (
              <div className="min-w-0">
                <p className="mb-0.5 text-[9px] font-semibold uppercase text-slate-400">Broker</p>
                <p className="truncate text-xs font-bold text-slate-800">{item.sourceMeta.brokerName}</p>
              </div>
            ) : <div/>}

            {phoneNumber && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-[#14202d] px-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#1d2d40] active:scale-95 sm:px-4 sm:text-sm"
              >
                📞 Contact
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Contact Actions">
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex min-h-16 items-center justify-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4 text-center">
            {contactName && (
              <>
                <span className="min-w-0 truncate text-lg font-bold text-slate-900">{contactName}</span>
                <span className="h-5 w-px shrink-0 bg-stone-300" aria-hidden="true" />
              </>
            )}
            <span className="shrink-0 text-lg font-bold text-slate-900">{phoneNumber}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${phoneNumber}`}
              className="flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#2157f2] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(33,87,242,0.3)]"
            >
              📞 Call Now
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(37,211,102,0.3)]"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </Modal>

    </div>
  );
}
