import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT /api/inventory/[id] - Update inventory item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await request.json();
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const updatedItem = await prisma.inventory.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        quantity: data.quantity,
        minStock: data.threshold,
        price: data.price,
        supplier: data.supplier,
      },
    });

    return NextResponse.json({
      id: updatedItem.id.toString(),
      name: updatedItem.name,
      category: updatedItem.category,
      quantity: updatedItem.quantity,
      threshold: updatedItem.minStock,
      supplier: updatedItem.supplier || "Unknown",
      status:
        updatedItem.quantity === 0
          ? "out-of-stock"
          : updatedItem.quantity <= updatedItem.minStock
            ? "low-stock"
            : "in-stock",
      lastOrdered: updatedItem.updatedAt.toISOString().split("T")[0],
      price: updatedItem.price || 0,
    });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return NextResponse.json(
      { error: "Failed to update inventory item" },
      { status: 500 }
    );
  }
}

// DELETE /api/inventory/[id] - Delete inventory item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    await prisma.inventory.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return NextResponse.json(
      { error: "Failed to delete inventory item" },
      { status: 500 }
    );
  }
}
