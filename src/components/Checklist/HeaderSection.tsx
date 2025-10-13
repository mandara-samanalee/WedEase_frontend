import React from "react";
import { Bucket } from "./ChecklistTypes";

interface Props {
  progress: number;
  total: number;
  activeBucket: Bucket | "all";
  setActiveBucket: (b: Bucket | "all") => void;
  buckets: { key: Bucket; label: string }[];
  bucketCount: (k: Bucket) => number;
}

export const Header: React.FC<Props> = ({
  progress,
  total,
  activeBucket,
  setActiveBucket,
  buckets,
  bucketCount,
}) => {
  const circleLength = 283;
  const circleOffset = circleLength - (circleLength * progress) / 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent mb-1">
            Create Checklist
          </h1>
          <p className="text-gray-600">Plan everything from 6 months out to the day of.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" className="stroke-brand-offWhite" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#overallGradient)"
                strokeWidth="8"
                strokeDasharray={circleLength}
                strokeDashoffset={circleOffset}
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="overallGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" className="text-brand-violet" />
                  <stop offset="100%" stopColor="currentColor" className="text-brand-pink" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-gray-900 font-medium">
              {progress}%
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-600">All ({total})</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1.5 rounded-full text-sm border ${activeBucket === "all" ? "bg-purple-600 text-white border-purple-600" : "text-gray-600 hover:bg-gray-50 border-gray-300"}`}
          onClick={() => setActiveBucket("all")}
        >
          All ({total})
        </button>

        {buckets.map((b) => (
          <button
            key={b.key}
            className={`px-3 py-1.5 rounded-full text-sm border ${activeBucket === b.key ? "bg-purple-600 text-white border-purple-600" : "text-gray-600 hover:bg-gray-50 border-gray-300"}`}
            onClick={() => setActiveBucket(b.key)}
          >
            {b.label} ({bucketCount(b.key)})
          </button>
        ))}
      </div>
    </div>
  );
};