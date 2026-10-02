import React, { useState } from 'react';
import { ConfirmedOrder, OrderStatus } from '../types/coffee';
import {
  X,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Trash2,
  Plus,
  RefreshCw,
  ExternalLink,
  Flame,
  Snowflake,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Coffee,
} from 'lucide-react';

interface OrderSheetTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: ConfirmedOrder[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onClearAll: () => void;
  onAddSampleOrders: () => void;
}

export const OrderSheetTableModal: React.FC<OrderSheetTableModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateStatus,
  onDeleteOrder,
  onClearAll,
  onAddSampleOrders,
}) => {
  const [copiedToast, setCopiedToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showWebhookGuide, setShowWebhookGuide] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(
    localStorage.getItem('google_sheet_webhook_url') || ''
  );
  const [webhookSaved, setWebhookSaved] = useState(false);

  if (!isOpen) return null;

  // Filtered orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.drinkName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.beanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.orderNumber.toString().includes(searchTerm) ||
      (ord.notes && ord.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalPrice, 0);
  const totalCups = orders.reduce((sum, ord) => sum + ord.quantity, 0);

  // 1. Copy formatted TSV for direct Google Sheets Ctrl+V paste
  const handleCopyForGoogleSheets = () => {
    if (orders.length === 0) return;

    const headers = [
      '주문번호',
      '주문일시',
      '음료명',
      '온도',
      '사이즈',
      '추출원두',
      '원두산지',
      '로스팅단계',
      '옵션내역',
      '수량',
      '단가',
      '합계금액',
      '진행상태',
      '요청메모',
    ];

    const rows = orders.map((o) => [
      `#${o.orderNumber}`,
      o.createdAt,
      o.drinkName,
      o.temp,
      o.size,
      o.beanName,
      o.beanOrigin,
      o.roastLevel,
      o.optionsSummary,
      o.quantity,
      o.unitPrice,
      o.totalPrice,
      o.status,
      o.notes || '-',
    ]);

    const tsvContent = [
      headers.join('\t'),
      ...rows.map((row) => row.join('\t')),
    ].join('\n');

    navigator.clipboard.writeText(tsvContent).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    });
  };

  // 2. Download CSV file for Google Sheets / Excel import
  const handleDownloadCSV = () => {
    if (orders.length === 0) return;

    const headers = [
      '주문번호',
      '주문일시',
      '음료명',
      '온도',
      '사이즈',
      '추출원두',
      '원두산지',
      '로스팅단계',
      '옵션내역',
      '수량',
      '단가(원)',
      '합계(원)',
      '진행상태',
      '요청메모',
    ];

    const escapeCsv = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;

    const rows = orders.map((o) => [
      escapeCsv(`#${o.orderNumber}`),
      escapeCsv(o.createdAt),
      escapeCsv(o.drinkName),
      escapeCsv(o.temp),
      escapeCsv(o.size),
      escapeCsv(o.beanName),
      escapeCsv(o.beanOrigin),
      escapeCsv(o.roastLevel),
      escapeCsv(o.optionsSummary),
      o.quantity,
      o.unitPrice,
      o.totalPrice,
      escapeCsv(o.status),
      escapeCsv(o.notes || '-'),
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `brew_bean_orders_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveWebhook = () => {
    localStorage.setItem('google_sheet_webhook_url', webhookUrl.trim());
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 2000);
  };

  const cycleStatus = (order: ConfirmedOrder) => {
    const nextStatus: Record<OrderStatus, OrderStatus> = {
      '접수 완료': '추출 중',
      '추출 중': '제조 완료',
      '제조 완료': '접수 완료',
    };
    onUpdateStatus(order.orderId, nextStatus[order.status]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-6xl w-full h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                  주문 확인 관리 시트
                </h3>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded">
                  실시간 기록 연동 중
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono">
                Brew & Bean Real-time Order Spreadsheet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWebhookGuide(!showWebhookGuide)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors cursor-pointer"
            >
              <span>구글 시트 연동 설정</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Webhook Guide Drawer / Expandable */}
        {showWebhookGuide && (
          <div className="p-4 bg-emerald-50/70 border-b border-emerald-200 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950">
                📊 구글 스프레드시트(Google Sheets) 실시간 자동 전송 설정
              </span>
              <button
                onClick={() => setShowWebhookGuide(false)}
                className="text-emerald-800 hover:underline cursor-pointer"
              >
                닫기
              </button>
            </div>
            <p className="text-emerald-800 leading-relaxed">
              구글 스프레드시트의 <strong>[확장 프로그램] ➜ [Apps Script]</strong>를 웹 앱(Web App)으로 배포한 후 URL을 입력하시면, 주문이 생성될 때마다 고객의 실제 구글 시트 행으로 실시간 자동 전송됩니다. 또는 하단의 <strong>[구글 시트용 형식 복사]</strong> 버튼을 눌러 바로 붙여넣기(Ctrl+V)하실 수도 있습니다!
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 bg-white border border-emerald-300 rounded-lg px-3 py-1.5 text-xs font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
              <button
                onClick={handleSaveWebhook}
                className="px-3.5 py-1.5 bg-emerald-800 text-white rounded-lg font-medium hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                {webhookSaved ? '저장됨 ✓' : 'URL 저장'}
              </button>
            </div>
          </div>
        )}

        {/* Stats & Tool Bar */}
        <div className="p-3 sm:p-4 border-b border-stone-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Key Metrics */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500">총 기록 건수:</span>
              <span className="font-bold text-stone-900 tabular-nums">{orders.length}건</span>
              <span className="text-stone-300">·</span>
              <span className="font-bold text-amber-900 tabular-nums">{totalCups}잔</span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-stone-200 pl-4">
              <span className="text-stone-500">누적 주문액:</span>
              <span className="font-bold text-stone-900 tabular-nums">
                ₩{totalRevenue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyForGoogleSheets}
              disabled={orders.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                copiedToast
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
              title="구글 시트에 Ctrl+V로 붙여넣을 수 있는 표 형태로 복사합니다"
            >
              {copiedToast ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedToast ? '구글 시트용 복사 완료!' : '구글 시트용 형식 복사'}</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              disabled={orders.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV 내보내기</span>
            </button>

            <button
              onClick={onAddSampleOrders}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              title="테스트용 샘플 주문을 추가합니다"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>샘플 추가</span>
            </button>

            {orders.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('시트에 기록된 모든 주문 내역을 초기화하시겠습니까?')) {
                    onClearAll();
                  }
                }}
                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="시트 전체 비우기"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-4 py-2 bg-stone-50/60 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="음료명, 원두명, 주문번호 검색..."
                className="w-full bg-white border border-stone-300 rounded-md pl-8 pr-2.5 py-1 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span className="text-stone-400 mr-1">상태 필터:</span>
            {['all', '접수 완료', '추출 중', '제조 완료'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-stone-900 text-white font-medium'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {st === 'all' ? '전체' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Spreadsheet Grid Table */}
        <div className="flex-1 overflow-auto bg-stone-100/40">
          {orders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 shadow-xs">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-stone-800">
                기록된 주문 내역이 아직 없습니다.
              </h4>
              <p className="text-xs text-stone-500 max-w-sm">
                메뉴 화면에서 음료 옵션을 고른 뒤 <strong>"주문서 담기"</strong>를 누르시면 이곳 시트에 실시간으로 기록됩니다.
              </p>
              <button
                onClick={onAddSampleOrders}
                className="mt-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>테스트용 샘플 주문 3건 채우기</span>
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-stone-100 sticky top-0 z-10 border-b border-stone-200 font-mono text-[11px] text-stone-600 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 font-semibold border-r border-stone-200"># 번호</th>
                  <th className="py-2.5 px-3 font-semibold border-r border-stone-200">일시</th>
                  <th className="py-2.5 px-3 font-semibold border-r border-stone-200">음료명</th>
                  <th className="py-2.5 px-3 font-semibold border-r border-stone-200">온도</th>
                  <th className="py-2.5 px-3 font-semibold border-r border-stone-200">추출 원두 및 로스팅</th>
                  <th className="py-2.5 px-3 font-semibold border-r border-stone-200">퍼스널 옵션</th>
                  <th className="py-2.5 px-3 font-semibold border-r border-stone-200 text-center">수량</th>
                  <th className="py-2.5 px-3 font-semibold border-r border-stone-200 text-right">금액</th>
                  <th className="py-2.5 px-3 font-semibold border-r border-stone-200 text-center">진행 상태</th>
                  <th className="py-2.5 px-3 font-semibold border-r border-stone-200">요청사항</th>
                  <th className="py-2.5 px-2 font-semibold text-center">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {filteredOrders.map((order, idx) => {
                  const statusColors: Record<OrderStatus, string> = {
                    '접수 완료': 'bg-amber-50 text-amber-800 border-amber-300',
                    '추출 중': 'bg-sky-50 text-sky-800 border-sky-300',
                    '제조 완료': 'bg-emerald-50 text-emerald-800 border-emerald-300',
                  };

                  return (
                    <tr
                      key={order.orderId}
                      className="hover:bg-amber-50/30 transition-colors"
                    >
                      {/* Order Number */}
                      <td className="py-2 px-3 font-mono font-bold text-stone-900 border-r border-stone-100">
                        #{order.orderNumber}
                      </td>

                      {/* Timestamp */}
                      <td className="py-2 px-3 text-[11px] text-stone-500 font-mono whitespace-nowrap border-r border-stone-100">
                        {order.createdAt.slice(5)}
                      </td>

                      {/* Drink Name */}
                      <td className="py-2 px-3 font-semibold text-stone-900 border-r border-stone-100 whitespace-nowrap">
                        {order.drinkName}
                      </td>

                      {/* Temp */}
                      <td className="py-2 px-3 text-center border-r border-stone-100">
                        <span
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            order.temp === 'HOT'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-sky-50 text-sky-700'
                          }`}
                        >
                          {order.temp === 'HOT' ? (
                            <Flame className="w-2.5 h-2.5" />
                          ) : (
                            <Snowflake className="w-2.5 h-2.5" />
                          )}
                          {order.temp}
                        </span>
                      </td>

                      {/* Coffee Bean Info */}
                      <td className="py-2 px-3 border-r border-stone-100">
                        <div className="font-medium text-stone-900 truncate max-w-[180px]">
                          {order.beanName}
                        </div>
                        <div className="text-[10px] text-stone-500 truncate max-w-[180px]">
                          {order.beanOrigin} · <span className="font-mono text-amber-900">{order.roastLevel}</span>
                        </div>
                      </td>

                      {/* Options */}
                      <td className="py-2 px-3 text-[11px] text-stone-600 border-r border-stone-100 max-w-[180px] truncate">
                        {order.optionsSummary}
                      </td>

                      {/* Quantity */}
                      <td className="py-2 px-3 text-center font-bold text-stone-800 tabular-nums border-r border-stone-100">
                        {order.quantity}
                      </td>

                      {/* Total Price */}
                      <td className="py-2 px-3 text-right font-semibold text-stone-900 tabular-nums border-r border-stone-100">
                        ₩{order.totalPrice.toLocaleString()}
                      </td>

                      {/* Status Toggle Button */}
                      <td className="py-2 px-3 text-center border-r border-stone-100">
                        <button
                          onClick={() => cycleStatus(order)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                            statusColors[order.status]
                          }`}
                          title="클릭하여 상태 변경"
                        >
                          {order.status}
                        </button>
                      </td>

                      {/* Notes */}
                      <td className="py-2 px-3 text-stone-500 max-w-[140px] truncate border-r border-stone-100">
                        {order.notes || '-'}
                      </td>

                      {/* Delete Action */}
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => onDeleteOrder(order.orderId)}
                          className="p-1 text-stone-300 hover:text-rose-600 transition-colors cursor-pointer"
                          title="항목 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
          <div className="text-stone-500 hidden sm:flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>상태 버튼을 클릭하면 [접수 완료 ➜ 추출 중 ➜ 제조 완료]로 순환 변경됩니다.</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleCopyForGoogleSheets}
              disabled={orders.length === 0}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>구글 시트 복사</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium transition-colors cursor-pointer"
            >
              시트 닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
