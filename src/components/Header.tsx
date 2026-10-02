import React from 'react';
import { ShoppingBag, GitCompare, BookOpen, Coffee, FileSpreadsheet } from 'lucide-react';

interface HeaderProps {
  onOpenCompare: () => void;
  onOpenBeanGuide: () => void;
  onOpenCart: () => void;
  onOpenOrderSheet: () => void;
  cartCount: number;
  orderSheetCount: number;
  onSelectCategory: (category: string) => void;
  activeCategory: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCompare,
  onOpenBeanGuide,
  onOpenCart,
  onOpenOrderSheet,
  cartCount,
  orderSheetCount,
  onSelectCategory,
  activeCategory,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('all');
            }}
            className="flex items-center gap-2 group text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 rounded-sm"
          >
            <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-100 flex items-center justify-center transition-transform group-hover:scale-105">
              <Coffee className="w-4 h-4" />
            </div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              BREW & BEAN
            </span>
          </a>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => onSelectCategory('all')}
              className={`hover:text-stone-900 transition-colors cursor-pointer py-1 ${
                activeCategory === 'all'
                  ? 'text-stone-900 font-semibold border-b-2 border-stone-900'
                  : ''
              }`}
            >
              전체 메뉴
            </button>
            <button
              onClick={() => onSelectCategory('black')}
              className={`hover:text-stone-900 transition-colors cursor-pointer py-1 ${
                activeCategory === 'black'
                  ? 'text-stone-900 font-semibold border-b-2 border-stone-900'
                  : ''
              }`}
            >
              블랙 & 에스프레소
            </button>
            <button
              onClick={() => onSelectCategory('milk')}
              className={`hover:text-stone-900 transition-colors cursor-pointer py-1 ${
                activeCategory === 'milk'
                  ? 'text-stone-900 font-semibold border-b-2 border-stone-900'
                  : ''
              }`}
            >
              밀크 라떼
            </button>
            <button
              onClick={() => onSelectCategory('sweet')}
              className={`hover:text-stone-900 transition-colors cursor-pointer py-1 ${
                activeCategory === 'sweet'
                  ? 'text-stone-900 font-semibold border-b-2 border-stone-900'
                  : ''
              }`}
            >
              스위트 & 시그니처
            </button>
            <button
              onClick={onOpenBeanGuide}
              className="flex items-center gap-1.5 hover:text-stone-900 transition-colors cursor-pointer text-stone-600"
            >
              <BookOpen className="w-4 h-4" />
              <span>원두 도감</span>
            </button>
            <button
              onClick={onOpenOrderSheet}
              className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-semibold transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>주문 확인 시트</span>
              {orderSheetCount > 0 && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                  {orderSheetCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenOrderSheet}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-xs"
              title="주문 확인 및 구글 시트 연동"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>확인 시트</span>
              {orderSheetCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 text-[10px] font-bold text-white bg-emerald-700 rounded-full tabular-nums">
                  {orderSheetCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenCompare}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
              title="음료 스펙 & 원두 비교하기"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>음료 비교</span>
            </button>

            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-sm"
              aria-label="장바구니"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">장바구니</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-semibold text-stone-900 bg-amber-400 rounded-full tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

