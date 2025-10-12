export type WaterBodyType = 'drain' | 'river-stretch' | 'lake' | 'other';

export interface WaterBodySelection {
  type: WaterBodyType;
  name: string;
  description?: string;
}

export interface ManualWaypoint {
  latitude: number;
  longitude: number;
  name?: string;
}
