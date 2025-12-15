/**
 * TypeScript interfaces and types for Portfolio Scene
 */

export interface MousePosition {
  x: number;
  y: number;
}

export interface SceneState {
  scroll: number;
  mouse: MousePosition;
  audio: number;
  time: number;
}

export interface DisposableResource {
  dispose(): void;
}
