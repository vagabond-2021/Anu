import React from 'react';
import { Person, WalkTime, WalksByDate } from '../types';
import { DayCard } from './DayCard';

interface WalkTrackerProps {
  walks: WalksByDate;
  onSelect: (date: string, walkTime: WalkTime, person: Person) => void;
  weekDates: Date[];
}

const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export const WalkTracker: React.FC<WalkTrackerProps> = ({ walks, onSelect, weekDates }) => {
  return (
    <main className="w-full max-w-5xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {weekDates.map((date) => {
          const dateKey = formatDateKey(date);
          return (
            <DayCard 
              key={dateKey} 
              date={date} 
              walks={walks[dateKey] || { morning: [], evening: [] }}
              onSelect={onSelect} 
            />
          );
        })}
      </div>
    </main>
  );
};
