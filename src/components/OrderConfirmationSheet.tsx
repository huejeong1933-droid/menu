import React, { useState } from 'react';
import { CoffeeDrink, CustomizationState, BeanInfo, ConfirmedOrder } from '../types/coffee';
import {
  X,
  CheckCircle,
  FileSpreadsheet,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Layers,
  Flame,
  Snowflake,
  ClipboardCheck,
} from 'lucide-react';

interface OrderConfirmationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  drink: CoffeeDrink;
  customization: CustomizationState;
  selectedBean: BeanInfo;
  unitPrice: number;
  onConfirmToSheet: (order: ConfirmedOrder) => void;
  onOpenSheetTable: () => void;
}

export const OrderConfirmationSheet: React.FC<OrderConfirmationSheetProps> = ({
  isOpen,
  onClose,
  drink,
  customization,
  selectedBean,
  unitPrice,
  onConfirmToSheet,
  onOpenSheetTable,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [confirmedSuccess, setConfirmedSuccess] = useState<boolean>(false);
  const [lastOrderNumber, setLastOrderNumber] = useState<number>(0);

  if (!isOpen) return null;

  const totalPrice = unitPrice * quantity;

  // Format options summary text
  const sizeText =
    customization.size === 'short'
      ? 'Short (240ml)'
      : customization.size === 'large'
      ? 'Large (473ml)'
      : 'Regular (355ml)';

  const milkText = drink.hasMilkOption
    ? customization.milkId === 'oat'
      ? '귀리 오트밀크'
      : customization.milkId === 'lowfat'
      ? '저지방 우유'
      : customization.milkId === 'soy'
      ? '무가당 두유'
      : '1등급 일반우유'
    : '';

  const shotText =
    customization.shotId === 'light'
      ? '연하게 (1샷)'
      : customization.shotId === 'extra'
      ? '샷 추가 (+1샷)'
      : '보통 (2샷)';

  const sweetnessText = drink.hasSweetnessOption
    ? customization.sweetnessId === 'low'
      ? '당도 50%'
      : customization.sweetnessId === 'high'
      ? '당도 130%'
      : '당도 100%'
    : '';

  const optionsSummaryParts = [
    sizeText,
    shotText,
    milkText ? `우유: ${milkText}` : '',
    sweetnessText ? `당도: ${sweetnessText}` : '',
  ].filter(Boolean);

  const optionsSummary = optionsSummaryParts.join(' / ');

  const handleConfirmOrder = () => {
    const orderNum = Math.floor(100 + Math.random() * 900);
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const newOrder: ConfirmedOrder = {
      orderId: `ORD-${Date.now().toString().slice(-6)}`,
      orderNumber: orderNum,
      createdAt,
      drinkName: drink.nameKo,
      drinkEn: drink.nameEn,
      temp: customization.temp,
      size: sizeText,
      beanName: selectedBean.nameKo,
      beanOrigin: selectedBean.origin,
      roastLevel: selectedBean.roastLevel,
      optionsSummary,
      quantity,
      unitPrice,
      totalPrice,
      status: '접수 완료',
      notes: notes.trim() || undefined,
    };

    onConfirmToSheet(newOrder);
    setLastOrderNumber(orderNum);
    setConfirmedSuccess(true);
  };

  const handleResetAndClose = () => {
    setConfirmedSuccess(false);
    setQuantity(1);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-stone-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-100 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {confirmedSuccess ? '시트에 주문 기록 완료' : '주문 확인 시트'}
              </h3>
              <p className="text-xs text-stone-500 font-mono">Order Confirmation Sheet</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {confirmedSuccess ? (
            /* Success State */
            <div className="text-center py-6 space-y-4 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-mono tracking-widest text-stone-500 uppercase">
                  RECORDED TO ORDER SHEET
                </span>
                <h4 className="text-2xl font-bold font-serif text-stone-900 mt-1">
                  주문 번호 #{lastOrderNumber} 시트 등록 완료!
                </h4>
                <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
                  선택하신 커피와 원두 정보가 <strong>주문 관리 시트(표)</strong>에 실시간으로 기록되었습니다.
                </p>
              </div>

              {/* Order Card Preview */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200 text-left text-xs space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                  <span className="font-bold text-stone-900 text-sm">{drink.nameKo}</span>
                  <span className="text-amber-900 font-semibold">{customization.temp}</span>
                </div>
                <div className="text-stone-600 space-y-1">
                  <div><strong>원두:</strong> {selectedBean.nameKo} ({selectedBean.roastLevel})</div>
                  <div><strong>옵션:</strong> {optionsSummary}</div>
                  <div><strong>수량:</strong> {quantity}잔</div>
                  {notes && <div><strong>요청사항:</strong> {notes}</div>}
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900 text-sm">
                  <span>기록 금액</span>
                  <span className="tabular-nums">₩{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    handleResetAndClose();
                    onOpenSheetTable();
                  }}
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                  <span>주문 확인 시트(표) 바로가기</span>
                </button>

                <button
                  onClick={handleResetAndClose}
                  className="w-full py-2.5 text-xs text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  계속해서 다른 음료 주문하기
                </button>
              </div>
            </div>
          ) : (
            /* Order Review Form */
            <>
              {/* Product Banner */}
              <div className="flex gap-4 p-4 rounded-xl border border-stone-200 bg-stone-50/60">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-stone-200 bg-stone-200 shrink-0">
                  <img
                    src={drink.image}
                    alt={drink.nameKo}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        customization.temp === 'HOT'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-sky-50 text-sky-700'
                      }`}
                    >
                      {customization.temp === 'HOT' ? (
                        <Flame className="w-2.5 h-2.5" />
                      ) : (
                        <Snowflake className="w-2.5 h-2.5" />
                      )}
                      {customization.temp}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">{sizeText}</span>
                  </div>
                  <h4 className="text-base font-bold text-stone-900 font-serif mt-1 truncate">
                    {drink.nameKo}
                  </h4>
                  <p className="text-xs text-stone-500 font-mono truncate">{drink.nameEn}</p>
                </div>
              </div>

              {/* Used Coffee Bean Verification Section */}
              <div className="p-4 rounded-xl border border-amber-900/15 bg-amber-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                    추출에 사용되는 커피(원두) 정보
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-900 text-amber-100 uppercase">
                    {selectedBean.roastLevel}
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-stone-900">{selectedBean.nameKo}</h5>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    <strong>산지:</strong> {selectedBean.origin}
                  </p>
                  <p className="text-xs text-amber-900 font-medium mt-1">
                    <strong>테이스팅 노트:</strong> {selectedBean.flavorNotes.join(', ')}
                  </p>
                </div>
              </div>

              {/* Selected Options Summary */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
                  퍼스널 커스텀 옵션 확인
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">사이즈</span>
                    <span className="font-semibold text-stone-900">{sizeText}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">에스프레소 샷</span>
                    <span className="font-semibold text-stone-900">{shotText}</span>
                  </div>
                  {drink.hasMilkOption && (
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 block text-[11px]">우유 종류</span>
                      <span className="font-semibold text-stone-900">{milkText}</span>
                    </div>
                  )}
                  {drink.hasSweetnessOption && (
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                      <span className="text-stone-500 block text-[11px]">당도</span>
                      <span className="font-semibold text-stone-900">{sweetnessText}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Selector & Live Unit Price */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 bg-white">
                <div>
                  <span className="text-xs text-stone-500 block">주문 수량</span>
                  <span className="text-xs font-semibold text-stone-700 tabular-nums">
                    단가 ₩{unitPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center border border-stone-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-l-lg transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3.5 text-sm font-bold tabular-nums text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-r-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Notes / Customer Name Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  시트 기록용 고객 메모 / 요청 사항 (선택)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="예: 얼음 적게, 텀블러 할인, 테이블 5번"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!confirmedSuccess && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-stone-500 font-medium">총 주문 합계</span>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">
                  ₩{totalPrice.toLocaleString()}
                </span>
                <span className="text-[11px] text-stone-500 block">부가세 포함</span>
              </div>
            </div>

            <button
              onClick={handleConfirmOrder}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4 text-amber-300" />
              <span>주문 확정 및 시트에 기록하기</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenSheetTable();
              }}
              className="w-full py-2 text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-800" />
              <span>현재 주문 확인 시트(표) 바로 보기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
