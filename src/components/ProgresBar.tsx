import React from 'react'


type ProgressBarProps = {
  progress: number;
};

function ProgresBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-grayscale-800">
      <div
        className="h-full bg-primary-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default ProgresBar