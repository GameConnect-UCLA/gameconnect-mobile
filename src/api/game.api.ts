import { mockGameProfiles } from "@/src/hooks/mock-data/mock-game";
import type { GameProfile } from "@/src/types/game.types";

const simulateLatency = () => new Promise((res) => setTimeout(res, 200));

export async function searchGameProfiles(
  query: string,
): Promise<GameProfile[]> {
  await simulateLatency();
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return mockGameProfiles.filter((g) =>
    g.title.toLowerCase().includes(lower),
  );
}
