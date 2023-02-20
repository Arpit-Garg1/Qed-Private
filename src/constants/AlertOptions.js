import { positions, transitions, Provider as AlertProvider } from 'react-alert';

export default {
    position: positions.TOP_CENTER,
    timeout: 6000,
    offset: '20px',
    transition: transitions.SCALE,
    containerStyle: {
        zIndex: 99999999999
    }
}