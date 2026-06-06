const pathways = {
  ot: {
    label: "Discuss an Other Transaction",
    summary: "This looks like a candidate for an Other Transaction discussion, especially if the work involves prototype activity, non-traditional performers, or speed and flexibility that may not fit a standard FAR path.",
    nextSteps: [
      "Ask whether the requirement is a prototype, follow-on production candidate, or research-focused effort.",
      "Identify likely non-traditional defense contractors, small businesses, or consortia.",
      "Prepare the business rationale for flexibility, speed, and competition approach."
    ],
    questions: [
      "Does the effort qualify as prototype, research, or follow-on production under the applicable authority?",
      "What approval level and agreements support will be required?",
      "What safeguards are needed for data rights, IP, deliverables, and transition?"
    ]
  },
  far: {
    label: "Discuss a FAR-based contract",
    summary: "A traditional FAR-based contract may fit best when the requirement is mature, the government can define the need clearly, and standard competition, clauses, deliverables, and oversight are appropriate.",
    nextSteps: [
      "Refine the performance work statement, evaluation factors, funding profile, and schedule.",
      "Confirm market research, acquisition planning lead times, and contract type options.",
      "Coordinate early on source selection, data rights, cybersecurity, and deliverable acceptance."
    ],
    questions: [
      "Is the requirement sufficiently defined for a solicitation?",
      "Which contract type matches the risk profile?",
      "What approvals, milestones, and competition requirements drive the timeline?"
    ]
  },
  cso: {
    label: "Discuss a Commercial Solutions Opening",
    summary: "A CSO discussion may be useful when the need can be framed as a problem statement and the program wants commercial solution proposals with flexible evaluation and award mechanics.",
    nextSteps: [
      "Translate the need into a clear problem statement and desired outcome.",
      "Collect evidence that commercial solutions may exist.",
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
      "Define proposal review criteria and expected research deliverables."
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
      "Search existing IDIQs, BPAs, GWACs, agency contracts, and marketplace options.",
      "Confirm scope fit, ceiling, ordering lead time, and vendor capabilities.",
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
      "Clarify minimum needs, configuration limits, license terms, and sustainment expectations.",
      "Ask Contracts about commercial item procedures, purchase card, GSA, or other simplified options."
    ],
    questions: [
      "Is the item or service sold in substantial quantities to the public or non-government buyers?",
      "What customization, cybersecurity, or data terms could affect commercial treatment?",
      "Can the need be satisfied through catalog, schedule, or simplified buying channels?"
    ]
  }
};

const questions = [
  {
    prompt: "How mature is the requirement?",
    choices: [
      { label: "Well-defined product or service", help: "Requirements, deliverables, and acceptance criteria are already clear.", scores: { far: 3, vehicle: 2, commercial: 1 } },
      { label: "Problem statement with room for solutions", help: "The outcome is clear, but industry could propose different approaches.", scores: { cso: 3, ot: 2, commercial: 1 } },
      { label: "Research or technical uncertainty", help: "The main objective is discovery, experimentation, or advancing knowledge.", scores: { baa: 3, ot: 2 } }
    ]
  },
  {
    prompt: "What best describes the market?",
    choices: [
      { label: "Commercial items or services likely exist", help: "Comparable offerings are sold outside the government.", scores: { commercial: 3, cso: 2, vehicle: 1 } },
      { label: "Defense or specialized suppliers are likely", help: "The work may require niche mission knowledge or defense-specific integration.", scores: { far: 2, ot: 2, vehicle: 1 } },
      { label: "Non-traditional performers are important", help: "The program wants to reach firms that may not routinely do FAR contracting.", scores: { ot: 3, cso: 2 } }
    ]
  },
  {
    prompt: "How urgent is the need?",
    choices: [
      { label: "Urgent mission need", help: "The program needs a fast path and can support rapid coordination.", scores: { vehicle: 3, ot: 2, commercial: 2, cso: 1 } },
      { label: "Standard acquisition timeline is acceptable", help: "There is time for complete acquisition planning and solicitation steps.", scores: { far: 3, baa: 1 } },
      { label: "Schedule is flexible for exploration", help: "Learning and discovery matter more than immediate delivery.", scores: { baa: 3, cso: 1 } }
    ]
  },
  {
    prompt: "How much flexibility does the effort need?",
    choices: [
      { label: "High flexibility", help: "Scope, milestones, or technical approach may evolve as the work progresses.", scores: { ot: 3, baa: 2, cso: 1 } },
      { label: "Moderate flexibility", help: "The government can define outcomes but wants room for solution variation.", scores: { cso: 3, commercial: 1 } },
      { label: "Low flexibility", help: "The government knows what to buy and how to evaluate it.", scores: { far: 3, vehicle: 2 } }
    ]
  },
  {
    prompt: "Is there a likely existing buying channel?",
    choices: [
      { label: "Yes, a known vehicle or schedule may fit", help: "A contract vehicle, schedule, BPA, IDIQ, or marketplace may already be available.", scores: { vehicle: 4, commercial: 1 } },
      { label: "Maybe, but scope fit is unclear", help: "There may be vehicles, but Contracts must validate scope and ordering rules.", scores: { vehicle: 2, far: 1, commercial: 1 } },
      { label: "No obvious existing channel", help: "A new acquisition path may be needed.", scores: { far: 1, ot: 1, cso: 1, baa: 1 } }
    ]
  },
  {
    prompt: "What is the main expected output?",
    choices: [
      { label: "Operational capability or service", help: "The program needs a deliverable capability, integration, support, or service.", scores: { far: 3, vehicle: 2, commercial: 1 } },
      { label: "Prototype or demonstration", help: "The program needs to test feasibility or demonstrate a capability.", scores: { ot: 3, cso: 2 } },
      { label: "Study, research result, or technical report", help: "The program needs investigation, analysis, or research findings.", scores: { baa: 3, far: 1 } }
    ]
  }
];

