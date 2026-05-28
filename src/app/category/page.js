import { Suspense } from 'react';
import CC from './CC';
export default function C() {
  return <Suspense fallback={<div className="text-center p-5"><div className="spinner-border text-primary"/></div>}><CC/></Suspense>;
}
