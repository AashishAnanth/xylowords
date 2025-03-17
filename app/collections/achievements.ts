export interface Achievement {
    id: string;
    name: string;
    condition: (stats: { timeTrials: number; auraCount: number }) => boolean;
  }
  
  export const achievements: Achievement[] = [
    {
      id: "play_time_trial_1",
      name: "Play a time trial.",
      condition: (stats) => stats.timeTrials >= 1,
    },
    {
      id: "play_time_trial_5",
      name: "Play 5 time trials.",
      condition: (stats) => stats.timeTrials >= 5,
    },
    {
      id: "play_time_trial_20",
      name: "Play 20 time trials.",
      condition: (stats) => stats.timeTrials >= 20,
    },
    {
      id: "aura_count_1000",
      name: "Achieve an aura count of 1000.",
      condition: (stats) => stats.auraCount >= 1000,
    },
    {
      id: "aura_count_5000",
      name: "Achieve an aura count of 5000.",
      condition: (stats) => stats.auraCount >= 5000,
    },
    {
      id: "aura_count_25000",
      name: "Achieve an aura count of 25000.",
      condition: (stats) => stats.auraCount >= 25000,
    },
    {
      id: "aura_count_100000",
      name: "Achieve an aura count of 100000.",
      condition: (stats) => stats.auraCount >= 100000,
    },
  ];