function estimatePhonemes(text) {
    // This is a very basic estimation
    return text.split('').map(char => ({
        phoneme: char,
        duration: 0.1 // Assume each character takes 0.1 seconds
    }));
}

module.exports = { estimatePhonemes };