import React from 'react';
import Skeleton from './Skeleton';

export default function CursosSkeleton() {
  return (
    <div className="flex-1 bg-[#F5F5F5] px-[25px]">
      <div className="mt-5 mb-4">
        <Skeleton width="100%" height={50} borderRadius={25} />
      </div>

      <div className="pb-[120px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center bg-[#E0E0E0] rounded-[20px] p-[18px] mb-[14px]">
            <div className="flex-1 mr-3">
              <Skeleton width="70%" height={18} />
              <Skeleton width="90%" height={13} style={{ marginTop: 8 }} />
            </div>
            <Skeleton width={24} height={24} borderRadius={12} />
          </div>
        ))}
      </div>
    </div>
  );
}
