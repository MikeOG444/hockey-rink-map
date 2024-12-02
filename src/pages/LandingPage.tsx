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
  const [searchResults, setSearchResults] = useState<google.maps.places.PlaceResult[]>([]);

  const handleSearchQuery = (query: string) => {
    const mapElement = document.querySelector('div[aria-label="Map"]');
    if (!mapElement) return;
    
    const service = new google.maps.places.PlacesService(mapElement as HTMLDivElement);
    
    service.textSearch(
      {
        query: query,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          setSearchResults(results);
          setSelectedLocation(null); // Clear single selection when showing search results
        }
      }
    );
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Hockey Rink Map
          </Typography>
          
          {user && (
            <SearchBar 
              onLocationSelect={setSelectedLocation}
              onSearchQuery={handleSearchQuery}
            />
          )}

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
        <MapComponent 
          selectedLocation={selectedLocation} 
          searchResults={searchResults}
        />
      </Box>

      <AuthModal 
        open={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </Box>
  );
};

export default LandingPage; 