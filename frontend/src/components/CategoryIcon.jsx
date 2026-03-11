import React from 'react';
import {
  Restaurant,
  LocalGroceryStore,
  DirectionsCar,
  Home,
  Lightbulb,
  LocalHospital,
  Movie,
  ShoppingBag,
  Flight,
  School,
  VerifiedUser,
  SelfImprovement,
  CardGiftcard,
  Receipt,
  Category,
  Work,
  Store,
  LaptopMac,
  TrendingUp,
  MapsHomeWork,
  Redeem,
  Replay,
  AttachMoney,
  AccountBalanceWallet
} from '@mui/icons-material';

const iconMap = {
  // Expense Categories
  'food & dining': Restaurant,
  'food': Restaurant,
  'dining': Restaurant,
  'groceries': LocalGroceryStore,
  'transportation': DirectionsCar,
  'transit': DirectionsCar,
  'rent': Home,
  'housing': Home,
  'utilities': Lightbulb,
  'electricity': Lightbulb,
  'water': Lightbulb,
  'healthcare': LocalHospital,
  'medical': LocalHospital,
  'entertainment': Movie,
  'movies': Movie,
  'shopping': ShoppingBag,
  'travel': Flight,
  'vacation': Flight,
  'education': School,
  'insurance': VerifiedUser,
  'personal care': SelfImprovement,
  'beauty': SelfImprovement,
  'gifts & donations': CardGiftcard,
  'gifts': CardGiftcard,
  'donations': CardGiftcard,
  'bills & emi': Receipt,
  'bills': Receipt,
  'other expenses': Category,
  'misc': Category,
  
  // Income Categories
  'salary': Work,
  'business income': Store,
  'freelance': LaptopMac,
  'investments': TrendingUp,
  'rental income': MapsHomeWork,
  'gifts received': Redeem,
  'refunds': Replay,
  'other income': AttachMoney,
  
  // Default
  'default': AccountBalanceWallet
};

export const getCategoryIcon = (categoryName) => {
  if (!categoryName) return AccountBalanceWallet;
  
  const normalizedName = categoryName.toLowerCase().trim();
  
  // Exact match
  if (iconMap[normalizedName]) {
    return iconMap[normalizedName];
  }

  // Partial match
  for (const [key, IconComponent] of Object.entries(iconMap)) {
    if (normalizedName.includes(key)) {
      return IconComponent;
    }
  }

  return AccountBalanceWallet;
};

const CategoryIcon = ({ categoryName, sx = {}, ...props }) => {
  const IconComponent = getCategoryIcon(categoryName);
  
  return <IconComponent sx={{ color: 'text.secondary', ...sx }} {...props} />;
};

export default CategoryIcon;
