export type DroneState = 'Idle' | 'Flying' | 'Sampling' | 'Stable' | 'Returning' | 'Completed';

export type WaypointStatus = 'completed' | 'current' | 'remaining';


export interface SensorData {
  temperature: number;
  ph: number;
  turbidity: number;
}

export interface Waypoint {
  id: number;
  latitude: number;
  longitude: number;
  altitude: number;
  status: WaypointStatus;
  sensorData?: SensorData;
  timestamp?: string;
  droneState?: DroneState;
  sealed?: boolean;
  bottleId?: string;
  sampleVolume?: number;
  stationId?: string;
  operatorId?: string;
  chainOfCustodyHash?: string;
}

export interface MissionData {
  waypoints: Waypoint[];
  currentWaypointIndex: number;
  droneState: DroneState;
  missionStartTime?: string;
}

