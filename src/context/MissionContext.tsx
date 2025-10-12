// src/context/MissionContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Waypoint } from '../types/mission';

interface MissionContextType {
  waypoints: Waypoint[];
  setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>>;
  dronePosition: [number, number] | null;
  setDronePosition: React.Dispatch<React.SetStateAction<[number, number] | null>>;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [dronePosition, setDronePosition] = useState<[number, number] | null>(null);

  return (
    <MissionContext.Provider value={{ waypoints, setWaypoints, dronePosition, setDronePosition }}>
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => {
  const context = useContext(MissionContext);
  if (!context) throw new Error("useMission must be used within a MissionProvider");
  return context;
};
