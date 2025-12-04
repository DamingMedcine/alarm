import React from 'react';
import { Bot, Sparkles, MessageCircleHeart } from 'lucide-react';
import { CompanionState } from '../types';

interface CompanionProps {
  state: CompanionState;
}

const Companion: React.FC<CompanionProps> = ({ state }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-sky-200 relative mt-4 mx-4 md:mx-0">
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-sky-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm">
        <Bot size={18} />
        番茄小超人
      </div>

      <div className="flex flex-col items-center text-center">
        {state.isLoading ? (
          <div className="animate-pulse flex flex-col items-center">
             <Sparkles className="text-amber-400 mb-2 animate-spin" size={32} />
             <p className="text-slate-400 text-sm">正在思考有趣的事情...</p>
          </div>
        ) : (
          <div className="animate-fade-in">
             <div className="mb-3 text-4xl">
               {state.emotion === 'happy' && '😊'}
               {state.emotion === 'thinking' && '🤔'}
               {state.emotion === 'celebrating' && '🎉'}
               {state.emotion === 'sleepy' && '💤'}
             </div>
             <p className="text-lg text-slate-700 fun-font leading-relaxed">
               “{state.message}”
             </p>
          </div>
        )}
      </div>
      
      {/* Decorative dots */}
      <div className="absolute bottom-3 right-3 text-sky-100">
        <MessageCircleHeart size={24} />
      </div>
    </div>
  );
};

export default Companion;