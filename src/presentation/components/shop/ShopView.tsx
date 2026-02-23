'use client';

import { ShopClassicTemplate } from '@/src/presentation/components/shop/templates/ShopClassicTemplate';
import { ShopEditorialTemplate } from '@/src/presentation/components/shop/templates/ShopEditorialTemplate';
import { ShopRetroTechMagazineTemplate } from '@/src/presentation/components/shop/templates/ShopRetroTechMagazineTemplate';
import { useTemplate } from '@/src/presentation/hooks/useTemplate';

export function ShopView() {
  const { template } = useTemplate();

  if (template === 'editorial') {
    return <ShopEditorialTemplate />;
  }

  if (template === 'retroTechMagazine') {
    return <ShopRetroTechMagazineTemplate />;
  }

  return <ShopClassicTemplate />;
}
