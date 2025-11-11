import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { WalkTracker } from './components/WalkTracker';
import { Person, Scores, WalkTime, WalksByDate } from './types';

const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const getWeekDays = (relativeDate: Date): Date[] => {
  const start = new Date(relativeDate);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(start.setDate(diff));

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    return day;
  });
};


const getInitialWalks = (): WalksByDate => {
  try {
    const item = window.localStorage.getItem('dogWalks');
    if (item) {
      const parsed = JSON.parse(item);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        // Data migration for backward compatibility.
        // Old format: { morning: 'Anu' | 'Aaku' | null }
        // New format: { morning: ['Anu' | 'Aaku'] }
        Object.keys(parsed).forEach(dateKey => {
          const day = parsed[dateKey];
          if (day) {
            if (day.morning && typeof day.morning === 'string') {
              day.morning = [day.morning];
            } else if (day.morning === null || day.morning === undefined) {
              day.morning = [];
            }
            
            if (day.evening && typeof day.evening === 'string') {
              day.evening = [day.evening];
            } else if (day.evening === null || day.evening === undefined) {
              day.evening = [];
            }
          }
        });
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Error reading or migrating localStorage data:', error);
  }
  
  return {};
};


function App() {
  const [walks, setWalks] = useState<WalksByDate>(getInitialWalks);
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekDates = useMemo(() => getWeekDays(currentDate), [currentDate]);

  useEffect(() => {
    try {
      window.localStorage.setItem('dogWalks', JSON.stringify(walks));
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  }, [walks]);

  const handleSelectWalker = useCallback((date: string, walkTime: WalkTime, person: Person) => {
    setWalks(prevWalks => {
      const newWalks = { ...prevWalks };
      const dayWalks = newWalks[date] || { morning: [], evening: [] };
      const currentWalkers = dayWalks[walkTime] || [];
      
      const personIsSelected = currentWalkers.includes(person);
      
      let nextWalkers;
      if (personIsSelected) {
        nextWalkers = currentWalkers.filter(p => p !== person);
      } else {
        nextWalkers = [...currentWalkers, person].sort();
      }
      
      newWalks[date] = { ...dayWalks, [walkTime]: nextWalkers };
      
      return newWalks;
    });
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm('Are you sure you want to reset the current week? This cannot be undone.')) {
      setWalks(prevWalks => {
        const newWalks = { ...prevWalks };
        weekDates.forEach(date => {
          const dateKey = formatDateKey(date);
          newWalks[dateKey] = { morning: [], evening: [] };
        });
        return newWalks;
      });
    }
  }, [weekDates]);

  const handlePrevWeek = useCallback(() => {
    setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() - 7);
        return newDate;
    })
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() + 7);
        return newDate;
    })
  }, []);

  const scores = useMemo<Scores>(() => {
    return weekDates.reduce((acc, date) => {
      const dateKey = formatDateKey(date);
      const dailyWalks = walks[dateKey];
      if (dailyWalks) {
        (dailyWalks.morning || []).forEach(person => acc[person]++);
        (dailyWalks.evening || []).forEach(person => acc[person]++);
      }
      return acc;
    }, { [Person.Anu]: 0, [Person.Aaku]: 0 });
  }, [walks, weekDates]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 py-8">
      <Header 
        scores={scores} 
        onReset={handleReset} 
        weekDates={weekDates}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
      />
      <WalkTracker 
        walks={walks} 
        onSelect={handleSelectWalker} 
        weekDates={weekDates}
      />
      <footer className="text-center text-slate-400 dark:text-slate-500 mt-8 text-sm">
        <p>Made with ❤️ for the four-legged family member.</p>
      </footer>
    </div>
  );
}

export default App;
