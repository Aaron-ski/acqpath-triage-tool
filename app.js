const paths = {
  far: {
    name: "Traditional FAR-Based Contract",
    description: "Best fit when the requirement is mature, stable, well-defined, and suitable for standard procurement methods."
  },
  existingVehicle: {
    name: "Existing Contract Vehicle / IDIQ / BPA / GWAC",
    description: "Best fit when speed is important and an existing vehicle already covers the requirement scope."
  },
  commercial: {
    name: "Commercial Item / FAR Part 12 Style Approach",
    description: "Best fit when the need can be met by commercial products or services already available in the marketplace."
  },
  csoba: {
    name: "CSO / BAA / Innovation Solicitation",
    description: "Best fit when the Government needs to discover solutions, invite innovative approaches, or evaluate technical concepts before committing to a specific acquisition path."
  },
  ot: {
    name: "Other Transaction Discussion",
    description: "Best fit when the effort involves prototype, experimentation, nontraditional vendors, flexible terms, iterative development, or rapid mission-focused capability delivery."
  },
  review: {
    name: "Needs Contracting Officer / Agreements Officer Review",
    description: "Use when the answers are mixed, uncertain, high-risk, or involve legal/acquisition authority questions."
  }
};

const questions = [
  {
    id: "q1",
    text: "Is the requirement already well-defined, stable, and unlikely to change?",
    yes: { far: 3, existingVehicle: 2 },
    no: { ot: 2, csoba: 2 },
    unsure: { review: 2 }
  },
  {
    id: "q2",
    text: "Is this primarily a prototype, pilot, experiment, demonstration, or new capability development effort?",
    yes: { ot: 4, csoba: 2 },
    no: { far: 2 },
    unsure: { review: 2 }
  },
  {
    id: "q3",
    text: "Do you need to attract nontraditional defense contractors, startups, commercial technology firms, or vendors that may avoid FAR-based contracts?",
    yes: { ot: 4, csoba: 2 },
    no: { far: 1 },
    unsure: { review: 1 }
  },
  {
    id: "q4",
    text: "Is speed, iteration, and collaboration more important than a fully locked requirement at award?",
    yes: { ot: 3, csoba: 2 },
    no: { far: 2 },
    unsure: { review: 2 }
  },
  {
    id: "q5",
    text: "Does an existing contract vehicle, BPA, IDIQ, GWAC, or task order vehicle already cover the likely scope?",
    yes: { existingVehicle: 4, far: 1 },
    no: { ot: 1, csoba: 1 },
    unsure: { review: 2 }
  },
  {
    id: "q6",
    text: "Is the solution likely available commercially with minimal Government-unique development?",
    yes: { commercial: 4, existingVehicle: 2 },
    no: { ot: 2, csoba: 1 },
    unsure: { review: 1 }
  },
  {
    id: "q7",
    text: "Is the requirement mostly recurring services, staff augmentation, sustainment, or routine support?",
    yes: { far: 4, existingVehicle: 3 },
    no: { ot: 1, csoba: 1 },
    unsure: { review: 1 }
  },
  {
    id: "q8",
    text: "Would you benefit from first asking industry what solutions exist before writing a detailed requirement?",
    yes: { csoba: 3, ot: 2 },
    no: { far: 1 },
    unsure: { review: 1 }
  },
  {
    id: "q9",
    text: "Is there a possible follow-on production or scaling need after a successful prototype?",
    yes: { ot: 3, review: 1 },
    no: { csoba: 1 },
    unsure: { review: 2 }
  },
  {
    id: "q10",
    text: "Have you already engaged a Contracting Officer, Agreements Officer, or acquisition attorney?",
    yes: { review: 1 },
    no: { review: 3 },
    unsure: { review: 2 }
  }
];

const labels = {
  yes: "Yes",
  no: "No",
  unsure: "Unsure",
  next: "Next",
  back: "Back",
  reset: "Start Over",
  copySummary: "Copy Summary",
  print: "Print Summary",
  primary: "Primary path to discuss",
  secondary: "Secondary paths to consider",
  why: "This result is based on your answers",
  nextSteps: "Recommended next steps",
  questionsForContracts: "Questions to ask Contracts",
  summary: "Copyable summary"
};

const standardNextSteps = [
  "Prepare a short problem statement.",
  "Identify mission need, desired outcome, and urgency.",
  "Summarize known market research.",
  "Identify whether vendors, prototypes, commercial products, or existing vehicles are already known.",
  "Engage the Contracting Officer or Agreements Officer early.",
  "Ask whether legal counsel or policy review is needed."
];

const questionsForContracts = [
  "Does this requirement fit an existing contract vehicle?",
  "Would a FAR-based approach be faster or more appropriate?",
  "Is this requirement suitable for commercial acquisition?",
  "Is a CSO, BAA, RFI, or sources sought appropriate before choosing a path?",
  "Is this effort a valid candidate for an Other Transaction discussion?",
  "Who has authority to execute the recommended path?",
  "What documentation should the program office prepare next?"
];

const governanceWarning = "Do not include classified information, source selection information, vendor proprietary information, procurement-sensitive information, CUI, NNPI, PII, or controlled acquisition data in the MVP.";

