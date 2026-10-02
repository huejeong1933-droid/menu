import React, { useState } from 'react';
import { CoffeeDrink } from '../types/coffee';
import { X, GitCompare, ArrowRight, Flame, Snowflake } from 'lucide-react';

interface DrinkComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  drinks: CoffeeDrink[];
  initialLeftDrinkId: string;
}

export const DrinkComparisonModal: React.FC<DrinkComparisonModalProps> = ({
  isOpen,
  onClose,
  drinks,
  initialLeftDrinkId,
}) => {
  const [leftId, setLeftId] = useState(initialLeftDrinkId);
  const [rightId, setRightId] = useState(
    drinks.find((d) => d.id !== initialLeftDrinkId)?.id || drinks[1]?.id
  );

  if (!isOpen) return null;

  const leftDrink = drinks.find((d) => d.id === leftId) || drinks[0];
  const rightDrink = drinks.find((d) => d.id === rightId) || drinks[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xs px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-amber-800" />
            <h3 className="font-serif text-lg font-bold text-stone-900">
              커피 메뉴 1:1 비교 분석
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Selectors Bar */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1">
                기준 음료 1
              </label>
              <select
                value={leftId}
                onChange={(e) => setLeftId(e.target.value)}
                className="w-full text-sm font-semibold p-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800 cursor-pointer"
              >
                {drinks.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nameKo} ({d.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 mb-1">
                비교 대상 음료 2
              </label>
              <select
                value={rightId}
                onChange={(e) => setRightId(e.target.value)}
                className="w-full text-sm font-semibold p-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800 cursor-pointer"
              >
                {drinks.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nameKo} ({d.nameEn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Side by Side Drink Profiles */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {/* Left Card */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-stone-200">
                <img
                  src={leftDrink.image}
                  alt={leftDrink.nameKo}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-amber-900 uppercase">
                  {leftDrink.categoryLabel}
                </span>
                <h4 className="text-lg font-bold text-stone-900 font-serif">
                  {leftDrink.nameKo}
                </h4>
                <p className="text-xs text-stone-500 font-mono">{leftDrink.nameEn}</p>
                <p className="text-sm font-semibold text-stone-900 mt-1 tabular-nums">
                  ₩{leftDrink.basePrice.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Right Card */}
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-stone-200">
                <img
                  src={rightDrink.image}
                  alt={rightDrink.nameKo}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-amber-900 uppercase">
                  {rightDrink.categoryLabel}
                </span>
                <h4 className="text-lg font-bold text-stone-900 font-serif">
                  {rightDrink.nameKo}
                </h4>
                <p className="text-xs text-stone-500 font-mono">{rightDrink.nameEn}</p>
                <p className="text-sm font-semibold text-stone-900 mt-1 tabular-nums">
                  ₩{rightDrink.basePrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Comparison Metrics Table */}
          <div className="border border-stone-200 rounded-xl overflow-hidden text-xs sm:text-sm">
            <div className="bg-stone-100/80 px-4 py-2 font-bold text-stone-700 text-xs uppercase tracking-wider">
              영양 & 추출 스펙 비교
            </div>
            <div className="divide-y divide-stone-100">
              <div className="grid grid-cols-3 p-3 items-center">
                <span className="font-semibold text-stone-900">{leftDrink.specs.volume}</span>
                <span className="text-center text-xs text-stone-500 font-medium">기준 용량</span>
                <span className="font-semibold text-stone-900 text-right">{rightDrink.specs.volume}</span>
              </div>
              <div className="grid grid-cols-3 p-3 items-center">
                <span className="font-semibold text-stone-900">{leftDrink.specs.caffeine}</span>
                <span className="text-center text-xs text-stone-500 font-medium">카페인 함량</span>
                <span className="font-semibold text-stone-900 text-right">{rightDrink.specs.caffeine}</span>
              </div>
              <div className="grid grid-cols-3 p-3 items-center">
                <span className="font-semibold text-stone-900">{leftDrink.specs.calories}</span>
                <span className="text-center text-xs text-stone-500 font-medium">칼로리</span>
                <span className="font-semibold text-stone-900 text-right">{rightDrink.specs.calories}</span>
              </div>
              <div className="grid grid-cols-3 p-3 items-center">
                <span className="font-semibold text-stone-900">{leftDrink.defaultBean.nameKo}</span>
                <span className="text-center text-xs text-stone-500 font-medium">기본 추출 원두</span>
                <span className="font-semibold text-stone-900 text-right">{rightDrink.defaultBean.nameKo}</span>
              </div>
              <div className="grid grid-cols-3 p-3 items-center">
                <span className="font-semibold text-stone-900">{leftDrink.defaultBean.roastLevel}</span>
                <span className="text-center text-xs text-stone-500 font-medium">로스팅 포인트</span>
                <span className="font-semibold text-stone-900 text-right">{rightDrink.defaultBean.roastLevel}</span>
              </div>
            </div>
          </div>

          {/* Flavor Profile Head-to-Head */}
          <div className="border border-stone-200 rounded-xl p-4 space-y-4">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              테이스팅 프로파일 직접 비교 (5점 척도)
            </h4>
            {[
              { label: '산미 (Acidity)', k1: leftDrink.flavorProfile.acidity, k2: rightDrink.flavorProfile.acidity },
              { label: '바디감 (Body)', k1: leftDrink.flavorProfile.body, k2: rightDrink.flavorProfile.body },
              { label: '단맛 (Sweetness)', k1: leftDrink.flavorProfile.sweetness, k2: rightDrink.flavorProfile.sweetness },
              { label: '쌉싸래함 (Bitterness)', k1: leftDrink.flavorProfile.bitterness, k2: rightDrink.flavorProfile.bitterness },
              { label: '밸런스 (Balance)', k1: leftDrink.flavorProfile.balance, k2: rightDrink.flavorProfile.balance },
            ].map((f, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-amber-900 font-semibold">{leftDrink.nameKo}: {f.k1}</span>
                  <span className="text-stone-600">{f.label}</span>
                  <span className="text-stone-800 font-semibold">{rightDrink.nameKo}: {f.k2}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden flex justify-end">
                    <div
                      style={{ width: `${(f.k1 / 5) * 100}%` }}
                      className="h-full bg-amber-800 rounded-full"
                    />
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(f.k2 / 5) * 100}%` }}
                      className="h-full bg-stone-800 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
