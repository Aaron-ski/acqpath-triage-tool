const pathways = {
  ot: {
    label: "Discuss an Other Transaction",
    summary: "This looks like a candidate for an Other Transaction discussion, especially if the work involves prototype activity, non-traditional performers, or speed and flexibility that may not fit a standard FAR path.",
    nextSteps: [
      "Ask whether the requirement is a prototype, research, or follow-on production candidate.",
      "Identify likely non-traditional defense contractors, small businesses, consortia, or performers not comfortable with standard FAR terms.",
      "Prepare the business rationale for flexibility, speed, competition approach, data rights, IP, and transition."
    ],
    questions: [
      "Does the effort qualify as prototype, research, or follow-on production under the applicable authority?",
      "What approval level and agreements support will be required?",
      "What safeguards are needed for data rights, IP, deliverables, cybersecurity, and transition?"
    ]
  },
  far: {
    label: "Discuss a FAR-based contract",
    summary: "A traditional FAR-based contract may fit when the requirement is mature, the government can define the need clearly, and standard competition, clauses, deliverables, and oversight are appropriate.",
    nextSteps: [
      "Refine the performance work statement, evaluation factors, funding profile, and schedule.",
      "Confirm market research, acquisition planning lead times, contract type options, and source-selection expectations.",
      "Coordinate early on data rights, cybersecurity, deliverable acceptance, and government-furnished information."
    ],
    questions: [
      "Is the requirement sufficiently defined for a solicitation?",
      "Which contract type matches the technical, cost, and schedule risk profile?",
      "What approvals, milestones, and competition requirements drive the timeline?"
    ]
  },
  cso: {
    label: "Discuss a Commercial Solutions Opening",
    summary: "A CSO discussion may be useful when the need can be framed as a problem statement and the program wants commercial solution proposals with flexible evaluation and award mechanics.",
    nextSteps: [
      "Translate the need into a clear problem statement and desired mission outcome.",
      "Collect evidence that commercial solutions may exist and that solution variation is useful.",
      "Ask Contracts whether a CSO authority or existing CSO vehicle is available."
    ],
    questions: [
      "Can industry propose varied commercial approaches rather than respond to a fixed specification?",
      "What evidence supports commercial availability?",
      "How will demonstrations, technical merit, price, and transition potential be evaluated?"
    ]
  },
  baa: {
    label: "Discuss a Broad Agency Announcement",
    summary: "A BAA may fit when the core need is basic or applied research and the government wants white papers or proposals for scientific or technical investigation.",
    nextSteps: [
      "Clarify the research objective, technical uncertainty, and expected knowledge gain.",
      "Confirm whether a BAA exists or a new announcement is warranted.",
      "Define proposal review criteria, technical reviewers, funding limits, and expected research deliverables."
    ],
    questions: [
      "Is this primarily research rather than procurement of a defined product or service?",
      "What scientific or technical advancement is sought?",
      "Who will evaluate white papers and proposals?"
    ]
  },
  vehicle: {
    label: "Check existing vehicles first",
    summary: "An existing contract vehicle may be the fastest compliant route if scope, ceiling, vendors, funding, and ordering procedures align with the requirement.",
    nextSteps: [
      "Search existing IDIQs, BPAs, GWACs, agency contracts, schedules, and marketplace options.",
      "Confirm scope fit, ceiling, ordering lead time, fair opportunity rules, and vendor capabilities.",
      "Ask Contracts whether the vehicle supports the desired competition and award approach."
    ],
    questions: [
      "Is the requirement within scope of an existing vehicle?",
      "Are qualified vendors already on the vehicle?",
      "What ordering rules, fair opportunity requirements, and approvals apply?"
    ]
  },
  commercial: {
    label: "Discuss commercial acquisition options",
    summary: "Commercial acquisition approaches may fit when the need can be met by readily available products or services with limited customization.",
    nextSteps: [
      "Document market research showing commercial availability and price signals.",
      "Clarify minimum needs, configuration limits, license terms, sustainment expectations, and cyber requirements.",
      "Ask Contracts about commercial item procedures, purchase card, GSA, or other simplified options."
    ],
    questions: [
      "Is the item or service sold in substantial quantities to the public or non-government buyers?",
      "What customization, cybersecurity, or data terms could affect commercial treatment?",
      "Can the need be satisfied through catalog, schedule, or simplified buying channels?"
    ]
  }
};

