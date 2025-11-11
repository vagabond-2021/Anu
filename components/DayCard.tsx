import React from 'react';
import { DailyWalks, Person, WalkTime } from '../types';
import { WalkSelector } from './WalkSelector';
import { SunIcon, MoonIcon } from './icons';

interface DayCardProps {
  date: Date;
  walks: DailyWalks;
  onSelect: (date: string, walkTime: WalkTime, person: Person) => void;
}

const WalkSlot: React.FC<{
    label: string;
    icon: React.ReactNode;
    selectedPersons: Person[];
    onSelect: (person: Person) => void;
}> = ({ label, icon, selectedPersons, onSelect }) => (
    <div>
        <div className="flex items-center space-x-2">
            {icon}
            <h4 className="font-semibold text-slate-600 dark:text-slate-300">{label}</h4>
        </div>
        <WalkSelector selectedPersons={selectedPersons} onSelect={onSelect} />
    </div>
);

const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export const DayCard: React.FC<DayCardProps> = ({ date, walks, onSelect }) => {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNumber = date.getDate();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 md:p-6 flex flex-col space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{dayName}</h3>
        <p className="text-3xl font-mono font-bold text-slate-400 dark:text-slate-500">{dayNumber}</p>
      </div>
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
        <WalkSlot
            label="Morning"
            icon={<SunIcon className="w-5 h-5 text-yellow-500" />}
            selectedPersons={walks.morning}
            onSelect={(person) => onSelect(formatDateKey(date), WalkTime.Morning, person)}
        />
        <WalkSlot
            label="Evening"
            icon={<MoonIcon className="w-5 h-5 text-indigo-400" />}
            selectedPersons={walks.evening}
            onSelect={(person) => onSelect(formatDateKey(date), WalkTime.Evening, person)}
        />
      </div>
    </div>
  );
};
