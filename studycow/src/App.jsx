import React, { useEffect } from 'react';
import "./App.css";
import PageRoutes from "./routes/PageRoutes";

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
  }, []);
  
  return (
    <>
      <PageRoutes />
    </>
  );
}

export default App;
