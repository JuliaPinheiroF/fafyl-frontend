import React from 'react';
import Skeleton from './Skeleton';

const NUM_TAGS = 4;
const NUM_IMPS = 3;

export default function CursoDetailSkeleton() {
  return (
    <div className="flex-1 bg-[#F5F5F5] px-[25px] pt-5">
      <div className="mb-6">
        <Skeleton width="80%" height={24} />
        <Skeleton width="100%" height={14} style={{ marginTop: 6 }} />
      </div>

      <div className="mb-6">
        <Skeleton width={100} height={16} />
        <div className="flex flex-wrap gap-2 mt-[10px]">
          {Array.from({ length: NUM_TAGS }).map((_, i) => (
            <Skeleton key={i} width={70} height={28} borderRadius={20} />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <Skeleton width={120} height={16} />
        <div className="flex flex-wrap gap-2 mt-[10px]">
          {Array.from({ length: NUM_TAGS }).map((_, i) => (
            <Skeleton key={i} width={90} height={28} borderRadius={20} />
          ))}
        </div>
      </div>

      <Skeleton width={200} height={16} style={{ marginTop: 8 }} />

      <div className="pb-[120px]">
        {Array.from({ length: NUM_IMPS }).map((_, i) => (
          <div key={i} className="bg-[#E0E0E0] rounded-[16px] p-4 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton width="60%" height={16} />
                <Skeleton width="40%" height={15} style={{ marginTop: 2 }} />
              </div>
              <Skeleton width={22} height={22} borderRadius={11} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
