// Select all elements with the "data-typing" attribute
const elementsToType = document.querySelectorAll('[data-typing="true"]');

// Typing settings
const typingSpeed = 50; // Milliseconds per character
const pauseDuration = 800; // Pause duration in milliseconds
const initialBlinkDuration = 1200; // Initial blinking duration for the first word (1 second)

// Function to simulate typing for a single element with pauses
function typeTextWithCursorAndPause(element, text, resolve, isFirst = false) {
  let index = 0;

  // Make the element visible when typing starts
  element.style.visibility = "visible";

  // Create and append the blinking cursor
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  element.innerHTML = ""; // Clear the text
  element.appendChild(cursor);

  // Measure the full text length and calculate its height (before typing)
  const tempSpan = document.createElement("span");
  tempSpan.style.fontFamily = "Press Start 2P, monospace"; // Apply the same font as the original element
  tempSpan.style.visibility = "hidden"; // Hide the temporary element
  tempSpan.innerHTML = text; // Set the full text to measure
  document.body.appendChild(tempSpan); // Append to the body to get accurate measurements
  const fullTextHeight = tempSpan.offsetHeight;
  document.body.removeChild(tempSpan); // Remove the temporary element after measuring

  // Set a fixed min-height for the element to reserve space for the full text
  element.style.minHeight = `${fullTextHeight}px`;

  const startTyping = () => {
    // Typing interval with pauses
    const typeNextCharacter = () => {
      if (index < text.length) {
        const char = text[index];
        cursor.insertAdjacentText("beforebegin", char); // Add the next character
        index++;

        // Check for pause conditions
        if (char === "," || char === ":" || char === "!" || char === ".") {
          setTimeout(typeNextCharacter, pauseDuration); // Pause before resuming
        } else {
          setTimeout(typeNextCharacter, typingSpeed); // Continue typing
        }
      } else {
        element.removeChild(cursor); // Remove the cursor after typing
        resolve(); // Resolve the promise when done
      }
    };

    typeNextCharacter();
  };

  // If it's the first element, blink the cursor for the initial duration
  if (isFirst) {
    setTimeout(startTyping, initialBlinkDuration);
  } else {
    startTyping();
  }
}

// Function to handle typing for multiple elements sequentially
async function startTyping() {
  // Ensure all elements are hidden initially
  elementsToType.forEach((element) => {
    element.style.visibility = "hidden";
  });

  // Start typing for each element sequentially
  for (const [index, element] of elementsToType.entries()) {
    const text = element.textContent.trim(); // Get the original text
    await new Promise((resolve) =>
      typeTextWithCursorAndPause(element, text, resolve, index === 0)
    );
  }
}

// Start typing animation
startTyping();