import Sample1 from "../../assets/audio/sample1.mp3";
import Sample2 from "../../assets/audio/sample2.mp3";

import React from 'react';
import { Modal, Box, Typography, FormControl, Select, MenuItem, Slider, IconButton } from '@mui/material';
import { Close, VolumeUp, AudioFile } from '@mui/icons-material';
import './styles/AudioModal.css';

const AudioModal = ({ open, onClose, selectedAudio, onAudioChange, volume, onVolumeChange }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="audioModalContainer">
        <div className="audioModalHeader">
          <Typography variant="h6">배경음악 설정</Typography>
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
                <MenuItem value={Sample1}>Sample 1</MenuItem>
                <MenuItem value={Sample2}>Sample 2</MenuItem>
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