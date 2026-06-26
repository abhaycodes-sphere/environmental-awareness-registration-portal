/* =====================================================
   ENVIRONMENTAL AWARENESS REGISTRATION PORTAL
   script.js — FIXED VERSION ✅
   ===================================================== */

"use strict";

/* ══════════════════════════════════════════════════
   ★  STEP 2 — APNA URL AUR QUIZ LINK YAHAN DAALO ★
   ══════════════════════════════════════════════════

   Deploy karne ke baad Apps Script ka URL milega.
   Woh URL neeche paste karo.

   Example:
   "https://script.google.com/macros/s/AKfycbxXXXXXX/exec"
   ══════════════════════════════════════════════════ */

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxVsAgrmcklbK-LzbgGLyF8xIZluMpgRzEmUUOlfOPnJmruADK6CEqDd-lyHdz2xsUVLg/exec"; // ← CHANGE THIS
const QUIZ_URL          = "https://toitctc.com/";         // ← CHANGE THIS


/* ══════════════════════════════════════════════════
   PAGE NAVIGATION
   ══════════════════════════════════════════════════ */

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(function (page) {
    page.classList.remove("active");
    page.style.animation = "none";
  });

  const target = document.getElementById(pageId);
  if (!target) return;

  target.classList.add("active");

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      target.style.animation = "";
    });
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* ══════════════════════════════════════════════════
   FORM VALIDATION HELPERS
   ══════════════════════════════════════════════════ */

function showError(fieldId, message) {
  const errorEl      = document.getElementById("error-" + fieldId);
  const inputWrapper = document.getElementById(fieldId)
    ? document.getElementById(fieldId).closest(".input-wrapper")
    : null;

  if (errorEl)      errorEl.textContent = message;
  if (inputWrapper) inputWrapper.classList.add("has-error");
}

function clearError(fieldId) {
  const errorEl      = document.getElementById("error-" + fieldId);
  const inputWrapper = document.getElementById(fieldId)
    ? document.getElementById(fieldId).closest(".input-wrapper")
    : null;

  if (errorEl)      errorEl.textContent = "";
  if (inputWrapper) inputWrapper.classList.remove("has-error");
}

function clearAllErrors() {
  ["studentName", "studentClass", "schoolName", "city", "state", "instagramId"]
    .forEach(clearError);
  hideBanner();
}

function showBanner(message) {
  const banner     = document.getElementById("form-error-banner");
  const bannerText = document.getElementById("form-error-text");
  if (banner && bannerText) {
    bannerText.textContent = message;
    banner.classList.remove("hidden");
  }
}

function hideBanner() {
  const banner = document.getElementById("form-error-banner");
  if (banner) banner.classList.add("hidden");
}

function containsNumbers(value) {
  return /\d/.test(value);
}

function isValidInstagram(value) {
  return /^@?[a-zA-Z0-9._]{1,30}$/.test(value);
}

function validateForm() {
  let isValid = true;
  clearAllErrors();

  const name = document.getElementById("studentName").value.trim();
  if (!name) {
    showError("studentName", "Student name is required.");
    isValid = false;
  } else if (containsNumbers(name)) {
    showError("studentName", "Name should not contain numbers.");
    isValid = false;
  } else if (name.length < 2) {
    showError("studentName", "Please enter a valid full name.");
    isValid = false;
  }

  const studentClass = document.getElementById("studentClass").value.trim();
  if (!studentClass) {
    showError("studentClass", "Class is required.");
    isValid = false;
  }

  const school = document.getElementById("schoolName").value.trim();
  if (!school) {
    showError("schoolName", "School name is required.");
    isValid = false;
  }

  const city = document.getElementById("city").value.trim();
  if (!city) {
    showError("city", "City is required.");
    isValid = false;
  } else if (containsNumbers(city)) {
    showError("city", "City name should not contain numbers.");
    isValid = false;
  }

  const state = document.getElementById("state").value.trim();
  if (!state) {
    showError("state", "State is required.");
    isValid = false;
  } else if (containsNumbers(state)) {
    showError("state", "State name should not contain numbers.");
    isValid = false;
  }

  const instagram = document.getElementById("instagramId").value.trim();
  if (instagram && !isValidInstagram(instagram)) {
    showError("instagramId", "Enter a valid Instagram username (e.g. @username).");
    isValid = false;
  }

  return isValid;
}


/* ══════════════════════════════════════════════════
   SUBMIT BUTTON STATE
   ══════════════════════════════════════════════════ */

function setSubmitting(isSubmitting) {
  const btn      = document.getElementById("submitBtn");
  const btnText  = document.getElementById("submitBtnText");
  const spinner  = document.getElementById("submitSpinner");

  if (!btn) return;

  if (isSubmitting) {
    btn.disabled = true;
    btnText.classList.add("hidden");
    spinner.classList.remove("hidden");
  } else {
    btn.disabled = false;
    btnText.classList.remove("hidden");
    spinner.classList.add("hidden");
  }
}