const questionsEl = document.querySelector("#questions");
const form = document.querySelector("#triage-form");
const resultTitle = document.querySelector("#result-title");
const resultSummary = document.querySelector("#result-summary");
const scoreList = document.querySelector("#score-list");
const nextSteps = document.querySelector("#next-steps");
const copyButton = document.querySelector("#copy-summary");
const printButton = document.querySelector("#print-summary");

function renderQuestions() {
  questionsEl.innerHTML = questions.map((question, index) => {
    const choices = question.choices.map((choice, choiceIndex) => {
      const id = `q${index}-choice${choiceIndex}`;
      return `
        <label class="choice" for="${id}">
          <input id="${id}" type="radio" name="q${index}" value="${choiceIndex}">
          <span><strong>${choice.label}</strong><br>${choice.help}</span>
        </label>
      `;
    }).join("");

    return `
      <fieldset class="question">
        <legend>${index + 1}. ${question.prompt}</legend>
        <div class="choice-grid">${choices}</div>
      </fieldset>
    `;
  }).join("");
}

function getScores() {
  const scores = Object.fromEntries(Object.keys(pathways).map((key) => [key, 0]));
  const answers = [];

  questions.forEach((question, index) => {
    const selected = form.querySelector(`input[name="q${index}"]:checked`);
    if (!selected) return;
    const choice = question.choices[Number(selected.value)];
    answers.push({ question: question.prompt, answer: choice.label });
    Object.entries(choice.scores).forEach(([key, value]) => {
      scores[key] += value;
    });
  });

  return { scores, answers };
}

function renderResults() {
  const { scores, answers } = getScores();
  const answeredCount = answers.length;
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const maxScore = Math.max(...Object.values(scores), 1);
  const [topKey, topScore] = sorted[0];
  const topPathway = pathways[topKey];

  scoreList.innerHTML = sorted.map(([key, score]) => {
    const percent = Math.round((score / maxScore) * 100);
    return `
      <div class="score-row">
        <div class="score-label"><span>${pathways[key].label}</span><strong>${score}</strong></div>
        <div class="score-track"><div class="score-fill" style="width: ${percent}%"></div></div>
      </div>
    `;
  }).join("");

  if (answeredCount < questions.length) {
    resultTitle.textContent = `${answeredCount} of ${questions.length} answered`;
    resultSummary.textContent = "Answer all questions for the clearest recommendation. Interim scores are shown below.";
    nextSteps.innerHTML = "";
    return;
  }

  resultTitle.textContent = topPathway.label;
  resultSummary.textContent = `${topPathway.summary} Fit score: ${topScore}. Use this as a conversation starter, not as a binding determination.`;
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
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top = pathways[sorted[0][0]];
  const answerText = answers.map((item) => `- ${item.question}: ${item.answer}`).join("\n");
  const scoreText = sorted.map(([key, score]) => `- ${pathways[key].label}: ${score}`).join("\n");

  return [
    "Acquisition Pathway Triage Tool Summary",
    "",
    `Recommendation: ${top.label}`,
    top.summary,
    "",
    "Answers:",
    answerText || "- No answers selected",
    "",
    "Fit scores:",
    scoreText,
    "",
    "Disclaimer: This is a planning and triage aid only. Final decisions must be reviewed by the appropriate Contracting Officer, Agreements Officer, legal counsel, and acquisition leadership."
  ].join("\n");
}

renderQuestions();
renderResults();

form.addEventListener("change", renderResults);
form.addEventListener("reset", () => {
  window.setTimeout(renderResults, 0);
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
