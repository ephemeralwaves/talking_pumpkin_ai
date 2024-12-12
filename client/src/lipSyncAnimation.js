import { gsap } from 'gsap'; // Import the GSAP library for animations
import { visemeToMouthShape, getVisemeForPhoneme } from './phonemeVisemeMapper';

// Define any mappings or additional logic if needed

// Function to animate the mouth based on viseme data
export function animateMouth(visemes) {
    const mouth = document.getElementById('kal-mouth'); // Get the mouth element by ID
    if (!mouth) {
        console.error('Mouth element not found'); // Log an error if the mouth element is not found
        return;
    }

    let timeline = gsap.timeline(); // Create a GSAP timeline for animations

    // Set the initial mouth shape to neutral and make it visible
    timeline.set(mouth, { ...visemeToMouthShape[0], opacity: 1 });

    // Loop through each viseme to create animations
    visemes.forEach((viseme, index) => {
        const nextViseme = visemes[index + 1]; // Get the next viseme
        const duration = nextViseme ? (nextViseme.audioOffset - viseme.audioOffset) / 1000 : 0.1; // Calculate duration for the current viseme
        const mouthShape = visemeToMouthShape[viseme.visemeId] || visemeToMouthShape[0]; // Get the mouth shape for the current viseme

        // Animate the mouth to the new shape
        timeline.to(mouth, {
            ...mouthShape, // Apply the mouth shape
            opacity: 1, // Ensure the mouth is visible
            duration: duration, // Set the duration of the animation
            ease: "power1.inOut" // Set the easing function for the animation
        }, viseme.audioOffset / 1000); // Start the animation at the appropriate time
    });

    // Add a final state to keep the mouth visible in the neutral position
    timeline.to(mouth, {
        ...visemeToMouthShape[80], // Set the mouth back to neutral
        opacity: 1, // Ensure the mouth remains visible
        duration: 0.2, // Duration for the final state
        ease: "power1.inOut" // Easing for the final state
    });

    return timeline; // Return the timeline for further control if needed
}