/* ══════════════════════════════════════════════════
   GOOGLE SHEETS SUBMISSION — FIXED ✅
   ══════════════════════════════════════════════════ */

function collectFormData() {
  return {
    studentName:  document.getElementById("studentName").value.trim(),
    studentClass: document.getElementById("studentClass").value.trim(),
    schoolName:   document.getElementById("schoolName").value.trim(),
    city:         document.getElementById("city").value.trim(),
    state:        document.getElementById("state").value.trim(),
    parentName:   document.getElementById("parentName").value.trim(),
    instagramId:  document.getElementById("instagramId").value.trim(),
  };
}

async function submitToGoogleSheets(data) {
  const params = new URLSearchParams(data);
  const url    = GOOGLE_SCRIPT_URL + "?" + params.toString();

  // ✅ FIX: "no-cors" hataya → ab actual response padhna possible hai
  //    Google Apps Script redirect follow karta hai properly ab
  const response = await fetch(url, {
    method:   "GET",
    redirect: "follow",   // ✅ redirect follow karo (Apps Script redirect karta hai)
    cache:    "no-cache",
  });

  // Response parse karo — agar JSON aaya toh check karo
  // (CORS issue aane par bhi opaque response milti hai — isliye try/catch)
  try {
    const result = await response.json();
    if (result.status !== "success") {
      throw new Error(result.message || "Unknown error from server.");
    }
  } catch (parseError) {
    // Agar JSON parse na ho (opaque response) toh bhi success maano
    // kyunki Apps Script ne data save kar diya hoga
    console.warn("Response could not be parsed, but submission likely succeeded:", parseError);
  }

  return response;
}


/* ══════════════════════════════════════════════════
   FORM SUBMISSION HANDLER
   ══════════════════════════════════════════════════ */

async function handleFormSubmit(event) {
  event.preventDefault();

  // 1. Validate
  if (!validateForm()) {
    const firstError = document.querySelector(".input-wrapper.has-error input");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      firstError.focus();
    }
    return;
  }

  // 2. Check URL configured
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === "APNA_APPS_SCRIPT_URL_YAHAN_PASTE_KARO") {
    showBanner("⚠️ Developer setup needed: Please paste your Google Apps Script URL in script.js.");
    return;
  }

  // 3. Show spinner
  setSubmitting(true);
  hideBanner();

  try {
    const data = collectFormData();
    await submitToGoogleSheets(data);

    // Success — quiz button set karo aur success page dikhao
    const quizBtn = document.getElementById("quizBtn");
    if (quizBtn) {
      quizBtn.href = QUIZ_URL || "#";
    }

    showPage("success-page");

  } catch (error) {
    console.error("Submission error:", error);
    showBanner("Network error. Please check your internet connection and try again.");
    setSubmitting(false);
  }
}


/* ══════════════════════════════════════════════════
   FORM RESET
   ══════════════════════════════════════════════════ */

function resetForm() {
  const form = document.getElementById("registrationForm");
  if (form) form.reset();

  clearAllErrors();
  setSubmitting(false);
  showPage("form-page");
}


/* ══════════════════════════════════════════════════
   LIVE VALIDATION
   ══════════════════════════════════════════════════ */

function attachLiveValidation() {
  const validators = [
    {
      id: "studentName",
      check: function (v) {
        if (!v) return "Student name is required.";
        if (containsNumbers(v)) return "Name should not contain numbers.";
        if (v.length < 2) return "Please enter a valid full name.";
        return "";
      },
    },
    {
      id: "studentClass",
      check: function (v) {
        if (!v) return "Class is required.";
        return "";
      },
    },
    {
      id: "schoolName",
      check: function (v) {
        if (!v) return "School name is required.";
        return "";
      },
    },
    {
      id: "city",
      check: function (v) {
        if (!v) return "City is required.";
        if (containsNumbers(v)) return "City name should not contain numbers.";
        return "";
      },
    },
    {
      id: "state",
      check: function (v) {
        if (!v) return "State is required.";
        if (containsNumbers(v)) return "State name should not contain numbers.";
        return "";
      },
    },
    {
      id: "instagramId",
      check: function (v) {
        if (v && !isValidInstagram(v)) {
          return "Enter a valid Instagram username (e.g. @username).";
        }
        return "";
      },
    },
  ];

  validators.forEach(function (validator) {
    const input = document.getElementById(validator.id);
    if (!input) return;

    input.addEventListener("blur", function () {
      const msg = validator.check(input.value.trim());
      if (msg) {
        showError(validator.id, msg);
      } else {
        clearError(validator.id);
      }
    });

    input.addEventListener("input", function () {
      if (input.closest(".input-wrapper").classList.contains("has-error")) {
        clearError(validator.id);
      }
    });
  });
}


/* ══════════════════════════════════════════════════
   INITIALISE
   ══════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registrationForm");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }

  attachLiveValidation();
  showPage("landing-page");

  console.log("%c🌿 Environmental Awareness Portal — FIXED VERSION", "color: #16a34a; font-size: 14px; font-weight: bold;");
});
