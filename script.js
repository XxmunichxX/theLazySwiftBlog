// Select all elements with the "data-typing" attribute
const elementsToType = document.querySelectorAll('[data-typing="true"]');

// Typing settings
const typingSpeed = 60; // Milliseconds per character
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