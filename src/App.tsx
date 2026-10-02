import React, { useState } from 'react';
import { COFFEE_DRINKS } from './data/coffeeData';
import { CoffeeDrink, CustomizationState, CartItem } from './types/coffee';
import { Header } from './components/Header';
import { DrinkSelector } from './components/DrinkSelector';
import { DrinkDetailView } from './components/DrinkDetailView';
import { DrinkComparisonModal } from './components/DrinkComparisonModal';
import { BeanGuideModal } from './components/BeanGuideModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Sparkles, BookOpen, GitCompare, Coffee, Droplets } from 'lucide-react';

export default function App() {
  const [selectedDrinkId, setSelectedDrinkId] = useState<string>('americano');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [compareLeftId, setCompareLeftId] = useState<string>('americano');
  const [isBeanGuideOpen, setIsBeanGuideOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Find currently selected drink
  const currentDrink =
    COFFEE_DRINKS.find((d) => d.id === selectedDrinkId) || COFFEE_DRINKS[0];

  // Cart operations
  const handleAddToCart = (
    drink: CoffeeDrink,
    custom: CustomizationState,
    finalPrice: number
  ) => {
    const selectedBean =
      drink.selectableBeans.find((b) => b.id === custom.beanId) || drink.defaultBean;
    const cartId = `${drink.id}-${custom.temp}-${custom.size}-${custom.beanId}-${custom.milkId}-${custom.shotId}-${custom.sweetnessId}-${Date.now()}`;

    setCartItems((prev) => [
      ...prev,
      {
        cartId,
        drink,
        customization: custom,
        finalPrice,
        quantity: 1,
        selectedBean,
      },
    ]);
  };

  const handleUpdateQty = (cartId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenCompareWith = (drink: CoffeeDrink) => {
    setCompareLeftId(drink.id);
    setIsCompareOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900 selection:bg-amber-800 selection:text-white">
      {/* Header following Section 2 Top Bar Contract */}
      <Header
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenBeanGuide={() => setIsBeanGuideOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
        onSelectCategory={setActiveCategory}
        activeCategory={activeCategory}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Editorial Hero Banner */}
        <section className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-md">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-amber-700/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>스페셜티 커피 & 원두 탐색 가이드</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white leading-tight">
              커피의 풍미와 원두의 기원을 담아낸<br className="hidden sm:inline" />
              6가지 시그니처 메뉴 셀렉션
            </h1>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              아메리카노, 에스프레소, 카페라떼, 바닐라라떼, 크림라떼, 초코라떼까지. 각 음료가 지닌
              독창적인 추출 레시피, 감각 프로파일, 그리고 어떤 산지의 커피 원두를 블렌딩하여 사용하는지
              상세히 확인하고 나만의 한 잔으로 커스텀해보세요.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsBeanGuideOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>8단계 로스팅 & 원두 도감 보기</span>
              </button>

              <button
                onClick={() => setIsCompareOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-200 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-colors cursor-pointer"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>음료 간 스펙 1:1 비교</span>
              </button>
            </div>
          </div>
        </section>

        {/* 6 Drinks Interactive Selection Bar */}
        <DrinkSelector
          drinks={COFFEE_DRINKS}
          selectedDrinkId={selectedDrinkId}
          onSelectDrink={(id) => setSelectedDrinkId(id)}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
        />

        {/* Comprehensive Drink Detail View (Characteristics & Used Coffee Beans) */}
        <DrinkDetailView
          drink={currentDrink}
          onAddToCart={handleAddToCart}
          onOpenBeanGuide={() => setIsBeanGuideOpen(true)}
          onOpenCompareWith={handleOpenCompareWith}
        />
      </main>

      {/* Modals & Slide-over Panels */}
      <DrinkComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        drinks={COFFEE_DRINKS}
        initialLeftDrinkId={compareLeftId}
      />

      <BeanGuideModal
        isOpen={isBeanGuideOpen}
        onClose={() => setIsBeanGuideOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Footer */}
      <Footer
        onOpenBeanGuide={() => setIsBeanGuideOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
      />
    </div>
  );
}
