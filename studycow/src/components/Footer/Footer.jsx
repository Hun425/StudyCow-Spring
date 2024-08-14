import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import './Footer.css'; // CSS 파일 import

const Footer = () => {
  return (
    <Box component="footer" className="footer">
        <Container maxWidth="md">
          <Typography variant="body2" className="footer-text-gray footer-small" align="center">
            본 사이트의 콘텐츠는 저작권법의 보호를 받는 바 무단 전재, 복사, 배포 등을 금합니다.
          </Typography>
          <Typography variant="body2" className="footer-text-gray footer-small" align="center">
            본 사이트의 저작권은 광주C202(채기훈, 박봉균, 김정환, 노명환, 박동민, 윤성준)과 SSAFY에 있습니다.
          </Typography>
          <Typography variant="body1" className="footer-text-white" align="center">
            © 공부했소? 2024 All Rights Reserved.
          </Typography>
        </Container>
      </Box>
  );
};

export default Footer;
