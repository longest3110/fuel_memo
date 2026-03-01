/**
 * Entry data for fuel consumption records
 */
export interface EntryData {
  userId: string;
  fuelAmount: number; // 給油量 (liters)
  price: number; // 金額 (yen)
  distanceSinceLastRefuel: number; // 前回給油時からの走行距離 (km)
  odometer?: number; // 走行距離（将来用）
  vehicleId?: string; // 車両ID（将来用）
}

/**
 * Entry with id and timestamp
 */
export interface Entry extends EntryData {
  id: string;
  createdAt: Date;
}
