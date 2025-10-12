import { Waypoint } from '../types/mission';

export const GANGA_WAYPOINTS: Waypoint[] = [
  {
    id: 1,
    latitude: 25.3176,
    longitude: 82.9739,
    altitude: 85,
    status: 'remaining',
    stationId: 'GNG-001',
    operatorId: 'OP-Alpha',
  },
  {
    id: 2,
    latitude: 25.3250,
    longitude: 82.9850,
    altitude: 88,
    status: 'remaining',
    stationId: 'GNG-002',
    operatorId: 'OP-Alpha',
  },
  {
    id: 3,
    latitude: 25.3350,
    longitude: 83.0000,
    altitude: 90,
    status: 'remaining',
    stationId: 'GNG-003',
    operatorId: 'OP-Alpha',
  },
  {
    id: 4,
    latitude: 25.3450,
    longitude: 83.0150,
    altitude: 92,
    status: 'remaining',
    stationId: 'GNG-004',
    operatorId: 'OP-Alpha',
  },
  {
    id: 5,
    latitude: 25.3550,
    longitude: 83.0300,
    altitude: 87,
    status: 'remaining',
    stationId: 'GNG-005',
    operatorId: 'OP-Alpha',
  },
  {
    id: 6,
    latitude: 25.3650,
    longitude: 83.0450,
    altitude: 89,
    status: 'remaining',
    stationId: 'GNG-006',
    operatorId: 'OP-Alpha',
  },
];

export const HOME_POSITION = {
  latitude: 25.3176,
  longitude: 82.9739,
};

export function generateSensorData(waypointId: number) {
  const baseTemp = 22 + Math.random() * 8;
  const basePh = 7.0 + (Math.random() - 0.5) * 2;
  const baseTurbidity = 10 + Math.random() * 40;

  return {
    temperature: parseFloat(baseTemp.toFixed(2)),
    ph: parseFloat(basePh.toFixed(2)),
    turbidity: parseFloat(baseTurbidity.toFixed(2)),
  };
}

export function generateBottleId(waypointId: number): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  return `GNG-${waypointId.toString().padStart(3, '0')}-${timestamp}`;
}

export function generateChainOfCustodyHash(waypointId: number, timestamp: string): string {
  const hashInput = `${waypointId}-${timestamp}-${Math.random()}`;
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(16, '0');
}
