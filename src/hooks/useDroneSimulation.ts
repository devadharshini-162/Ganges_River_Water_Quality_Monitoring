import { useState, useEffect, useCallback } from 'react';
import { Waypoint, DroneState } from '../types/mission';
import { generateSensorData, generateBottleId, generateChainOfCustodyHash, HOME_POSITION } from '../data/sampleData';

interface DroneSimulationState {
  waypoints: Waypoint[];
  dronePosition: [number, number] | null;
  currentWaypointIndex: number;
  droneState: DroneState;
  isSimulating: boolean;
}

export function useDroneSimulation(initialWaypoints: Waypoint[]) {
  const [state, setState] = useState<DroneSimulationState>({
    waypoints: initialWaypoints,
    dronePosition: null,
    currentWaypointIndex: -1,
    droneState: 'Idle',
    isSimulating: false,
  });

  const startSimulation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSimulating: true,
      currentWaypointIndex: 0,
      dronePosition: [initialWaypoints[0].latitude, initialWaypoints[0].longitude],
      droneState: 'Flying',
      waypoints: initialWaypoints.map((wp, idx) => ({
        ...wp,
        status: idx === 0 ? 'current' : 'remaining',
      })),
    }));
  }, [initialWaypoints]);

  const stopSimulation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSimulating: false,
      droneState: 'Idle',
    }));
  }, []);

  useEffect(() => {
    if (!state.isSimulating) return;

    const timer = setInterval(() => {
      setState((prev) => {
        const { currentWaypointIndex, waypoints, droneState } = prev;

        if (currentWaypointIndex >= waypoints.length) {
          return {
            ...prev,
            droneState: 'Returning',
            dronePosition: [HOME_POSITION.latitude, HOME_POSITION.longitude],
          };
        }

        if (droneState === 'Returning') {
          return {
            ...prev,
            droneState: 'Completed',
            isSimulating: false,
          };
        }

        const currentWaypoint = waypoints[currentWaypointIndex];

        if (droneState === 'Flying') {
          return {
            ...prev,
            droneState: 'Stable',
            dronePosition: [currentWaypoint.latitude, currentWaypoint.longitude],
          };
        }

        if (droneState === 'Stable') {
          return {
            ...prev,
            droneState: 'Sampling',
          };
        }

        if (droneState === 'Sampling') {
          const timestamp = new Date().toISOString();
          const sensorData = generateSensorData(currentWaypoint.id);
          const bottleId = generateBottleId(currentWaypoint.id);
          const chainOfCustodyHash = generateChainOfCustodyHash(currentWaypoint.id, timestamp);

          const updatedWaypoints = waypoints.map((wp, idx) => {
            if (idx === currentWaypointIndex) {
              return {
                ...wp,
                status: 'completed' as const,
                sensorData,
                timestamp,
                droneState: 'Sampling' as DroneState,
                sealed: true,
                bottleId,
                sampleVolume: 250,
                chainOfCustodyHash,
              };
            }
            if (idx === currentWaypointIndex + 1) {
              return { ...wp, status: 'current' as const };
            }
            return wp;
          });

          const nextIndex = currentWaypointIndex + 1;

          if (nextIndex >= waypoints.length) {
            return {
              ...prev,
              waypoints: updatedWaypoints,
              currentWaypointIndex: nextIndex,
              droneState: 'Returning',
            };
          }

          return {
            ...prev,
            waypoints: updatedWaypoints,
            currentWaypointIndex: nextIndex,
            droneState: 'Flying',
            dronePosition: [updatedWaypoints[nextIndex].latitude, updatedWaypoints[nextIndex].longitude],
          };
        }

        return prev;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [state.isSimulating]);

  return {
    ...state,
    startSimulation,
    stopSimulation,
  };
}
