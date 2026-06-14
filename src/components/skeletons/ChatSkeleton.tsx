import React from 'react';
import Skeleton from './Skeleton';

export default function ChatSkeleton() {
  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex items-end gap-2 self-start">
        <div className="w-8 h-8 rounded-full bg-[#E0E0E0]" />
        <Skeleton width={200} height={40} borderRadius={16} />
      </div>

      <div className="self-end">
        <Skeleton width={150} height={36} borderRadius={16} />
      </div>

      <div className="flex items-end gap-2 self-start">
        <div className="w-8 h-8 rounded-full bg-[#E0E0E0]" />
        <Skeleton width={180} height={40} borderRadius={16} />
      </div>

      <div className="flex items-end gap-2 self-start">
        <div className="w-8 h-8 rounded-full bg-[#E0E0E0]" />
        <Skeleton width={220} height={44} borderRadius={16} />
      </div>
    </div>
  );
}
