'use client'

import React from 'react'
import { ImageAssetCard } from '../AssetCards'
import type { SiteMediaAssets, WelcomeSectionConfig } from '@/lib/site-assets'
import { defaultWelcomeSection } from '@/lib/site-assets'

interface WelcomeSectionEditorProps {
  mediaAssets: SiteMediaAssets
  saveMediaAssets: (assets: SiteMediaAssets) => void
}

export function WelcomeSectionEditor({
  mediaAssets,
  saveMediaAssets,
}: WelcomeSectionEditorProps) {
  const welcome: WelcomeSectionConfig = mediaAssets.welcomeSection || defaultWelcomeSection

  const updateWelcome = (updates: Partial<WelcomeSectionConfig>) => {
    saveMediaAssets({
      ...mediaAssets,
      welcomeSection: {
        ...welcome,
        ...updates,
      },
    })
  }

  return (
    <section id="sec-welcome" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#EB008B]">
            Section 03 • Homepage Intro &amp; Trust Bar
          </span>
          <h3 className="text-base font-black uppercase tracking-tight text-[#080d2d]">
            Welcome to Toys Shop &amp; Promise Section
          </h3>
          <p className="text-xs text-slate-400">
            Manage the intro narrative, shop image, promise statement, and 4 trust feature badges.
          </p>
        </div>

        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
          <input
            type="checkbox"
            checked={welcome.enabled}
            onChange={(e) => updateWelcome({ enabled: e.target.checked })}
            className="accent-[#EB008B] size-4 rounded"
          />
          <span className="text-xs font-bold text-slate-700">Section Enabled</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <label className="block text-xs font-bold text-slate-700 mb-2">Store Intro Image</label>
          <ImageAssetCard
            label="Toy Store Entrance Image"
            sublabel="Main Feature Visual"
            currentSrc={welcome.image}
            aspectRatio="aspect-[4/3]"
            onUpdate={(newSrc) => updateWelcome({ image: newSrc })}
          />
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Welcome Headline</label>
            <input
              type="text"
              value={welcome.title}
              onChange={(e) => updateWelcome({ title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#EB008B]"
              placeholder="e.g. Welcome to Avone Toys Shop"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Intro Narrative Paragraph</label>
            <textarea
              rows={3}
              value={welcome.description1}
              onChange={(e) => updateWelcome({ description1: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#EB008B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Promise Subheading</label>
            <input
              type="text"
              value={welcome.subheading}
              onChange={(e) => updateWelcome({ subheading: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#EB008B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Promise Narrative</label>
            <textarea
              rows={2}
              value={welcome.description2}
              onChange={(e) => updateWelcome({ description2: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-[#EB008B]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
