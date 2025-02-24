import { Box, Button, Stack, Typography } from '@mui/material'
import './App.css'
import { useAuth } from './useAuth/useAuth'
import LaunchIcon from '@mui/icons-material/Launch'

import logo from './assets/images/logo.png'

function App() {
  const {
    logout,
    user,
    accountConsole,
    keycloakInfo,
    loginUpdateProfile,
    loginUpdatePassword,
    deleteProfile,
    register,
  } = useAuth()

  const { clientId, realm } = keycloakInfo

  return (
    <Stack gap={2} alignItems="start">
      <Box width={100} sx={{ background: '#FFFFFF', borderRadius: 2, alignSelf: 'center' }} p={2}>
        <img src={logo} alt="logo" width="100px" />{' '}
      </Box>
      <Typography variant="h3">Welcome to: {realm}</Typography>
      <Typography variant="h3">Keycloak client: {clientId}</Typography>
      <Typography variant="h4">User: {user?.preferred_username}</Typography>
      <Box textAlign="left">
        <Typography variant="h6">User Info</Typography>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </Box>

      <Stack gap={2} alignItems="start">
        <Typography variant="h6">Actions that can initiate from the app </Typography>
        <Stack gap={1} direction="row" alignItems="center" justifyContent="space-between">
          <Button
            endIcon={<LaunchIcon />}
            sx={{ width: '350px' }}
            variant="contained"
            color="success"
            onClick={loginUpdatePassword}
          >
            Update Password
          </Button>
          <Button
            endIcon={<LaunchIcon />}
            sx={{ width: '350px' }}
            variant="contained"
            color="success"
            onClick={loginUpdateProfile}
          >
            Update Profile
          </Button>
          <Button
            endIcon={<LaunchIcon />}
            sx={{ width: '350px' }}
            variant="contained"
            color="error"
            onClick={deleteProfile}
          >
            Delete Profile
          </Button>
        </Stack>
      </Stack>

      <Stack gap={2} alignItems="start">
        <Button
          endIcon={<LaunchIcon />}
          sx={{ width: '350px' }}
          variant="contained"
          color="success"
          onClick={accountConsole}
        >
          Go to Account Console
        </Button>

        <Button sx={{ width: '250px' }} variant="contained" color="warning" onClick={logout}>
          Logout
        </Button>

        <Button onClick={register}>Register</Button>
      </Stack>
    </Stack>
  )
}

export default App
