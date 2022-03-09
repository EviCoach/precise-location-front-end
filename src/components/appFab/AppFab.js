import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AppFab from './AppFab.css';
import NavigationIcon from '@mui/icons-material/Navigation';

export default function FloatingActionButtons(props) {
    return (
        <Box  className="show-mapped" sx={{ '& > :not(style)': { m: 1 } }}>
            <Fab onClick={props.onTouch} variant="extended">
                <NavigationIcon sx={{ mr: 1 }} />
                Show Mapped Areas
            </Fab>
        </Box>
    );
}