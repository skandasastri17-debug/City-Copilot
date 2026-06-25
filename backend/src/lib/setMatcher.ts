import { RebrickableSetPart, RebrickableSetSummary } from "../types.js";

export function scoreSetMatches(
  inventory: Record<string, number>,
  setPartsMap: Map<string, RebrickableSetPart[]>,
  setMetaMap: Map<string, RebrickableSetSummary>
) {
  return Array.from(setPartsMap.entries())
    .map(([setNum, parts]) => {
      const totalRequired = parts.reduce((sum, part) => sum + part.quantity, 0);
      const ownedPieces = parts.reduce((sum, part) => {
        const inventoryKey = `${part.part.part_num}_${part.color.id}`;
        return sum + Math.min(inventory[inventoryKey] ?? 0, part.quantity);
      }, 0);
      const missingPieces = Math.max(totalRequired - ownedPieces, 0);
      const meta = setMetaMap.get(setNum);

      return {
        id: setNum,
        setNum,
        name: meta?.name ?? setNum,
        year: meta?.year,
        numParts: meta?.num_parts,
        setImgUrl: meta?.set_img_url,
        setUrl: meta?.set_url,
        theme: meta?.theme_name,
        coverage: totalRequired === 0 ? 0 : ownedPieces / totalRequired,
        ownedPieces,
        totalRequired,
        missingPieces,
      };
    })
    .filter((match) => match.coverage > 0)
    .sort((a, b) => {
      if (b.coverage !== a.coverage) {
        return b.coverage - a.coverage;
      }
      if (a.missingPieces !== b.missingPieces) {
        return a.missingPieces - b.missingPieces;
      }
      return (a.numParts ?? Number.MAX_SAFE_INTEGER) - (b.numParts ?? Number.MAX_SAFE_INTEGER);
    })
    .slice(0, 8);
}
