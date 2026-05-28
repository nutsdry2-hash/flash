import { Suspense } from 'react';
import PC from './PC';
export default function P() {
  return <Suspense fallback={<div className="text-center p-5"><div className="spinner-border text-primary"/></div>}><PC/></Suspense>;
}
