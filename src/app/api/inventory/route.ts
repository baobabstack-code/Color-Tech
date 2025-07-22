import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/inventory - Get all inventory items
export async function GET() {
  try {
    const inventory = await prisma.inventory.findMany({
      orderBy: { name: "asc" },
    });

    // Transform database data to match frontend interface
    const transformedInventory = inventory.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      threshold: item.minStock,
      supplier: item.supplier || "Unknown",
      status:
        item.quantity === 0
          ? "out-of-stock"
          : item.quantity <= item.minStock
            ? "low-stock"
            : "in-stock",
      lastOrdered: item.updatedAt.toISOString().split("T")[0],
      price: item.price || 0,
    }));

    return NextResponse.json(transformedInventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

// POST /api/inventory - Create new inventory item
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const newItem = await prisma.inventory.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        quantity: data.quantity,
        minStock: data.threshold || 0,
        price: data.price,
        supplier: data.supplier,
        status: "active",
      },
    });

    return NextResponse.json({
      id: newItem.id.toString(),
      name: newItem.name,
      category: newItem.category,
      quantity: newItem.quantity,
      threshold: newItem.minStock,
      supplier: newItem.supplier || "Unknown",
      status:
        newItem.quantity === 0
          ? "out-of-stock"
          : newItem.quantity <= newItem.minStock
            ? "low-stock"
            : "in-stock",
      lastOrdered: newItem.updatedAt.toISOString().split("T")[0],
      price: newItem.price || 0,
    });
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return NextResponse.json(
      { error: "Failed to create inventory item" },
      { status: 500 }
    );
  }
}
