// GET and POST /api/favorites
// GET  — return all favorites with their recipe data (like db.Favorites.Include(f => f.Recipe))
// POST — save a new favorite (like db.Favorites.Add(new Favorite { RecipeId = id }))

import prisma from "@/prisma-backend-tools/localClient";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // include: { recipe: true } is like .Include(f => f.Recipe) in Entity Framework
      // It joins the Recipe table so we get full recipe data with each favorite
      const favorites = await prisma.favoriteRecipe.findMany({
        include: { recipe: true },
      });
      return res.status(200).json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return res.status(500).json({ error: "Failed to fetch favorites" });
    }
  }

  if (req.method === "POST") {
    try {
      const { recipeId } = req.body;

      const newFavorite = await prisma.favoriteRecipe.create({
        data: { recipeId: parseInt(recipeId) },
        include: { recipe: true }, // return the full recipe data with the new favorite
      });
      return res.status(201).json(newFavorite);
    } catch (error) {
      console.error("Error saving favorite:", error);
      return res.status(500).json({ error: "Failed to save favorite" });
    }
  }

  return res.status(405).json({ error: "Method not allowed. Use GET or POST." });
}
