// GET /api/recipes/[recipeId] — Returns a single recipe by its ID
// In C#, this is like: public IActionResult GetById(int id) => Ok(db.Recipes.Find(id));

import prisma from "@/prisma-backend-tools/localClient";

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  try {
    // req.query.recipeId comes from the filename [recipeId].js — like a route parameter in C#
    const { recipeId } = req.query;

    // findUnique is like LINQ's .FirstOrDefault(r => r.Id == id)
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(recipeId) },
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    return res.status(200).json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return res.status(500).json({ error: "Failed to fetch recipe" });
  }
}
