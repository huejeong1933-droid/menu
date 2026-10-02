import React from 'react';
import { Coffee, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenBeanGuide: () => void;
  onOpenCompare: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBeanGuide,
  onOpenCompare,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white">
              <div className="w-7 h-7 rounded-full bg-amber-800 flex items-center justify-center">
                <Coffee className="w-3.5 h-3.5 text-amber-100" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight">
                BREW & BEAN ROASTERY
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              신선한 생두 선별부터 8단계 정밀 프로파일 로스팅, 그리고 9bar 상업용 추출 머신을 통한
              이상적인 한 잔까지. 커피의 본질과 산지의 떼루아를 온전히 전달합니다.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              빠른 탐색
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenBeanGuide}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  원두 도감 & 로스팅 스펙트럼
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCompare}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  음료 1:1 비교 분석
                </button>
              </li>
              <li>
                <span className="text-stone-500">6종 시그니처 레시피 아카이브</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              원두 및 추출 품질 원칙
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-center gap-1.5 text-amber-200/90">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>100% 스페셜티 SCA 84+ 생두</span>
              </div>
              <p>로스팅 후 7일~21일 이내 원두만 정밀 추출에 사용합니다.</p>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
          <p>© 2026 BREW & BEAN. All rights reserved.</p>
          <p>Crafted for coffee connoisseurs & daily brew seekers.</p>
        </div>
      </div>
    </footer>
  );
};
