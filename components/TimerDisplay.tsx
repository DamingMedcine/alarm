import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { TimerMode } from '../types';

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
  mode: TimerMode;
  onToggle: () => void;
  onReset: () => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  totalTime,
  isActive,
  mode,
  onToggle,
  onReset
}) => {
  // SVG Circle configuration
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / totalTime;
  const strokeDashoffset = circumference - progress * circumference;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getColor = () => {
    switch (mode) {
      case TimerMode.FOCUS: return 'stroke-rose-500 text-rose-500';
      case TimerMode.SHORT_BREAK: return 'stroke-emerald-500 text-emerald-500';
      case TimerMode.LONG_BREAK: return 'stroke-blue-500 text-blue-500';
    }
  };

  const getBgColor = () => {
     switch (mode) {
      case TimerMode.FOCUS: return 'bg-rose-100';
      case TimerMode.SHORT_BREAK: return 'bg-emerald-100';
      case TimerMode.LONG_BREAK: return 'bg-blue-100';
    }
  };

  const getLabel = () => {
    switch (mode) {
      case TimerMode.FOCUS: return '专注时间';
      case TimerMode.SHORT_BREAK: return '短暂休息';
      case TimerMode.LONG_BREAK: return '长休息';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        {/* SVG Ring */}
        <svg className="transform -rotate-90 w-72 h-72" viewBox="0 0 260 260">
          {/* Background Circle */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            className="stroke-gray-200 fill-none"
            strokeWidth="20"
          />
          {/* Progress Circle */}
          <circle
            cx="130"
            cy="130"
            r={radius}
            className={`${getColor()} fill-none transition-all duration-1000 ease-linear`}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          <span className={`text-xl font-bold mb-2 fun-font ${getColor()}`.replace('stroke-', 'text-')}>
            {getLabel()}
          </span>
          <span className="text-6xl font-bold tracking-wider text-slate-700 font-mono">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-6 mt-8">
        <button
          onClick={onToggle}
          className={`
            p-6 rounded-full shadow-lg transition-transform transform active:scale-95 
            ${isActive ? 'bg-amber-400 hover:bg-amber-500' : 'bg-indigo-500 hover:bg-indigo-600'} 
            text-white border-4 border-white
          `}
        >
          {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
        </button>
        
        <button
          onClick={onReset}
          className="p-6 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 shadow-lg transition-transform transform active:scale-95 border-4 border-white"
        >
          <RotateCcw size={40} />
        </button>
      </div>
    </div>
  );
};

export default TimerDisplay;