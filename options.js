// Get the checkbox element
const appendTimeBlockCheckbox = document.getElementById("appendTimeBlock");

// Load the saved setting when the options page opens
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["appendTimeBlock"], (result) => {
    // Default to true if not set
    appendTimeBlockCheckbox.checked = result.appendTimeBlock !== false;
  });
});

// Save the setting when the checkbox value changes
appendTimeBlockCheckbox.addEventListener("change", () => {
  const shouldAppend = appendTimeBlockCheckbox.checked;
  chrome.storage.local.set({ appendTimeBlock: shouldAppend }, () => {
    console.log("Append time block setting saved:", shouldAppend);
  });
});
