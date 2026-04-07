// Draw logic
export function performDraw(participants: string[]): string[] {
  // Shuffle and pair
  return participants.sort(() => Math.random() - 0.5);
}
