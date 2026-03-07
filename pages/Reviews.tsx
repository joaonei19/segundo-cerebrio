import React, { useState } from 'react';
import { REVIEW_RITUALS } from '../constants';
import { CheckCircle2, Circle } from 'lucide-react';

const Reviews: React.FC = () => {
  const [activeReviewId, setActiveReviewId] = useState(REVIEW_RITUALS[0].id);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (reviewId: string, itemIdx: number) => {
    const key = `${reviewId}-${itemIdx}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const activeReview = REVIEW_RITUALS.find(r => r.id === activeReviewId);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-8">
      {/* Sidebar Selection */}
      <div className="w-full md:w-64 flex-none space-y-2">
        <h2 className="text-xl font-bold text-slate-900 mb-4 px-2">Rituais de Revisão</h2>
        {REVIEW_RITUALS.map(review => (
          <button
            key={review.id}
            onClick={() => setActiveReviewId(review.id)}
            className={`
              w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${activeReviewId === review.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'}
            `}
          >
            {review.title}
          </button>
        ))}
      </div>

      {/* Checklist Area */}
      {activeReview && (
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <h1 className="text-3xl font-bold text-slate-900">{activeReview.title}</h1>
            <p className="text-slate-500 mt-2">Frequência: <span className="font-semibold text-indigo-600">{activeReview.frequency}</span></p>
          </div>
          
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="space-y-4 max-w-3xl">
              {activeReview.items.map((item, idx) => {
                const isChecked = checkedItems[`${activeReview.id}-${idx}`];
                return (
                  <div 
                    key={idx}
                    onClick={() => toggleItem(activeReview.id, idx)}
                    className={`
                      flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200
                      ${isChecked 
                        ? 'bg-green-50 border-green-200 opacity-70' 
                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'}
                    `}
                  >
                    <div className={`mt-0.5 transition-colors ${isChecked ? 'text-green-600' : 'text-slate-300'}`}>
                      {isChecked ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </div>
                    <span className={`text-lg ${isChecked ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>

            {activeReview.items.every((_, idx) => checkedItems[`${activeReview.id}-${idx}`]) && (
              <div className="mt-8 p-4 bg-green-100 text-green-800 rounded-lg text-center font-medium animate-in fade-in slide-in-from-bottom-4">
                🎉 Revisão completa! Você está no controle.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
