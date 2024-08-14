import React from 'react';
import { Modal, Box, Typography, Slider, IconButton } from '@mui/material';
import { Close, VolumeUp, Mic } from '@mui/icons-material';
import './styles/SettingsModal.css';

function SettingsModal({ open, onClose, volume, micVolume, onVolumeChange, onMicVolumeChange }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="settingsModalContainer">
        <div className="settingsModalHeader">
          <Typography variant="h6" className="settingsModalName">장비 설정</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>
        <div className="settingsModalContent">
          <div className="settingsModalSliderContainer">
            <VolumeUp />
            <Typography>Vol: {Math.round(volume * 100)}%</Typography>
            <Slider 
              value={volume} 
              onChange={onVolumeChange}
              aria-labelledby="volume-slider"
              min={0} 
              max={1} 
              step={0.01}
            />
          </div>
          <div className="settingsModalSliderContainer">
            <Mic />
            <Typography>Mic: {Math.round(micVolume * 100)}%</Typography>
            <Slider 
              value={micVolume} 
              onChange={onMicVolumeChange}
              aria-labelledby="mic-volume-slider"
              min={0} 
              max={1} 
              step={0.01}
            />
          </div>
        </div>
      </Box>
    </Modal>
  );
}

export default SettingsModal;