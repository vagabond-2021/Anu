import React from 'react';
import { Person } from '../types';

interface WalkSelectorProps {
  selectedPersons: Person[];
  onSelect: (person: Person) => void;
}

const PersonButton: React.FC<{
  person: Person;
  isSelected: boolean;
  onClick: () => void;
  colorClasses: string;
}> = ({ person, isSelected, onClick, colorClasses }) => {
  const baseClasses = "w-full py-2 px-3 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-700";
  const selectedClasses = isSelected ? `${colorClasses} text-white shadow` : "bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500";
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${selectedClasses}`}>
      {person}
    </button>
  );
};

export const WalkSelector: React.FC<WalkSelectorProps> = ({ selectedPersons, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      <PersonButton 
        person={Person.Anu}
        isSelected={selectedPersons.includes(Person.Anu)}
        onClick={() => onSelect(Person.Anu)}
        colorClasses="bg-blue-500 focus:ring-blue-400"
      />
      <PersonButton 
        person={Person.Aaku}
        isSelected={selectedPersons.includes(Person.Aaku)}
        onClick={() => onSelect(Person.Aaku)}
        colorClasses="bg-pink-500 focus:ring-pink-400"
      />
    </div>
  );
};
