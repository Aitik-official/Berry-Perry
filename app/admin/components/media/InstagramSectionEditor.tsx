'use client'

import React from 'react'
import { ImageAssetCard } from '../AssetCards'
import type { SiteMediaAssets, InstagramSectionConfig } from '@/lib/site-assets'
import { defaultInstagramSection } from '@/lib/site-assets'

interface InstagramSectionEditorProps {
  mediaAssets: SiteMediaAssets
  saveMediaAssets: (assets: SiteMediaAssets) => void
}

export function InstagramSectionEditor({
  mediaAssets,
  saveMediaAssets,
}: InstagramSectionEditorProps) {
  const insta: InstagramSectionConfig = mediaAssets.instagramSection || defaultInstagramSection

  const updateInsta = (updates: Partial<InstagramSectionConfig>) => {
    saveMediaAssets({
      ...mediaAssets,
      instagramSection: {
        ...insta,
        ...updates,
      },
    })
  }

  return (
    <section id="sec-instagram" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#EB008B]">
            Section 06 • Social Proof &amp; Feed
          </span>
          <h3 className="text-base font-black uppercase tracking-tight text-[#080d2d]">
            Instagram Grid &amp; Community Carousel
          </h3>
          <p className="text-xs text-slate-400">
            Control the 10-photo live Instagram showcase, custom handle, and section toggle.
          </p>
        </div>

        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
          <input
            type="checkbox"
            checked={insta.enabled}
            onChange={(e) => updateInsta({ enabled: e.target.checked })}
            className="accent-[#EB008B] size-4 rounded"
          />
          <span className="text-xs font-bold text-slate-700">Section Enabled</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
          <input
            type="text"
            value={insta.title}
            onChange={(e) => updateInsta({ title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
            placeholder="We're on Instagram"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Instagram Handle</label>
          <input
            type="text"
            value={insta.handle}
            onChange={(e) => updateInsta({ handle: e.target.value })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
            placeholder="@adornthemes"
          />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-[#080d2d] mb-3">
          Instagram Posts (10 Photos)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {(insta.images || []).map((imgSrc: string, idx: number) => (
            <ImageAssetCard
              key={idx}
              label={`Post #${idx + 1}`}
              sublabel={`Photo ${idx + 1}`}
              currentSrc={imgSrc}
              aspectRatio="aspect-square"
              onUpdate={(newSrc) => {
                const updated = [...(insta.images || [])]
                updated[idx] = newSrc
                updateInsta({ images: updated })
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
