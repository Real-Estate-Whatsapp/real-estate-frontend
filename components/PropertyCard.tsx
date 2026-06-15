"use client";

import { useState } from 'react';
import Modal from './Modal';
import type { PropertyItem } from '../lib/types';

type ViewMode = "list" | "detailed";

export default function PropertyCard({
  item,
  displayId,
  viewMode = "list",
  isFavorited = false,
  onToggleFavorite,
}: {
  item: PropertyItem;
  displayId?: string;
  viewMode?: ViewMode;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}) {
  const [expanded, setExpanded] = useState(viewMode === "detailed");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatCurrency = (value: number | undefined) => {
    if (!value && value !== 0) return null;
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    return `₹${value.toLocaleString()}`;
  };

  const transactionMap: Record<string, string> = {
    sell: 'Sell',
    rent: 'Rent',
    buy: 'Buy',
    selfRent: 'Self Rent',
  };

  if (!item?.address && !item?.type) return null;

  const contactName = item.sourceMeta?.name || item.sourceMeta?.brokerName || item.contact?.name || '';
  const phoneNumber = item.sourceMeta?.phone || item.contact?.phone || '';
  const whatsappNumber = phoneNumber.replace(/\D/g, '');
  const txLabel = item.transactionType ? transactionMap[item.transactionType] : null;

  const areaSummary = item.area?.superBuiltup
    ? `${item.area.superBuiltup.toLocaleString()} ${item.area.unit || 'sqft'}`
    : item.area?.carpet
    ? `${item.area.carpet.toLocaleString()} ${item.area.unit || 'sqft'}`
    : item.area?.plot
    ? `${item.area.plot.toLocaleString()} ${item.area.unit || 'sqft'}`
    : null;

  const hasExpandableContent = !!(
    item.configuration?.bedrooms != null ||
    item.configuration?.bathrooms != null ||
    item.area?.superBuiltup ||
    item.area?.carpet ||
    item.area?.plot ||
    item.financial?.rent ||
    item.financial?.maintenance ||
    item.financial?.bookingAmount ||
    item.building?.totalFloors ||
    item.building?.propertyAge ||
    item.building?.facing ||
    item.building?.roadWidth ||
    item.building?.furnishing ||
    item.address?.floor ||
    item.amenities?.lift ||
    item.amenities?.parking ||
    item.amenities?.gated ||
    item.amenities?.corner ||
    item.condition?.renovated ||
    item.condition?.newlyBuilt ||
    phoneNumber
  );

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl border border-[#22354F] bg-[#132238] shadow-[0_1px_12px_rgba(0,7,20,0.4)] transition-all duration-200 hover:border-[#3B82F6]/25 hover:shadow-[0_4px_20px_rgba(0,7,20,0.6)]">

        {/* ── Card Header ── */}
        <div className="px-4 py-3.5 sm:px-5">

          {/* Row 1 — type badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {item.segment && (
              <span className="inline-flex h-5 items-center rounded-md border border-[#22354F] bg-[#1C3350] px-2 text-[10px] font-bold uppercase tracking-wider text-[#A9B4C2]">
                {item.segment}
              </span>
            )}
            {item.type && (
              <span className="inline-flex h-5 items-center rounded-md border border-[#22354F] px-2 text-[10px] font-medium text-[#A9B4C2]">
                {item.type}
              </span>
            )}
            {txLabel && (
              <span className="inline-flex h-5 items-center rounded-md border border-[#3B82F6]/25 bg-[#3B82F6]/10 px-2 text-[10px] font-semibold text-[#3B82F6]">
                {txLabel}
              </span>
            )}
          </div>

          {/* Row 2 — location (left) · heart · ID · expand (right) */}
          <div className="mt-2.5 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-snug text-white">
                📍 {item.address?.locality || 'Unknown Location'}
              </p>
              {(item.address?.society || areaSummary) && (
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  {item.address?.society && (
                    <span className="text-xs text-[#A9B4C2]">{item.address.society}</span>
                  )}
                  {areaSummary && (
                    <span className="text-xs text-[#A9B4C2]">
                      {item.address?.society && <span className="mr-1 text-[#22354F]">·</span>}
                      {areaSummary}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              {/* Favorite heart */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }}
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                className="flex h-7 w-7 items-center justify-center rounded-full transition-all hover:bg-[#EF4444]/10 active:scale-90"
              >
                {isFavorited ? (
                  <svg className="h-[14px] w-[14px] fill-[#EF4444]" viewBox="0 0 24 24">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                ) : (
                  <svg className="h-[14px] w-[14px] text-[#A9B4C2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                )}
              </button>

              {/* Property ID */}
              <span className="inline-flex items-center rounded-md border border-[#22354F] bg-[#0D1B2D] px-2 py-0.5 font-mono text-[11px] font-bold tracking-wide text-[#3B82F6]">
                {displayId || 'N/A'}
              </span>

              {/* Expand / collapse */}
              {hasExpandableContent && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  aria-label={expanded ? "Collapse" : "Expand"}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[#A9B4C2] transition-all hover:bg-[#1C3350] hover:text-white active:scale-90"
                >
                  <svg
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Accordion body ── */}
        <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <div className="border-t border-[#22354F] px-4 pb-4 pt-3.5 sm:px-5">

              {/* Configuration */}
              {(item.configuration?.bedrooms != null || item.configuration?.bathrooms != null) && (
                <div className="mb-3 grid grid-cols-2 gap-2">
                  {item.configuration?.bedrooms != null && (
                    <div className="rounded-xl bg-[#0D1B2D] px-3 py-3 text-center">
                      <p className="text-sm font-bold text-[#3B82F6]">🛏 {item.configuration.bedrooms}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#A9B4C2]">Bedrooms</p>
                    </div>
                  )}
                  {item.configuration?.bathrooms != null && (
                    <div className="rounded-xl bg-[#0D1B2D] px-3 py-3 text-center">
                      <p className="text-sm font-bold text-[#3B82F6]">🛁 {item.configuration.bathrooms}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-[#A9B4C2]">Bathrooms</p>
                    </div>
                  )}
                </div>
              )}

              {/* Area */}
              {(item.area?.superBuiltup || item.area?.carpet || item.area?.plot) && (
                <div className="mb-3 overflow-hidden rounded-xl border border-[#22354F]">
                  {item.area?.superBuiltup && (
                    <div className="flex items-center justify-between px-3.5 py-2.5">
                      <span className="text-xs text-[#A9B4C2]">Super Built-up</span>
                      <span className="text-xs font-semibold text-white">{item.area.superBuiltup.toLocaleString()} {item.area.unit || 'sqft'}</span>
                    </div>
                  )}
                  {item.area?.carpet && (
                    <div className="flex items-center justify-between border-t border-[#22354F] px-3.5 py-2.5">
                      <span className="text-xs text-[#A9B4C2]">Carpet Area</span>
                      <span className="text-xs font-semibold text-white">{item.area.carpet.toLocaleString()} {item.area.unit || 'sqft'}</span>
                    </div>
                  )}
                  {item.area?.plot && (
                    <div className="flex items-center justify-between border-t border-[#22354F] px-3.5 py-2.5">
                      <span className="text-xs text-[#A9B4C2]">Plot Area</span>
                      <span className="text-xs font-semibold text-white">{item.area.plot.toLocaleString()} {item.area.unit || 'sqft'}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Financial */}
              {(item.financial?.rent || item.financial?.maintenance || item.financial?.bookingAmount) && (
                <div className="mb-3 overflow-hidden rounded-xl border border-[#22354F]">
                  {item.financial?.rent && (
                    <div className="flex items-center justify-between px-3.5 py-2.5">
                      <span className="text-xs text-[#A9B4C2]">Monthly Rent</span>
                      <span className="text-xs font-semibold text-white">{formatCurrency(item.financial.rent)}</span>
                    </div>
                  )}
                  {item.financial?.maintenance && (
                    <div className="flex items-center justify-between border-t border-[#22354F] px-3.5 py-2.5">
                      <span className="text-xs text-[#A9B4C2]">Maintenance</span>
                      <span className="text-xs font-semibold text-white">{formatCurrency(item.financial.maintenance)}</span>
                    </div>
                  )}
                  {item.financial?.bookingAmount && (
                    <div className="flex items-center justify-between border-t border-[#22354F] px-3.5 py-2.5">
                      <span className="text-xs text-[#A9B4C2]">Booking Amount</span>
                      <span className="text-xs font-semibold text-white">{formatCurrency(item.financial.bookingAmount)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Building details */}
              {(item.building?.totalFloors || item.building?.propertyAge || item.building?.facing || item.building?.roadWidth || item.building?.furnishing || item.address?.floor) && (
                <div className="mb-3">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#A9B4C2]">Building</p>
                  <div className="overflow-hidden rounded-xl border border-[#22354F]">
                    {item.building?.totalFloors && (
                      <div className="flex items-center justify-between px-3.5 py-2.5">
                        <span className="text-xs text-[#A9B4C2]">Total Floors</span>
                        <span className="text-xs font-semibold text-white">{item.building.totalFloors}</span>
                      </div>
                    )}
                    {item.address?.floor && (
                      <div className="flex items-center justify-between border-t border-[#22354F] px-3.5 py-2.5">
                        <span className="text-xs text-[#A9B4C2]">Floor</span>
                        <span className="text-xs font-semibold text-white">{item.address.floor}</span>
                      </div>
                    )}
                    {item.building?.propertyAge && (
                      <div className="flex items-center justify-between border-t border-[#22354F] px-3.5 py-2.5">
                        <span className="text-xs text-[#A9B4C2]">Property Age</span>
                        <span className="text-xs font-semibold text-white">{item.building.propertyAge} yr</span>
                      </div>
                    )}
                    {item.building?.facing && (
                      <div className="flex items-center justify-between border-t border-[#22354F] px-3.5 py-2.5">
                        <span className="text-xs text-[#A9B4C2]">Facing</span>
                        <span className="text-xs font-semibold capitalize text-white">{item.building.facing}</span>
                      </div>
                    )}
                    {item.building?.roadWidth && (
                      <div className="flex items-center justify-between border-t border-[#22354F] px-3.5 py-2.5">
                        <span className="text-xs text-[#A9B4C2]">Road Width</span>
                        <span className="text-xs font-semibold text-white">{item.building.roadWidth} ft</span>
                      </div>
                    )}
                    {item.building?.furnishing && (
                      <div className="flex items-center justify-between border-t border-[#22354F] px-3.5 py-2.5">
                        <span className="text-xs text-[#A9B4C2]">Furnishing</span>
                        <span className="text-xs font-semibold capitalize text-white">{item.building.furnishing}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {(item.amenities?.lift || item.amenities?.parking || item.amenities?.gated || item.amenities?.corner || item.condition?.renovated || item.condition?.newlyBuilt) && (
                <div className="mb-3">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#A9B4C2]">Amenities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.amenities?.lift && (
                      <span className="rounded-lg border border-[#22354F] bg-[#1C3350] px-2.5 py-1 text-[11px] font-medium text-[#A9B4C2]">Lift</span>
                    )}
                    {item.amenities?.parking && (
                      <span className="rounded-lg border border-[#22354F] bg-[#1C3350] px-2.5 py-1 text-[11px] font-medium text-[#A9B4C2]">Parking</span>
                    )}
                    {item.amenities?.gated && (
                      <span className="rounded-lg border border-[#22354F] bg-[#1C3350] px-2.5 py-1 text-[11px] font-medium text-[#A9B4C2]">Gated</span>
                    )}
                    {item.amenities?.corner && (
                      <span className="rounded-lg border border-[#22354F] bg-[#1C3350] px-2.5 py-1 text-[11px] font-medium text-[#A9B4C2]">Corner Plot</span>
                    )}
                    {item.condition?.renovated && (
                      <span className="rounded-lg border border-[#22354F] bg-[#1C3350] px-2.5 py-1 text-[11px] font-medium text-[#A9B4C2]">Renovated</span>
                    )}
                    {item.condition?.newlyBuilt && (
                      <span className="rounded-lg border border-[#22354F] bg-[#1C3350] px-2.5 py-1 text-[11px] font-medium text-[#A9B4C2]">Newly Built</span>
                    )}
                  </div>
                </div>
              )}

              {/* Broker + Contact */}
              <div className="flex items-center justify-between gap-3 pt-0.5">
                {item.sourceMeta?.brokerName ? (
                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-[#A9B4C2]">Broker</p>
                    <p className="mt-0.5 truncate text-xs font-semibold text-white">{item.sourceMeta.brokerName}</p>
                  </div>
                ) : <div />}

                {phoneNumber && (
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-[#22354F] bg-[#1C3350] px-4 text-xs font-semibold text-white transition-all hover:border-[#3B82F6]/40 hover:bg-[#22354F] active:scale-95"
                  >
                    Contact
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Contact Actions">
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex min-h-16 items-center justify-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 text-center">
            {contactName && (
              <>
                <span className="min-w-0 truncate text-base font-bold text-slate-900">{contactName}</span>
                <span className="h-5 w-px shrink-0 bg-stone-300" aria-hidden="true" />
              </>
            )}
            <span className="shrink-0 text-base font-bold text-slate-900">{phoneNumber}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${phoneNumber}`}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2157f2] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(33,87,242,0.25)]"
            >
              📞 Call Now
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(37,211,102,0.25)]"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}
