const phonemeToViseme = {
    'AA': 'A', 'AE': 'A', 'AH': 'B', 'AO': 'C', 'AW': 'C',
    'AY': 'A', 'B': 'F', 'CH': 'G', 'D': 'G', 'DH': 'G',
    'EH': 'B', 'ER': 'B', 'EY': 'A', 'F': 'E', 'G': 'G',
    'HH': 'B', 'IH': 'B', 'IY': 'A', 'JH': 'G', 'K': 'G',
    'L': 'G', 'M': 'F', 'N': 'G', 'NG': 'G', 'OW': 'C',
    'OY': 'C', 'P': 'F', 'R': 'B', 'S': 'G', 'SH': 'G',
    'T': 'G', 'TH': 'G', 'UH': 'B', 'UW': 'D', 'V': 'E',
    'W': 'D', 'Y': 'B', 'Z': 'G', 'ZH': 'G'
};

const visemePaths = {
    'A': "M10 25 Q50 10 90 25 Q50 40 10 25", // Wide open
    'B': "M10 25 Q50 20 90 25 Q50 30 10 25", // Slightly open
    'C': "M10 25 Q50 15 90 25 Q50 35 10 25", // Open rounded
    'D': "M10 25 Q50 22 90 25 Q50 28 10 25", // Slightly rounded
    'E': "M10 25 Q50 24 90 25 Q50 26 10 25", // Nearly closed
    'F': "M10 25 Q50 25 90 25 Q50 25 10 25", // Closed
    'G': "M10 25 Q50 23 90 25 Q50 27 10 25"  // Slightly open (consonants)
};

export function getVisemeForPhoneme(phoneme) {
    return phonemeToViseme[phoneme] || 'F'; // Default to closed mouth
}

export function getPathForViseme(viseme) {
    return visemePaths[viseme] || visemePaths['F']; // Default to closed mouth
}

// Export visemeToMouthShape
export const visemeToMouthShape = {
    0: { height: 80 },    // Neutral (closed mouth)
    1: { height: 20 },   // Aa (more open mouth)
    2: { height: 30 },   // Ah (even more open mouth)
    3: { height: 15 },   // Aw (slightly open)
    4: { height: 5 },    // Ee (slightly open)
    5: { height: 5 },    // Eh (slightly open)
    6: { height: 0 },    // Er (closed mouth)
    7: { height: 15 },   // Ih (open mouth)
    8: { height: 40 },   // Oh (very open mouth)
    9: { height: 10 },   // Oo (rounded mouth)
    10: { height: 5 },   // P (closed mouth)
    11: { height: 15 },  // R (open mouth)
    12: { height: 10 },  // S (slightly open)
    13: { height: 5 },   // T (closed mouth)
    14: { height: 10 },  // Uh (open mouth)
    15: { height: 15 },  // F (open mouth)
    16: { height: 10 },  // K (slightly open)
};