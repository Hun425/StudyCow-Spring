import library1 from "../../assets/audio/library1.mp3";
import library2 from "../../assets/audio/library2.mp3";
import outsiderain from "../../assets/audio/outsiderain.mp3";
import traffic from "../../assets/audio/traffic.mp3";
import underwater from "../../assets/audio/underwater.mp3";
import wind from "../../assets/audio/wind.mp3";

import React from 'react';
import { Modal, Box, Typography, FormControl, Select, MenuItem, Slider, IconButton } from '@mui/material';
import { Close, VolumeUp, AudioFile } from '@mui/icons-material';
import './styles/AudioModal.css';

const AudioModal = ({ open, onClose, selectedAudio, onAudioChange, volume, onVolumeChange }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="audioModalContainer">
        <div className="audioModalHeader">
          <Typography variant="h6" className="audioModalHeaderTitle">배경음악 설정</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>
        <div className="audioModalContent">
          <div className="audioModalSelectContainer">
            <AudioFile />
            <Typography>음악 목록</Typography>
            <FormControl fullWidth variant="outlined">
              <Select value={selectedAudio} onChange={onAudioChange}>
                <MenuItem value="">선택하세요</MenuItem>
                <MenuItem value={library1}>도서관 클래식 1</MenuItem>
                <MenuItem value={library2}>도서관 클래식 2</MenuItem>
                <MenuItem value={wind}>바람</MenuItem>
                <MenuItem value={traffic}>도심</MenuItem>
                <MenuItem value={outsiderain}>창 밖 소나기</MenuItem>
                <MenuItem value={underwater}>물속</MenuItem>
              </Select>
            </FormControl>
          </div>

          {selectedAudio && (
            <div className="audioModalSliderContainer">
              <VolumeUp />
              <Typography>Volume: {Math.round(volume * 100)}%</Typography>
              <Slider
                value={volume}
                min={0}
                max={1}
                step={0.01}
                onChange={onVolumeChange}
                aria-labelledby="continuous-slider"
              />
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default AudioModal;