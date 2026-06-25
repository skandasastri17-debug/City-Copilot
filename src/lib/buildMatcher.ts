import { BrickInventory, BuildMatch, BuildRecipe } from "../types";

export function getBuildMatches(
  inventory: BrickInventory,
  recipes: BuildRecipe[]
): BuildMatch[] {
  return recipes
    .map((recipe) => {
      const requirementEntries = Object.entries(recipe.requirements);
      const totalRequired = requirementEntries.reduce(
        (sum, [, count]) => sum + count,
        0
      );
      const fulfilled = requirementEntries.reduce((sum, [brickId, count]) => {
        return sum + Math.min(inventory[brickId] ?? 0, count);
      }, 0);
      const missingPieces = requirementEntries.reduce((sum, [brickId, count]) => {
        return sum + Math.max(count - (inventory[brickId] ?? 0), 0);
      }, 0);

      return {
        recipe,
        coverage: totalRequired === 0 ? 1 : fulfilled / totalRequired,
        missingPieces,
      };
    })
    .sort((a, b) => {
      if (b.coverage !== a.coverage) {
        return b.coverage - a.coverage;
      }

      return a.missingPieces - b.missingPieces;
    });
}
