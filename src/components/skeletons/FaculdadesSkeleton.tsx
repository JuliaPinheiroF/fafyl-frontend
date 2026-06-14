import React from 'react';
import Skeleton from './Skeleton';

export default function FaculdadesSkeleton() {
  return (
    <div className="flex-1 bg-[#F5F5F5] px-[25px]">
      <div className="mt-5 mb-4">
        <Skeleton width="100%" height={50} borderRadius={25} />
      </div>

      <div className="pb-[120px]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#E0E0E0] rounded-[25px] overflow-hidden mb-5">
            <Skeleton width="100%" height={100} borderRadius={0} />
            <div className="p-4">
              <Skeleton width="70%" height={16} />
              <Skeleton width="90%" height={12} style={{ marginTop: 8 }} />
              <Skeleton width="50%" height={12} style={{ marginTop: 6 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
