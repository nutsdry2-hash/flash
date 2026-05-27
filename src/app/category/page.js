import { Suspense } from 'react';
import CategoryPageContent from './CategoryPageContent';

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="text-center p-5"><div className="spinner-border text-primary"></div></div>}>
      <CategoryPageContent />
    </Suspense>
  );
}
