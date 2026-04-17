// seedDatabase.mjs — Reads recipes.json and inserts them into the SQLite database via Prisma
// This is like running a C# "DbInitializer.Seed()" method to populate your database

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';

const prisma = new PrismaClient();

async function seedData() {
  try {
    // Read the JSON file containing our seed recipes
    const data = await fs.readFile('./prisma-backend-tools/recipes.json', 'utf-8');
    const { recipes } = JSON.parse(data);

    // Loop through each recipe and insert it into the database
    // In C#, this would be like: foreach (var recipe in recipes) { db.Recipes.Add(recipe); }
    for (const recipe of recipes) {
      await prisma.recipe.create({
        data: {
          title: recipe.title,
          category: recipe.category,
          prepTime: recipe.prepTime,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
        },
      });
    }

    console.log('✅ Database seeded successfully with', recipes.length, 'recipes!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    // Always disconnect — like disposing a DbContext in C#
    await prisma.$disconnect();
  }
}

seedData();
