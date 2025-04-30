// Default time threshold settings (in minutes)
const DEFAULT_THRESHOLDS = {
  segment_0_1: 1,
  segment_1_2: 2,
  segment_2_3: 3,
  segment_3_5: 5,
  segment_5_15: 15,
  segment_15_30: 30,
  segment_30_60: 60,
  segment_60_120: 120,
  segment_120_300: 300,
  segment_300_720: 720,
  segment_720_1440: 1440,
  segment_1440_2880: 2880,
  segment_2880_10080: 10080,
};

// User settings
let thresholds = DEFAULT_THRESHOLDS;
let shouldAppendTimeBlock = true; // Default value

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
      "segment_0_1",
      "segment_1_2",
      "segment_2_3",
      "segment_3_5",
      "segment_5_15",
      "segment_15_30",
      "segment_30_60",
      "segment_60_120",
      "segment_120_300",
      "segment_300_720",
      "segment_720_1440",
      "segment_1440_2880",
      "segment_2880_10080",
      "segment_last",
    ];

    // Remove existing segment classes efficiently
    element.classList.remove(...segmentClasses);

    // Apply appropriate class based on recency
    let appliedClass = []; // Default to the oldest segment
    if (minutesAgo <= thresholds.segment_0_1) {
      appliedClass = ["segment_0_1"];
      if (shouldAppendTimeBlock) {
        // element.textContent += " (0-1 min)";
        appliedClass.push("segment_0_1_time");
      }
    } else if (minutesAgo <= thresholds.segment_1_2) {
      appliedClass = ["segment_1_2"];
      if (shouldAppendTimeBlock) {
        // element.textContent += " (0-1 min)";
        appliedClass.push("segment_0_1_time");
      }
    } else if (minutesAgo <= thresholds.segment_2_3) {
      appliedClass = ["segment_2_3"];
      if (shouldAppendTimeBlock) {
        // element.textContent += " (0-1 min)";
        appliedClass.push("segment_2_3_time");
      }
    } else if (minutesAgo <= thresholds.segment_3_5) {
      appliedClass = ["segment_3_5"];
      if (shouldAppendTimeBlock) {
        // element.textContent += " (0-1 min)";
        appliedClass.push("segment_3_5_time");
      }
    } else if (minutesAgo <= thresholds.segment_5_15) {
      appliedClass = ["segment_15_30"];
      if (shouldAppendTimeBlock) {
        // element.textContent += " (0-1 min)";
        appliedClass.push("segment_15_30_time");
      }
    } else if (minutesAgo <= thresholds.segment_15_30) {
      appliedClass = ["segment_15_30"];
      if (shouldAppendTimeBlock) {
        // element.textContent += " (0-1 min)";
        appliedClass.push("segment_15_30_time");
      }
    } else if (minutesAgo <= thresholds.segment_30_60) {
      appliedClass = ["segment_30_60"];
      if (shouldAppendTimeBlock) {
        // element.textContent += " (0-1 min)";
        appliedClass.push("segment_30_60_time");
      }
    } else if (minutesAgo <= thresholds.segment_60_120) {
      appliedClass = ["segment_60_120"];
      if (shouldAppendTimeBlock) {
        // element.textContent += " (0-1 min)";
        appliedClass.push("segment_60_120_time");
      }
    } else if (minutesAgo <= thresholds.segment_120_300) {
      appliedClass = ["segment_120_300"];
      if (shouldAppendTimeBlock) {
        // element.textContent += " (0-1 min)";
        appliedClass.push("segment_120_300_time");
      }
    } else if (minutesAgo <= thresholds.segment_300_720) {
      appliedClass = ["segment_300_720"];
      if (shouldAppendTimeBlock) {
        // element.textContent += " (0-1 min)";
        appliedClass.push("segment_300_720_time");
      }
    } else if (minutesAgo <= thresholds.segment_720_1440) {
      appliedClass = ["segment_720_1440"];
      if (shouldAppendTimeBlock) {
        // element.textContent += " (0-1 min)";
        appliedClass.push("egment_720_1440_time");
      }
    } else if (minutesAgo <= thresholds.segment_1440_2880) {
      appliedClass = ["segment_1440_2880"];
      if (shouldAppendTimeBlock) {
        // element.textContent += " (0-1 min)";
        appliedClass.push("segment_1440_2880_time");
      }
    } else if (minutesAgo <= thresholds.segment_2880_10080) {
      appliedClass = ["segment_2880_10080"];
      if (shouldAppendTimeBlock) {
        // element.textContent += " (0-1 min)";
        appliedClass.push("segment_2880_10080_time");
      }
    } else {
      appliedClass = ["segment_last"]; // Default to the oldest segment
      if (shouldAppendTimeBlock) {
        // element.textContent += " (0-1 min)";
        appliedClass.push("segment_last_time");
      }
    }
    // else it remains segment_last

    element.classList.add(...appliedClass);
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

  // Load initial settings
  chrome.storage.local.get(["appendTimeBlock"], (result) => {
    shouldAppendTimeBlock = result.appendTimeBlock !== false; // Default to true if not set
    console.log("Initial appendTimeBlock setting:", shouldAppendTimeBlock); // Optional: for debugging
  });
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

// Listen for changes in storage
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "local" && changes.appendTimeBlock) {
    const newValue = changes.appendTimeBlock.newValue;
    shouldAppendTimeBlock = newValue !== false; // Update the variable, default to true if undefined/null
    console.log("appendTimeBlock setting updated:", shouldAppendTimeBlock); // Optional: for debugging
    // If the change requires immediate UI update, you might call a function here
    // e.g., applyTimestampColors(); // Re-apply if the setting affects coloring/display
  }
});

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