const state = {
  currentQuestion: 0,
  answers: {}
};

const form = document.querySelector("#triage-form");
const wizardHeading = document.querySelector("#wizard-heading");
const questionHost = document.querySelector("#question-host");
const progressFill = document.querySelector("#progress-fill");
const backButton = document.querySelector("#back-button");
const nextButton = document.querySelector("#next-button");
const resetButton = document.querySelector("#reset-button");
const resultTitle = document.querySelector("#result-title");
const resultSummary = document.querySelector("#result-summary");
const secondaryPaths = document.querySelector("#secondary-paths");
const whyPanel = document.querySelector("#why-panel");
const scoreList = document.querySelector("#score-list");
const nextSteps = document.querySelector("#next-steps");
const summaryText = document.querySelector("#summary-text");
const copyButton = document.querySelector("#copy-summary");
const printButton = document.querySelector("#print-summary");
const themeToggle = document.querySelector("#theme-toggle");

function getScores() {
  const scores = Object.fromEntries(Object.keys(paths).map((pathId) => [pathId, 0]));

  questions.forEach((question) => {
    const answer = state.answers[question.id];
    if (!answer) return;

    Object.entries(question[answer]).forEach(([pathId, points]) => {
      scores[pathId] += points;
    });
  });

  return scores;
}

function getSortedScores() {
  return Object.entries(getScores()).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return paths[a[0]].name.localeCompare(paths[b[0]].name);
  });
}

function getAnsweredCount() {
  return Object.keys(state.answers).length;
}

function getRecommendation() {
  const sorted = getSortedScores();
  const primary = sorted[0];
  const secondScore = sorted[1] ? sorted[1][1] : 0;
  const reviewScore = getScores().review;
  const closePaths = sorted
    .slice(1)
    .filter(([, score]) => primary[1] - score < 3 && score > 0)
    .slice(0, 3);
  const secondary = closePaths.length > 0 ? closePaths : sorted.slice(1, 3).filter(([, score]) => score > 0);
  const isClose = primary[1] - secondScore < 3 && secondScore > 0;
  const reviewEmphasis = reviewScore >= 5 || primary[0] === "review";

  return { primary, secondary, isClose, reviewEmphasis };
}

function renderQuestion() {
  const question = questions[state.currentQuestion];
  const selected = state.answers[question.id];
  const progress = ((state.currentQuestion + 1) / questions.length) * 100;

  wizardHeading.textContent = `Question ${state.currentQuestion + 1} of ${questions.length}`;
  progressFill.style.width = `${progress}%`;
  backButton.disabled = state.currentQuestion === 0;
  nextButton.textContent = state.currentQuestion === questions.length - 1 ? "View Recommendation" : labels.next;

  questionHost.innerHTML = `
      <fieldset class="question" tabindex="-1">
      <legend>${question.text}</legend>
      <div class="choice-grid">
        ${["yes", "no", "unsure"].map((answer) => {
          const id = `${question.id}-${answer}`;
          return `
            <label class="choice" for="${id}">
              <input id="${id}" type="radio" name="${question.id}" value="${answer}" ${selected === answer ? "checked" : ""}>
              <span>${labels[answer]}</span>
            </label>
          `;
        }).join("")}
      </div>
    </fieldset>
  `;
}

function renderScores() {
  const sorted = getSortedScores();
  const maxScore = Math.max(...sorted.map(([, score]) => score), 1);

  scoreList.innerHTML = sorted.map(([pathId, score]) => {
    const percent = Math.round((score / maxScore) * 100);
    return `
      <div class="score-row">
        <div class="score-label"><span>${paths[pathId].name}</span><strong>${score}</strong></div>
        <div class="score-track"><div class="score-fill" style="width: ${percent}%"></div></div>
      </div>
    `;
  }).join("");
}

function buildSummaryText() {
  const answeredCount = getAnsweredCount();
  const sorted = getSortedScores();
  const { primary, secondary, isClose, reviewEmphasis } = getRecommendation();
  const [primaryPathId, primaryScore] = primary;
  const answerLines = questions.map((question) => {
    const answer = state.answers[question.id];
    return `- ${question.text}: ${answer ? labels[answer] : "Not answered"}`;
  });
  const scoreLines = sorted.map(([pathId, score]) => `- ${paths[pathId].name}: ${score}`);
  const secondaryLines = secondary.length > 0
    ? secondary.map(([pathId, score]) => `- ${paths[pathId].name}: ${score}`)
    : ["- No close secondary path identified yet."];

  return [
    "Acquisition Pathway Triage Tool Summary",
    "",
    `Answered: ${answeredCount} of ${questions.length}`,
    `Primary path to discuss: ${paths[primaryPathId].name}`,
    `Primary fit score: ${primaryScore}`,
    `Recommendation language: Consider discussing whether this may be a candidate for ${paths[primaryPathId].name}.`,
    paths[primaryPathId].description,
    "",
    "Secondary paths to consider:",
    ...secondaryLines,
    "",
    labels.why + ":",
    ...scoreLines,
    "",
    isClose ? "Note: Two or more paths are close in score. Discuss the tradeoffs with Contracts before proceeding." : "Note: The primary path is separated from the next path by at least 3 points.",
    reviewEmphasis ? "Review emphasis: Answers indicate that Contracting Officer, Agreements Officer, legal counsel, or acquisition leadership review should occur before proceeding." : "Review emphasis: Official review is still required before any acquisition strategy decision.",
    "",
    labels.nextSteps + ":",
    ...standardNextSteps.map((step) => `- ${step}`),
    "",
    labels.questionsForContracts + ":",
    ...questionsForContracts.map((question) => `- ${question}`),
    "",
    "Safety warning:",
    governanceWarning,
    "",
    "Disclaimer: This tool does not provide official contracting, legal, or acquisition determinations. It is a planning aid only. Official determinations must be made by the appropriate Contracting Officer, Agreements Officer, legal counsel, and acquisition leadership. No data leaves the browser."
  ].join("\n");
}

