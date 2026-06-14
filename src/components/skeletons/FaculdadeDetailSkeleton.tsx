import React from 'react';
import Skeleton from './Skeleton';

const NUM_COURSES = 4;

export default function FaculdadeDetailSkeleton() {
  return (
    <div className="flex-1 bg-[#F5F5F5] px-[25px] pt-[10px]">
      <Skeleton width="100%" height={180} borderRadius={25} />

      <div className="mt-5 mb-5">
        <Skeleton width="80%" height={24} />
        <Skeleton width="100%" height={14} style={{ marginTop: 8 }} />
        <Skeleton width="60%" height={14} style={{ marginTop: 4 }} />
      </div>

      <Skeleton width={180} height={18} style={{ marginTop: 16 }} />

      <div className="pb-[120px]">
        {Array.from({ length: NUM_COURSES }).map((_, i) => (
          <div key={i} className="flex items-center bg-[#E0E0E0] rounded-[16px] p-4 mb-3">
            <div className="flex-1 mr-[10px]">
              <Skeleton width="70%" height={16} />
              <Skeleton width="90%" height={13} style={{ marginTop: 4 }} />
            </div>
            <Skeleton width={22} height={22} borderRadius={11} />
          </div>
        ))}
      </div>
    </div>
  );
}
