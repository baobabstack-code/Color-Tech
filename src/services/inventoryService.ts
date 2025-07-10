import api from './api';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
  supplier: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastOrdered: string;
  price: number;
}

export const inventoryService = {
  async getInventory() {
    if (typeof window === 'undefined') {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'src/data/inventory.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const inventory: InventoryItem[] = JSON.parse(fileContent);
      return inventory;
    } else {
      return [];
    }
  },

  async addItem(item: Omit<InventoryItem, 'id'>) {
    const response = await api.post<InventoryItem>('/inventory', item);
    return response.data;
  },

  async updateItem(id: string, item: Partial<InventoryItem>) {
    const response = await api.put<InventoryItem>(`/inventory/${id}`, item);
    return response.data;
  },

  async deleteItem(id: string) {
    await api.delete(`/inventory/${id}`);
  },

  async orderItems(id: string, quantity: number) {
    const response = await api.post<InventoryItem>(`/inventory/${id}/order`, {
      quantity
    });
    return response.data;
  }
}; 