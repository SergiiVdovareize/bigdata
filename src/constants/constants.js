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

export const mimoOptions = [
    { value: 1, label: '1x1' },
    { value: 2, label: '2x2' },
    { value: 4, label: '4x4' },
    { value: 8, label: '8x8' },
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
    { modulation: "QPSK", modulationOrder: 2, codeRate: 0.08 },
    { modulation: "QPSK", modulationOrder: 2, codeRate: 0.19 },
    { modulation: "QPSK", modulationOrder: 2, codeRate: 0.44 },
    { modulation: "16QAM", modulationOrder: 4, codeRate: 0.37 },
    { modulation: "16QAM", modulationOrder: 4, codeRate: 0.48 },
    { modulation: "16QAM", modulationOrder: 4, codeRate: 0.60 },
    { modulation: "64QAM", modulationOrder: 6, codeRate: 0.45 },
    { modulation: "64QAM", modulationOrder: 6, codeRate: 0.55 },
    { modulation: "64QAM", modulationOrder: 6, codeRate: 0.65 },
    { modulation: "64QAM", modulationOrder: 6, codeRate: 0.75 },
    { modulation: "64QAM", modulationOrder: 6, codeRate: 0.85 },
    { modulation: "64QAM", modulationOrder: 6, codeRate: 0.93 },
    { modulation: "256QAM", modulationOrder: 8, codeRate: 0.69 },
    { modulation: "256QAM", modulationOrder: 8, codeRate: 0.78 },
    { modulation: "256QAM", modulationOrder: 8, codeRate: 0.86 },
];

export const OFDMSymbolsPerSubframe = 7;

// Default overhead (10%)
export const defaultOverhead = 0.1;

export const defaultBandwidth = 10;

// Default number of MIMO layers (1 for single antenna systems)
export const defaultMIMOLayers = 1;

// Default carrier aggregation (1 carrier if no aggregation is used)
export const defaultCarriers = 1;