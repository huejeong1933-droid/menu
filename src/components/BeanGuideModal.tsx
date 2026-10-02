import React, { useState } from 'react';
import { ALL_BEANS, ROAST_STAGES } from '../data/coffeeData';
import { X, BookOpen, Flame, Globe2, Sparkles, Droplets } from 'lucide-react';

interface BeanGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeanGuideModal: React.FC<BeanGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'beans' | 'roast' | 'processing'>('beans');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xs px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-800" />
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                스페셜티 커피 & 원두 도감
              </h3>
              <p className="text-xs text-stone-500">
                산지별 떼루아, 8단계 로스팅 스펙트럼 및 가공 방식 가이드
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigator */}
        <div className="px-6 pt-4 border-b border-stone-200 bg-stone-50/50">
          <div className="flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => setActiveTab('beans')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'beans'
                  ? 'border-amber-800 text-amber-900 font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              매장 사용 원두 컬렉션 ({Object.keys(ALL_BEANS).length})
            </button>
            <button
              onClick={() => setActiveTab('roast')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'roast'
                  ? 'border-amber-800 text-amber-900 font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              8단계 로스팅 스펙트럼
            </button>
            <button
              onClick={() => setActiveTab('processing')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'processing'
                  ? 'border-amber-800 text-amber-900 font-semibold'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              생두 가공 방식 (Processing)
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'beans' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(ALL_BEANS).map((bean) => (
                <div
                  key={bean.id}
                  className="p-4 rounded-xl border border-stone-200 bg-[#FAF8F5] space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-stone-900 text-amber-100 uppercase">
                          {bean.roastLevel} ({bean.roastScore}/8)
                        </span>
                        {bean.priceDiff ? (
                          <span className="text-[10px] text-amber-800 font-semibold">
                            +₩{bean.priceDiff}
                          </span>
                        ) : null}
                      </div>
                      <h4 className="text-base font-bold text-stone-900 mt-1 font-serif">
                        {bean.nameKo}
                      </h4>
                      <p className="text-xs text-stone-500 font-mono">{bean.nameEn}</p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">
                    {bean.description}
                  </p>

                  <div className="pt-2 border-t border-stone-200/80 text-[11px] space-y-1">
                    <div>
                      <strong className="text-stone-600">원산지:</strong>{' '}
                      <span className="text-stone-800">{bean.origin}</span>
                    </div>
                    <div>
                      <strong className="text-stone-600">가공:</strong>{' '}
                      <span className="text-stone-800">{bean.processing}</span>
                    </div>
                    <div>
                      <strong className="text-stone-600">노트:</strong>{' '}
                      <span className="text-amber-900 font-medium">
                        {bean.flavorNotes.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'roast' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                원두는 생두에 가해지는 열과 시간에 따라 화학적 변화를 거치며 풋내에서 과일 산미,
                카라멜 단맛, 그리고 묵직한 카카오 스모키 풍미로 진화합니다.
              </p>
              <div className="space-y-2.5">
                {ROAST_STAGES.map((stg) => (
                  <div
                    key={stg.stage}
                    className="p-3.5 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: stg.color }}
                        className="w-10 h-10 rounded-lg shrink-0 shadow-inner border border-black/10 flex items-center justify-center text-white font-mono text-xs font-bold"
                      >
                        {stg.stage}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-900">{stg.nameKo}</h4>
                          <span className="text-xs text-stone-400 font-mono">
                            {stg.nameEn}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">{stg.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'processing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                  <Droplets className="w-3.5 h-3.5" /> 워시드 (Washed / 수세식)
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  커피 체리의 과육을 물로 깨끗이 씻어내어 발효조에서 점액질을 제거한 뒤 건조합니다.
                  잡미 없이 투명하고 선명한 산미와 깔끔한 클린컵(Clean Cup)이 특징입니다.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  <Sparkles className="w-3.5 h-3.5" /> 내추럴 (Natural / 건식)
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  수확한 커피 체리를 과육째 햇볕에 통째로 말리는 전통 방식입니다. 과육의 당분이
                  생두 내부로 스며들어 진한 와인 같은 발효 과일향과 묵직한 바디감을 선사합니다.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100/60 px-2 py-0.5 rounded">
                  <Globe2 className="w-3.5 h-3.5" /> 펄프드 내추럴 / 허니 (Honey)
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  외피만 벗겨내고 꿀처럼 끈적이는 과육 점액질을 남긴 상태로 건조합니다. 워시드의
                  깔끔함과 내추럴의 풍부한 단맛을 결합하여 라떼 음료에 최적입니다.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  <Droplets className="w-3.5 h-3.5" /> 스위스 워터 디카페인 (Swiss Water)
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  화학 용매를 일체 배제하고 삼투압과 탄소 필터를 이용해 순수한 물로만 카페인을
                  99.9% 추출합니다. 풍미 손실을 최소화하여 원두 고유의 맛을 지켜냅니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
