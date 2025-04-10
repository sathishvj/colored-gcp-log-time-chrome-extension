// Default time threshold settings (in minutes)
const DEFAULT_THRESHOLDS = {
  segment01: 5,
  segment02: 15,
  segment03: 30,
  segment04: 60,
  segment05: 120,
  segment06: 300,
  segment07: 720,
  segment08: 1440,
  segment09: 2880,
  segment10: 10080,
};

// User settings
let thresholds = DEFAULT_THRESHOLDS;

// Constants
const ONE_MINUTE_IN_MS = 60 * 1000;

// Variable to hold the interval timer ID
let intervalId = null;

// Parse timestamp and calculate minutes ago
function getMinutesAgo(timestampText) {
  try {
    // Google Cloud Console timestamp format: "Apr 8, 2025, 3:45:12 PM UTC" or similar variations
    // Attempt to handle potential timezone abbreviations or offsets
    const cleanedTimestampText = timestampText.replace(/ \w+$/, ""); // Remove trailing timezone abbreviation if present
    const timestamp = new Date(cleanedTimestampText);
    if (isNaN(timestamp.getTime())) {
      console.warn("Could not parse timestamp:", timestampText);
      return Infinity;
    }

    const now = new Date();
    const millisAgo = now - timestamp;
    return millisAgo / (1000 * 60); // Convert to minutes
  } catch (e) {
    console.error("Error parsing timestamp:", timestampText, e);
    return Infinity;
  }
}

// Apply colors to timestamps based on recency
function applyTimestampColors() {
  // console.log("Applying timestamp colors..."); // Optional: for debugging
  const timestampElements = document.querySelectorAll(".log-entry-timestamp");

  timestampElements.forEach((element) => {
    // Ensure we don't process elements already inside a processed parent (less common but possible)
    if (element.dataset.coloredTimestampProcessed) return;

    const timestampText = element.textContent.trim();
    if (!timestampText) return; // Skip empty elements

    const minutesAgo = getMinutesAgo(timestampText);

    // Define all possible segment classes
    const segmentClasses = [
      "segment01",
      "segment02",
      "segment03",
      "segment04",
      "segment05",
      "segment06",
      "segment07",
      "segment08",
      "segment09",
      "segment10",
      "segment11",
    ];

    // Remove existing segment classes efficiently
    element.classList.remove(...segmentClasses);

    // Apply appropriate class based on recency
    let appliedClass = "segment11"; // Default to the oldest segment
    if (minutesAgo <= thresholds.segment01) {
      appliedClass = "segment01";
    } else if (minutesAgo <= thresholds.segment02) {
      appliedClass = "segment02";
    } else if (minutesAgo <= thresholds.segment03) {
      appliedClass = "segment03";
    } else if (minutesAgo <= thresholds.segment04) {
      appliedClass = "segment04";
    } else if (minutesAgo <= thresholds.segment05) {
      appliedClass = "segment05";
    } else if (minutesAgo <= thresholds.segment06) {
      appliedClass = "segment06";
    } else if (minutesAgo <= thresholds.segment07) {
      appliedClass = "segment07";
    } else if (minutesAgo <= thresholds.segment08) {
      appliedClass = "segment08";
    } else if (minutesAgo <= thresholds.segment09) {
      appliedClass = "segment09";
    } else if (minutesAgo <= thresholds.segment10) {
      appliedClass = "segment10";
    }
    // else it remains segment11

    element.classList.add(appliedClass);
    element.dataset.coloredTimestampProcessed = true; // Mark as processed to avoid reprocessing by mistake
  });

  // Clean up the processed marker for the next run (important for the interval)
  setTimeout(() => {
    timestampElements.forEach(
      (el) => delete el.dataset.coloredTimestampProcessed
    );
  }, 0);
}

// Set up mutation observer to detect new log entries
function setupObserver() {
  const observer = new MutationObserver((mutations) => {
    let hasNewTimestamps = false;

    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasLogEntries = addedNodes.some((node) => {
          // Check if the node is an element and contains relevant class or children
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added node itself is a timestamp or contains one
            return (
              node.classList?.contains("log-entry-timestamp") ||
              node.querySelector(".log-entry-timestamp")
            );
          }
          return false;
        });

        if (hasLogEntries) {
          hasNewTimestamps = true;
          // Optional: Could break early if performance is critical
          // return; // Exit forEach early if we found one
        }
      }
    });

    if (hasNewTimestamps) {
      // console.log("MutationObserver detected new timestamps, applying colors..."); // Optional: for debugging
      applyTimestampColors();
    }
  });

  // Start observing the document body - more robust than a specific container
  // which might change or not exist initially.
  const targetNode = document.body;
  if (targetNode) {
    observer.observe(targetNode, { childList: true, subtree: true });
    // console.log("MutationObserver started."); // Optional: for debugging
  } else {
    console.warn("Could not find document body to observe.");
  }

  // Return the observer instance if needed later (e.g., to disconnect)
  return observer;
}

// Initialize extension
function init() {
  console.log("Initializing GCP Log Timestamp Colorizer"); // Optional: for debugging
  applyTimestampColors(); // Apply colors on initial load
  setupObserver(); // Set up observer for dynamic content

  // Clear any existing interval timer before setting a new one
  if (intervalId) {
    clearInterval(intervalId);
  }

  // Set up the interval timer to re-apply colors every minute
  intervalId = setInterval(applyTimestampColors, ONE_MINUTE_IN_MS);
  console.log(`Set interval timer (ID: ${intervalId}) to run every minute.`); // Optional: for debugging
}

// Run when DOM is loaded or immediately if already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  // DOM is already loaded
  init();
}

// Optional: Add cleanup logic if the script could be unloaded/reloaded
// (less common for simple content scripts, but good practice in some contexts)
window.addEventListener("unload", () => {
  if (intervalId) {
    clearInterval(intervalId);
    console.log("Cleared interval timer on page unload.");
  }
});
