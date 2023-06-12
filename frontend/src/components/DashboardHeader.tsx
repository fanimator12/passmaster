import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import LogoIcon from './LogoIcon';
import { DashboardHeaderProps } from '../props';

const lightColor = 'hsla(157, 100%, 50%, 1)';
const background = ''

export default function DashboardHeader(props: DashboardHeaderProps) {
  const { onDrawerToggle } = props;

  return (
    <Box sx={{background: background}} component="div">
      <AppBar position="sticky" elevation={0} sx={{background: 'transparent'}}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={onDrawerToggle}
                edge="start"
              >
                <LogoIcon />
              </IconButton>
            </Grid>
            <Grid item xs />
            <Grid item>
              <Link
                href="/"
                variant="body2"
                sx={{
                  textDecoration: 'none',
                  color: lightColor,
                  '&:hover': {
                    fontWeight:"bold"
                  },
                }}
                rel="noopener noreferrer"
                target="_blank"
              >
                Docs
              </Link>
            </Grid>
            <Grid item>
              <Tooltip title="Alerts • No alerts">
                <IconButton sx={{color: lightColor}}>
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <IconButton sx={{ p: 0.5, color: lightColor}}>
                <Avatar src="/static/images/avatar/1.jpg" alt="Avatar" />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{ zIndex: 0, background: 'transparent' }}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography variant="h5" component="h1" sx={{color: lightColor}}>
                My Vaults
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Help">
                <IconButton sx={{color: lightColor}}>
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar component="div" position="static" elevation={0} sx={{ zIndex: 0, background: 'transparent' }}>
        <Tabs value={0}>
          <Tab label="Personal" />
        </Tabs>
      </AppBar>
    </Box>
  );
}