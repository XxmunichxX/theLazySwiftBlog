// Select all elements with the "data-typing" attribute
const elementsToType = document.querySelectorAll('[data-typing="true"]');

// Typing settings
const typingSpeed = 90; // Milliseconds per character
const pauseDuration = 1000; // Pause duration in milliseconds

// Function to simulate typing for a single element with pauses
function typeTextWithCursorAndPause(element, text, resolve) {
  let index = 0;

  // Create and append the blinking cursor
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  element.innerHTML = ""; // Clear the text
  element.appendChild(cursor);

  // Typing interval with pauses
  const typeNextCharacter = () => {
    if (index < text.length) {
      const char = text[index];
      cursor.insertAdjacentText("beforebegin", char); // Add the next character
      index++;

      // Check for pause conditions
      if (char === "," || char === ":" || char === "!") {
        setTimeout(typeNextCharacter, pauseDuration); // Pause before resuming
      } else {
        setTimeout(typeNextCharacter, typingSpeed); // Continue typing
      }
    } else {
      element.removeChild(cursor); // Remove the cursor after typing
      resolve(); // Resolve the promise when done
    }
  };

  // Start typing
  typeNextCharacter();
}

// Function to handle typing for multiple elements sequentially
async function startTyping() {
  for (const element of elementsToType) {
    const text = element.textContent.trim(); // Get the original text
    await new Promise((resolve) =>
      typeTextWithCursorAndPause(element, text, resolve)
    );
  }
}

// Start typing animation
startTyping();
