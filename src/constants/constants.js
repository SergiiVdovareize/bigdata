export const bandwidthOptions = [
    { value: 1, label: '1.4Mhz' },
    { value: 3, label: '3Mhz' },
    { value: 5, label: '5Mhz' },
    { value: 10, label: '10Mhz' },
    { value: 15, label: '15Mhz' },
    { value: 20, label: '20Mhz' },
]

export const testDataOptions = [
    { value: 'static', label: 'Static' },
    { value: 'pedestrian', label: 'Pedestrian' },
    { value: 'car', label: 'Car' },
    { value: 'bus', label: 'Bus' },
    { value: 'train', label: 'Train' },
]

export const resourceBlocksMap = {
    1: 6,
    3: 15,
    5: 25,
    10: 50,
    15: 75,
    20: 100,
}

export const modulationMap = [
    null, // No CQI 0, indexing starts at 1
    { modulation: "QPSK", codeRate: 0.0762, bitsPerRE: 0.1524 },
    { modulation: "QPSK", codeRate: 0.1885, bitsPerRE: 0.377 },
    { modulation: "QPSK", codeRate: 0.4385, bitsPerRE: 0.877 },
    { modulation: "16QAM", codeRate: 0.3691, bitsPerRE: 1.4764 },
    { modulation: "16QAM", codeRate: 0.4785, bitsPerRE: 1.914 },
    { modulation: "16QAM", codeRate: 0.6016, bitsPerRE: 2.4064 },
    { modulation: "64QAM", codeRate: 0.4551, bitsPerRE: 2.7306 },
    { modulation: "64QAM", codeRate: 0.5537, bitsPerRE: 3.3222 },
    { modulation: "64QAM", codeRate: 0.6504, bitsPerRE: 3.9024 },
    { modulation: "64QAM", codeRate: 0.7539, bitsPerRE: 4.5234 },
    { modulation: "64QAM", codeRate: 0.8525, bitsPerRE: 5.115 },
    { modulation: "64QAM", codeRate: 0.9258, bitsPerRE: 5.5548 },
    { modulation: "256QAM", codeRate: 0.6943, bitsPerRE: 5.5544 },
    { modulation: "256QAM", codeRate: 0.7783, bitsPerRE: 6.2264 },
    { modulation: "256QAM", codeRate: 0.8634, bitsPerRE: 6.9072 }
];
      