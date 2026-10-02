import React, { useState } from 'react';
import { CartItem } from '../types/coffee';
import { X, Trash2, Plus, Minus, CheckCircle, Receipt, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) => {
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState(1042);

  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, it) => sum + it.finalPrice * it.quantity, 0);

  const handleOrder = () => {
    setOrderNumber(Math.floor(1000 + Math.random() * 9000));
    setOrderSubmitted(true);
  };

  const handleReset = () => {
    onClearCart();
    setOrderSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-800" />
            <h3 className="font-serif text-lg font-bold text-stone-900">
              {orderSubmitted ? '바리스타 주문 전송 완료' : '커피 주문서'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto">
          {orderSubmitted ? (
            /* Order Success Receipt */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-stone-400">
                  SPECIALTY BAR TICKET
                </span>
                <h4 className="text-2xl font-bold font-serif text-stone-900 mt-1">
                  주문 접수 번호 #{orderNumber}
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  선택하신 맞춤 원두와 레시피로 바리스타가 정밀 추출을 시작합니다.
                </p>
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between border-b border-stone-200 pb-2 font-bold text-stone-800">
                  <span>추출 항목</span>
                  <span>수량 / 금액</span>
                </div>
                {items.map((it) => (
                  <div key={it.cartId} className="flex justify-between py-1">
                    <span className="truncate pr-2">
                      {it.drink.nameKo} ({it.customization.temp}) · {it.selectedBean.nameKo.split(' ')[0]}
                    </span>
                    <span className="tabular-nums shrink-0">
                      {it.quantity}잔 / ₩{(it.finalPrice * it.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-900 text-sm">
                  <span>총 결제금액</span>
                  <span className="tabular-nums">₩{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg text-amber-900 text-xs">
                ☕ 예상 제조 소요 시간: 약 3~5분 (에스프레소 샷 정밀 추출 중)
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl text-xs transition-colors cursor-pointer"
              >
                새 주문 작성하기
              </button>
            </div>
          ) : items.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 text-stone-400 space-y-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Receipt className="w-6 h-6" />
              </div>
              <p className="text-sm">담긴 커피가 없습니다.</p>
              <p className="text-xs text-stone-400">
                원하는 음료와 원두를 선택하여 나만의 스페셜티 커피를 담아보세요.
              </p>
            </div>
          ) : (
            /* Itemized List */
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.cartId}
                  className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-2 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            item.customization.temp === 'HOT'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-sky-50 text-sky-700'
                          }`}
                        >
                          {item.customization.temp}
                        </span>
                        <h4 className="text-sm font-bold text-stone-900">
                          {item.drink.nameKo}
                        </h4>
                      </div>
                      <p className="text-[11px] text-amber-900 font-medium mt-0.5">
                        원두: {item.selectedBean.nameKo} ({item.selectedBean.roastLevel})
                      </p>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.cartId)}
                      className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Customization Details */}
                  <div className="text-[11px] text-stone-500 space-y-0.5 bg-stone-50 p-2 rounded-lg">
                    <div>사이즈: {item.customization.size.toUpperCase()}</div>
                    {item.drink.hasMilkOption && (
                      <div>우유: {item.customization.milkId}</div>
                    )}
                    <div>샷: {item.customization.shotId}</div>
                    {item.drink.hasSweetnessOption && (
                      <div>당도: {item.customization.sweetnessId}</div>
                    )}
                  </div>

                  {/* Quantity and Line Price */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-stone-200 rounded-lg">
                      <button
                        onClick={() => onUpdateQty(item.cartId, -1)}
                        className="px-2 py-1 text-stone-600 hover:text-stone-900 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.cartId, 1)}
                        className="px-2 py-1 text-stone-600 hover:text-stone-900 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-stone-900 tabular-nums">
                      ₩{(item.finalPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!orderSubmitted && items.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-stone-500 font-medium">총 주문 금액</span>
              <span className="text-xl font-bold text-stone-900 tabular-nums">
                ₩{totalAmount.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleOrder}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>스페셜티 바리스타에게 주문하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
