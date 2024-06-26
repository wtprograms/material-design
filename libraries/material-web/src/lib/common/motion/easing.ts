export const EASING = {
  emphasized: {
    default: 'cubic-bezier(0.2, 0, 0, 1)',
    accelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
    decelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  },
  standard: {
    default: 'cubic-bezier(0.2, 0, 0, 1)',
    accelerate: 'cubic-bezier(0.3, 0, 1, 1)',
    decelerate: 'cubic-bezier(0, 0, 0, 1)',
  },
  legacy: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  },
  linear: 'cubic-bezier(0, 0, 1, 1)',
};
