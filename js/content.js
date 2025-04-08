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

// Parse timestamp and calculate minutes ago
function getMinutesAgo(timestampText) {
  try {
    // Google Cloud Console timestamp format: "Apr 8, 2025, 3:45:12 PM"
    const timestamp = new Date(timestampText);
    if (isNaN(timestamp.getTime())) return Infinity;

    const now = new Date();
    const millisAgo = now - timestamp;
    return millisAgo / (1000 * 60); // Convert to minutes
  } catch (e) {
    console.error("Error parsing timestamp:", e);
    return Infinity;
  }
}

// Apply colors to timestamps based on recency
function applyTimestampColors() {
  const timestampElements = document.querySelectorAll(".log-entry-timestamp");

  timestampElements.forEach((element) => {
    const timestampText = element.textContent.trim();
    const minutesAgo = getMinutesAgo(timestampText);

    // Remove all timestamp classes
    element.classList.remove(
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
      "segment11"
    );

    // Apply appropriate class based on recency
    if (minutesAgo <= thresholds.segment01) {
      element.classList.add("segment01");
    } else if (minutesAgo <= thresholds.segment02) {
      element.classList.add("segment02");
    } else if (minutesAgo <= thresholds.segment03) {
      element.classList.add("segment03");
    } else if (minutesAgo <= thresholds.segment04) {
      element.classList.add("segment04");
    } else if (minutesAgo <= thresholds.segment05) {
      element.classList.add("segment05");
    } else if (minutesAgo <= thresholds.segment06) {
      element.classList.add("segment06");
    } else if (minutesAgo <= thresholds.segment07) {
      element.classList.add("segment07");
    } else if (minutesAgo <= thresholds.segment08) {
      element.classList.add("segment08");
    } else if (minutesAgo <= thresholds.segment09) {
      element.classList.add("segment09");
    } else if (minutesAgo <= thresholds.segment10) {
      element.classList.add("segment10");
    } else {
      element.classList.add("segment11");
    }
  });
}

// Set up mutation observer to detect new log entries
function setupObserver() {
  const observer = new MutationObserver((mutations) => {
    let hasNewTimestamps = false;

    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasLogEntries = addedNodes.some((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the node itself or any of its children contains timestamps
            return (
              node.classList?.contains("log-entry-timestamp") ||
              node.querySelector(".log-entry-timestamp")
            );
          }
          return false;
        });

        if (hasLogEntries) {
          hasNewTimestamps = true;
        }
      }
    });

    if (hasNewTimestamps) {
      applyTimestampColors();
    }
  });

  // Start observing the log container
  const logContainer = document.querySelector("body");
  if (logContainer) {
    observer.observe(logContainer, { childList: true, subtree: true });
  }
}

// Initialize extension
function init() {
  applyTimestampColors();
  setupObserver();
}

// Run when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
