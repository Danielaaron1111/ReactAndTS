// GET /api/recipes — Returns all recipes from the database
// In C#, this is like a controller action: public IActionResult GetAll() => Ok(db.Recipes.ToList());

import prisma from "@/prisma-backend-tools/localClient";

export default async function handler(req, res) {
  // Only allow GET requests — like [HttpGet] in C#
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  try {
    // findMany() is like LINQ's .ToList() — it fetches all rows from the Recipe table
    const recipes = await prisma.recipe.findMany();
    return res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({ error: "Failed to fetch recipes" });
  }
}
