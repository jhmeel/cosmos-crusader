import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const OnboardingContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #0f1624 0%, #1b2836 100%);
  overflow: hidden;
`;

const StyledCard = styled(Card)`
  max-width: 100%;
  width: 400px;
  text-align: center;
  background: rgba(31, 38, 48, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

const StepIndicator = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Dot = styled.div<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => (props.active ? '#ffbd44' : '#4a5568')};
  margin: 0 6px;
`;

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Cosmos Crusaders",
      content: "Defend Planet Earth against incoming waves of asteroid invaders. Get ready to lead humanity's ultimate defense!",
    },
    {
      title: "Master the Cosmic Shields",
      content: "Learn to deploy powerful shields to protect Earth from the devastating asteroid onslaught.",
    },
    {
      title: "Collect Celestial Energy",
      content: "Earn energy as you block asteroids. Upgrade your shields and weaponry to fend off bigger threats.",
    },
    {
      title: "Prepare for Battle",
      content: "Connect your control station, fine-tune your defense systems, and get ready for the cosmic showdown!",
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      console.log("Onboarding complete");
    }
  };

  return (
    <OnboardingContainer>
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -60 }}
        transition={{ duration: 0.6 }}
      >
        <StyledCard>
          <CardContent>
            <Typography variant="h4" gutterBottom sx={{ color: '#ffbd44' }}>
              {steps[step].title}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ color: '#e0e0e0' }}>
              {steps[step].content}
            </Typography>
            <Button onClick={handleNext} variant="contained" color="primary" sx={{ mt: 2 }}>
              {step < steps.length - 1 ? "Next" : "Start Your Crusade"}
            </Button>
          </CardContent>
        </StyledCard>
      </motion.div>
      <StepIndicator>
        {steps.map((_, index) => (
          <Dot key={index} active={index === step} />
        ))}
      </StepIndicator>
    </OnboardingContainer>
  );
};

export default Onboarding;
