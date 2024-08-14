import React, { useEffect } from 'react';
import "./App.css";
import PageRoutes from "./routes/PageRoutes";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Notiflix from 'notiflix';

// Material UI 폰트 적용
const theme = createTheme({
  typography: {
    fontFamily: "Pretendard, sans-serif"
  },
});

function App() {
  useEffect(() => {
    const setViewportMeta = () => {
      let metaTag = document.querySelector('meta[name="viewport"]');
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.name = "viewport";
        document.head.appendChild(metaTag);
      }
      metaTag.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    };

    setViewportMeta(); // 초기 설정

    // Notiflix 전역 설정
    Notiflix.Notify.init({
      position: 'center-top',
      width: 'calc(320 / 1440 * 100vw)',
      borderRadius: 'calc(7 / 1440 * 100vw)',
      clickToClose: true
    });

  }, []);
  
  return (
    <ThemeProvider theme={theme}>
      <PageRoutes />
    </ThemeProvider>
  );
}

export default App;
