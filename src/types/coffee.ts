export type RoastLevel =
  | 'Light'
  | 'Cinnamon'
  | 'Medium'
  | 'High'
  | 'City'
  | 'Full City'
  | 'French'
  | 'Italian';

export interface BeanInfo {
  id: string;
  nameKo: string;
  nameEn: string;
  origin: string; // e.g. "콜롬비아 후일라, 브라질 세하도"
  originFlags?: string;
  altitude: string;
  variety: string;
  processing: string; // e.g. "워시드 & 내추럴 블렌딩"
  roastLevel: RoastLevel;
  roastScore: number; // 1 to 8 (1: Light, 8: Italian)
  flavorNotes: string[];
  acidityDesc: string;
  bodyDesc: string;
  description: string;
  priceDiff?: number;
  bestBrewMethod: string;
}

export interface RecipeLayer {
  name: string;
  percentage: number;
  color: string;
  textColor?: string;
  description: string;
}

export interface CoffeeDrink {
  id: string;
  nameKo: string;
  nameEn: string;
  category: 'espresso' | 'black' | 'milk' | 'sweet';
  categoryLabel: string;
  basePrice: number;
  image: string;
  tag: string;
  shortDesc: string;
  story: string;
  tempAvailability: ('HOT' | 'ICE')[];
  defaultTemp: 'HOT' | 'ICE';
  flavorProfile: {
    acidity: number; // 1-5
    body: number; // 1-5
    sweetness: number; // 1-5
    bitterness: number; // 1-5
    balance: number; // 1-5
  };
  tastingNotes: string[];
  specs: {
    volume: string;
    caffeine: string;
    calories: string;
    servingTemp: string;
  };
  defaultBean: BeanInfo;
  selectableBeans: BeanInfo[];
  recipeLayers: RecipeLayer[];
  extractionSpecs: {
    dose: string;
    yield: string;
    ratio: string;
    time: string;
    pressure: string;
  };
  baristaTips: string[];
  hasMilkOption: boolean;
  hasSweetnessOption: boolean;
}

export interface CustomizationState {
  temp: 'HOT' | 'ICE';
  size: 'short' | 'regular' | 'large';
  beanId: string;
  milkId: 'regular' | 'oat' | 'lowfat' | 'soy';
  shotId: 'standard' | 'light' | 'extra';
  sweetnessId: 'low' | 'standard' | 'high';
  decafShot?: boolean;
}

export interface CartItem {
  cartId: string;
  drink: CoffeeDrink;
  customization: CustomizationState;
  finalPrice: number;
  quantity: number;
  selectedBean: BeanInfo;
}

export type OrderStatus = '접수 완료' | '추출 중' | '제조 완료';

export interface ConfirmedOrder {
  orderId: string;
  orderNumber: number;
  createdAt: string;
  drinkName: string;
  drinkEn: string;
  temp: 'HOT' | 'ICE';
  size: string;
  beanName: string;
  beanOrigin: string;
  roastLevel: string;
  optionsSummary: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
  notes?: string;
}
