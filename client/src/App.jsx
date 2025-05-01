import React from "react";
import AppRoutes from "./routes/AppRoutes"; // Routing logic

// material-ui
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// third-party
import { useSelector } from 'react-redux';

// project import
import theme from './themes';
// import NavigationScroll from './NavigationScroll';

const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <>
      {
        // <NavigationScroll>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme(customization)}>
            <CssBaseline />
            <AppRoutes />
          </ThemeProvider>
        </StyledEngineProvider>
        // </NavigationScroll>
      }
    </>

  );
};

export default App;
