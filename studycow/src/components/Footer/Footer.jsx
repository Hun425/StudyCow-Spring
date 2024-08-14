import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{
        backgroundColor: '#191f28',
        py: 5, // 위아래 패딩을 더 추가
        px: 3,
        mt: 4, // 위쪽 마진을 더 추가
      }}>
        <Container maxWidth="md">
          <Typography variant="body2" color="gray" align="center" fontSize="small" sx={{ mb: 1 }}> {/* 글씨 색상을 흰색으로 변경 */}
            본 사이트의 콘텐츠는 저작권법의 보호를 받는 바 무단 전재, 복사, 배포 등을 금합니다.
          </Typography>
          <Typography variant="body2" color="gray" align="center" fontSize="small" sx={{ mb: 2 }}> {/* 회색으로, 아주 작게 설정 */}
            본 사이트의 저작권은 광주C202(채기훈, 박봉균, 김정환, 노명환, 박동민, 윤성준)과 SSAFY에 있습니다.
          </Typography>
          <Typography variant="body1" align="center" color="white"> {/* 글씨 색상을 흰색으로 변경 */}
            © 공부했소? 2024 All Rights Reserved.
          </Typography>
        </Container>
      </Box>
  
  );
};

export default Footer;