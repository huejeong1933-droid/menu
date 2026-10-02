import React, { useState, useEffect } from 'react';
import { COFFEE_DRINKS, ALL_BEANS } from './data/coffeeData';
import {
  CoffeeDrink,
  CustomizationState,
  CartItem,
  ConfirmedOrder,
  OrderStatus,
  BeanInfo,
} from './types/coffee';
import { Header } from './components/Header';
import { DrinkSelector } from './components/DrinkSelector';
import { DrinkDetailView } from './components/DrinkDetailView';
import { DrinkComparisonModal } from './components/DrinkComparisonModal';
import { BeanGuideModal } from './components/BeanGuideModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmationSheet } from './components/OrderConfirmationSheet';
import { OrderSheetTableModal } from './components/OrderSheetTableModal';
import { Footer } from './components/Footer';
import {
  Sparkles,
  BookOpen,
  GitCompare,
  Coffee,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const INITIAL_SAMPLE_ORDERS: ConfirmedOrder[] = [
  {
    orderId: 'ORD-101001',
    orderNumber: 101,
    createdAt: '2026-10-02 16:30:15',
    drinkName: '아메리카노',
    drinkEn: 'Caffè Americano',
    temp: 'HOT',
    size: 'Regular (355ml)',
    beanName: '아틀라스 클래식 미디엄 블렌드',
    beanOrigin: '콜롬비아 나리뇨 60% · 과테말라 안티구아 40%',
    roastLevel: 'City',
    optionsSummary: 'Regular (355ml) / 보통 (2샷)',
    quantity: 2,
    unitPrice: 5000,
    totalPrice: 10000,
    status: '제조 완료',
    notes: '롱블랙 스타일로 크레마 풍부하게',
  },
  {
    orderId: 'ORD-101002',
    orderNumber: 102,
    createdAt: '2026-10-02 16:34:40',
    drinkName: '카페라떼',
    drinkEn: 'Caffè Latte',
    temp: 'ICE',
    size: 'Regular (355ml)',
    beanName: '벨벳 허니 라떼 블렌드',
    beanOrigin: '브라질 옐로우 버번 50% · 코스타리카 30%',
    roastLevel: 'Full City',
    optionsSummary: 'Regular (355ml) / 보통 (2샷) / 우유: 귀리 오트밀크',
    quantity: 1,
    unitPrice: 6300,
    totalPrice: 6300,
    status: '추출 중',
    notes: '오트밀크 변경',
  },
  {
    orderId: 'ORD-101003',
    orderNumber: 103,
    createdAt: '2026-10-02 16:39:10',
    drinkName: '크림라떼',
    drinkEn: 'Signature Einspänner Cream Latte',
    temp: 'ICE',
    size: 'Regular (355ml)',
    beanName: '딥 리저브 다크 로스트',
    beanOrigin: '콜롬비아 카우카 50% · 브라질 모지아나 30%',
    roastLevel: 'Full City',
    optionsSummary: 'Regular (355ml) / 보통 (2샷) / 당도 100%',
    quantity: 1,
    unitPrice: 6800,
    totalPrice: 6800,
    status: '접수 완료',
    notes: '코코아 파우더 듬뿍',
  },
];

export default function App() {
  const [selectedDrinkId, setSelectedDrinkId] = useState<string>('americano');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [compareLeftId, setCompareLeftId] = useState<string>('americano');
  const [isBeanGuideOpen, setIsBeanGuideOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Order Confirmation Sheet & Table States
  const [isOrderConfirmOpen, setIsOrderConfirmOpen] = useState<boolean>(false);
  const [isOrderSheetTableOpen, setIsOrderSheetTableOpen] = useState<boolean>(false);
  const [confirmDrink, setConfirmDrink] = useState<CoffeeDrink>(COFFEE_DRINKS[0]);
  const [confirmCustom, setConfirmCustom] = useState<CustomizationState>({
    temp: 'HOT',
    size: 'regular',
    beanId: COFFEE_DRINKS[0].defaultBean.id,
    milkId: 'regular',
    shotId: 'standard',
    sweetnessId: 'standard',
  });
  const [confirmBean, setConfirmBean] = useState<BeanInfo>(COFFEE_DRINKS[0].defaultBean);
  const [confirmPrice, setConfirmPrice] = useState<number>(COFFEE_DRINKS[0].basePrice);

  // Persistent Confirmed Orders for the Sheet
  const [confirmedOrders, setConfirmedOrders] = useState<ConfirmedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('brew_bean_confirmed_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SAMPLE_ORDERS;
  });

  // Save to localStorage whenever confirmed orders change
  useEffect(() => {
    try {
      localStorage.setItem(
        'brew_bean_confirmed_orders',
        JSON.stringify(confirmedOrders)
      );
    } catch (e) {
      console.error(e);
    }
  }, [confirmedOrders]);

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

  // Called when "주문서 담기" is clicked in DrinkDetailView
  const handleOpenOrderConfirm = (
    drink: CoffeeDrink,
    custom: CustomizationState,
    selectedBean: BeanInfo,
    price: number
  ) => {
    setConfirmDrink(drink);
    setConfirmCustom(custom);
    setConfirmBean(selectedBean);
    setConfirmPrice(price);
    setIsOrderConfirmOpen(true);
  };

  // Add order to Confirmed Orders Sheet
  const handleConfirmToSheet = (newOrder: ConfirmedOrder) => {
    setConfirmedOrders((prev) => [newOrder, ...prev]);

    // Optional: Send to Google Sheets Webhook if configured
    const webhook = localStorage.getItem('google_sheet_webhook_url');
    if (webhook) {
      try {
        fetch(webhook, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder),
        }).catch((err) => console.log('Webhook non-critical note:', err));
      } catch (e) {
        // non-blocking
      }
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setConfirmedOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setConfirmedOrders((prev) => prev.filter((o) => o.orderId !== orderId));
  };

  const handleClearAllOrders = () => {
    setConfirmedOrders([]);
  };

  const handleAddSampleOrders = () => {
    setConfirmedOrders((prev) => [...INITIAL_SAMPLE_ORDERS, ...prev]);
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
        onOpenOrderSheet={() => setIsOrderSheetTableOpen(true)}
        cartCount={cartItems.reduce((acc, it) => acc + it.quantity, 0)}
        orderSheetCount={confirmedOrders.length}
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
              아메리카노, 에스프레소, 카페라떼, 바닐라라떼, 크림라떼, 초코라떼까지. 각 음료의
              상세한 추출 레시피와 사용된 원두를 확인하고, <strong>"주문서 담기"</strong>를 누르면
              <strong>주문 확인 시트</strong>에서 실시간 주문 내역을 바로 확인 및 구글 시트로 내보낼 수 있습니다.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsOrderSheetTableOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
                <span>주문 확인 시트 보기 ({confirmedOrders.length}건)</span>
              </button>

              <button
                onClick={() => setIsBeanGuideOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>8단계 로스팅 & 원두 도감</span>
              </button>

              <button
                onClick={() => setIsCompareOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-200 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg transition-colors cursor-pointer"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>음료 1:1 비교</span>
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
          onOpenOrderConfirm={handleOpenOrderConfirm}
          onOpenBeanGuide={() => setIsBeanGuideOpen(true)}
          onOpenCompareWith={handleOpenCompareWith}
        />
      </main>

      {/* 1. Instant Order Confirmation Sheet (Opens on "주문서 담기") */}
      <OrderConfirmationSheet
        isOpen={isOrderConfirmOpen}
        onClose={() => setIsOrderConfirmOpen(false)}
        drink={confirmDrink}
        customization={confirmCustom}
        selectedBean={confirmBean}
        unitPrice={confirmPrice}
        onConfirmToSheet={handleConfirmToSheet}
        onOpenSheetTable={() => setIsOrderSheetTableOpen(true)}
      />

      {/* 2. Full Order Spreadsheet Table Modal ("확인은 시트를 이용할 거야") */}
      <OrderSheetTableModal
        isOpen={isOrderSheetTableOpen}
        onClose={() => setIsOrderSheetTableOpen(false)}
        orders={confirmedOrders}
        onUpdateStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        onClearAll={handleClearAllOrders}
        onAddSampleOrders={handleAddSampleOrders}
      />

      {/* 3. Comparison Modal */}
      <DrinkComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        drinks={COFFEE_DRINKS}
        initialLeftDrinkId={compareLeftId}
      />

      {/* 4. Bean Guide Modal */}
      <BeanGuideModal
        isOpen={isBeanGuideOpen}
        onClose={() => setIsBeanGuideOpen(false)}
      />

      {/* 5. Cart Drawer */}
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
