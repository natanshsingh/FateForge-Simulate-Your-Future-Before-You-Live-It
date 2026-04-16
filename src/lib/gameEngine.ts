export function calculateXp(
    input: any,
    consistency: number,
    burnout: number,
    growth: number
  ) {
    let xp =
      growth * 2 +
      consistency * 1.5 +
      input.deep_work * 10 +
      input.streak * 3;
  
    if (burnout > 70) xp *= 0.7;
  
    return Math.max(0, Math.round(xp));
  }
  
  export function calculateLevel(xp: number) {
    return Math.max(1, Math.floor(xp / 120) + 1);
  }
  
  export function getRank(heroClass?: string, level: number = 1) {
    if (level >= 25) return "Mythic";
    if (level >= 18) return "Legend";
    if (level >= 12) return "Warlord";
    if (level >= 7) return "Elite";
    if (level >= 3) return "Knight";
    return "Novice";
  }
  
  export function getAchievements(
    input: any,
    consistency: number,
    burnout: number,
    growth: number
  ) {
    const achievements: string[] = [];
  
    if (consistency >= 80) achievements.push("Iron Discipline");
    if (growth >= 85) achievements.push("Ascendant");
    if (burnout <= 25) achievements.push("Pure Mind");
    if (input.streak >= 7) achievements.push("Unbroken Streak");
    if (input.deep_work >= 4) achievements.push("Deep Focus");
  
    return achievements;
  }