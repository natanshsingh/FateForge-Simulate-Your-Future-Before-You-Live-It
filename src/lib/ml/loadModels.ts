export type UserInput = {
  study_hours: number;
  sleep_hours: number;
  screen_time: number;
  workout: number;
  mood: number;
  deep_work: number;
  streak: number;
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function calculateScores(input: UserInput) {
  const sleepScore =
    input.sleep_hours >= 8
      ? 18
      : input.sleep_hours >= 7
      ? 14
      : input.sleep_hours >= 6
      ? 6
      : -12;

  const studyScore = input.study_hours * 6;
  const deepWorkScore = input.deep_work * 9;
  const workoutScore = input.workout * 10;
  const moodScore = input.mood * 3;
  const streakScore = input.streak * 2.2;
  const screenPenalty = input.screen_time * 6;

  const consistency = clamp(
    Math.round(
      22 +
        studyScore +
        deepWorkScore +
        workoutScore * 0.7 +
        sleepScore +
        streakScore -
        screenPenalty * 0.55
    )
  );

  const burnout = clamp(
    Math.round(
      24 +
        (input.sleep_hours < 6 ? 24 : input.sleep_hours < 7 ? 10 : -8) +
        input.screen_time * 7 -
        input.workout * 6 -
        input.mood * 2.5 -
        input.deep_work * 1.5 +
        (input.study_hours > 6 ? 10 : 0)
    )
  );

  const growth = clamp(
    Math.round(
      18 +
        input.study_hours * 8 +
        input.deep_work * 10 +
        input.workout * 5 +
        input.mood * 2.5 +
        input.streak * 2.8 +
        (input.sleep_hours >= 7 ? 10 : -6) -
        input.screen_time * 4 -
        burnout * 0.18
    )
  );

  return {
    consistency,
    burnout,
    growth,
  };
}