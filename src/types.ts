export interface Player {
    health: number;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
  }
  
  export interface Enemy {
    health: number;
    position: { x: number; y: number; z: number };
    type: string;
  }
  
  export interface Gun {
    name: string;
    damage: number;
    fireRate: number;
    ammo: number;
    maxAmmo: number;
  }
  
  export interface Level {
    number: number;
    difficulty: number;
    enemyCount: number;
  }