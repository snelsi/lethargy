export const scrollDirections = ["up", "down", "left", "right"] as const;

export type ScrollDirection = (typeof scrollDirections)[number];
