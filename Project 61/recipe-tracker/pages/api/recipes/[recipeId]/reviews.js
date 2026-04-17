// GET and POST /api/recipes/[recipeId]/reviews
// GET  — fetch all reviews for a recipe (like LINQ: db.Reviews.Where(r => r.RecipeId == id))
// POST — add a new review for a recipe (like db.Reviews.Add(newReview))

import prisma from "@/prisma-backend-tools/localClient";

export default async function handler(req, res) {
  const { recipeId } = req.query;

  if (req.method === "GET") {
    try {
      // findMany with a where clause is like LINQ's .Where() filter
      const reviews = await prisma.recipeReview.findMany({
        where: { recipeId: parseInt(recipeId) },
      });
      return res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({ error: "Failed to fetch reviews" });
    }
  }

  if (req.method === "POST") {
    try {
      const { reviewerName, comment, rating } = req.body;

      // create() is like db.Reviews.Add() + db.SaveChanges() in C# Entity Framework
      const newReview = await prisma.recipeReview.create({
        data: {
          recipeId: parseInt(recipeId),
          reviewerName,
          comment,
          rating: parseInt(rating),
        },
      });
      return res.status(201).json(newReview);
    } catch (error) {
      console.error("Error creating review:", error);
      return res.status(500).json({ error: "Failed to create review" });
    }
  }

  // If neither GET nor POST, return 405
  return res.status(405).json({ error: "Method not allowed. Use GET or POST." });
}
