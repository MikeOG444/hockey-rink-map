import { useState } from 'react';
import { Box, Modal, Tab, Tabs, Button, Divider } from '@mui/material';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { auth } from '../../config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [tab, setTab] = useState(0);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        width: 400,
        borderRadius: 2,
      }}>
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} centered>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>
        {tab === 0 ? <LoginForm onClose={onClose} /> : <SignupForm onClose={onClose} />}
        
        <Box sx={{ my: 2 }}>
          <Divider>OR</Divider>
        </Box>

        <Button 
          fullWidth 
          variant="outlined" 
          onClick={handleGoogleSignIn}
          sx={{ mt: 1 }}
        >
          Continue with Google
        </Button>
      </Box>
    </Modal>
  );
};

export default AuthModal; 