/*
  Warnings:

  - You are about to drop the column `unit` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `foodId` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `ShoppingListItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Food` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commonPortionSize` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commonPortionUnit` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Made the column `recipeId` on table `MenuItem` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `amount` to the `ShoppingListItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ingredientId` to the `ShoppingListItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_foodId_fkey";

-- DropForeignKey
ALTER TABLE "MenuItem" DROP CONSTRAINT "MenuItem_recipeId_fkey";

-- AlterTable
ALTER TABLE "Food" DROP COLUMN "unit",
ADD COLUMN     "alternativesIds" TEXT[],
ADD COLUMN     "calcium" DOUBLE PRECISION,
ADD COLUMN     "commonPortionSize" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "commonPortionUnit" TEXT NOT NULL,
ADD COLUMN     "fiber" DOUBLE PRECISION,
ADD COLUMN     "iron" DOUBLE PRECISION,
ADD COLUMN     "isGlutenFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLactoseFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNutFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVegan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVegetarian" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "potassium" DOUBLE PRECISION,
ADD COLUMN     "saturatedFat" DOUBLE PRECISION,
ADD COLUMN     "sodium" DOUBLE PRECISION,
ADD COLUMN     "sugar" DOUBLE PRECISION,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "unsaturatedFat" DOUBLE PRECISION,
ADD COLUMN     "vitaminA" DOUBLE PRECISION,
ADD COLUMN     "vitaminC" DOUBLE PRECISION,
ADD COLUMN     "vitaminD" DOUBLE PRECISION,
ADD COLUMN     "vitaminE" DOUBLE PRECISION,
ALTER COLUMN "calories" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Menu" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "foodId",
DROP COLUMN "quantity",
ADD COLUMN     "servings" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "recipeId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isGlutenFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLactoseFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isNutFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVegan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVegetarian" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "type" TEXT,
ALTER COLUMN "calories" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ShoppingListItem" DROP COLUMN "quantity",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ingredientId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Food_name_key" ON "Food"("name");

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
