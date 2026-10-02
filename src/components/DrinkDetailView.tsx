import React, { useState, useEffect } from 'react';
import { CoffeeDrink, BeanInfo, CustomizationState } from '../types/coffee';
import {
  Flame,
  Snowflake,
  Layers,
  Sparkles,
  Info,
  Check,
  Plus,
  ShoppingBag,
  Clock,
  Gauge,
  Thermometer,
  Zap,
  Activity,
  Award,
  ChevronRight,
} from 'lucide-react';

interface DrinkDetailViewProps {
  drink: CoffeeDrink;
  onAddToCart: (drink: CoffeeDrink, custom: CustomizationState, price: number) => void;
  onOpenBeanGuide: () => void;
  onOpenCompareWith: (drink: CoffeeDrink) => void;
}

export const DrinkDetailView: React.FC<DrinkDetailViewProps> = ({
  drink,
  onAddToCart,
  onOpenBeanGuide,
  onOpenCompareWith,
}) => {
  // Customization State
  const [temp, setTemp] = useState<'HOT' | 'ICE'>(drink.defaultTemp);
  const [size, setSize] = useState<'short' | 'regular' | 'large'>('regular');
  const [selectedBeanId, setSelectedBeanId] = useState<string>(drink.defaultBean.id);
  const [milkId, setMilkId] = useState<'regular' | 'oat' | 'lowfat' | 'soy'>('regular');
  const [shotId, setShotId] = useState<'standard' | 'light' | 'extra'>('standard');
  const [sweetnessId, setSweetnessId] = useState<'low' | 'standard' | 'high'>('standard');
  
  // UI Tabs for visual card
  const [visualMode, setVisualMode] = useState<'photo' | 'layers'>('photo');
  const [addedToast, setAddedToast] = useState(false);

  // Sync state on drink change
  useEffect(() => {
    setTemp(drink.defaultTemp);
    setSize('regular');
    setSelectedBeanId(drink.defaultBean.id);
    setMilkId('regular');
    setShotId('standard');
    setSweetnessId('standard');
    setVisualMode('photo');
  }, [drink.id, drink.defaultTemp, drink.defaultBean.id]);

  // Find currently selected bean
  const currentBean: BeanInfo =
    drink.selectableBeans.find((b) => b.id === selectedBeanId) || drink.defaultBean;

  // Price Calculation
  const sizePriceDiff = size === 'short' ? -500 : size === 'large' ? 700 : 0;
  const beanPriceDiff = currentBean.priceDiff || 0;
  const milkPriceDiff = milkId === 'oat' ? 500 : 0;
  const shotPriceDiff = shotId === 'extra' ? 500 : 0;
  const totalPrice = drink.basePrice + sizePriceDiff + beanPriceDiff + milkPriceDiff + shotPriceDiff;

  const handleAddToCart = () => {
    const custom: CustomizationState = {
      temp,
      size,
      beanId: selectedBeanId,
      milkId,
      shotId,
      sweetnessId,
    };
    onAddToCart(drink, custom, totalPrice);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  const getScoreWidth = (score: number) => {
    return `${(score / 5) * 100}%`;
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden transition-all duration-300">
      {/* Section 1: Hero & Media + Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-stone-200">
        {/* Left Column: Visual Showcase (Photo vs Layer Cross-section) */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-stone-50/50 border-b lg:border-b-0 lg:border-r border-stone-200">
          <div>
            {/* Visual Mode Switcher (Photo / Layer Architecture) */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-amber-900 font-bold">
                  {drink.categoryLabel}
                </span>
                <span className="text-stone-300">·</span>
                <span className="text-xs text-stone-500 font-mono">{drink.nameEn}</span>
              </div>

              <div className="inline-flex p-0.5 bg-stone-200/70 rounded-lg text-xs">
                <button
                  onClick={() => setVisualMode('photo')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    visualMode === 'photo'
                      ? 'bg-white text-stone-900 shadow-xs font-medium'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  포토 뷰
                </button>
                <button
                  onClick={() => setVisualMode('layers')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    visualMode === 'layers'
                      ? 'bg-white text-stone-900 shadow-xs font-medium'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>레시피 층별 비율</span>
                </button>
              </div>
            </div>

            {/* Visual Display Container */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-200/80 bg-stone-900 shadow-inner flex items-center justify-center">
              {visualMode === 'photo' ? (
                <>
                  <img
                    src={drink.image}
                    alt={drink.nameKo}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Overlay badge with serving temperature notice */}
                  <div className="absolute bottom-3 left-3 bg-stone-950/75 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-xs flex items-center gap-2">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    <span>추천 서빙: {drink.specs.servingTemp}</span>
                  </div>
                </>
              ) : (
                /* Cross-section Cup Architecture Visualizer */
                <div className="w-full h-full p-4 sm:p-6 flex flex-col justify-end bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950">
                  <div className="mb-3 flex items-center justify-between text-xs text-amber-200/80">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      {drink.nameKo} 컵 단면 비율 구조
                    </span>
                    <span className="text-[11px] text-stone-400">총 {drink.specs.volume}</span>
                  </div>

                  {/* Vertical Layer Stack */}
                  <div className="w-full h-44 rounded-lg overflow-hidden border border-white/10 flex flex-col shadow-lg bg-stone-800">
                    {drink.recipeLayers.map((layer, idx) => (
                      <div
                        key={idx}
                        style={{
                          height: `${layer.percentage}%`,
                          backgroundColor: layer.color,
                        }}
                        className="relative flex items-center justify-between px-3 text-[11px] font-medium transition-all hover:brightness-110 group cursor-default"
                      >
                        <span
                          style={{ color: layer.textColor || '#FFFFFF' }}
                          className="truncate drop-shadow-xs font-semibold"
                        >
                          {layer.name} ({layer.percentage}%)
                        </span>
                        <span
                          style={{ color: layer.textColor || '#FFFFFF' }}
                          className="hidden sm:inline text-[10px] opacity-80"
                        >
                          {layer.description}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-stone-400 mt-3 text-center">
                    각 재료의 비중과 추출 농도에 따라 고유의 레이어와 마우스필이 구현됩니다.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Beverage Specs Pill Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 pt-4 border-t border-stone-200/80">
            <div className="bg-white p-2.5 rounded-lg border border-stone-200 text-center">
              <span className="block text-[11px] text-stone-500 font-medium">기준 용량</span>
              <span className="text-xs sm:text-sm font-semibold text-stone-900 tabular-nums">
                {drink.specs.volume}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-stone-200 text-center">
              <span className="block text-[11px] text-stone-500 font-medium">카페인</span>
              <span className="text-xs sm:text-sm font-semibold text-stone-900 tabular-nums">
                {drink.specs.caffeine}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-stone-200 text-center">
              <span className="block text-[11px] text-stone-500 font-medium">칼로리</span>
              <span className="text-xs sm:text-sm font-semibold text-stone-900 tabular-nums">
                {drink.specs.calories}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Core Characteristics & Customization Purchase Module */}
        <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Header: Title & Temperature Switcher */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
                    {drink.nameKo}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded">
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    {drink.tag}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-500 font-mono mt-0.5">
                  {drink.nameEn}
                </p>
              </div>

              {/* Temperature Selector (HOT / ICE) */}
              <div className="flex items-center p-1 bg-stone-100 rounded-lg border border-stone-200">
                {drink.tempAvailability.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTemp(t)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      temp === t
                        ? t === 'HOT'
                          ? 'bg-rose-50 text-rose-700 shadow-xs'
                          : 'bg-sky-50 text-sky-700 shadow-xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    {t === 'HOT' ? (
                      <Flame className="w-3.5 h-3.5 text-rose-500" />
                    ) : (
                      <Snowflake className="w-3.5 h-3.5 text-sky-500" />
                    )}
                    <span>{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Short editorial summary */}
            <p className="text-sm text-stone-700 leading-relaxed mt-2 pb-4 border-b border-stone-100">
              {drink.shortDesc}
            </p>

            {/* Interactive Options Configuration */}
            <div className="space-y-4 py-4 border-b border-stone-200">
              {/* Option 1: Cup Size */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  사이즈 선택
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'short', name: 'Short', vol: '240ml', diff: -500 },
                    { id: 'regular', name: 'Regular', vol: '355ml', diff: 0 },
                    { id: 'large', name: 'Large', vol: '473ml', diff: 700 },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSize(s.id as any)}
                      className={`p-2 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                        size === s.id
                          ? 'border-amber-800 bg-amber-50/40 text-stone-900 font-semibold'
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{s.name}</span>
                        <span className="text-[10px] text-stone-400">{s.vol}</span>
                      </div>
                      <span className="text-[11px] text-amber-800 mt-0.5 block tabular-nums">
                        {s.diff === 0 ? '기본' : `${s.diff > 0 ? '+' : ''}₩${s.diff.toLocaleString()}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Bean Selection (Default vs Single Origin vs Decaf) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-stone-700">
                    추출 원두 선택 (어떤 커피를 사용할까요?)
                  </label>
                  <button
                    onClick={onOpenBeanGuide}
                    className="text-[11px] text-amber-900 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>원두 도감 보기</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {drink.selectableBeans.map((bean) => {
                    const isSelected = selectedBeanId === bean.id;
                    return (
                      <button
                        key={bean.id}
                        onClick={() => setSelectedBeanId(bean.id)}
                        className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-800 bg-amber-50/40 ring-1 ring-amber-800/30'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-stone-900 truncate">
                              {bean.nameKo}
                            </span>
                            <span className="text-[10px] font-mono text-stone-500 uppercase px-1.5 py-0.2 bg-stone-100 rounded">
                              {bean.roastLevel}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 truncate mt-0.5">
                            {bean.origin}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-medium text-stone-900 tabular-nums">
                            {bean.priceDiff ? `+₩${bean.priceDiff.toLocaleString()}` : '기본 포함'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Option 3: Milk Customization (If drink has milk) */}
              {drink.hasMilkOption && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    우유 베이스 변경
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'regular', name: '1등급 일반우유', diff: 0 },
                      { id: 'oat', name: '귀리 오트밀크', diff: 500 },
                      { id: 'lowfat', name: '저지방 우유', diff: 0 },
                      { id: 'soy', name: '무가당 두유', diff: 0 },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMilkId(m.id as any)}
                        className={`p-2 rounded-lg border text-center text-xs transition-colors cursor-pointer ${
                          milkId === m.id
                            ? 'border-amber-800 bg-amber-50/40 text-stone-900 font-semibold'
                            : 'border-stone-200 hover:border-stone-300 text-stone-600'
                        }`}
                      >
                        <div className="truncate">{m.name}</div>
                        <span className="text-[10px] text-stone-400 mt-0.5 block tabular-nums">
                          {m.diff === 0 ? '기본' : `+₩${m.diff.toLocaleString()}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Option 4: Shot Strength & Sweetness */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    에스프레소 샷 조절
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'light', name: '연하게', diff: 0 },
                      { id: 'standard', name: '보통', diff: 0 },
                      { id: 'extra', name: '샷추가(+1)', diff: 500 },
                    ].map((sh) => (
                      <button
                        key={sh.id}
                        onClick={() => setShotId(sh.id as any)}
                        className={`py-1.5 px-2 rounded-md border text-center text-xs transition-colors cursor-pointer ${
                          shotId === sh.id
                            ? 'border-amber-800 bg-amber-50/50 text-stone-900 font-semibold'
                            : 'border-stone-200 text-stone-600'
                        }`}
                      >
                        {sh.name}
                      </button>
                    ))}
                  </div>
                </div>

                {drink.hasSweetnessOption && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      당도 조절
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'low', name: '덜 달게(50%)' },
                        { id: 'standard', name: '보통(100%)' },
                        { id: 'high', name: '달게(130%)' },
                      ].map((sw) => (
                        <button
                          key={sw.id}
                          onClick={() => setSweetnessId(sw.id as any)}
                          className={`py-1.5 px-2 rounded-md border text-center text-xs transition-colors cursor-pointer ${
                            sweetnessId === sw.id
                              ? 'border-amber-800 bg-amber-50/50 text-stone-900 font-semibold'
                              : 'border-stone-200 text-stone-600'
                          }`}
                        >
                          {sw.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer: Live Total & Add to Cart */}
          <div className="pt-4 mt-2 flex items-center justify-between gap-4">
            <div>
              <span className="block text-[11px] text-stone-500 font-medium">선택 옵션 합계</span>
              <div className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">
                ₩{totalPrice.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenCompareWith(drink)}
                className="px-3.5 py-3 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
                title="다른 음료와 1:1 비교"
              >
                비교하기
              </button>

              <button
                onClick={handleAddToCart}
                className="relative flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>주문서 담기</span>

                {addedToast && (
                  <span className="absolute -top-8 right-0 bg-emerald-700 text-white text-[11px] font-medium px-2 py-0.5 rounded shadow animate-fade-in flex items-center gap-1">
                    <Check className="w-3 h-3" /> 담겼습니다!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Deep Dive - 음료 특징 & 어떤 커피(원두)를 사용하는지 상세 정보 */}
      <div className="p-6 sm:p-10 space-y-10 bg-white">
        {/* Sub-section 2.1: 음료 특징 및 테이스팅 프로파일 (Flavor & Story) */}
        <div>
          <div className="flex items-center gap-2 text-stone-900 mb-3">
            <Activity className="w-5 h-5 text-amber-800" />
            <h2 className="text-lg sm:text-xl font-serif font-bold tracking-tight">
              음료 특징 & 테이스팅 스토리
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Story prose */}
            <div className="lg:col-span-7 space-y-4">
              <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
                {drink.story}
              </p>

              {/* Tasting Notes Tags */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                  대표 플레이버 노트
                </span>
                <div className="flex flex-wrap gap-2">
                  {drink.tastingNotes.map((note, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium text-stone-800 bg-stone-100 rounded-md border border-stone-200/60"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Barista Tips Card */}
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/50">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Award className="w-4 h-4 text-amber-700" />
                  헤드 바리스타의 음용 가이드
                </h4>
                <ul className="space-y-1.5">
                  {drink.baristaTips.map((tip, idx) => (
                    <li key={idx} className="text-xs text-stone-700 flex items-start gap-2">
                      <span className="text-amber-700 font-bold shrink-0">·</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Flavor Balance Gauges */}
            <div className="lg:col-span-5 bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-3.5">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
                <span>감각 지표 밸런스</span>
                <span className="text-[10px] text-stone-400 font-normal">5단계 척도</span>
              </h3>

              {[
                { label: '산미 (Acidity)', val: drink.flavorProfile.acidity, desc: '상큼함과 과일 톤' },
                { label: '바디감 (Body)', val: drink.flavorProfile.body, desc: '입안의 무게감과 질감' },
                { label: '단맛 (Sweetness)', val: drink.flavorProfile.sweetness, desc: '원두 본연 및 시럽 당도' },
                { label: '쌉싸름함 (Bitterness)', val: drink.flavorProfile.bitterness, desc: '로스팅 카카오 톤' },
                { label: '밸런스 (Balance)', val: drink.flavorProfile.balance, desc: '전체적인 조화도' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-stone-700">{item.label}</span>
                    <span className="font-semibold text-stone-900 tabular-nums">
                      {item.val} / 5
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: getScoreWidth(item.val) }}
                      className="bg-amber-800 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                  <span className="text-[10px] text-stone-500 block">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sub-section 2.2: "어떤 커피를 사용하는가?" (Selected Bean Deep-Dive) */}
        <div className="pt-8 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-amber-800" />
              <div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 tracking-tight">
                  어떤 커피(원두)를 사용하는가?
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  현재 선택된 원두: <strong className="text-stone-900">{currentBean.nameKo}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 hidden sm:inline">원두 변경해보기:</span>
              <div className="flex items-center gap-1.5">
                {drink.selectableBeans.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBeanId(b.id)}
                    className={`px-2.5 py-1 text-xs rounded-md border transition-all cursor-pointer ${
                      selectedBeanId === b.id
                        ? 'bg-stone-900 text-white border-stone-900 font-medium'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    {b.nameKo.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Bean Specification Board */}
          <div className="bg-[#FAF7F2] rounded-xl border border-amber-900/15 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-stone-200/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-900 text-amber-100 rounded">
                    로스팅 단계 {currentBean.roastScore}/8
                  </span>
                  <span className="text-xs font-mono font-medium text-amber-950 uppercase">
                    {currentBean.roastLevel} Roast
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900 mt-1.5">
                  {currentBean.nameKo}
                </h3>
                <p className="text-xs text-stone-600 font-mono mt-0.5">{currentBean.nameEn}</p>
                <p className="text-sm text-stone-700 mt-3 leading-relaxed max-w-3xl">
                  {currentBean.description}
                </p>
              </div>

              {/* Extraction Machine Spec Card */}
              <div className="bg-white p-4 rounded-xl border border-stone-200/90 shrink-0 w-full md:w-64 space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                  브루잉 & 추출 사양
                </span>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">도징량</span>
                    <span className="font-semibold text-stone-900">{drink.extractionSpecs.dose}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">추출량</span>
                    <span className="font-semibold text-stone-900">{drink.extractionSpecs.yield}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">추출 시간</span>
                    <span className="font-semibold text-stone-900">{drink.extractionSpecs.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">추출 수압</span>
                    <span className="font-semibold text-stone-900">{drink.extractionSpecs.pressure}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-Item Bean Origin Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/80 p-3.5 rounded-lg border border-stone-200/80">
                <span className="block text-[11px] text-stone-500 font-medium">원산지 및 배합</span>
                <span className="text-xs font-semibold text-stone-900 mt-1 block">
                  {currentBean.origin}
                </span>
              </div>
              <div className="bg-white/80 p-3.5 rounded-lg border border-stone-200/80">
                <span className="block text-[11px] text-stone-500 font-medium">재배 고도 & 품종</span>
                <span className="text-xs font-semibold text-stone-900 mt-1 block">
                  {currentBean.altitude} · {currentBean.variety}
                </span>
              </div>
              <div className="bg-white/80 p-3.5 rounded-lg border border-stone-200/80">
                <span className="block text-[11px] text-stone-500 font-medium">가공 방식</span>
                <span className="text-xs font-semibold text-stone-900 mt-1 block">
                  {currentBean.processing}
                </span>
              </div>
              <div className="bg-white/80 p-3.5 rounded-lg border border-stone-200/80">
                <span className="block text-[11px] text-stone-500 font-medium">산미 & 바디 평가</span>
                <span className="text-xs font-semibold text-stone-900 mt-1 block truncate">
                  {currentBean.acidityDesc.split(' ')[0]} / {currentBean.bodyDesc.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Roasting Visual Meter (8 Stages) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-800">
                  로스팅 강도 게이지 (Roast Spectrum)
                </span>
                <span className="text-stone-500">
                  {currentBean.roastLevel} ({currentBean.roastScore}단계 / 8단계)
                </span>
              </div>
              <div className="grid grid-cols-8 gap-1.5">
                {[
                  { lvl: 1, name: 'Light', color: '#D4A373' },
                  { lvl: 2, name: 'Cinnamon', color: '#C68B59' },
                  { lvl: 3, name: 'Medium', color: '#A66A38' },
                  { lvl: 4, name: 'High', color: '#8B5024' },
                  { lvl: 5, name: 'City', color: '#6F3A15' },
                  { lvl: 6, name: 'Full City', color: '#52280D' },
                  { lvl: 7, name: 'French', color: '#391B08' },
                  { lvl: 8, name: 'Italian', color: '#210F04' },
                ].map((stg) => {
                  const isActive = currentBean.roastScore === stg.lvl;
                  return (
                    <div
                      key={stg.lvl}
                      className="flex flex-col items-center gap-1"
                    >
                      <div
                        style={{ backgroundColor: stg.color }}
                        className={`w-full h-3 rounded transition-all ${
                          isActive
                            ? 'ring-2 ring-stone-900 scale-105 shadow-xs'
                            : 'opacity-40'
                        }`}
                      />
                      <span
                        className={`text-[9px] truncate max-w-full ${
                          isActive
                            ? 'font-bold text-stone-900'
                            : 'text-stone-400'
                        }`}
                      >
                        {stg.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
