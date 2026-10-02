import React from 'react';
import { CoffeeDrink } from '../types/coffee';
import { Check, Flame, Snowflake, Sparkles } from 'lucide-react';

interface DrinkSelectorProps {
  drinks: CoffeeDrink[];
  selectedDrinkId: string;
  onSelectDrink: (drinkId: string) => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const DrinkSelector: React.FC<DrinkSelectorProps> = ({
  drinks,
  selectedDrinkId,
  onSelectDrink,
  activeCategory,
  onSelectCategory,
}) => {
  const categories = [
    { id: 'all', label: '전체 (6)' },
    { id: 'black', label: '블랙 & 에스프레소' },
    { id: 'milk', label: '밀크 라떼' },
    { id: 'sweet', label: '스위트 & 시그니처' },
  ];

  const filteredDrinks =
    activeCategory === 'all'
      ? drinks
      : drinks.filter((d) => {
          if (activeCategory === 'black')
            return d.category === 'espresso' || d.category === 'black';
          if (activeCategory === 'milk') return d.category === 'milk';
          if (activeCategory === 'sweet') return d.category === 'sweet';
          return true;
        });

  return (
    <section className="py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight">
            스페셜티 셀렉션 메뉴
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            음료를 선택하시면 상세 특징, 로스팅 프로파일 및 추출 원두 정보를 확인하실 수 있습니다.
          </p>
        </div>

        {/* Category Segmented Controls */}
        <div className="inline-flex p-1 bg-stone-100/90 rounded-lg self-start sm:self-auto border border-stone-200/60 overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Coffee Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {filteredDrinks.map((drink) => {
          const isSelected = drink.id === selectedDrinkId;
          const hasHot = drink.tempAvailability.includes('HOT');
          const hasIce = drink.tempAvailability.includes('ICE');

          return (
            <div
              key={drink.id}
              onClick={() => onSelectDrink(drink.id)}
              className={`group relative flex flex-col bg-white rounded-xl border text-left cursor-pointer transition-all duration-200 overflow-hidden ${
                isSelected
                  ? 'border-amber-800 ring-2 ring-amber-800/20 shadow-md translate-y-[-2px]'
                  : 'border-stone-200 hover:border-stone-400 hover:shadow-sm'
              }`}
            >
              {/* Product Image Slot */}
              <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                <img
                  src={drink.image}
                  alt={drink.nameKo}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Subtle Temperature Indicators */}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] text-white">
                  {hasHot && <Flame className="w-2.5 h-2.5 text-amber-300" />}
                  {hasIce && <Snowflake className="w-2.5 h-2.5 text-sky-300" />}
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-3 flex flex-col flex-1 justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-medium">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span className="truncate">{drink.tag}</span>
                  </div>

                  <h3 className="font-semibold text-stone-900 text-sm sm:text-base mt-0.5 leading-snug group-hover:text-amber-900 transition-colors">
                    {drink.nameKo}
                  </h3>
                  <p className="text-[11px] text-stone-600 truncate mt-0.5 font-mono">
                    {drink.nameEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
                  <span className="text-xs text-stone-500 font-medium">기본</span>
                  <span className="text-sm font-semibold text-stone-900 tabular-nums">
                    ₩{drink.basePrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
