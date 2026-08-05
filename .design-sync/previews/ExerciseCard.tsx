import React from 'react';
import { ExerciseCard, ProgressBar, SetRow } from 'fitness-pwa-ds';

const surface: React.CSSProperties = {
  background: 'var(--bg, #080d14)',
  padding: 16,
  borderRadius: 14,
};

export const Collapsed = () => (
  <div style={surface}>
    <ExerciseCard number={2} name="Incline Dumbbell Press" muscles="Upper chest, Front delts" meta="4 × 8" />
  </div>
);

export const Expanded = () => (
  <div style={surface}>
    <ExerciseCard number={1} name="Bench Press" muscles="Chest, Triceps" meta="4 × 10" defaultOpen>
      <ProgressBar current={2} total={4} label="sets" />
      <div className="sets-list">
        <SetRow setNumber={1} weight={80} reps={10} unit="kg" done />
        <SetRow setNumber={2} weight={80} reps={10} unit="kg" done />
        <SetRow setNumber={3} weight={82.5} reps={8} unit="kg" lastHint="Last time: 80 kg × 8" />
      </div>
    </ExerciseCard>
  </div>
);

export const Complete = () => (
  <div style={surface}>
    <ExerciseCard number={3} name="Cable Fly" muscles="Chest" meta="3 × 12" complete />
  </div>
);

export const Timed = () => (
  <div style={surface}>
    <ExerciseCard number={4} name="Treadmill Cooldown" muscles="Cardio" meta="10 min" />
  </div>
);
