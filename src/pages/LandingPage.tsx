import { useState } from 'react';
import { 
  Box, 
  Button, 
  AppBar, 
  Toolbar, 
  Typography,
} from '@mui/material';
import MapComponent from '../components/map/MapComponent';
import AuthModal from '../components/auth/AuthModal';
import { auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import SearchBar from '../components/search/SearchBar';

const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user] = useAuthState(auth);
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Hockey Rink Map
          </Typography>
          
          {user && <SearchBar onLocationSelect={setSelectedLocation} />}

          <Box sx={{ flexGrow: 1 }} />
          
          {user ? (
            <Button color="inherit" onClick={() => auth.signOut()}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={() => setAuthModalOpen(true)}>
              Login / Sign Up
            </Button>
          )}
        </Toolbar>
      </AppBar>
      
      <Box sx={{ flexGrow: 1 }}>
        <MapComponent selectedLocation={selectedLocation} />
      </Box>

      <AuthModal 
        open={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </Box>
  );
};

export default LandingPage; 