const handleGoogleSignIn = async () => {
  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, provider);
    console.log('Sign-in successful:', result.user.email);
  } catch (error) {
    console.error('Google sign-in error:', error.code, error.message);
    if (error.code === 'auth/popup-closed-by-user') {
      // Handle popup closed
    } else if (error.code === 'auth/popup-blocked') {
      // Handle popup blocked
    }
  }
}; 