import React from 'react';
import { Person, Scores } from '../types';
import { PawPrintIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

interface HeaderProps {
  scores: Scores;
  onReset: () => void;
  weekDates: Date[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

const ScoreCard: React.FC<{ person: Person; score: number; colorClass: string }> = ({ person, score, colorClass }) => (
    <div className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-md ${colorClass}`}>
        <div className="text-2xl font-bold text-white">{person}</div>
        <div className="mt-2 text-5xl font-mono font-extrabold text-white">{score}</div>
    </div>
);

const PieChart: React.FC<{ scores: Scores }> = ({ scores }) => {
    const total = scores[Person.Anu] + scores[Person.Aaku];
    if (total === 0) {
        return (
            <div className="flex items-center justify-center h-48 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-slate-500 dark:text-slate-400">No walks logged for this week.</p>
            </div>
        );
    }

    const anuPercent = (scores[Person.Anu] / total) * 100;
    const aakuPercent = 100 - anuPercent;

    const circumference = 2 * Math.PI * 40;
    const anuStrokeDashoffset = circumference - (anuPercent / 100) * circumference;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-pink-500" strokeWidth="15" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    <circle 
                        className="text-blue-500" 
                        strokeWidth="15" 
                        strokeDasharray={circumference}
                        strokeDashoffset={anuStrokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                        transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">{total}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Walks</span>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <div>
                        <span className="font-bold">{Person.Anu}</span>: {scores[Person.Anu]} walks ({anuPercent.toFixed(0)}%)
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                    <div>
                        <span className="font-bold">{Person.Aaku}</span>: {scores[Person.Aaku]} walks ({aakuPercent.toFixed(0)}%)
                    </div>
                </div>
            </div>
        </div>
    );
};


export const Header: React.FC<HeaderProps> = ({ scores, onReset, weekDates, onPrevWeek, onNextWeek }) => {
  const formatOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const startDate = weekDates[0]?.toLocaleDateString('en-US', formatOptions) || '';
  const endDate = weekDates[6]?.toLocaleDateString('en-US', formatOptions) || '';
  const year = weekDates[0]?.getFullYear();
  const imageUrl = "https://images.unsplash.com/photo-1590189191985-7521cce3b5f7?q=80&w=2070&auto=format&fit=crop";

  return (
    <header className="w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div 
        className="relative rounded-xl shadow-lg overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
        <div className="relative text-center p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center justify-center gap-3">
            <PawPrintIcon className="w-10 h-10 text-cyan-400" />
            Auri's Walk Tracker
          </h1>
          <p className="text-slate-200 mt-2">Who's a good human? Let's find out.</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <button 
            onClick={onPrevWeek} 
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Previous week"
        >
          <ChevronLeftIcon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>
        <div className="text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-200">{startDate} - {endDate}</h2>
            <p className="text-slate-500 dark:text-slate-400">{year}</p>
        </div>
        <button 
            onClick={onNextWeek} 
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Next week"
        >
          <ChevronRightIcon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6">
        <ScoreCard person={Person.Anu} score={scores[Person.Anu]} colorClass="bg-blue-500" />
        <ScoreCard person={Person.Aaku} score={scores[Person.Aaku]} colorClass="bg-pink-500" />
      </div>

      <div>
        <PieChart scores={scores} />
      </div>

      <div className="text-center">
        <button 
          onClick={onReset}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
        >
          Reset Week
        </button>
      </div>
    </header>
  );
};