const triageQuestions = [
  {
    prompt: "Is the requirement well-defined enough to describe deliverables, acceptance criteria, and evaluation factors?",
    help: "Yes favors a more traditional contracting path. No may point to flexible, research, or problem-statement-based paths.",
    yes: { far: 3, vehicle: 2, commercial: 1 },
    no: { ot: 2, cso: 2, baa: 2 },
    unsure: { far: 1, ot: 1, cso: 1 }
  },
  {
    prompt: "Is the main objective prototype, demonstration, experimentation, or transition learning?",
    help: "Prototype and demonstration work often needs early Other Transaction or CSO discussion.",
    yes: { ot: 4, cso: 2 },
    no: { far: 2, vehicle: 1, commercial: 1 },
    unsure: { ot: 1, cso: 1, far: 1 }
  },
  {
    prompt: "Is the main objective basic or applied research rather than buying a defined product or service?",
    help: "Research-oriented work may belong in a BAA conversation.",
    yes: { baa: 4, ot: 1 },
    no: { far: 2, vehicle: 1, commercial: 1 },
    unsure: { baa: 1, far: 1 }
  },
  {
    prompt: "Do comparable commercial products or services appear to be available in the marketplace?",
    help: "Commercial availability can support commercial acquisition procedures, CSO framing, or existing vehicle searches.",
    yes: { commercial: 4, cso: 2, vehicle: 1 },
    no: { far: 2, ot: 1, baa: 1 },
    unsure: { commercial: 1, cso: 1, vehicle: 1 }
  },
  {
    prompt: "Is there a known contract vehicle, schedule, BPA, IDIQ, GWAC, or marketplace that may already cover the need?",
    help: "If scope and vendors fit, an existing vehicle may be the fastest compliant route.",
    yes: { vehicle: 5, far: 1 },
    no: { far: 1, ot: 1, cso: 1, baa: 1, commercial: 1 },
    unsure: { vehicle: 2, far: 1, commercial: 1 }
  },
  {
    prompt: "Is speed or flexible execution more important than using a fully specified standard solicitation?",
    help: "High urgency or uncertainty can make flexible acquisition paths worth discussing early.",
    yes: { ot: 3, vehicle: 2, cso: 2, commercial: 1 },
    no: { far: 3, baa: 1 },
    unsure: { ot: 1, far: 1, vehicle: 1 }
  },
  {
    prompt: "Is the program trying to reach non-traditional companies, startups, consortia, or performers that may avoid standard FAR contracting?",
    help: "Non-traditional performer interest is a strong signal to discuss Other Transaction or CSO options.",
    yes: { ot: 4, cso: 2, commercial: 1 },
    no: { far: 2, vehicle: 1 },
    unsure: { ot: 1, cso: 1 }
  },
  {
    prompt: "Can the need be framed as a problem statement where industry proposes different solution approaches?",
    help: "Problem statements are useful for CSO, OT, and some research pathways.",
    yes: { cso: 4, ot: 2, baa: 1 },
    no: { far: 2, vehicle: 2, commercial: 1 },
    unsure: { cso: 1, ot: 1, far: 1 }
  }
];

const questionsEl = document.querySelector("#questions");
const form = document.querySelector("#triage-form");
const resultTitle = document.querySelector("#result-title");
const resultSummary = document.querySelector("#result-summary");
const secondaryPaths = document.querySelector("#secondary-paths");
const scoreList = document.querySelector("#score-list");
const nextSteps = document.querySelector("#next-steps");
const copyButton = document.querySelector("#copy-summary");
const printButton = document.querySelector("#print-summary");
const themeToggle = document.querySelector("#theme-toggle");

function renderQuestions() {
  questionsEl.innerHTML = triageQuestions.map((question, index) => {
    const choices = ["yes", "no", "unsure"].map((answer) => {
      const id = `q${index}-${answer}`;
      const label = answer.charAt(0).toUpperCase() + answer.slice(1);
      return `
        <label class="choice" for="${id}">
          <input id="${id}" type="radio" name="q${index}" value="${answer}">
          <span>${label}</span>
        </label>
      `;
    }).join("");

    return `
      <fieldset class="question">
        <legend>${index + 1}. ${question.prompt}</legend>
        <p class="question-help">${question.help}</p>
        <div class="choice-grid">${choices}</div>
      </fieldset>
    `;
  }).join("");
}

function getScores() {
  const scores = Object.fromEntries(Object.keys(pathways).map((key) => [key, 0]));
  const answers = [];

  triageQuestions.forEach((question, index) => {
    const selected = form.querySelector(`input[name="q${index}"]:checked`);
    if (!selected) return;
    const answer = selected.value;
    answers.push({ question: question.prompt, answer });
    Object.entries(question[answer]).forEach(([key, value]) => {
      scores[key] += value;
    });
  });

  return { scores, answers };
}

