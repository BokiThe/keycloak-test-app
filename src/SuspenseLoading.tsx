import { Stack, Typography } from '@mui/material'

import spinner from './assets/images/spinner.gif'

export const SuspenseLoading = () => (
  <Stack alignItems={'center'} justifyContent={'center'} spacing={5} height={'100vh'}>
    <img src={spinner} alt="Loading..." height={120} />
    <Typography fontWeight={500} fontSize={16}>
      {'Loading...'}
    </Typography>
  </Stack>
)
