// The indices of each keypoint, keyed by a more readable name.
export const KP_INDICES = {
  wrist: 0,
  thumb_cmc: 1,
  thumb_mcp: 2,
  thumb_ip: 3,
  thumb_tip: 4,
  index_finger_mcp: 5,
  index_finger_pip: 6,
  index_finger_dip: 7,
  index_finger_tip: 8,
  middle_finger_mcp: 9,
  middle_finger_pip: 10,
  middle_finger_dip: 11,
  middle_finger_tip: 12,
  ring_finger_mcp: 13,
  ring_finger_pip: 14,
  ring_finger_dip: 15,
  ring_finger_tip: 16,
  pinky_finger_mcp: 17,
  pinky_finger_pip: 18,
  pinky_finger_dip: 19,
  pinky_finger_tip: 20,
};

// Sequences of keypoint indices for each finger.
export const FINGER_SEQUENCES: {
  [k in FingerType]: [number, number, number, number, number];
} = {
  thumb: [
    KP_INDICES.wrist,
    KP_INDICES.thumb_cmc,
    KP_INDICES.thumb_mcp,
    KP_INDICES.thumb_ip,
    KP_INDICES.thumb_tip,
  ],
  indexFinger: [
    KP_INDICES.wrist,
    KP_INDICES.index_finger_mcp,
    KP_INDICES.index_finger_pip,
    KP_INDICES.index_finger_dip,
    KP_INDICES.index_finger_tip,
  ],
  middleFinger: [
    KP_INDICES.wrist,
    KP_INDICES.middle_finger_mcp,
    KP_INDICES.middle_finger_pip,
    KP_INDICES.middle_finger_dip,
    KP_INDICES.middle_finger_tip,
  ],
  ringFinger: [
    KP_INDICES.wrist,
    KP_INDICES.ring_finger_mcp,
    KP_INDICES.ring_finger_pip,
    KP_INDICES.ring_finger_dip,
    KP_INDICES.ring_finger_tip,
  ],
  pinkyFinger: [
    KP_INDICES.wrist,
    KP_INDICES.pinky_finger_mcp,
    KP_INDICES.pinky_finger_pip,
    KP_INDICES.pinky_finger_dip,
    KP_INDICES.pinky_finger_tip,
  ],
};