function formatAnswer(answer) {
  return answer.charAt(0).toUpperCase() + answer.slice(1);
}

function sortedScores(scores) {
  return Object.entries(scores).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return pathways[a[0]].label.localeCompare(pathways[b[0]].label);
  });
}

function renderResults() {
  const { scores, answers } = getScores();
  const answeredCount = answers.length;
  const sorted = sortedScores(scores);
  const maxScore = Math.max(...Object.values(scores), 1);
  const [topKey, topScore] = sorted[0];
  const topPathway = pathways[topKey];
  const secondary = sorted.slice(1, 3);

  scoreList.innerHTML = sorted.map(([key, score]) => {
    const percent = Math.round((score / maxScore) * 100);
    return `
      <div class="score-row">
        <div class="score-label"><span>${pathways[key].label}</span><strong>${score}</strong></div>
        <div class="score-track"><div class="score-fill" style="width: ${percent}%"></div></div>
      </div>
    `;
  }).join("");

  if (answeredCount < triageQuestions.length) {
    resultTitle.textContent = `${answeredCount} of ${triageQuestions.length} answered`;
    resultSummary.textContent = "Answer all checklist items for the clearest recommendation. Interim weighted scores are shown below.";
    secondaryPaths.innerHTML = "";
    nextSteps.innerHTML = "";
    return;
  }

  resultTitle.textContent = topPathway.label;
  resultSummary.textContent = `${topPathway.summary} Fit score: ${topScore}. Use this as a conversation starter, not as a binding determination.`;
  secondaryPaths.innerHTML = `
    <h3>Secondary paths to consider</h3>
    ${secondary.map(([key, score]) => `
      <div class="path-chip"><strong>${pathways[key].label}</strong><br>Fit score: ${score}</div>
    `).join("")}
  `;
  nextSteps.innerHTML = `
    <section>
      <h3>Recommended next steps</h3>
      <ul>${topPathway.nextSteps.map((step) => `<li>${step}</li>`).join("")}</ul>
    </section>
    <section>
      <h3>Questions to ask Contracts</h3>
      <ul>${topPathway.questions.map((question) => `<li>${question}</li>`).join("")}</ul>
    </section>
  `;
}

function buildSummaryText() {
  const { scores, answers } = getScores();
  const sorted = sortedScores(scores);
  const [topKey, topScore] = sorted[0];
  const top = pathways[topKey];
  const secondary = sorted.slice(1, 3);
  const answerText = answers.map((item) => `- ${item.question}: ${formatAnswer(item.answer)}`).join("\n");
  const scoreText = sorted.map(([key, score]) => `- ${pathways[key].label}: ${score}`).join("\n");
  const secondaryText = secondary.map(([key, score]) => `- ${pathways[key].label}: ${score}`).join("\n");

  return [
    "Acquisition Pathway Triage Tool Summary",
    "",
    `Top recommendation: ${top.label}`,
    `Top fit score: ${topScore}`,
    top.summary,
    "",
    "Secondary paths to consider:",
    secondaryText || "- None",
    "",
    "Answers:",
    answerText || "- No answers selected",
    "",
    "Weighted fit scores:",
    scoreText,
    "",
    "Recommended next steps:",
    ...top.nextSteps.map((step) => `- ${step}`),
    "",
    "Questions to ask Contracts:",
    ...top.questions.map((question) => `- ${question}`),
    "",
    "Disclaimer: This is a planning and triage aid only. Final decisions must be reviewed by the appropriate Contracting Officer, Agreements Officer, legal counsel, and acquisition leadership. No data leaves the browser."
  ].join("\n");
}

function setTheme(isLight) {
  document.body.classList.toggle("light-mode", isLight);
  themeToggle.textContent = isLight ? "Dark mode" : "Light mode";
  themeToggle.setAttribute("aria-pressed", String(isLight));
}

renderQuestions();
renderResults();
setTheme(false);

form.addEventListener("change", renderResults);
form.addEventListener("reset", () => {
  window.setTimeout(renderResults, 0);
});

themeToggle.addEventListener("click", () => {
  setTheme(!document.body.classList.contains("light-mode"));
});

copyButton.addEventListener("click", async () => {
  const summary = buildSummaryText();
  try {
    await navigator.clipboard.writeText(summary);
    copyButton.textContent = "Copied";
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = summary;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    copyButton.textContent = "Copied";
  }
  window.setTimeout(() => {
    copyButton.textContent = "Copy summary";
  }, 1600);
});

printButton.addEventListener("click", () => {
  window.print();
});
