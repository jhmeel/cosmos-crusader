import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Suspense } from 'react';

const MarketplaceContainer = styled(Box)`
  padding: 20px;
  padding-bottom: 76px;
  background: linear-gradient(135deg, #0f1624 0%, #1b2836 100%);
`;

const StyledCard = styled(Card)`
  background: rgba(31, 38, 48, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ships = [
  { id: 1, name: "Asteroid Defender", price: 500, glbPath: "/model/asteroid.glb" },
];

const ShipViewer: React.FC<{ glbPath: string }> = ({ glbPath }) => {
  return (
    <Canvas style={{ height: 300 }}>
      <Suspense fallback={<Typography variant="body2" color="text.secondary">Loading 3D model...</Typography>}>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <GLTFModel glbPath={glbPath} />
      </Suspense>
    </Canvas>
  );
};

const GLTFModel: React.FC<{ glbPath: string }> = ({ glbPath }) => {
  const [gltf, setGltf] = React.useState<any>(null);

  React.useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(glbPath, (gltf) => setGltf(gltf));
  }, [glbPath]);

  return gltf ? <primitive object={gltf.scene} scale={2} /> : null;
};

const Marketplace: React.FC = () => {
  return (
    <MarketplaceContainer>
      <Typography variant="h4" gutterBottom sx={{ color: '#ffbd44' }}>
        Cosmos Bazaar
      </Typography>
      <Grid container spacing={3}>
        {ships.map((ship) => (
          <Grid item xs={12} sm={6} md={4} key={ship.id}>
            <StyledCard>
              <ShipViewer glbPath={ship.glbPath} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ color: '#e0e0e0' }}>
                  {ship.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ color: '#a0a0a0' }}>
                  Price: {ship.price} ELF
                </Typography>
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  Purchase
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </MarketplaceContainer>
  );
};

export default Marketplace;