function renderRecommendation() {
  const answeredCount = getAnsweredCount();
  const { primary, secondary, isClose, reviewEmphasis } = getRecommendation();
  const [primaryPathId, primaryScore] = primary;
  const isComplete = answeredCount === questions.length;

  if (!isComplete) {
    resultTitle.textContent = `${answeredCount} of ${questions.length} answered`;
    resultSummary.textContent = "Answer all questions to generate the clearest suggested discussion path. Interim weighted scores are shown below.";
    secondaryPaths.innerHTML = "";
    whyPanel.innerHTML = "";
    nextSteps.innerHTML = "";
  } else {
    resultTitle.textContent = `Consider discussing: ${paths[primaryPathId].name}`;
    resultSummary.textContent = `This may be a candidate for ${paths[primaryPathId].name}. ${paths[primaryPathId].description} Fit score: ${primaryScore}. This is not an authorization or official determination.`;
    secondaryPaths.innerHTML = `
      <h3>${labels.secondary}</h3>
      ${secondary.map(([pathId, score]) => `
        <div class="path-chip"><strong>${paths[pathId].name}</strong><br>Fit score: ${score}</div>
      `).join("") || `<div class="path-chip">No close secondary path identified.</div>`}
    `;
    whyPanel.innerHTML = `
      <h3>${labels.why}</h3>
      <p>${isClose ? "Two or more paths are close in score, so discuss multiple options with Contracts." : "The primary path leads the next path by at least 3 points."}</p>
      <p>${reviewEmphasis ? "The review score is high enough to emphasize early CO, AO, legal, or acquisition leadership engagement." : "Official review is still required before any acquisition strategy decision."}</p>
    `;
    nextSteps.innerHTML = `
      <section>
        <h3>${labels.nextSteps}</h3>
        <ul>${standardNextSteps.map((step) => `<li>${step}</li>`).join("")}</ul>
      </section>
      <section>
        <h3>${labels.questionsForContracts}</h3>
        <ul>${questionsForContracts.map((question) => `<li>${question}</li>`).join("")}</ul>
      </section>
    `;
  }

  renderScores();
  summaryText.value = buildSummaryText();
}

function renderApp() {
  renderQuestion();
  renderRecommendation();
}

function saveCurrentAnswer() {
  const question = questions[state.currentQuestion];
  const checked = form.querySelector(`input[name="${question.id}"]:checked`);
  if (!checked) return false;

  state.answers[question.id] = checked.value;
  return true;
}

function setTheme(isLight) {
  document.body.classList.toggle("light-mode", isLight);
  themeToggle.textContent = isLight ? "Dark mode" : "Light mode";
  themeToggle.setAttribute("aria-pressed", String(isLight));
}

questionHost.addEventListener("change", (event) => {
  if (event.target.matches("input[type='radio']")) {
    saveCurrentAnswer();
    renderRecommendation();
  }
});

backButton.addEventListener("click", () => {
  saveCurrentAnswer();
  state.currentQuestion = Math.max(0, state.currentQuestion - 1);
  renderApp();
});

nextButton.addEventListener("click", () => {
  if (!saveCurrentAnswer()) {
    questionHost.querySelector("fieldset").focus();
    return;
  }

  if (state.currentQuestion < questions.length - 1) {
    state.currentQuestion += 1;
    renderApp();
  } else {
    renderRecommendation();
    document.querySelector(".result-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

resetButton.addEventListener("click", () => {
  state.currentQuestion = 0;
  state.answers = {};
  renderApp();
});

themeToggle.addEventListener("click", () => {
  setTheme(!document.body.classList.contains("light-mode"));
});

copyButton.addEventListener("click", async () => {
  const summary = summaryText.value;
  try {
    await navigator.clipboard.writeText(summary);
    copyButton.textContent = "Copied";
  } catch {
    summaryText.focus();
    summaryText.select();
    document.execCommand("copy");
    copyButton.textContent = "Copied";
  }
  window.setTimeout(() => {
    copyButton.textContent = labels.copySummary;
  }, 1600);
});

printButton.addEventListener("click", () => {
  window.print();
});

renderApp();
setTheme(false);
