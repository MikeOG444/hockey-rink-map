import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  AppBar, 
  Toolbar, 
  Typography,
  InputBase,
  alpha,
  styled
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MapComponent from '../components/map/MapComponent';
import AuthModal from '../components/auth/AuthModal';
import { auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user] = useAuthState(auth);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [mapsApi, setMapsApi] = useState<typeof google.maps | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleMapsLoad = (maps: typeof google.maps) => {
    setMapsApi(maps);
  };

  useEffect(() => {
    if (mapsApi && searchInputRef.current) {
      autocompleteRef.current = new mapsApi.places.Autocomplete(searchInputRef.current, {
        types: ['establishment'],
        componentRestrictions: { country: 'ca' },
        fields: ['geometry', 'name', 'formatted_address']
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
          const location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          // Handle the selected location (you can pass this to MapComponent)
          console.log('Selected location:', location);
        }
      });
    }
  }, [mapsApi]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Hockey Rink Map
          </Typography>
          
          {user && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                inputRef={searchInputRef}
                placeholder="Search for rinks…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          )}

          <Box sx={{ flexGrow: 1 }} />
          
          {user ? (
            <Button 
              color="inherit" 
              onClick={() => auth.signOut()}
            >
              Logout
            </Button>
          ) : (
            <Button 
              color="inherit" 
              onClick={() => setAuthModalOpen(true)}
            >
              Login / Sign Up
            </Button>
          )}
        </Toolbar>
      </AppBar>
      
      <Box sx={{ flexGrow: 1 }}>
        <MapComponent onLoadCallback={handleMapsLoad} />
      </Box>

      <AuthModal 
        open={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </Box>
  );
};

export default LandingPage; 