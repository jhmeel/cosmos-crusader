import { keyframes } from 'styled-components';

export const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(0, 255, 157, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 255, 157, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(0, 255, 157, 0.5);
  }
`;

export const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }`