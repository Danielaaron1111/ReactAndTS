// DELETE /api/favorites/[favoriteId] — Remove a favorite by its ID
// Like a C# controller: [HttpDelete("{id}")] public IActionResult Delete(int id)

import prisma from "@/prisma-backend-tools/localClient";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed. Use DELETE." });
  }

  try {
    const { favoriteId } = req.query;

    // delete() is like db.Favorites.Remove(favorite) + db.SaveChanges()
    await prisma.favoriteRecipe.delete({
      where: { id: parseInt(favoriteId) },
    });

    return res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    return res.status(500).json({ error: "Failed to remove favorite" });
  }
}
