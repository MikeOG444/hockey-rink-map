import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { LoadScript } from '@react-google-maps/api';
import LandingPage from './pages/LandingPage';

const theme = createTheme();

const libraries: ("places" | "drawing" | "geometry" | "visualization" | "marker")[] = ["places", "marker"];

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
        libraries={libraries}
      >
        <LandingPage />
      </LoadScript>
    </ThemeProvider>
  );
}

export default App;
