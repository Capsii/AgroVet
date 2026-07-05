export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import MedicinesContent from './medscontent';

export default function MedicinesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MedicinesContent />
    </Suspense>
  );
}