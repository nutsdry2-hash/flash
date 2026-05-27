import { Suspense } from 'react';
import ProductPageContent from './ProductPageContent';

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="text-center p-5"><div className="spinner-border text-primary"></div></div>}>
      <ProductPageContent />
    </Suspense>
  );
}
