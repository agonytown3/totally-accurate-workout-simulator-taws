const STORAGE_PROFILE = "workoutProfile";
const STORAGE_GOALS = "workoutGoals";
const STORAGE_XP = "workoutXp";

let workoutSeconds = 25 * 60;
let workoutTotal = workoutSeconds;
let timerId = null;
let stopwatchSeconds = 0;
let stopwatchId = null;

const profileForm = document.querySelector("#profileForm");
const planResult = document.querySelector("#planResult");
const emptyPlan = document.querySelector("#emptyPlan");
const deletePlanButton = document.querySelector("#deletePlan");
const workoutExerciseSelect = document.querySelector("#workoutExercise");
const exerciseDurationSelect = document.querySelector("#exerciseDuration");
const goalForm = document.querySelector("#goalForm");
const goalInput = document.querySelector("#goalInput");
const goalList = document.querySelector("#goalList");
let planExercises = [];

const exercises = [
  {
    id: "bodyweightSquat",
    name: "Bodyweight squat",
    text: "Stand with feet about shoulder-width apart. Push your hips back, keep your chest lifted, and stop before your knees move inward.",
    url: "https://www.youtube.com/results?search_query=beginner+bodyweight+squat+form",
    recommendedSeconds: 60,
    restSeconds: 60
  },
  {
    id: "wallPushUp",
    name: "Wall push-up",
    text: "Hands on a wall at chest height. Keep a straight line from head to heels and move slowly toward and away from the wall.",
    url: "https://www.youtube.com/results?search_query=wall+push+up+form+beginner",
    recommendedSeconds: 60,
    restSeconds: 60
  },
  {
    id: "easyMarching",
    name: "Easy marching",
    text: "March in place with a tall posture. Start slowly and lift your knees only as high as feels comfortable.",
    url: "https://www.youtube.com/results?search_query=standing+march+exercise+beginner",
    recommendedSeconds: 120,
    restSeconds: 30
  },
  {
    id: "birdDog",
    name: "Bird dog",
    text: "From hands and knees, reach one arm and the opposite leg out. Keep your hips level and return slowly.",
    url: "https://www.youtube.com/results?search_query=bird+dog+exercise+beginner+form",
    recommendedSeconds: 120,
    restSeconds: 30
  },
  {
    id: "calfRaise",
    name: "Standing calf raise",
    text: "Hold a stable chair if needed. Rise onto your toes, pause, and lower with control.",
    url: "https://www.youtube.com/results?search_query=standing+calf+raise+beginner+form",
    recommendedSeconds: 60,
    restSeconds: 30
  },
  {
    id: "gentleStretch",
    name: "Gentle stretch",
    text: "Move until you feel a mild stretch, never sharp pain. Hold still and breathe normally.",
    url: "https://www.youtube.com/results?search_query=gentle+full+body+stretch+for+beginners",
    recommendedSeconds: 180,
    restSeconds: 30
  },
  {
    id: "slowSquat",
    name: "Slow squats",
    text: "Use a comfortable range, move slowly, and stop if your knees or back hurt.",
    url: "https://www.youtube.com/results?search_query=slow+bodyweight+squat+beginner+form",
    recommendedSeconds: 120,
    restSeconds: 60
  },
  {
    id: "gluteBridge",
    name: "Glute bridge",
    text: "Lie on your back with knees bent and feet flat. Lift your hips a little, then lower slowly; stop if your back hurts.",
    url: "https://www.youtube.com/results?search_query=beginner+glute+bridge+exercise+form",
    recommendedSeconds: 60,
    restSeconds: 60
  },
  {
    id: "stepTouch",
    name: "Step-touch",
    text: "Step gently to one side and bring the other foot beside it. Alternate sides at a comfortable pace.",
    url: "https://www.youtube.com/results?search_query=low+impact+step+touch+exercise+beginner",
    recommendedSeconds: 180,
    restSeconds: 30
  },
  {
    id: "seatedKneeExtension",
    name: "Seated knee extension",
    text: "Sit tall in a stable chair. Slowly straighten one knee, lower your foot, then switch sides.",
    url: "https://www.youtube.com/results?search_query=seated+knee+extension+exercise+beginner",
    recommendedSeconds: 120,
    restSeconds: 30
  },
  {
    id: "sideLegRaise",
    name: "Side leg raise",
    text: "Hold a stable chair if needed. Lift one leg gently to the side without leaning, then switch legs.",
    url: "https://www.youtube.com/results?search_query=standing+side+leg+raise+beginner+form",
    recommendedSeconds: 120,
    restSeconds: 30
  },
  {
    id: "deadBug",
    name: "Dead bug",
    text: "Lie on your back and move one arm and the opposite leg slowly. Keep the movement comfortable and stop if your back hurts.",
    url: "https://www.youtube.com/results?search_query=beginner+dead+bug+exercise+form",
    recommendedSeconds: 120,
    restSeconds: 30
  },
  {
    id: "wallSit",
    name: "Short wall sit",
    text: "Lean against a wall and bend your knees only a little. Hold briefly, stand up, and stop if you feel pain.",
    url: "https://www.youtube.com/results?search_query=beginner+wall+sit+safe+form",
    recommendedSeconds: 30,
    restSeconds: 60
  },
  {
    id: "marchingIntervals",
    name: "Marching intervals",
    text: "Alternate a short, quicker march with an easy pace. Keep the steps comfortable and rest whenever you need.",
    url: "https://www.youtube.com/results?search_query=low+impact+marching+intervals+beginner",
    recommendedSeconds: 180,
    restSeconds: 30
  }
];

const exerciseById = Object.fromEntries(exercises.map((exercise) => [exercise.id, exercise]));
const planTemplates = {
  fitness: {
    warmup: { key: "warmup", exerciseId: "easyMarching", planText: "Easy marching - 5 minutes" },
    cooldown: { key: "cooldown", exerciseId: "gentleStretch", planText: "Easy stretch - 3 minutes" },
    choices: [
      { key: "fitness-squat", exerciseId: "bodyweightSquat", planText: "Squats - 2 sets of 8 reps" },
      { key: "fitness-wall-push-up", exerciseId: "wallPushUp", planText: "Wall push-ups - 2 sets of 8 reps" },
      { key: "fitness-bird-dog", exerciseId: "birdDog", planText: "Bird dog - 2 sets of 6 reps per side" },
      { key: "fitness-calf-raise", exerciseId: "calfRaise", planText: "Calf raises - 2 sets of 10 reps" },
      { key: "fitness-glute-bridge", exerciseId: "gluteBridge", planText: "Glute bridges - 2 sets of 8 reps" },
      { key: "fitness-step-touch", exerciseId: "stepTouch", planText: "Step-touch - 3 minutes" },
      { key: "fitness-seated-knee-extension", exerciseId: "seatedKneeExtension", planText: "Seated knee extensions - 2 sets of 8 reps per side" },
      { key: "fitness-side-leg-raise", exerciseId: "sideLegRaise", planText: "Side leg raises - 2 sets of 8 reps per side" },
      { key: "fitness-dead-bug", exerciseId: "deadBug", planText: "Dead bug - 2 sets of 6 reps per side" }
    ]
  },
  strength: {
    warmup: { key: "warmup", exerciseId: "easyMarching", planText: "Easy marching - 5 minutes" },
    cooldown: { key: "cooldown", exerciseId: "gentleStretch", planText: "Easy stretch - 3 minutes" },
    choices: [
      { key: "strength-squat", exerciseId: "slowSquat", planText: "Slow squats - 3 sets of 8 reps" },
      { key: "strength-wall-push-up", exerciseId: "wallPushUp", planText: "Wall push-ups - 3 sets of 8 reps" },
      { key: "strength-glute-bridge", exerciseId: "gluteBridge", planText: "Glute bridges - 3 sets of 8 reps" },
      { key: "strength-seated-knee-extension", exerciseId: "seatedKneeExtension", planText: "Seated knee extensions - 2 sets of 8 reps per side" },
      { key: "strength-side-leg-raise", exerciseId: "sideLegRaise", planText: "Side leg raises - 2 sets of 8 reps per side" },
      { key: "strength-dead-bug", exerciseId: "deadBug", planText: "Dead bug - 2 sets of 6 reps per side" },
      { key: "strength-wall-sit", exerciseId: "wallSit", planText: "Short wall sit - 2 sets of 20 seconds" },
      { key: "strength-calf-raise", exerciseId: "calfRaise", planText: "Calf raises - 2 sets of 10 reps" }
    ]
  },
  endurance: {
    warmup: { key: "warmup", exerciseId: "easyMarching", planText: "Easy marching - 5 minutes" },
    cooldown: { key: "cooldown", exerciseId: "gentleStretch", planText: "Easy stretch - 3 minutes" },
    choices: [
      { key: "endurance-marching", exerciseId: "marchingIntervals", planText: "Marching intervals - 6 minutes" },
      { key: "endurance-step-touch", exerciseId: "stepTouch", planText: "Step-touch - 3 minutes" },
      { key: "endurance-squat", exerciseId: "bodyweightSquat", planText: "Squats - 2 sets of 10 reps" },
      { key: "endurance-bird-dog", exerciseId: "birdDog", planText: "Bird dog - 2 sets of 6 reps per side" },
      { key: "endurance-calf-raise", exerciseId: "calfRaise", planText: "Calf raises - 2 sets of 10 reps" },
      { key: "endurance-side-leg-raise", exerciseId: "sideLegRaise", planText: "Side leg raises - 2 sets of 8 reps per side" },
      { key: "endurance-seated-knee-extension", exerciseId: "seatedKneeExtension", planText: "Seated knee extensions - 2 sets of 8 reps per side" }
    ]
  }
};

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function choosePlan(profile) {
  const template = planTemplates[profile.goal] || planTemplates.fitness;
  const savedKeys = Array.isArray(profile.planOptionKeys) ? profile.planOptionKeys : [];
  const savedChoices = savedKeys.map((key) => template.choices.find((choice) => choice.key === key));
  const restoredPlanIsValid = savedKeys.length === 4 &&
    savedKeys[0] === template.warmup.key &&
    savedKeys[3] === template.cooldown.key &&
    savedChoices[1] &&
    savedChoices[2] &&
    savedKeys[1] !== savedKeys[2];

  if (restoredPlanIsValid) {
    return [template.warmup, savedChoices[1], savedChoices[2], template.cooldown];
  }

  return [template.warmup, ...shuffle(template.choices).slice(0, 2), template.cooldown];
}

document.querySelector("#exerciseGrid").innerHTML = exercises.map((exercise) => `
  <article class="exercise">
    <h3>${exercise.name}</h3>
    <p>${exercise.text}</p>
    <a href="${exercise.url}" target="_blank" rel="noopener">Watch a form video</a>
  </article>
`).join("");

const stunts = [
  {
    name: "Forward roll",
    text: "Learn only on a soft mat with a coach. Tuck the chin, keep the spine rounded, place hands beside the head, and roll smoothly instead of diving.",
    url: "https://www.youtube.com/results?search_query=forward+roll+gymnastics+beginner+coach"
  },
  {
    name: "Cartwheel",
    text: "Start in a lunge on a mat. Place hands down one at a time, kick the legs over sideways, and land with control. Never attempt on hard ground.",
    url: "https://www.youtube.com/results?search_query=beginner+cartwheel+gymnastics+coach"
  },
  {
    name: "Handstand practice",
    text: "Use a wall and a coach. Start with toes on the floor, walk your feet up gradually, keep breathing, and stop before fatigue or neck strain.",
    url: "https://www.youtube.com/results?search_query=handstand+wall+beginner+gymnastics"
  },
  {
    name: "Backflip",
    text: "High-risk tumbling skill. Learn only in a proper gymnastics facility with a qualified coach, crash mats, and guardian approval. Never try from online instructions, at home, or on hard ground.",
    url: "https://www.youtube.com/results?search_query=backflip+gymnastics+coach+trampoline+safety"
  },
  {
    name: "Aerial (no-handed cartwheel)",
    text: "Advanced skill with serious head, neck, and landing risks. Do not attempt without a qualified gymnastics coach, a safe training facility, mats, and guardian approval. This page does not teach the movement.",
    url: "https://www.youtube.com/results?search_query=aerial+cartwheel+gymnastics+coach+safety"
  },
  {
    name: "Kick-up to stand",
    text: "This can strain wrists, shoulders, back, or neck. Learn it only with a qualified gymnastics coach, proper mats, and guardian approval. Do not practise alone; this page does not teach the movement.",
    url: "https://www.youtube.com/results?search_query=kick+up+to+stand+gymnastics+coach+safety"
  }
];

document.querySelector("#stuntGrid").innerHTML = stunts.map((stunt) => `
  <article class="exercise">
    <h3>${stunt.name}</h3>
    <p>${stunt.text}</p>
    <a href="${stunt.url}" target="_blank" rel="noopener">Watch a supervised lesson</a>
  </article>
`).join("");

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`#${tab.dataset.tab}`).classList.add("active");
  });
});

function loadJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveProfile(profile) {
  localStorage.setItem(STORAGE_PROFILE, JSON.stringify(profile));
}

function bmiLabel(bmi) {
  if (bmi < 18.5) return "below 18.5";
  if (bmi < 25) return "between 18.5 and 24.9";
  if (bmi < 30) return "between 25 and 29.9";
  return "30 or higher";
}

function createPlan(profile) {
  emptyPlan.hidden = true;
  planResult.hidden = false;

  const hasAge = Number(profile.age) > 0;
  const hasHeight = Number(profile.height) > 0;
  const hasWeight = Number(profile.weight) > 0;
  const completeCount = [hasAge, hasHeight, hasWeight].filter(Boolean).length;
  let confidence = 35 + completeCount * 15;
  let bmiText = "not calculated";

  if (hasHeight && hasWeight) {
    const heightMeters = Number(profile.height) / 100;
    const bmi = Number(profile.weight) / (heightMeters * heightMeters);
    bmiText = `${bmiLabel(bmi)} (screening number ${bmi.toFixed(1)})`;
  }

  if (profile.activity !== "medium") confidence += 5;
  if (profile.goal) confidence += 10;
  confidence = Math.min(confidence, 95);

  const selectedPlan = choosePlan(profile);
  planExercises = selectedPlan.map((option) => ({
    ...exerciseById[option.exerciseId],
    optionKey: option.key,
    planText: option.planText
  }));

  planResult.innerHTML = `
    <p><strong>Suggested session:</strong> ${profile.minutes} minutes</p>
    <p><strong>BMI range:</strong> ${bmiText}</p>
    <ul class="result-list">
      ${planExercises.map((item) => `<li>${item.planText}</li>`).join("")}
    </ul>
    <p class="confidence"><strong>Plan confidence:</strong> ${confidence}% — more complete inputs add confidence, but this is not a medical result.</p>
  `;

  workoutExerciseSelect.innerHTML = planExercises.map((exercise, index) =>
    `<option value="${index}">${exercise.planText}</option>`
  ).join("");
  workoutExerciseSelect.value = "0";
  exerciseDurationSelect.value = String(planExercises[0].recommendedSeconds);
  workoutExerciseSelect.disabled = false;
  exerciseDurationSelect.disabled = false;
  deletePlanButton.hidden = false;
  resetWorkoutForSelection(false);
  saveProfile({
    ...profile,
    planOptionKeys: selectedPlan.map((option) => option.key)
  });
}

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createPlan({
    age: document.querySelector("#age").value,
    height: document.querySelector("#height").value,
    weight: document.querySelector("#weight").value,
    activity: document.querySelector("#activity").value,
    goal: document.querySelector("#goal").value,
    minutes: document.querySelector("#minutes").value
  });
  applyLanguage(currentLanguage);
});

const savedProfile = loadJson(STORAGE_PROFILE, null);
if (savedProfile) {
  ["age", "height", "weight", "activity", "goal", "minutes"].forEach((key) => {
    if (savedProfile[key] !== undefined) document.querySelector(`#${key}`).value = savedProfile[key];
  });
  createPlan(savedProfile);
}

let xp = Number(localStorage.getItem(STORAGE_XP)) || 0;

function updateRank() {
  const rank = xp >= 300 ? "Champion" : xp >= 200 ? "Power Star" : xp >= 100 ? "Mover" : "Rookie";
  const rankStart = xp >= 300 ? 300 : xp >= 200 ? 200 : xp >= 100 ? 100 : 0;
  const rankLimit = xp >= 300 ? 400 : xp >= 200 ? 300 : xp >= 100 ? 200 : 100;
  document.querySelector("#rankName").textContent = rank;
  document.querySelector("#rankText").textContent = `${xp} / ${rankLimit} XP`;
  document.querySelector("#rankFill").style.width = `${Math.min(((xp - rankStart) / (rankLimit - rankStart)) * 100, 100)}%`;
}

function addXp(amount) {
  xp += amount;
  localStorage.setItem(STORAGE_XP, String(xp));
  updateRank();
  applyLanguage(currentLanguage);
}

document.querySelector("#resetRank").addEventListener("click", () => {
  if (!window.confirm(translateText("Reset your rank and all saved XP?"))) return;
  xp = 0;
  localStorage.removeItem(STORAGE_XP);
  updateRank();
  applyLanguage(currentLanguage);
});

updateRank();

function setTimer(seconds) {
  workoutSeconds = Math.max(0, seconds);
  workoutTotal = workoutSeconds;
  document.querySelector("#timer").textContent = formatTime(workoutSeconds);
  document.querySelector("#workoutFill").style.width = "0%";
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function formatDurationLabel(seconds, shouldTranslate) {
  const label = seconds % 60 === 0
    ? seconds === 60 ? "1 minute" : `${seconds / 60} minutes`
    : `${seconds} seconds`;
  return shouldTranslate ? translateText(label) : label;
}

function updateExerciseRecommendation(shouldTranslate = true) {
  const recommendation = document.querySelector("#exerciseRecommendation");
  const exercise = planExercises[Number(workoutExerciseSelect.value)] || planExercises[0];
  if (!exercise) {
    recommendation.hidden = true;
    return;
  }

  recommendation.hidden = false;
  document.querySelector("#recommendedExerciseTime").textContent =
    formatDurationLabel(exercise.recommendedSeconds, shouldTranslate);
  document.querySelector("#recommendedRestTime").textContent =
    formatDurationLabel(exercise.restSeconds, shouldTranslate);
}

function resetWorkoutForSelection(translateStatus = true) {
  window.clearInterval(timerId);
  timerId = null;
  const selectedExercise = planExercises[Number(workoutExerciseSelect.value)] || planExercises[0];
  setTimer(selectedExercise ? Number(exerciseDurationSelect.value) || selectedExercise.recommendedSeconds : 0);
  updateExerciseRecommendation(translateStatus);
  document.querySelector("#startWorkout").disabled = planExercises.length === 0;
  document.querySelector("#pauseWorkout").disabled = true;
  document.querySelector("#resetWorkout").disabled = planExercises.length === 0;
  workoutExerciseSelect.disabled = planExercises.length === 0;
  exerciseDurationSelect.disabled = planExercises.length === 0;
  const status = planExercises.length
    ? "Press start to time this exercise."
    : "Create a plan to choose an exercise.";
  document.querySelector("#workoutStatus").textContent = translateStatus ? translateText(status) : status;
}

deletePlanButton.addEventListener("click", () => {
  window.clearInterval(timerId);
  timerId = null;
  localStorage.removeItem(STORAGE_PROFILE);
  planExercises = [];
  planResult.innerHTML = "";
  planResult.hidden = true;
  emptyPlan.hidden = false;
  deletePlanButton.hidden = true;
  workoutExerciseSelect.innerHTML =
    `<option value="">${translateText("Create a plan first")}</option>`;
  resetWorkoutForSelection();
});

workoutExerciseSelect.addEventListener("change", () => {
  const selectedExercise = planExercises[Number(workoutExerciseSelect.value)];
  if (selectedExercise) exerciseDurationSelect.value = String(selectedExercise.recommendedSeconds);
  resetWorkoutForSelection();
});
exerciseDurationSelect.addEventListener("change", () => resetWorkoutForSelection());

document.querySelector("#startWorkout").addEventListener("click", () => {
  if (timerId || planExercises.length === 0) return;
  workoutExerciseSelect.disabled = true;
  exerciseDurationSelect.disabled = true;
  document.querySelector("#pauseWorkout").disabled = false;
  document.querySelector("#startWorkout").disabled = true;
  document.querySelector("#workoutStatus").textContent = translateText("Timing this exercise.");

  timerId = window.setInterval(() => {
    workoutSeconds -= 1;
    document.querySelector("#timer").textContent = formatTime(workoutSeconds);
    document.querySelector("#workoutFill").style.width =
      `${((workoutTotal - workoutSeconds) / workoutTotal) * 100}%`;

    if (workoutSeconds <= 0) {
      window.clearInterval(timerId);
      timerId = null;
      document.querySelector("#pauseWorkout").disabled = true;
      document.querySelector("#startWorkout").disabled = true;
      workoutExerciseSelect.disabled = false;
      exerciseDurationSelect.disabled = false;
      document.querySelector("#workoutStatus").textContent = translateText("Exercise timer complete! Great work.");
      document.querySelector("#workoutFill").style.width = "100%";
      addXp(10);
    }
  }, 1000);
});

document.querySelector("#pauseWorkout").addEventListener("click", () => {
  window.clearInterval(timerId);
  timerId = null;
  document.querySelector("#pauseWorkout").disabled = true;
  document.querySelector("#startWorkout").disabled = false;
  workoutExerciseSelect.disabled = false;
  exerciseDurationSelect.disabled = false;
  document.querySelector("#workoutStatus").textContent = translateText("Paused.");
});

document.querySelector("#resetWorkout").addEventListener("click", () => {
  resetWorkoutForSelection();
});

const stopwatchStartButton = document.querySelector("#stopwatchStart");
const stopwatchPauseButton = document.querySelector("#stopwatchPause");
const stopwatchResetButton = document.querySelector("#stopwatchReset");
const stopwatchDisplay = document.querySelector("#stopwatchDisplay");

stopwatchStartButton.addEventListener("click", () => {
  if (stopwatchId) return;
  stopwatchStartButton.disabled = true;
  stopwatchPauseButton.disabled = false;
  stopwatchId = window.setInterval(() => {
    stopwatchSeconds += 1;
    stopwatchDisplay.textContent = formatTime(stopwatchSeconds);
  }, 1000);
});

stopwatchPauseButton.addEventListener("click", () => {
  window.clearInterval(stopwatchId);
  stopwatchId = null;
  stopwatchStartButton.disabled = false;
  stopwatchPauseButton.disabled = true;
});

stopwatchResetButton.addEventListener("click", () => {
  window.clearInterval(stopwatchId);
  stopwatchId = null;
  stopwatchSeconds = 0;
  stopwatchDisplay.textContent = formatTime(stopwatchSeconds);
  stopwatchStartButton.disabled = false;
  stopwatchPauseButton.disabled = true;
});

const coachTips = [
  "Keep a pace that lets you still speak in short sentences.",
  "Use a stable chair or wall nearby for balance.",
  "Stop if you feel sharp pain, dizziness, or trouble breathing.",
  "Breathe out when the movement is hardest.",
  "Move slowly and with control for a safer workout.",
  "Leave enough clear space around you before you begin.",
  "Rest between sets so you can keep your movements controlled.",
  "Try a smaller movement if an exercise feels difficult.",
  "A steady pace is more useful than rushing.",
  "Check that a chair is stable before using it for support.",
  "Take a water break whenever you feel thirsty.",
  "Stop and tell a trusted adult if something does not feel right."
];
let coachIndex = 0;

document.querySelector("#coachNext").addEventListener("click", () => {
  coachIndex = (coachIndex + 1) % coachTips.length;
  document.querySelector("#coachTip").textContent = translateText(coachTips[coachIndex]);
});

const soundSources = {
  rain: [
    "https://upload.wikimedia.org/wikipedia/commons/e/ec/Bourne_woods_rain_2020-05-10_0804.mp3",
    "https://actions.google.com/sounds/v1/weather/rain_on_roof.ogg"
  ],
  ocean: ["https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3"],
  forest: ["https://upload.wikimedia.org/wikipedia/commons/b/be/Forest_ambience_%28Gravity_Sound%29.wav"],
  wind: [
    "https://upload.wikimedia.org/wikipedia/commons/d/d0/Wind_sounds_2020-05-10_1625.mp3",
    "https://actions.google.com/sounds/v1/weather/wind.ogg"
  ],
  battlefield: [
    "https://upload.wikimedia.org/wikipedia/commons/d/d0/Wind_sounds_2020-05-10_1625.mp3",
    "https://actions.google.com/sounds/v1/weather/wind.ogg"
  ],
  coffee: ["https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg"],
  music: ["https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"]
};

let ambientAudio = null;
let ambientSourceIndex = 0;
let ambientRequest = 0;

function stopSound() {
  ambientRequest += 1;
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio.removeAttribute("src");
    ambientAudio.load();
    ambientAudio = null;
  }
  document.querySelector("#soundToggle").textContent = translateText("Play sound");
  document.querySelector("#soundStatus").textContent = translateText("Sound stopped.");
}

function playSound(soundType) {
  if (soundType === "off") {
    stopSound();
    return;
  }

  if (ambientAudio) ambientAudio.pause();
  const request = ++ambientRequest;
  const sources = soundSources[soundType];
  ambientSourceIndex = 0;
  ambientAudio = new Audio();
  ambientAudio.preload = "none";
  ambientAudio.loop = true;
  ambientAudio.volume = soundType === "music" ? 0.35 : 0.45;

  const status = document.querySelector("#soundStatus");
  const button = document.querySelector("#soundToggle");

  function loadSource(index) {
    if (request !== ambientRequest) return;
    ambientSourceIndex = index;
    ambientAudio.onerror = () => {
      if (request !== ambientRequest || ambientSourceIndex !== index) return;
      if (index + 1 < sources.length) {
        loadSource(index + 1);
      } else {
        status.textContent = translateText("Could not load sound. Check your internet connection and try again.");
        button.textContent = translateText("Play sound");
      }
    };

    ambientAudio.src = sources[index];
    ambientAudio.load();
    ambientAudio.play().then(() => {
      if (request !== ambientRequest) return;
      button.textContent = translateText("Stop sound");
      status.textContent = translateText("Sound is playing.");
    }).catch(() => {
      if (request !== ambientRequest || ambientSourceIndex !== index) return;
      if (index + 1 < sources.length) {
        loadSource(index + 1);
      } else {
        status.textContent = translateText("Could not load sound. Check your internet connection and try again.");
        button.textContent = translateText("Play sound");
      }
    });
  }

  status.textContent = translateText("Loading sound...");
  loadSource(0);
}

document.querySelector("#soundToggle").addEventListener("click", () => {
  if (ambientAudio && !ambientAudio.paused) {
    stopSound();
  } else {
    playSound(document.querySelector("#soundType").value);
  }
});

document.querySelector("#soundType").addEventListener("change", (event) => {
  if (ambientAudio && !ambientAudio.paused) {
    playSound(event.target.value);
  } else {
    document.querySelector("#soundStatus").textContent =
      event.target.value === "off"
        ? translateText("Choose a sound and press play. Internet is needed.")
        : translateText("Sound selected. Press play to start.");
  }
});

let reactionTimeout = null;
let reactionStartTime = 0;
let reactionRounds = 0;
let reactionResultText = "Start a round to test your reaction.";

function updateReactionScore() {
  document.querySelector("#reactionScore").textContent = translateText(`Score: ${reactionRounds}`);
}

document.querySelector("#reactionStart").addEventListener("click", () => {
  stopGlider();
  const button = document.querySelector("#reactionButton");
  window.clearTimeout(reactionTimeout);
  button.disabled = false;
  button.classList.remove("ready");
  button.textContent = translateText("Wait...");
  reactionResultText = "Get ready...";
  document.querySelector("#reactionResult").textContent = translateText(reactionResultText);

  const delay = 1200 + Math.random() * 2400;
  reactionTimeout = window.setTimeout(() => {
    button.classList.add("ready");
    button.textContent = translateText("GO!");
    reactionResultText = "Tap when it turns green!";
    document.querySelector("#reactionResult").textContent = translateText(reactionResultText);
    reactionStartTime = performance.now();
  }, delay);
});

document.querySelector("#reactionButton").addEventListener("click", (event) => {
  if (!event.currentTarget.classList.contains("ready")) {
    reactionResultText = "Too soon! Try another round.";
    document.querySelector("#reactionResult").textContent = translateText(reactionResultText);
    event.currentTarget.disabled = true;
    window.clearTimeout(reactionTimeout);
    return;
  }

  const reactionTime = Math.round(performance.now() - reactionStartTime);
  reactionRounds += 1;
  updateReactionScore();
  reactionResultText = `Your reaction time: ${reactionTime} ms`;
  document.querySelector("#reactionResult").textContent = translateText(reactionResultText);
  event.currentTarget.classList.remove("ready");
  event.currentTarget.disabled = true;
  event.currentTarget.textContent = translateText("Nice!");
  addXp(10);
});

let goals = loadJson(STORAGE_GOALS, []);
if (!Array.isArray(goals)) goals = [];
goals = goals.filter((goal) => goal && typeof goal.text === "string")
  .map((goal) => ({ text: goal.text, done: goal.done === true }));

function saveGoals() {
  localStorage.setItem(STORAGE_GOALS, JSON.stringify(goals));
}

function renderGoals() {
  goalList.innerHTML = "";
  goals.forEach((goal, index) => {
    const item = document.createElement("li");
    if (goal.done) item.classList.add("done");

    const text = document.createElement("span");
    text.textContent = goal.text;
    text.dataset.userContent = "true";

    const doneButton = document.createElement("button");
    doneButton.type = "button";
    doneButton.textContent = translateText(goal.done ? "Undo" : "Done");
    doneButton.addEventListener("click", () => {
      goal.done = !goal.done;
      if (goal.done) addXp(15);
      saveGoals();
      renderGoals();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = translateText("Remove");
    deleteButton.addEventListener("click", () => {
      goals.splice(index, 1);
      saveGoals();
      renderGoals();
    });

    item.append(text, doneButton, deleteButton);
    goalList.append(item);
  });
}

      const panoramaViews = [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85",
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=85"
      ];
      let panoramaIndex = 0;

      document.querySelector("#bannerNext").addEventListener("click", () => {
        panoramaIndex = (panoramaIndex + 1) % panoramaViews.length;
        document.querySelector("#panorama").style.backgroundImage = `url("${panoramaViews[panoramaIndex]}")`;
      });

      const localeOrder = ["zh", "es", "de", "hi", "ar", "fr", "ja", "ru", "id", "tlh"];
      const translationRows = {
        "Totally Accurate Workout Simulator": ["全能健身模拟器", "Simulador de entrenamiento", "Workout-Simulator", "संपूर्ण वर्कआउट सिम्युलेटर", "محاكي التمارين"],
        "WORKOUT HQ": ["健身中心", "CENTRO DE ENTRENAMIENTO", "WORKOUT-ZENTRALE", "वर्कआउट केंद्र", "مركز التمارين"],
        "Language": ["语言", "Idioma", "Sprache", "भाषा", "اللغة"],
        "Level progress": ["等级进度", "Progreso de nivel", "Level-Fortschritt", "लेवल प्रगति", "تقدم المستوى"],
        "Reset rank": ["重置等级", "Reiniciar rango", "Rang zurücksetzen", "रैंक रीसेट करें", "إعادة ضبط المستوى"],
        "Reset your rank and all saved XP?": ["要重置等级和所有已保存的经验值吗？", "¿Quieres reiniciar tu rango y todos los puntos de experiencia guardados?", "Rang und alle gespeicherten EP zurücksetzen?", "क्या आप अपना रैंक और सभी सहेजे गए XP रीसेट करना चाहते हैं?", "هل تريد إعادة ضبط مستواك وكل نقاط الخبرة المحفوظة؟"],
        "App sections": ["应用栏目", "Secciones de la aplicación", "App-Bereiche", "ऐप अनुभाग", "أقسام التطبيق"],
        "Mascot helper": ["吉祥物助手", "Ayuda de la mascota", "Maskottchen-Hilfe", "शुभंकर सहायता", "مساعد التميمة"],
        "Changing workout panorama": ["可切换的运动全景图", "Panorama de entrenamiento", "Trainingspanorama", "बदलता वर्कआउट दृश्य", "مشهد تمرين بانورامي"],
        "Change panorama": ["更换全景图", "Cambiar panorama", "Panorama wechseln", "दृश्य बदलें", "تغيير المشهد"],
        "For example 14": ["例如 14", "Por ejemplo, 14", "Zum Beispiel 14", "उदाहरण: 14", "مثال: 14"],
        "English": ["英语", "Inglés", "Englisch", "अंग्रेज़ी", "الإنجليزية"],
        "Chinese": ["中文", "Chino", "Chinesisch", "चीनी", "الصينية"],
        "Spanish": ["西班牙语", "Español", "Spanisch", "स्पेनिश", "الإسبانية"],
        "German": ["德语", "Alemán", "Deutsch", "जर्मन", "الألمانية"],
        "Hindi": ["印地语", "Hindi", "Hindi", "हिन्दी", "الهندية"],
        "Arabic": ["阿拉伯语", "Árabe", "Arabisch", "अरबी", "العربية"],
        "Rookie": ["新手", "Principiante", "Anfänger", "शुरुआती", "مبتدئ"],
        "Change view": ["更换风景", "Cambiar paisaje", "Ansicht ändern", "दृश्य बदलें", "تغيير المشهد"],
        "My Plan": ["我的计划", "Mi plan", "Mein Plan", "मेरी योजना", "خطتي"],
        "Exercise Guide": ["运动指南", "Guía de ejercicios", "Übungsanleitung", "व्यायाम गाइड", "دليل التمارين"],
        "Workout": ["锻炼", "Entrenamiento", "Training", "वर्कआउट", "التمرين"],
        "Mini Games": ["小游戏", "Minijuegos", "Minispiele", "छोटे खेल", "ألعاب صغيرة"],
        "Places": ["地点", "Lugares", "Orte", "स्थान", "أماكن"],
        "Goals": ["目标", "Objetivos", "Ziele", "लक्ष्य", "الأهداف"],
        "Health Risks": ["健康风险", "Riesgos para la salud", "Gesundheitsrisiken", "स्वास्थ्य जोखिम", "المخاطر الصحية"],
        "Settings": ["设置", "Ajustes", "Einstellungen", "सेटिंग", "الإعدادات"],
        "Build your plan": ["制定计划", "Crea tu plan", "Erstelle deinen Plan", "अपनी योजना बनाएँ", "أنشئ خطتك"],
        "Optional inputs. Everything stays on this device.": ["所有信息均为可选，并保存在此设备上。", "Los datos son opcionales y se guardan en este dispositivo.", "Alle Angaben sind freiwillig und bleiben auf diesem Gerät.", "जानकारी देना वैकल्पिक है। सब कुछ इसी डिवाइस पर रहता है।", "المدخلات اختيارية وتبقى على هذا الجهاز."],
        "Age": ["年龄", "Edad", "Alter", "उम्र", "العمر"],
        "Height (cm)": ["身高（厘米）", "Altura (cm)", "Größe (cm)", "लंबाई (सेमी)", "الطول (سم)"],
        "Weight (kg)": ["体重（千克）", "Peso (kg)", "Gewicht (kg)", "वज़न (किग्रा)", "الوزن (كجم)"],
        "Current activity": ["当前活动量", "Actividad actual", "Aktuelle Aktivität", "अभी की गतिविधि", "النشاط الحالي"],
        "Mostly inactive": ["活动较少", "Poca actividad", "Wenig aktiv", "बहुत कम सक्रिय", "قليل النشاط"],
        "Some activity": ["有一些活动", "Algo de actividad", "Etwas aktiv", "कुछ सक्रिय", "نشاط متوسط"],
        "Very active": ["活动量较大", "Muy activo", "Sehr aktiv", "बहुत सक्रिय", "نشاط كبير"],
        "Goal": ["目标", "Meta", "Ziel", "लक्ष्य", "الهدف"],
        "General fitness": ["提升整体体能", "Forma física general", "Allgemeine Fitness", "सामान्य फ़िटनेस", "لياقة عامة"],
        "Build strength": ["增强力量", "Ganar fuerza", "Kraft aufbauen", "ताकत बढ़ाएँ", "زيادة القوة"],
        "Build endurance": ["增强耐力", "Mejorar resistencia", "Ausdauer verbessern", "सहनशक्ति बढ़ाएँ", "زيادة القدرة على التحمل"],
        "Suggested session length": ["建议训练时长", "Duración sugerida de la sesión", "Empfohlene Trainingsdauer", "सुझाए गए सत्र की अवधि", "مدة الجلسة المقترحة"],
        "15 minutes": ["15 分钟", "15 minutos", "15 Minuten", "15 मिनट", "15 دقيقة"],
        "25 minutes": ["25 分钟", "25 minutos", "25 Minuten", "25 मिनट", "25 دقيقة"],
        "40 minutes": ["40 分钟", "40 minutos", "40 Minuten", "40 मिनट", "40 دقيقة"],
        "Create My Plan": ["创建我的计划", "Crear mi plan", "Meinen Plan erstellen", "मेरी योजना बनाएँ", "أنشئ خطتي"],
        "Delete plan": ["删除计划", "Eliminar plan", "Plan löschen", "योजना हटाएँ", "حذف الخطة"],
        "Your plan": ["你的计划", "Tu plan", "Dein Plan", "आपकी योजना", "خطتك"],
        "Add a few details and create a starter plan.": ["填写一些信息来制定入门计划。", "Añade algunos datos para crear un plan inicial.", "Gib ein paar Angaben für einen Einstiegsplan ein.", "शुरुआती योजना बनाने के लिए कुछ जानकारी दें।", "أضف بعض التفاصيل لإنشاء خطة أولية."],
        "General fitness information only. This app cannot predict illnesses or lifespan. Ask a parent or trusted health professional before starting a new routine.": ["这里只提供一般健身信息。本应用无法预测疾病或寿命。开始新锻炼计划前，请咨询家长或可信赖的医疗专业人员。", "Esta aplicación ofrece información general y no puede predecir enfermedades ni la esperanza de vida. Consulta con un adulto de confianza o profesional de salud antes de empezar una rutina.", "Diese App bietet nur allgemeine Fitnessinformationen und kann weder Krankheiten noch Lebenserwartung vorhersagen. Sprich vor einem neuen Trainingsplan mit einer erwachsenen Vertrauensperson oder medizinischem Fachpersonal.", "यह ऐप केवल सामान्य फ़िटनेस जानकारी देता है और बीमारी या जीवनकाल की भविष्यवाणी नहीं कर सकता। नई दिनचर्या शुरू करने से पहले माता-पिता या भरोसेमंद स्वास्थ्य विशेषज्ञ से पूछें।", "يقدم التطبيق معلومات عامة فقط ولا يمكنه توقع الأمراض أو العمر. استشر أحد الوالدين أو مختصًا صحيًا موثوقًا قبل بدء تمرين جديد."],
        "How to move safely": ["如何安全运动", "Cómo moverte con seguridad", "Sicher bewegen", "सुरक्षित तरीके से व्यायाम", "كيفية الحركة بأمان"],
        "Bodyweight squat": ["徒手深蹲", "Sentadilla con peso corporal", "Kniebeuge ohne Gewichte", "बिना वज़न के स्क्वैट", "قرفصاء بوزن الجسم"],
        "Stand with feet about shoulder-width apart. Push your hips back, keep your chest lifted, and stop before your knees move inward.": ["双脚与肩同宽站立，臀部向后推，挺起胸部；膝盖开始内扣前就停止。", "Separa los pies al ancho de los hombros. Lleva la cadera atrás, mantén el pecho erguido y detente si las rodillas se meten hacia dentro.", "Stelle die Füße etwa schulterbreit auf. Schiebe die Hüfte zurück, halte die Brust aufrecht und stoppe, bevor die Knie nach innen kippen.", "पैर कंधों जितने खोलकर खड़े हों। कूल्हों को पीछे ले जाएँ, छाती ऊपर रखें और घुटने अंदर मुड़ने से पहले रुकें।", "قف والقدمان بعرض الكتفين تقريبًا. ادفع الوركين للخلف وارفع الصدر، وتوقف قبل أن يتجه الركبتان للداخل."],
        "Wall push-up": ["靠墙俯卧撑", "Flexión contra la pared", "Liegestütz an der Wand", "दीवार के सहारे पुश-अप", "ضغط على الحائط"],
        "Hands on a wall at chest height. Keep a straight line from head to heels and move slowly toward and away from the wall.": ["双手放在胸口高度的墙上，头到脚跟保持成直线，慢慢靠近墙再推回。", "Apoya las manos en la pared a la altura del pecho. Mantén el cuerpo recto y acércate y aléjate lentamente.", "Lege die Hände auf Brusthöhe an die Wand. Halte den Körper gerade und bewege dich langsam zur Wand und zurück.", "हाथों को छाती की ऊँचाई पर दीवार पर रखें। सिर से एड़ी तक शरीर सीधा रखें और धीरे-धीरे आगे-पीछे जाएँ।", "ضع يديك على الحائط عند مستوى الصدر. حافظ على استقامة الجسم وتحرك ببطء نحو الحائط ثم ابتعد."],
        "Easy marching": ["轻松原地踏步", "Marcha suave en el sitio", "Lockeres Marschieren", "हल्की मार्चिंग", "المشي في المكان بهدوء"],
        "March in place with a tall posture. Start slowly and lift your knees only as high as feels comfortable.": ["挺直身体原地踏步。先慢慢开始，膝盖抬到舒适的高度即可。", "Marcha en el sitio con la espalda erguida. Empieza despacio y levanta las rodillas solo hasta donde te resulte cómodo.", "Marschiere aufrecht auf der Stelle. Beginne langsam und hebe die Knie nur so hoch, wie es angenehm ist.", "सीधे खड़े होकर एक ही जगह मार्च करें। धीरे शुरू करें और घुटने आरामदायक ऊँचाई तक ही उठाएँ।", "امشِ في مكانك مع استقامة الظهر. ابدأ ببطء وارفع ركبتيك بالقدر المريح فقط."],
        "Bird dog": ["鸟狗式", "Extensión de brazo y pierna", "Diagonalstrecken im Vierfüßlerstand", "बर्ड डॉग व्यायाम", "تمرين الطائر والكلب"],
        "From hands and knees, reach one arm and the opposite leg out. Keep your hips level and return slowly.": ["双手双膝撑地，伸出一只手和对侧腿。保持髋部平稳，再慢慢收回。", "A cuatro patas, estira un brazo y la pierna contraria. Mantén la cadera nivelada y vuelve despacio.", "Strecke im Vierfüßlerstand einen Arm und das gegenüberliegende Bein aus. Halte die Hüfte gerade und kehre langsam zurück.", "हाथों और घुटनों के बल रहकर एक हाथ और उल्टा पैर फैलाएँ। कूल्हे सीधे रखें और धीरे वापस आएँ।", "من وضع اليدين والركبتين، مد ذراعًا وساقًا من الجهة المقابلة. حافظ على ثبات الوركين ثم عُد ببطء."],
        "Standing calf raise": ["站姿提踵", "Elevación de talones de pie", "Wadenheben im Stand", "खड़े होकर एड़ी उठाना", "رفع الساق واقفًا"],
        "Hold a stable chair if needed. Rise onto your toes, pause, and lower with control.": ["需要时扶稳固的椅子。踮起脚尖，稍停，再控制着放下。", "Sujétate a una silla estable si lo necesitas. Ponte de puntillas, haz una pausa y baja con control.", "Halte dich bei Bedarf an einem stabilen Stuhl fest. Stelle dich auf die Zehenspitzen, pausiere und senke dich kontrolliert ab.", "ज़रूरत हो तो मज़बूत कुर्सी पकड़ें। पंजों पर उठें, रुकें और धीरे नीचे आएँ।", "تمسك بكرسي ثابت عند الحاجة. ارفع كعبيك، توقف قليلًا، ثم انزل بتحكم."],
        "Gentle stretch": ["轻柔拉伸", "Estiramiento suave", "Sanfte Dehnung", "हल्की स्ट्रेचिंग", "تمدد لطيف"],
        "Move until you feel a mild stretch, never sharp pain. Hold still and breathe normally.": ["拉伸到轻微感觉即可，不要忍受刺痛。保持姿势并正常呼吸。", "Muévete hasta notar un estiramiento suave, nunca un dolor agudo. Mantén la postura y respira con normalidad.", "Dehne nur bis zu einem leichten Zug, niemals bis zu stechendem Schmerz. Halte still und atme normal.", "हल्का खिंचाव महसूस होने तक जाएँ, तेज़ दर्द तक नहीं। स्थिर रहें और सामान्य साँस लें।", "تحرك حتى تشعر بتمدد خفيف دون ألم حاد. اثبت وتنفس بشكل طبيعي."],
        "Watch a form video": ["观看动作示范视频", "Ver video de técnica", "Technikvideo ansehen", "सही तरीका देखने का वीडियो", "شاهد فيديو للطريقة الصحيحة"],
        "Stunts & flips": ["特技与翻滚", "Acrobacias y volteretas", "Stunts und Überschläge", "स्टंट और कलाबाज़ी", "الحركات البهلوانية والشقلبات"],
        "Only try beginner acrobatics with a trained coach, proper mats, and permission from a parent or guardian.": ["初学体操动作只能在专业教练指导下、铺好垫子并获得家长或监护人许可后尝试。", "Practica acrobacias para principiantes solo con un entrenador, colchonetas adecuadas y permiso de tu madre, padre o tutor.", "Übe einfache Akrobatik nur mit ausgebildetem Trainer, geeigneten Matten und Erlaubnis deiner Eltern oder Erziehungsberechtigten.", "शुरुआती कलाबाज़ी केवल प्रशिक्षित कोच, सही मैट और माता-पिता या अभिभावक की अनुमति से करें।", "لا تجرب الحركات البهلوانية للمبتدئين إلا مع مدرب مؤهل وحصائر مناسبة وموافقة ولي الأمر."],
        "Forward roll": ["前滚翻", "Voltereta hacia delante", "Vorwärtsrolle", "आगे की कलाबाज़ी", "الدحرجة الأمامية"],
        "Learn only on a soft mat with a coach. Tuck the chin, keep the spine rounded, place hands beside the head, and roll smoothly instead of diving.": ["只在教练陪同下于软垫上学习。收下巴、弓背，双手放在头旁，平稳滚动，不要向前扑。", "Apréndela solo sobre una colchoneta y con entrenador. Mete la barbilla, redondea la espalda, coloca las manos junto a la cabeza y rueda sin lanzarte.", "Lerne sie nur mit Trainer auf einer weichen Matte. Zieh das Kinn an, runde den Rücken, setze die Hände neben den Kopf und rolle gleichmäßig statt zu springen.", "कोच के साथ नरम मैट पर ही सीखें। ठोड़ी अंदर रखें, पीठ गोल करें, हाथ सिर के पास रखें और कूदने के बजाय सहजता से लुढ़कें।", "تعلمها على بساط لين ومع مدرب فقط. أدخل الذقن، واحنِ الظهر، وضع اليدين بجانب الرأس وتدحرج بسلاسة دون الاندفاع."],
        "Cartwheel": ["侧手翻", "Rueda lateral", "Radschlag", "कार्टव्हील", "العجلة الجانبية"],
        "Start in a lunge on a mat. Place hands down one at a time, kick the legs over sideways, and land with control. Never attempt on hard ground.": ["在垫子上弓步开始。双手依次撑地，双腿向侧上方摆过并稳稳落地。切勿在硬地上尝试。", "Empieza en zancada sobre una colchoneta. Apoya las manos una a una, pasa las piernas de lado y aterriza con control. Nunca lo intentes en suelo duro.", "Beginne im Ausfallschritt auf einer Matte. Setze die Hände nacheinander auf, schwinge die Beine seitwärts und lande kontrolliert. Niemals auf hartem Boden üben.", "मैट पर लंज से शुरू करें। एक-एक करके हाथ रखें, पैरों को बगल से घुमाएँ और नियंत्रण से उतरें। सख्त ज़मीन पर कभी न करें।", "ابدأ بوضعية اندفاع على بساط. ضع اليدين واحدة تلو الأخرى، وارفع الساقين جانبًا، ثم اهبط بتحكم. لا تجربها على أرض صلبة."],
        "Handstand practice": ["倒立练习", "Práctica de parada de manos", "Handstand üben", "हैंडस्टैंड अभ्यास", "التدرب على الوقوف على اليدين"],
        "Use a wall and a coach. Start with toes on the floor, walk your feet up gradually, keep breathing, and stop before fatigue or neck strain.": ["在墙边并由教练指导。从脚尖留在地面开始，逐步抬高双脚，保持呼吸；疲劳或颈部不适前就停止。", "Usa una pared y la ayuda de un entrenador. Empieza con los pies en el suelo, súbelos poco a poco, respira y para antes de cansarte o forzar el cuello.", "Übe an einer Wand mit Trainer. Beginne mit den Zehen am Boden, gehe mit den Füßen schrittweise höher, atme weiter und höre vor Erschöpfung oder Nackenbelastung auf.", "दीवार और कोच की मदद लें। पैर ज़मीन पर रखकर शुरू करें, धीरे-धीरे ऊपर ले जाएँ, साँस लेते रहें और थकान या गर्दन पर दबाव से पहले रुकें।", "استخدم جدارًا ومدربًا. ابدأ وأصابع القدم على الأرض، وارفع القدمين تدريجيًا مع التنفس، وتوقف قبل التعب أو إجهاد الرقبة."],
        "Backflip": ["后空翻", "Voltereta hacia atrás", "Rückwärtssalto", "बैकफ्लिप", "الشَقلبة الخلفية"],
        "Aerial (no-handed cartwheel)": ["无手侧空翻", "Rueda lateral sin manos", "Rad ohne Hände", "बिना हाथ का एरियल", "العجلة الهوائية دون استخدام اليدين"],
        "Kick-up to stand": ["踢起站立", "Impulso para ponerse de pie", "Aufschwingen zum Stand", "किक-अप से खड़े होना", "الاندفاع للوقوف"],
        "This can strain wrists, shoulders, back, or neck. Learn it only with a qualified gymnastics coach, proper mats, and guardian approval. Do not practise alone; this page does not teach the movement.": ["这个动作可能拉伤手腕、肩膀、背部或颈部。只能在合格体操教练、合适垫子和监护人许可下学习。不要独自练习；本页面不教授动作方法。", "Este movimiento puede lesionar muñecas, hombros, espalda o cuello. Apréndelo solo con un entrenador cualificado, colchonetas adecuadas y permiso de un adulto. No practiques a solas; esta página no enseña el movimiento.", "Diese Bewegung kann Handgelenke, Schultern, Rücken oder Nacken belasten. Lerne sie nur mit qualifiziertem Trainer, geeigneten Matten und Zustimmung deiner Erziehungsberechtigten. Übe nicht allein; diese Seite lehrt die Bewegung nicht.", "इससे कलाई, कंधे, पीठ या गर्दन पर चोट लग सकती है। इसे केवल योग्य जिम्नास्टिक कोच, सही मैट और अभिभावक की अनुमति के साथ सीखें। अकेले अभ्यास न करें; यह पेज तरीका नहीं सिखाता।", "قد يجهد هذا الحركة المعصمين أو الكتفين أو الظهر أو الرقبة. تعلمها فقط مع مدرب جمباز مؤهل وحصائر مناسبة وموافقة ولي الأمر. لا تتدرب وحدك؛ هذه الصفحة لا تشرح طريقة الحركة."],
        "Flips and aerials can cause severe injury. Learn only with a qualified coach, proper mats, and guardian approval—never practise from a video alone.": ["翻转和空翻可能造成严重伤害。只能在合格教练、合适垫子和监护人许可下学习，切勿只看视频自行练习。", "Las volteretas y acrobacias aéreas pueden causar lesiones graves. Aprende solo con entrenador cualificado, colchonetas adecuadas y permiso de un adulto; nunca practiques solo con un video.", "Salti und Aerials können schwere Verletzungen verursachen. Nur mit qualifiziertem Trainer, geeigneten Matten und Zustimmung der Erziehungsberechtigten lernen – niemals allein nach einem Video üben.", "फ्लिप और एरियल से गंभीर चोट लग सकती है। इन्हें केवल योग्य कोच, सही मैट और अभिभावक की अनुमति से सीखें—सिर्फ वीडियो देखकर कभी अभ्यास न करें।", "قد تسبب الشقلبات والحركات الهوائية إصابات خطيرة. تعلمها فقط مع مدرب مؤهل وحصائر مناسبة وموافقة ولي الأمر، ولا تتدرب اعتمادًا على فيديو وحده."],
        "High-risk tumbling skill. Learn only in a proper gymnastics facility with a qualified coach, crash mats, and guardian approval. Never try from online instructions, at home, or on hard ground.": ["这是高风险翻腾动作。只能在正规的体操场馆、有资质的教练、防护垫和监护人同意下学习。切勿在家中、硬地上或只凭网上教程尝试。", "Habilidad de alto riesgo. Aprende solo en un gimnasio adecuado, con entrenador cualificado, colchonetas de seguridad y permiso de un adulto. Nunca la intentes en casa, en suelo duro ni siguiendo instrucciones en internet.", "Riskante Turnübung. Nur in einer geeigneten Turnhalle mit qualifiziertem Trainer, Sicherheitsmatten und Zustimmung der Erziehungsberechtigten lernen. Niemals zu Hause, auf hartem Boden oder nach Online-Anleitungen versuchen.", "यह जोखिम भरा जिम्नास्टिक कौशल है। इसे केवल सही जिम, योग्य कोच, सुरक्षा मैट और अभिभावक की अनुमति के साथ सीखें। घर पर, सख्त ज़मीन पर या ऑनलाइन निर्देश देखकर कभी न करें।", "مهارة بهلوانية عالية الخطورة. تعلمها فقط في صالة مناسبة مع مدرب مؤهل وحصائر أمان وموافقة ولي الأمر. لا تجربها في المنزل أو على أرض صلبة أو باتباع تعليمات الإنترنت."],
        "Advanced skill with serious head, neck, and landing risks. Do not attempt without a qualified gymnastics coach, a safe training facility, mats, and guardian approval. This page does not teach the movement.": ["这是高难度动作，头部、颈部和落地受伤风险严重。没有合格体操教练、安全训练场地、防护垫和监护人同意时切勿尝试。本页面不教授该动作。", "Habilidad avanzada con riesgos graves para la cabeza, el cuello y el aterrizaje. No la intentes sin entrenador cualificado, instalaciones seguras, colchonetas y permiso de un adulto. Esta página no enseña el movimiento.", "Fortgeschrittene Übung mit erheblichen Risiken für Kopf, Nacken und Landung. Nicht ohne qualifizierten Trainer, sichere Trainingsstätte, Matten und Zustimmung der Erziehungsberechtigten versuchen. Diese Seite lehrt die Bewegung nicht.", "यह उन्नत कौशल है जिसमें सिर, गर्दन और उतरते समय गंभीर जोखिम हैं। योग्य कोच, सुरक्षित जगह, मैट और अभिभावक की अनुमति के बिना न करें। यह पेज इसकी विधि नहीं सिखाता।", "مهارة متقدمة تنطوي على مخاطر خطيرة للرأس والرقبة والهبوط. لا تحاولها دون مدرب مؤهل ومكان آمن وحصائر وموافقة ولي الأمر. هذه الصفحة لا تشرح طريقة الحركة."],
        "Watch a supervised lesson": ["观看有指导的教学视频", "Ver una lección supervisada", "Betreute Anleitung ansehen", "कोच के साथ सीखने का वीडियो", "شاهد درسًا بإشراف مدرب"],
        "CURRENT SESSION": ["当前训练", "SESIÓN ACTUAL", "AKTUELLE EINHEIT", "मौजूदा सत्र", "الجلسة الحالية"],
        "Press start when you are ready.": ["准备好后按开始。", "Pulsa iniciar cuando estés listo.", "Drücke auf Start, wenn du bereit bist.", "तैयार होने पर शुरू करें दबाएँ।", "اضغط ابدأ عندما تكون مستعدًا."],
        "Start": ["开始", "Iniciar", "Start", "शुरू करें", "ابدأ"],
        "Pause": ["暂停", "Pausar", "Pause", "रोकें", "إيقاف مؤقت"],
        "Reset": ["重置", "Reiniciar", "Zurücksetzen", "रीसेट", "إعادة ضبط"],
        "Coach & sounds": ["教练提示与声音", "Consejos y sonidos", "Trainer & Klänge", "कोच और ध्वनि", "المدرب والأصوات"],
        "Ambient sound": ["环境音", "Sonido ambiental", "Hintergrundklang", "परिवेशी ध्वनि", "صوت محيطي"],
        "Off": ["关闭", "Desactivado", "Aus", "बंद", "إيقاف"],
        "Soft rain": ["轻柔雨声", "Lluvia suave", "Sanfter Regen", "हल्की बारिश", "مطر خفيف"],
        "Ocean waves": ["海浪声", "Olas del mar", "Meereswellen", "समुद्र की लहरें", "أمواج المحيط"],
        "Forest ambience": ["森林环境音", "Ambiente de bosque", "Waldatmosphäre", "जंगल का माहौल", "أجواء الغابة"],
        "Wind": ["风声", "Viento", "Wind", "हवा", "الرياح"],
        "Distant battlefield ambience (wind only)": ["远处战场氛围（仅风声）", "Ambiente de campo de batalla lejano (solo viento)", "Entfernte Schlachtfeld-Atmosphäre (nur Wind)", "दूर के युद्धक्षेत्र का माहौल (केवल हवा)", "أجواء ساحة معركة بعيدة (رياح فقط)"],
        "The battlefield-style option uses wind ambience only. It has no weapon or explosion sounds.": ["战场风格选项仅播放风声，不含武器或爆炸声。", "La opción de ambiente de batalla solo usa viento; no contiene armas ni explosiones.", "Die Schlachtfeld-Atmosphäre verwendet nur Wind, keine Waffen- oder Explosionsgeräusche.", "युद्धक्षेत्र वाला विकल्प केवल हवा की आवाज़ चलाता है। इसमें हथियार या विस्फोट की आवाज़ें नहीं हैं।", "يستخدم خيار أجواء المعركة صوت الرياح فقط، ولا يحتوي على أصوات أسلحة أو انفجارات."],
        "Cafe ambience": ["咖啡馆环境音", "Ambiente de cafetería", "Café-Atmosphäre", "कैफ़े का माहौल", "أجواء المقهى"],
        "Ambient music": ["氛围音乐", "Música ambiental", "Hintergrundmusik", "हल्का संगीत", "موسيقى هادئة"],
        "Review a practice video": ["回看练习视频", "Revisa un video de práctica", "Übungsvideo ansehen", "अभ्यास का वीडियो देखें", "راجع فيديو التدريب"],
        "Choose a video from this device or record a short clip with your camera, then play it back here.": ["从此设备选择视频，或用摄像头录制短片，然后在此回放。", "Elige un video de este dispositivo o graba un clip corto con la cámara y reprodúcelo aquí.", "Wähle ein Video von diesem Gerät oder nimm einen kurzen Clip mit der Kamera auf und spiele ihn hier ab.", "इस डिवाइस से वीडियो चुनें या कैमरे से छोटी क्लिप रिकॉर्ड करें, फिर इसे यहाँ चलाएँ।", "اختر فيديو من هذا الجهاز أو سجل مقطعًا قصيرًا بالكاميرا ثم شاهده هنا."],
        "Your video stays in this page on this device. It is not uploaded or saved. This app does not have AI video analysis, so ask a qualified coach to check your technique.": ["视频只在此设备的此页面中处理，不会上传或保存。本应用没有 AI 视频分析功能，请让合格教练检查动作。", "Tu video permanece en esta página y dispositivo. No se sube ni se guarda. Esta aplicación no analiza videos con IA; pide a un entrenador cualificado que revise tu técnica.", "Dein Video bleibt auf diesem Gerät in dieser Seite. Es wird weder hochgeladen noch gespeichert. Diese App bietet keine KI-Videoanalyse. Bitte eine qualifizierte Trainerperson um Technik-Feedback.", "वीडियो इसी डिवाइस के इस पेज पर रहता है। इसे अपलोड या सेव नहीं किया जाता। इस ऐप में AI वीडियो विश्लेषण नहीं है; तकनीक जाँचने के लिए योग्य कोच से पूछें।", "يبقى الفيديو في هذه الصفحة وعلى هذا الجهاز. لا يتم رفعه أو حفظه. لا يتضمن التطبيق تحليل فيديو بالذكاء الاصطناعي، لذا اطلب من مدرب مؤهل مراجعة أدائك."],
        "Choose a video from this device": ["从此设备选择视频", "Elige un video de este dispositivo", "Video von diesem Gerät auswählen", "इस डिवाइस से वीडियो चुनें", "اختر فيديو من هذا الجهاز"],
        "Use camera": ["使用摄像头", "Usar cámara", "Kamera verwenden", "कैमरा इस्तेमाल करें", "استخدم الكاميرا"],
        "Start recording": ["开始录制", "Empezar a grabar", "Aufnahme starten", "रिकॉर्डिंग शुरू करें", "ابدأ التسجيل"],
        "Stop recording": ["停止录制", "Detener grabación", "Aufnahme beenden", "रिकॉर्डिंग रोकें", "أوقف التسجيل"],
        "Stop camera": ["关闭摄像头", "Apagar cámara", "Kamera ausschalten", "कैमरा बंद करें", "أوقف الكاميرا"],
        "Clear video": ["清除视频", "Borrar video", "Video löschen", "वीडियो हटाएँ", "امسح الفيديو"],
        "Choose a clip or start the camera. Camera access needs your permission.": ["选择视频或开启摄像头。摄像头需要你的许可。", "Elige un clip o activa la cámara. Necesitas dar permiso para usarla.", "Wähle einen Clip oder starte die Kamera. Der Kamerazugriff braucht deine Zustimmung.", "वीडियो चुनें या कैमरा शुरू करें। कैमरे के लिए आपकी अनुमति ज़रूरी है।", "اختر مقطعًا أو شغّل الكاميرا. يتطلب الوصول إليها إذنك."],
        "Requesting camera permission...": ["正在请求摄像头权限……", "Solicitando permiso para la cámara...", "Kameraberechtigung wird angefragt ...", "कैमरे की अनुमति माँगी जा रही है...", "جارٍ طلب إذن الكاميرا..."],
        "Camera is on. Preview stays on this device. Press start recording when ready.": ["摄像头已开启。预览仅在此设备显示。准备好后开始录制。", "La cámara está activa. La vista previa permanece en este dispositivo. Empieza a grabar cuando quieras.", "Kamera ist an. Die Vorschau bleibt auf diesem Gerät. Starte die Aufnahme, wenn du bereit bist.", "कैमरा चालू है। प्रीव्यू इसी डिवाइस पर रहता है। तैयार होने पर रिकॉर्डिंग शुरू करें।", "الكاميرا تعمل. تبقى المعاينة على هذا الجهاز. ابدأ التسجيل عندما تكون مستعدًا."],
        "Recording... Press stop when you are done.": ["正在录制……完成后按停止。", "Grabando... Pulsa detener cuando termines.", "Aufnahme läuft ... Drücke zum Beenden auf Stopp.", "रिकॉर्डिंग जारी है... पूरा होने पर रोकें दबाएँ।", "جارٍ التسجيل... اضغط إيقاف عند الانتهاء."],
        "Clip ready to review. It is only available until you leave or refresh this page.": ["视频已准备好回看。离开或刷新页面后将无法查看。", "Clip listo para revisar. Solo estará disponible hasta que salgas o actualices esta página.", "Clip bereit zur Ansicht. Er ist nur verfügbar, bis du diese Seite verlässt oder neu lädst.", "क्लिप देखने के लिए तैयार है। पेज छोड़ने या रीफ़्रेश करने तक ही उपलब्ध है।", "المقطع جاهز للمراجعة. سيبقى متاحًا حتى مغادرة الصفحة أو تحديثها فقط."],
        "Video selected. It stays on this device and is not uploaded.": ["已选择视频。视频保留在此设备上，不会上传。", "Video seleccionado. Permanece en este dispositivo y no se sube.", "Video ausgewählt. Es bleibt auf diesem Gerät und wird nicht hochgeladen.", "वीडियो चुना गया। यह डिवाइस पर ही रहेगा और अपलोड नहीं होगा।", "تم اختيار الفيديو. يبقى على هذا الجهاز ولا يتم رفعه."],
        "Camera permission was denied. Allow camera access in your browser settings and try again.": ["摄像头权限被拒绝。请在浏览器设置中允许摄像头访问后重试。", "Se denegó el permiso de cámara. Permite el acceso en la configuración del navegador e inténtalo de nuevo.", "Kamerazugriff verweigert. Erlaube ihn in den Browsereinstellungen und versuche es erneut.", "कैमरे की अनुमति नहीं मिली। ब्राउज़र सेटिंग में अनुमति दें और फिर कोशिश करें।", "تم رفض إذن الكاميرا. اسمح بالوصول من إعدادات المتصفح ثم حاول مجددًا."],
        "Camera is unavailable. Use HTTPS or localhost and check that a camera is connected.": ["摄像头不可用。请使用 HTTPS 或 localhost，并检查摄像头是否连接。", "La cámara no está disponible. Usa HTTPS o localhost y comprueba que haya una cámara conectada.", "Kamera nicht verfügbar. Verwende HTTPS oder localhost und prüfe, ob eine Kamera angeschlossen ist.", "कैमरा उपलब्ध नहीं है। HTTPS या localhost का उपयोग करें और कैमरा कनेक्शन जाँचें।", "الكاميرا غير متاحة. استخدم HTTPS أو localhost وتأكد من توصيل الكاميرا."],
        "Could not start the camera. Check browser permissions and try again.": ["无法启动摄像头。请检查浏览器权限后重试。", "No se pudo iniciar la cámara. Revisa los permisos del navegador e inténtalo de nuevo.", "Kamera konnte nicht gestartet werden. Prüfe die Browserberechtigungen und versuche es erneut.", "कैमरा शुरू नहीं हो सका। ब्राउज़र की अनुमतियाँ जाँचें और फिर कोशिश करें।", "تعذر تشغيل الكاميرا. تحقق من أذونات المتصفح وحاول مجددًا."],
        "Camera preview could not start.": ["无法启动摄像头预览。", "No se pudo iniciar la vista previa de la cámara.", "Kameravorschau konnte nicht gestartet werden.", "कैमरा प्रीव्यू शुरू नहीं हो सका।", "تعذر بدء معاينة الكاميرا."],
        "Camera stopped.": ["摄像头已关闭。", "Cámara apagada.", "Kamera ausgeschaltet.", "कैमरा बंद है।", "تم إيقاف الكاميرا."],
        "Your browser does not support video recording. You can still choose a video file.": ["浏览器不支持视频录制。你仍可选择视频文件。", "Tu navegador no admite grabar video. Aún puedes elegir un archivo de video.", "Dein Browser unterstützt keine Videoaufnahme. Du kannst weiterhin eine Videodatei auswählen.", "आपका ब्राउज़र वीडियो रिकॉर्डिंग का समर्थन नहीं करता। फिर भी वीडियो फ़ाइल चुन सकते हैं।", "لا يدعم متصفحك تسجيل الفيديو. يمكنك اختيار ملف فيديو بدلًا من ذلك."],
        "Could not record this video. Try another browser or choose a video file.": ["无法录制此视频。请换个浏览器或选择视频文件。", "No se pudo grabar este video. Prueba otro navegador o elige un archivo.", "Video konnte nicht aufgenommen werden. Probiere einen anderen Browser oder wähle eine Videodatei.", "वीडियो रिकॉर्ड नहीं हो सका। दूसरा ब्राउज़र आज़माएँ या वीडियो फ़ाइल चुनें।", "تعذر تسجيل الفيديو. جرب متصفحًا آخر أو اختر ملف فيديو."],
        "Choose a video file to preview.": ["请选择要预览的视频文件。", "Elige un archivo de video para previsualizar.", "Wähle eine Videodatei für die Vorschau aus.", "प्रीव्यू के लिए वीडियो फ़ाइल चुनें।", "اختر ملف فيديو لمعاينته."],
        "Video preview cleared.": ["视频预览已清除。", "Vista previa borrada.", "Videovorschau gelöscht.", "वीडियो प्रीव्यू हटाया गया।", "تم مسح معاينة الفيديو."],
        "Play sound": ["播放声音", "Reproducir sonido", "Ton abspielen", "ध्वनि चलाएँ", "تشغيل الصوت"],
        "Stop sound": ["停止声音", "Detener sonido", "Ton stoppen", "ध्वनि रोकें", "إيقاف الصوت"],
        "Sound stopped.": ["声音已停止。", "Sonido detenido.", "Ton gestoppt.", "ध्वनि बंद है।", "تم إيقاف الصوت."],
        "Loading sound...": ["正在加载声音……", "Cargando sonido...", "Ton wird geladen ...", "ध्वनि लोड हो रही है...", "جارٍ تحميل الصوت..."],
        "Sound is playing.": ["正在播放声音。", "El sonido está reproduciéndose.", "Der Ton wird abgespielt.", "ध्वनि चल रही है।", "الصوت يعمل."],
        "Sound selected. Press play to start.": ["已选择声音。按播放开始。", "Sonido seleccionado. Pulsa reproducir.", "Ton ausgewählt. Drücke auf Abspielen.", "ध्वनि चुनी गई। शुरू करने के लिए चलाएँ दबाएँ।", "تم اختيار الصوت. اضغط تشغيل للبدء."],
        "Choose a sound and press play. Internet is needed.": ["选择声音并按播放。需要联网。", "Elige un sonido y pulsa reproducir. Se necesita internet.", "Wähle einen Ton und drücke auf Abspielen. Internet ist nötig.", "ध्वनि चुनें और चलाएँ दबाएँ। इंटरनेट ज़रूरी है।", "اختر صوتًا واضغط تشغيل. يلزم الاتصال بالإنترنت."],
        "Could not load sound. Check your internet connection and try again.": ["无法加载声音。请检查网络连接后重试。", "No se pudo cargar el sonido. Comprueba internet e inténtalo de nuevo.", "Ton konnte nicht geladen werden. Prüfe die Internetverbindung und versuche es erneut.", "ध्वनि लोड नहीं हुई। इंटरनेट जाँचें और फिर प्रयास करें।", "تعذر تحميل الصوت. تحقق من اتصال الإنترنت وحاول مجددًا."],
        "Coach tip": ["教练提示", "Consejo", "Trainer-Tipp", "कोच की सलाह", "نصيحة المدرب"],
        "Keep a pace that lets you still speak in short sentences.": ["保持可以说简短句子的运动速度。", "Mantén un ritmo que te permita hablar con frases cortas.", "Wähle ein Tempo, bei dem du noch kurze Sätze sprechen kannst.", "ऐसी गति रखें कि आप छोटे वाक्य बोल सकें।", "حافظ على وتيرة تسمح لك بالتحدث بجمل قصيرة."],
        "Use a stable chair or wall nearby for balance.": ["在附近放一把稳固的椅子或靠墙，以便保持平衡。", "Ten cerca una silla estable o una pared para apoyarte.", "Halte einen stabilen Stuhl oder eine Wand zum Festhalten bereit.", "संतुलन के लिए पास में मज़बूत कुर्सी या दीवार रखें।", "ضع كرسيًا ثابتًا أو جدارًا قريبًا للاستناد إليه."],
        "Stop if you feel sharp pain, dizziness, or trouble breathing.": ["如感到刺痛、头晕或呼吸困难，请停止。", "Para si sientes dolor agudo, mareo o dificultad para respirar.", "Höre bei stechendem Schmerz, Schwindel oder Atemnot auf.", "तेज़ दर्द, चक्कर या साँस लेने में परेशानी हो तो रुकें।", "توقف إذا شعرت بألم حاد أو دوار أو صعوبة في التنفس."],
        "Breathe out when the movement is hardest.": ["动作最费力时呼气。", "Exhala cuando el movimiento sea más difícil.", "Atme aus, wenn die Bewegung am anstrengendsten ist.", "जब व्यायाम सबसे कठिन लगे तब साँस छोड़ें।", "ازفر عندما تكون الحركة أصعب."],
        "Move slowly and with control for a safer workout.": ["缓慢并有控制地运动，让锻炼更安全。", "Muévete despacio y con control para entrenar con más seguridad.", "Bewege dich langsam und kontrolliert für ein sichereres Training.", "सुरक्षित वर्कआउट के लिए धीरे और नियंत्रण से चलें।", "تحرك ببطء وتحكم لتمرين أكثر أمانًا."],
        "Next tip": ["下一条提示", "Siguiente consejo", "Nächster Tipp", "अगली सलाह", "النصيحة التالية"],
        "Quick reaction break": ["快速反应小游戏", "Pausa de reacción rápida", "Schnelle Reaktionspause", "तेज़ प्रतिक्रिया खेल", "استراحة رد الفعل السريع"],
        "When the button turns green, tap it as quickly as you can.": ["按钮变绿时，尽快点击。", "Cuando el botón se ponga verde, tócalo lo más rápido posible.", "Tippe so schnell du kannst, sobald die Schaltfläche grün wird.", "बटन हरा होने पर उसे जल्दी से दबाएँ।", "اضغط بسرعة عندما يتحول الزر إلى اللون الأخضر."],
        "Wait...": ["等待……", "Espera...", "Warte ...", "रुकें...", "انتظر..."],
        "Tap when it turns green!": ["变绿时点击！", "¡Toca cuando se ponga verde!", "Tippe, wenn es grün wird!", "हरा होने पर टैप करें!", "اضغط عندما يتحول إلى الأخضر!"],
        "Start a round to test your reaction.": ["开始一轮来测试反应速度。", "Inicia una ronda para probar tus reflejos.", "Starte eine Runde und teste deine Reaktion.", "अपनी प्रतिक्रिया जाँचने के लिए राउंड शुरू करें।", "ابدأ جولة لاختبار سرعة استجابتك."],
        "Start a round after or during a workout.": ["锻炼期间或之后开始一轮。", "Empieza una ronda durante o después del ejercicio.", "Starte eine Runde während oder nach dem Training.", "वर्कआउट के दौरान या बाद में राउंड शुरू करें।", "ابدأ جولة أثناء التمرين أو بعده."],
        "Start round": ["开始一轮", "Iniciar ronda", "Runde starten", "राउंड शुरू करें", "ابدأ الجولة"],
        "Mini games": ["小游戏", "Minijuegos", "Minispiele", "छोटे खेल", "ألعاب صغيرة"],
        "Use the mouse, touch, or arrow keys where shown. The mascot has a tip for each game.": ["根据提示使用鼠标、触摸或方向键。吉祥物会为每个游戏提供提示。", "Usa el ratón, la pantalla táctil o las flechas según se indique. La mascota tiene consejos para cada juego.", "Nutze Maus, Touch oder Pfeiltasten wie angegeben. Das Maskottchen gibt Tipps zu jedem Spiel.", "जहाँ बताया गया हो वहाँ माउस, टच या तीर कुंजियों का उपयोग करें। हर खेल के लिए शुभंकर की सलाह है।", "استخدم الفأرة أو اللمس أو الأسهم حسب التعليمات. يقدم التميمة نصيحة لكل لعبة."],
        "Dino runner": ["恐龙跑酷", "Carrera del dinosaurio", "Dino-Lauf", "डायनासोर दौड़", "لعبة الديناصور"],
        "Dino runner game": ["恐龙跑酷游戏", "Juego del dinosaurio", "Dino-Laufspiel", "डायनासोर दौड़ खेल", "لعبة الديناصور"],
        "Cloud Glider": ["云端滑翔", "Planeador de nubes", "Wolkengleiter", "बादलों का ग्लाइडर", "الطائرة الشراعية السحابية"],
        "Cloud Glider game": ["云端滑翔游戏", "Juego del planeador de nubes", "Wolkengleiter-Spiel", "बादलों के ग्लाइडर का खेल", "لعبة الطائرة الشراعية السحابية"],
        "Tap or press Space to glide through the gates.": ["点击或按空格键穿过云门。", "Toca o pulsa Espacio para atravesar las puertas.", "Tippe oder drücke die Leertaste, um durch die Tore zu gleiten.", "गेट से गुजरने के लिए टैप करें या स्पेस दबाएँ।", "المس أو اضغط المسافة للتحليق عبر البوابات."],
        "Glider game over! Press Start / Glide to try again.": ["滑翔结束！按“开始 / 滑翔”再试一次。", "¡Fin del planeador! Pulsa Iniciar / Volar para intentarlo otra vez.", "Gleitflug beendet! Drücke Start / Gleiten und versuche es erneut.", "ग्लाइडर खेल खत्म! फिर से कोशिश करने के लिए शुरू / ग्लाइड दबाएँ।", "انتهت لعبة الطائرة! اضغط ابدأ / حلّق للمحاولة مجددًا."],
        "Start / Glide": ["开始 / 滑翔", "Iniciar / Volar", "Start / Gleiten", "शुरू / ग्लाइड", "ابدأ / حلّق"],
        "Mascot Max: Tap, click, or press Space to rise through the cloud gates.": ["吉祥物麦克斯：点击、轻触或按空格键，向上穿过云门。", "Mascota Max: toca, haz clic o pulsa Espacio para subir por las puertas de nubes.", "Maskottchen Max: Tippe, klicke oder drücke die Leertaste, um durch die Wolkentore zu steigen.", "मैक्स: बादलों के गेट से ऊपर जाने के लिए टैप, क्लिक या स्पेस दबाएँ।", "ماكس: المس أو انقر أو اضغط المسافة للارتفاع عبر بوابات السحب."],
        "Score: 0": ["得分：0", "Puntuación: 0", "Punktzahl: 0", "स्कोर: 0", "النتيجة: 0"],
        "Runs": ["跑垒得分", "Carreras", "Runs", "रन", "الأشواط"],
        "Hits": ["安打", "Golpes", "Hits", "हिट", "الضربات"],
        "Baseball batting": ["棒球击球", "Bateo de béisbol", "Baseball-Schlagen", "बेसबॉल बल्लेबाज़ी", "ضرب البيسبول"],
        "Baseball batting timing game": ["棒球击球时机游戏", "Juego de bateo de béisbol", "Baseball-Timing-Spiel", "बेसबॉल टाइमिंग गेम", "لعبة توقيت ضرب البيسبول"],
        "Start a game, then swing when the pitch reaches the plate.": ["开始游戏，等球到本垒附近时挥棒。", "Empieza y batea cuando la pelota llegue al plato.", "Starte das Spiel und schwinge, wenn der Ball die Platte erreicht.", "खेल शुरू करें और गेंद प्लेट के पास आने पर बल्ला घुमाएँ।", "ابدأ اللعبة واضرب عندما تصل الكرة إلى القاعدة."],
        "Pitch coming! Swing as it reaches the batter.": ["球来了！等球到击球手附近时挥棒。", "¡Se acerca la pelota! Batea cuando llegue al bateador.", "Der Ball kommt! Schwinge, wenn er den Schlagmann erreicht.", "गेंद आ रही है! बल्लेबाज़ तक पहुँचने पर बल्ला घुमाएँ।", "الكرة قادمة! اضرب عندما تصل إلى اللاعب."],
        "Game ended when you started another minigame.": ["开始其他小游戏后，本局已结束。", "La partida terminó al iniciar otro minijuego.", "Das Spiel endete, als du ein anderes Minispiel gestartet hast.", "दूसरा मिनीगेम शुरू करने पर खेल समाप्त हो गया।", "انتهت اللعبة عند بدء لعبة مصغرة أخرى."],
        "Strike! Try the next pitch.": ["好球！试试下一球。", "¡Strike! Prueba con el siguiente lanzamiento.", "Strike! Versuch es beim nächsten Wurf.", "स्ट्राइक! अगली गेंद आज़माएँ।", "ضربة خاطئة! جرب الرمية التالية."],
        "Base hit! +1 run.": ["安打！得 1 分。", "¡Hit! +1 carrera.", "Basehit! +1 Run.", "हिट! +1 रन।", "ضربة ناجحة! +1 شوط."],
        "Double! +2 runs.": ["二垒安打！得 2 分。", "¡Doble! +2 carreras.", "Doppel! +2 Runs.", "डबल! +2 रन।", "ضربة مزدوجة! +2 شوط."],
        "Home run! +4 runs.": ["全垒打！得 4 分。", "¡Jonrón! +4 carreras.", "Home Run! +4 Runs.", "होम रन! +4 रन।", "ضربة منزلية! +4 أشواط."],
        "Game over! Final score:": ["游戏结束！最终得分：", "¡Fin del juego! Puntuación final:", "Spiel vorbei! Endstand:", "खेल खत्म! अंतिम स्कोर:", "انتهت اللعبة! النتيجة النهائية:"],
        "Start game": ["开始游戏", "Empezar", "Spiel starten", "खेल शुरू करें", "ابدأ اللعبة"],
        "Next pitch": ["下一球", "Siguiente lanzamiento", "Nächster Wurf", "अगली गेंद", "الرمية التالية"],
        "Play again": ["再玩一次", "Jugar de nuevo", "Nochmal spielen", "फिर खेलें", "العب مجددًا"],
        "Swing!": ["挥棒！", "¡Batear!", "Schwingen!", "बल्ला घुमाएँ!", "اضرب!"],
        "Mascot Max: Time your swing as the ball reaches the batter. Space also swings.": ["吉祥物麦克斯：等球到击球手附近时挥棒。按空格也能挥棒。", "Mascota Max: batea cuando la pelota llegue al bateador. También puedes usar la barra espaciadora.", "Maskottchen Max: Schwinge, wenn der Ball den Schlagmann erreicht. Leertaste funktioniert auch.", "मैक्स: गेंद बल्लेबाज़ के पास आने पर बल्ला घुमाएँ। स्पेस से भी स्विंग होगा।", "ماكس: اضرب عندما تصل الكرة إلى اللاعب. يمكنك أيضًا استخدام زر المسافة."],
        "Mascot Max: Type an area and choose a place. Your search opens in Google Maps only when you click the link.": ["吉祥物麦克斯：输入区域并选择地点。只有点击链接时，搜索才会在 Google 地图中打开。", "Mascota Max: escribe una zona y elige un lugar. La búsqueda solo se abre en Google Maps cuando pulsas el enlace.", "Maskottchen Max: Gib einen Ort ein und wähle eine Kategorie. Die Suche wird erst in Google Maps geöffnet, wenn du den Link anklickst.", "मैक्स: इलाका लिखें और जगह चुनें। लिंक दबाने पर ही खोज Google Maps में खुलेगी।", "ماكس: اكتب منطقة واختر مكانًا. لن يُفتح البحث في خرائط Google إلا عند الضغط على الرابط."],
        "Start / Jump": ["开始 / 跳跃", "Iniciar / Saltar", "Start / Springen", "शुरू / कूदें", "ابدأ / اقفز"],
        "Mascot Max: Press start, then jump over each cactus.": ["吉祥物麦克斯：点击开始，然后跳过每一株仙人掌。", "Mascota Max: pulsa iniciar y salta cada cactus.", "Maskottchen Max: Drücke Start und springe über jeden Kaktus.", "मैक्स: शुरू दबाएँ और हर कैक्टस के ऊपर से कूदें।", "ماكس: اضغط ابدأ ثم اقفز فوق كل صبار."],
        "Snake": ["贪吃蛇", "Serpiente", "Snake", "साँप", "الثعبان"],
        "Minesweeper": ["扫雷", "Buscaminas", "Minesweeper", "माइनस्वीपर", "كاسحة الألغام"],
        "Retro maze": ["复古迷宫", "Laberinto retro", "Retro-Labyrinth", "रेट्रो भूलभुलैया", "متاهة كلاسيكية"],
        "Reaction time": ["反应速度", "Tiempo de reacción", "Reaktionszeit", "प्रतिक्रिया समय", "زمن الاستجابة"],
        "Find the safe squares. Numbers show nearby mines.": ["找出安全方格。数字表示附近的地雷数量。", "Encuentra las casillas seguras. Los números indican las minas cercanas.", "Finde sichere Felder. Zahlen zeigen Minen in der Nähe.", "सुरक्षित खाने खोजें। अंक पास की खानों की संख्या बताते हैं।", "اعثر على المربعات الآمنة. تشير الأرقام إلى الألغام القريبة."],
        "Flag mode: off": ["标记模式：关", "Modo bandera: apagado", "Markiermodus: aus", "फ़्लैग मोड: बंद", "وضع العلامة: متوقف"],
        "Flag mode: on": ["标记模式：开", "Modo bandera: activado", "Markiermodus: an", "फ़्लैग मोड: चालू", "وضع العلامة: يعمل"],
        "Adjacent mines": ["附近地雷", "Minas cercanas", "Benachbarte Minen", "पास की माइन", "الألغام المجاورة"],
        "Flagged cell": ["已标记方格", "Casilla marcada", "Markiertes Feld", "चिह्नित खाना", "مربع عليه علامة"],
        "Mine": ["地雷", "Mina", "Mine", "माइन", "لغم"],
        "Empty safe cell": ["空白安全方格", "Casilla segura vacía", "Leeres sicheres Feld", "खाली सुरक्षित खाना", "مربع آمن فارغ"],
        "Hidden cell": ["未揭开的方格", "Casilla oculta", "Verdecktes Feld", "छिपा हुआ खाना", "مربع مخفي"],
        "New board": ["新棋盘", "Nuevo tablero", "Neues Feld", "नया बोर्ड", "لوحة جديدة"],
        "Boom! You found a mine. Start a new board.": ["砰！踩到地雷了。开始新棋盘吧。", "¡Boom! Encontraste una mina. Empieza un tablero nuevo.", "Bumm! Du hast eine Mine gefunden. Starte ein neues Feld.", "बूम! आपको एक माइन मिली। नया बोर्ड शुरू करें।", "انفجار! عثرت على لغم. ابدأ لوحة جديدة."],
        "You cleared the board!": ["你清除了棋盘！", "¡Despejaste el tablero!", "Du hast das Feld geräumt!", "आपने बोर्ड साफ़ कर दिया!", "لقد أزلت الألغام من اللوحة!"],
        "Start maze": ["开始迷宫", "Iniciar laberinto", "Labyrinth starten", "भूलभुलैया शुरू करें", "ابدأ المتاهة"],
        "Use arrow keys or WASD to collect dots and avoid the ghost.": ["使用方向键或 WASD 收集豆子并躲避幽灵。", "Usa las flechas o WASD para recoger puntos y evitar al fantasma.", "Sammle mit Pfeiltasten oder WASD Punkte und weiche dem Geist aus.", "तीर कुंजियों या WASD से बिंदु इकट्ठा करें और भूत से बचें।", "استخدم الأسهم أو WASD لجمع النقاط وتجنب الشبح."],
        "Find places nearby": ["查找附近地点", "Busca lugares cercanos", "Orte in der Nähe finden", "आस-पास की जगहें खोजें", "ابحث عن أماكن قريبة"],
        "Search ready": ["已准备搜索", "Búsqueda lista", "Suche bereit", "खोज तैयार", "البحث جاهز"],
        "Search food places, gyms, malls, arcades, parks, or another place by typing an area.": ["输入区域，搜索餐饮店、健身房、商场、游戏厅、公园或其他地点。", "Escribe una zona para buscar restaurantes, gimnasios, centros comerciales, recreativos, parques u otros lugares.", "Gib einen Ort ein, um Restaurants, Fitnessstudios, Einkaufszentren, Spielhallen, Parks oder andere Orte zu finden.", "इलाका लिखकर खाने की जगहें, जिम, मॉल, आर्केड, पार्क या अन्य जगहें खोजें।", "اكتب منطقة للبحث عن المطاعم أو الصالات الرياضية أو المراكز التجارية أو مدن الألعاب أو الحدائق أو أماكن أخرى."],
        "What are you looking for?": ["你要找什么？", "¿Qué buscas?", "Wonach suchst du?", "आप क्या खोज रहे हैं?", "ما الذي تبحث عنه؟"],
        "Food places and restaurants": ["餐饮店和餐馆", "Comida y restaurantes", "Restaurants und Lokale", "खाने की जगहें और रेस्तराँ", "أماكن الطعام والمطاعم"],
        "Gyms": ["健身房", "Gimnasios", "Fitnessstudios", "जिम", "صالات رياضية"],
        "Malls": ["商场", "Centros comerciales", "Einkaufszentren", "मॉल", "مراكز تجارية"],
        "Arcades": ["游戏厅", "Salones recreativos", "Spielhallen", "आर्केड", "صالات ألعاب"],
        "Parks": ["公园", "Parques", "Parks", "पार्क", "حدائق"],
        "Other places": ["其他地点", "Otros lugares", "Andere Orte", "अन्य जगहें", "أماكن أخرى"],
        "Another kind of place (optional)": ["其他类型的地点（可选）", "Otro tipo de lugar (opcional)", "Andere Art von Ort (optional)", "अन्य तरह की जगह (वैकल्पिक)", "نوع آخر من الأماكن (اختياري)"],
        "For example: bookshops or bowling": ["例如：书店或保龄球馆", "Por ejemplo: librerías o boleras", "Zum Beispiel: Buchläden oder Bowling", "जैसे: किताबों की दुकान या बॉलिंग", "مثل: المكتبات أو البولينغ"],
        "Area, town, or landmark": ["区域、城镇或地标", "Zona, ciudad o punto de referencia", "Gebiet, Ort oder Wahrzeichen", "इलाका, कस्बा या पहचान की जगह", "منطقة أو بلدة أو معلم"],
        "Type an area to search": ["输入要搜索的区域", "Escribe una zona para buscar", "Gib ein Suchgebiet ein", "खोजने के लिए इलाका लिखें", "اكتب منطقة للبحث"],
        "Enter an area to search.": ["请输入要搜索的区域。", "Escribe una zona para buscar.", "Gib ein Suchgebiet ein.", "खोजने के लिए इलाका लिखें।", "اكتب منطقة للبحث."],
        "Prepare map search": ["准备地图搜索", "Preparar búsqueda en el mapa", "Kartensuche vorbereiten", "मैप खोज तैयार करें", "جهّز البحث على الخريطة"],
        "Your search is ready.": ["搜索已准备好。", "Tu búsqueda está lista.", "Deine Suche ist bereit.", "आपकी खोज तैयार है।", "بحثك جاهز."],
        "Open results in Google Maps": ["在 Google 地图中打开结果", "Abrir resultados en Google Maps", "Ergebnisse in Google Maps öffnen", "Google Maps में नतीजे खोलें", "افتح النتائج في خرائط Google"],
        "Opening the map sends your search words to Google Maps. This app does not use GPS or save your search.": ["打开地图会将搜索词发送到 Google 地图。本应用不会使用 GPS 或保存搜索内容。", "Al abrir el mapa, tus términos se envían a Google Maps. Esta aplicación no usa GPS ni guarda la búsqueda.", "Beim Öffnen der Karte werden deine Suchbegriffe an Google Maps gesendet. Diese App nutzt kein GPS und speichert deine Suche nicht.", "मैप खोलने पर खोज के शब्द Google Maps को भेजे जाते हैं। यह ऐप GPS का उपयोग या खोज को सहेजता नहीं है।", "عند فتح الخريطة تُرسل كلمات البحث إلى خرائط Google. لا يستخدم هذا التطبيق GPS ولا يحفظ البحث."],
        "Maze cleared! Great collecting.": ["迷宫清空了！收集得真好。", "¡Laberinto despejado! Buena recolección.", "Labyrinth geschafft! Gut gesammelt.", "भूलभुलैया पूरी! बढ़िया संग्रह।", "أنهيت المتاهة! أحسنت جمع النقاط."],
        "The ghost caught you. Start again to retry.": ["你被幽灵抓到了。重新开始再试一次。", "El fantasma te atrapó. Vuelve a empezar para intentarlo otra vez.", "Der Geist hat dich erwischt. Starte erneut.", "भूत ने पकड़ लिया। फिर से शुरू करके कोशिश करें।", "أمسك بك الشبح. ابدأ من جديد وحاول مرة أخرى."],
        "Collect food. The wall and your own tail end the game.": ["收集食物。碰到墙壁或自己的尾巴就会结束游戏。", "Recoge comida. Chocar con una pared o contigo mismo termina el juego.", "Sammle Futter. Wand oder eigener Schwanz beenden das Spiel.", "खाना इकट्ठा करें। दीवार या अपनी पूँछ से टकराने पर खेल खत्म होगा।", "اجمع الطعام. الاصطدام بالجدار أو بذيلك ينهي اللعبة."],
        "Game over! You hit the wall.": ["游戏结束！你撞到墙了。", "Fin del juego: chocaste contra la pared.", "Spiel vorbei! Du bist gegen die Wand gestoßen.", "खेल खत्म! आप दीवार से टकरा गए।", "انتهت اللعبة! اصطدمت بالجدار."],
        "Game over! You hit your tail.": ["游戏结束！你撞到自己的尾巴了。", "Fin del juego: chocaste con tu cola.", "Spiel vorbei! Du hast deinen Schwanz berührt.", "खेल खत्म! आप अपनी पूँछ से टकरा गए।", "انتهت اللعبة! اصطدمت بذيلك."],
        "Snake minigame": ["贪吃蛇小游戏", "Minijuego de la serpiente", "Snake-Minispiel", "साँप का छोटा खेल", "لعبة الثعبان الصغيرة"],
        "Start snake": ["开始贪吃蛇", "Iniciar serpiente", "Snake starten", "साँप का खेल शुरू करें", "ابدأ لعبة الثعبان"],
        "Mascot Max: Use arrow keys or WASD. Do not cross your own trail.": ["吉祥物麦克斯：使用方向键或 WASD，不要撞到自己的身体。", "Mascota Max: usa las flechas o WASD. No choques con tu propio cuerpo.", "Maskottchen Max: Nutze Pfeiltasten oder WASD. Berühre nicht deinen eigenen Schwanz.", "मैक्स: तीर कुंजियाँ या WASD इस्तेमाल करें। अपनी ही पूँछ से न टकराएँ।", "ماكس: استخدم الأسهم أو WASD. لا تصطدم بجسمك."],
        "Aim trainer": ["瞄准训练", "Entrenador de puntería", "Zieltraining", "निशाना अभ्यास", "تدريب التصويب"],
        "Aim trainer game": ["瞄准训练游戏", "Juego de puntería", "Zieltrainingsspiel", "निशाना अभ्यास खेल", "لعبة تدريب التصويب"],
        "Targets: 0 / 20": ["目标：0 / 20", "Objetivos: 0 / 20", "Ziele: 0 / 20", "लक्ष्य: 0 / 20", "الأهداف: 0 / 20"],
        "Start aim trainer": ["开始瞄准训练", "Iniciar puntería", "Zieltraining starten", "निशाना अभ्यास शुरू करें", "ابدأ تدريب التصويب"],
        "Mascot Max: Tap the glowing targets quickly, but stay relaxed.": ["吉祥物麦克斯：快速点击发光目标，同时保持放松。", "Mascota Max: toca los objetivos brillantes rápidamente, sin tensarte.", "Maskottchen Max: Tippe schnell auf die leuchtenden Ziele, aber bleib entspannt.", "मैक्स: चमकते लक्ष्यों पर जल्दी टैप करें, लेकिन आराम से रहें।", "ماكس: اضغط على الأهداف المضيئة بسرعة مع الاسترخاء."],
        "Mascot Max: Tap to reveal; turn on flag mode to mark a suspected mine.": ["吉祥物麦克斯：点击以揭开方格；开启标记模式以标记可能的地雷。", "Mascota Max: toca para revelar; activa el modo bandera para marcar una posible mina.", "Maskottchen Max: Tippe zum Aufdecken; aktiviere den Markiermodus für vermutete Minen.", "मैक्स: खाने खोलने के लिए टैप करें; संदिग्ध माइन पर निशान लगाने के लिए फ़्लैग मोड चालू करें।", "ماكس: اضغط للكشف؛ فعّل وضع العلامة لتحديد لغم محتمل."],
        "Mascot Max: Use arrow keys or WASD. Collect all the dots and watch for the ghost.": ["吉祥物麦克斯：使用方向键或 WASD。收集所有豆子并留意幽灵。", "Mascota Max: usa las flechas o WASD. Recoge todos los puntos y vigila al fantasma.", "Maskottchen Max: Nutze Pfeiltasten oder WASD. Sammle alle Punkte und achte auf den Geist.", "मैक्स: तीर कुंजियाँ या WASD इस्तेमाल करें। सारे बिंदु जमा करें और भूत से बचें।", "ماكس: استخدم الأسهم أو WASD. اجمع كل النقاط وانتبه للشبح."],
        "Task manager": ["任务管理", "Gestor de tareas", "Aufgabenverwaltung", "कार्य प्रबंधक", "مدير المهام"],
        "Example: Drink water after school": ["例如：放学后喝水", "Ejemplo: beber agua al salir de clase", "Beispiel: Nach der Schule Wasser trinken", "उदाहरण: स्कूल के बाद पानी पीना", "مثال: شرب الماء بعد المدرسة"],
        "Add goal": ["添加目标", "Añadir objetivo", "Ziel hinzufügen", "लक्ष्य जोड़ें", "أضف هدفًا"],
        "Done": ["完成", "Hecho", "Erledigt", "हो गया", "تم"],
        "Undo": ["撤销", "Deshacer", "Rückgängig", "पूर्ववत करें", "تراجع"],
        "Remove": ["删除", "Eliminar", "Entfernen", "हटाएँ", "إزالة"],
        "Health, illness & injury risks": ["健康、疾病与受伤风险", "Riesgos para la salud, enfermedades y lesiones", "Gesundheits-, Krankheits- und Verletzungsrisiken", "स्वास्थ्य, बीमारी और चोट के जोखिम", "مخاطر الصحة والمرض والإصابة"],
        "Exercise can help many people, but it is not a replacement for medical advice. Stop and get help for chest pain, fainting, severe breathing trouble, or pain after injury.": ["运动对许多人有帮助，但不能代替医疗建议。出现胸痛、昏厥、严重呼吸困难或受伤后疼痛时，请停止运动并寻求帮助。", "El ejercicio ayuda a muchas personas, pero no sustituye el consejo médico. Para y pide ayuda si tienes dolor en el pecho, desmayo, dificultad grave para respirar o dolor tras una lesión.", "Bewegung kann vielen Menschen helfen, ersetzt aber keine medizinische Beratung. Höre auf und hole Hilfe bei Brustschmerzen, Ohnmacht, starker Atemnot oder Schmerzen nach einer Verletzung.", "व्यायाम कई लोगों के लिए मददगार है, पर यह चिकित्सा सलाह का विकल्प नहीं है। सीने में दर्द, बेहोशी, साँस की गंभीर समस्या या चोट के बाद दर्द हो तो रुकें और मदद लें।", "قد تساعد الرياضة كثيرين لكنها لا تحل محل المشورة الطبية. توقف واطلب المساعدة عند ألم الصدر أو الإغماء أو صعوبة التنفس الشديدة أو ألم بعد الإصابة."],
        "Sprains & strains": ["扭伤与拉伤", "Esguinces y distensiones", "Verstauchungen und Zerrungen", "मोच और खिंचाव", "الالتواءات والشد العضلي"],
        "Sudden twisting or poor form can hurt muscles or ligaments. Rest, use the safe RICE steps if appropriate, and ask a health professional if pain is strong or lasting.": ["突然扭转或动作不正确可能伤到肌肉或韧带。适当休息；如适用，可采用安全的 RICE 处理方法。若疼痛严重或持续，请咨询医疗专业人员。", "Un giro brusco o una técnica incorrecta puede dañar músculos o ligamentos. Descansa y consulta a un profesional si el dolor es intenso o persiste.", "Ruckartige Drehungen oder falsche Technik können Muskeln oder Bänder verletzen. Ruhe dich aus und frage medizinisches Fachpersonal, wenn die Schmerzen stark sind oder anhalten.", "अचानक मुड़ने या गलत तरीके से करने से मांसपेशियों या लिगामेंट को चोट लग सकती है। आराम करें और दर्द तेज़ या लंबे समय तक रहे तो स्वास्थ्य विशेषज्ञ से पूछें।", "قد تؤدي الحركة المفاجئة أو الوضعية الخاطئة إلى إصابة العضلات أو الأربطة. استرح واستشر مختصًا إذا كان الألم شديدًا أو مستمرًا."],
        "Overtraining": ["过度训练", "Exceso de entrenamiento", "Übertraining", "ज़रूरत से ज़्यादा व्यायाम", "الإفراط في التدريب"],
        "Too much exercise can cause tiredness, poor sleep, soreness, and lower performance. Include rest days and easier sessions.": ["运动过量可能导致疲劳、睡眠变差、酸痛和表现下降。安排休息日和较轻松的训练。", "Hacer demasiado ejercicio puede causar cansancio, mal sueño, dolor muscular y menor rendimiento. Incluye días de descanso y sesiones suaves.", "Zu viel Training kann Müdigkeit, schlechten Schlaf, Muskelkater und geringere Leistung verursachen. Plane Ruhetage und leichtere Einheiten ein.", "बहुत अधिक व्यायाम से थकान, खराब नींद, दर्द और प्रदर्शन में कमी हो सकती है। आराम के दिन और हल्के सत्र रखें।", "قد يسبب الإفراط في التمرين التعب وسوء النوم والألم وضعف الأداء. خصص أيامًا للراحة وتمارين أخف."],
        "Heat illness": ["热相关疾病", "Enfermedad por calor", "Hitzekrankheit", "गर्मी से होने वाली बीमारी", "أمراض الحرارة"],
        "Hot environments can cause dehydration or heat illness. Drink water, rest in shade, and stop for headache, confusion, vomiting, or weakness.": ["炎热环境可能导致脱水或中暑。补充水分、在阴凉处休息；若头痛、意识混乱、呕吐或虚弱，请停止运动。", "El calor puede causar deshidratación o enfermedad. Bebe agua, descansa a la sombra y para si tienes dolor de cabeza, confusión, vómitos o debilidad.", "Hitze kann zu Flüssigkeitsmangel oder Hitzekrankheit führen. Trinke Wasser, ruhe im Schatten und höre bei Kopfschmerzen, Verwirrung, Erbrechen oder Schwäche auf.", "गर्मी से पानी की कमी या हीट इलनेस हो सकती है। पानी पिएँ, छाँव में आराम करें और सिरदर्द, भ्रम, उल्टी या कमजोरी होने पर रुकें।", "قد تسبب الحرارة الجفاف أو المرض. اشرب الماء واسترح في الظل وتوقف عند الصداع أو الارتباك أو القيء أو الضعف."],
        "Head or neck injury": ["头部或颈部受伤", "Lesión en la cabeza o el cuello", "Kopf- oder Nackenverletzung", "सिर या गर्दन की चोट", "إصابة الرأس أو الرقبة"],
        "Flips and gymnastic moves can cause serious injury. Never practice without trained supervision, correct equipment, and landing mats.": ["翻滚和体操动作可能造成严重伤害。没有专业人员监督、合适器材和落地垫时，绝不要练习。", "Las volteretas y la gimnasia pueden causar lesiones graves. Nunca practiques sin supervisión profesional, equipo adecuado y colchonetas.", "Überschläge und Turnübungen können schwere Verletzungen verursachen. Übe niemals ohne geschulte Aufsicht, passende Ausrüstung und Landematten.", "कलाबाज़ी और जिम्नास्टिक से गंभीर चोट लग सकती है। प्रशिक्षित निगरानी, सही उपकरण और मैट के बिना कभी अभ्यास न करें।", "قد تسبب الشقلبات والحركات الرياضية إصابات خطيرة. لا تتدرب دون إشراف مؤهل ومعدات مناسبة وحصائر هبوط."],
        "When to get help": ["何时寻求帮助", "Cuándo pedir ayuda", "Wann du Hilfe holen solltest", "कब मदद लें", "متى تطلب المساعدة"],
        "Contact emergency services for severe symptoms. Ask a parent or trusted health professional before exercise if you have a heart, joint, breathing, or long-term condition.": ["症状严重时请联系急救服务。如有心脏、关节、呼吸或长期健康问题，运动前请咨询家长或可信赖的医疗专业人员。", "Llama a emergencias si los síntomas son graves. Si tienes un problema cardíaco, articular, respiratorio o crónico, consulta con un adulto o profesional antes de hacer ejercicio.", "Rufe bei schweren Beschwerden den Notdienst. Frage bei Herz-, Gelenk-, Atemwegs- oder chronischen Erkrankungen vor dem Training eine erwachsene Vertrauensperson oder medizinisches Fachpersonal.", "गंभीर लक्षणों पर आपातकालीन सेवा से संपर्क करें। हृदय, जोड़, साँस या लंबे समय की बीमारी हो तो व्यायाम से पहले माता-पिता या स्वास्थ्य विशेषज्ञ से पूछें।", "اتصل بالطوارئ عند الأعراض الشديدة. استشر ولي الأمر أو مختصًا قبل الرياضة إذا كنت تعاني مشكلة في القلب أو المفاصل أو التنفس أو حالة مزمنة."],
        "Life expectancy": ["预期寿命", "Esperanza de vida", "Lebenserwartung", "जीवन प्रत्याशा", "متوسط العمر المتوقع"],
        "This app cannot responsibly predict lifespan. Genetics, environment, medical history, and luck all matter. It does not estimate illness risk or predict a future diagnosis.": ["本应用无法可靠地预测寿命。遗传、环境、病史和其他因素都会产生影响。本应用不会估算患病风险或预测未来诊断。", "Esta aplicación no puede predecir de forma responsable la esperanza de vida. Influyen la genética, el entorno, el historial médico y otros factores. No calcula el riesgo de enfermedad ni predice diagnósticos.", "Diese App kann die Lebenserwartung nicht zuverlässig vorhersagen. Gene, Umwelt, Krankengeschichte und weitere Faktoren spielen eine Rolle. Sie schätzt weder Krankheitsrisiken noch künftige Diagnosen.", "यह ऐप जीवनकाल की भरोसेमंद भविष्यवाणी नहीं कर सकता। आनुवंशिकी, वातावरण, चिकित्सा इतिहास और अन्य बातें मायने रखती हैं। यह बीमारी का जोखिम या भविष्य का निदान नहीं बताता।", "لا يمكن لهذا التطبيق توقع العمر بشكل موثوق. تؤثر الجينات والبيئة والتاريخ الطبي وعوامل أخرى. ولا يقدر مخاطر المرض أو يتنبأ بتشخيص مستقبلي."],
        "Page shade": ["页面色调", "Tono de página", "Seitenton", "पेज का रंग", "لون الصفحة"],
        "Page zoom": ["页面缩放", "Zoom de página", "Seitenzoom", "पेज ज़ूम", "تكبير الصفحة"],
        "Day": ["白天", "Día", "Tag", "दिन", "نهار"],
        "Sunset": ["日落", "Atardecer", "Abenddämmerung", "सूर्यास्त", "غروب"],
        "Night": ["夜晚", "Noche", "Nacht", "रात", "ليل"],
        "Match the time": ["根据时间自动调整", "Según la hora", "An die Uhrzeit anpassen", "समय के अनुसार", "حسب الوقت"],
        "Accent color": ["强调色", "Color de acento", "Akzentfarbe", "मुख्य रंग", "اللون المميز"],
        "Reset colors": ["重置颜色", "Restablecer colores", "Farben zurücksetzen", "रंग रीसेट करें", "إعادة ضبط الألوان"],
        "Mascot Max": ["吉祥物麦克斯", "Mascota Max", "Maskottchen Max", "शुभंकर मैक्स", "التميمة ماكس"],
        "Welcome! I can explain the exercises and mini games.": ["欢迎！我可以讲解锻炼动作和小游戏。", "¡Bienvenido! Puedo explicar los ejercicios y minijuegos.", "Willkommen! Ich kann die Übungen und Minispiele erklären.", "स्वागत है! मैं व्यायाम और छोटे खेल समझा सकता हूँ।", "مرحبًا! يمكنني شرح التمارين والألعاب الصغيرة."],
        "Suggested session:": ["建议训练：", "Sesión sugerida:", "Vorgeschlagene Einheit:", "सुझाया गया सत्र:", "الجلسة المقترحة:"],
        "BMI range:": ["BMI 范围：", "Rango de IMC:", "BMI-Bereich:", "BMI सीमा:", "نطاق مؤشر كتلة الجسم:"],
        "not calculated": ["未计算", "no calculado", "nicht berechnet", "गणना नहीं की गई", "غير محسوب"],
        "below 18.5": ["低于 18.5", "menos de 18,5", "unter 18,5", "18.5 से कम", "أقل من 18.5"],
        "between 18.5 and 24.9": ["18.5 至 24.9 之间", "entre 18,5 y 24,9", "zwischen 18,5 und 24,9", "18.5 और 24.9 के बीच", "بين 18.5 و24.9"],
        "between 25 and 29.9": ["25 至 29.9 之间", "entre 25 y 29,9", "zwischen 25 und 29,9", "25 और 29.9 के बीच", "بين 25 و29.9"],
        "30 or higher": ["30 或更高", "30 o más", "30 oder höher", "30 या अधिक", "30 أو أكثر"],
        "Easy marching - 5 minutes": ["轻松踏步 - 5 分钟", "Marcha suave - 5 minutos", "Lockeres Marschieren – 5 Minuten", "हल्की मार्चिंग - 5 मिनट", "مشي هادئ في المكان - 5 دقائق"],
        "Squats - 2 sets of 8 reps": ["深蹲 - 2 组，每组 8 次", "Sentadillas - 2 series de 8 repeticiones", "Kniebeugen – 2 Sätze mit je 8 Wiederholungen", "स्क्वैट - 8 दोहराव के 2 सेट", "قرفصاء - مجموعتان من 8 تكرارات"],
        "Wall push-ups - 2 sets of 8 reps": ["靠墙俯卧撑 - 2 组，每组 8 次", "Flexiones en pared - 2 series de 8 repeticiones", "Liegestütze an der Wand – 2 Sätze mit je 8 Wiederholungen", "दीवार पुश-अप - 8 दोहराव के 2 सेट", "ضغط على الحائط - مجموعتان من 8 تكرارات"],
        "Cool down stretch - 3 minutes": ["放松拉伸 - 3 分钟", "Estiramiento final - 3 minutos", "Dehnen zum Abkühlen – 3 Minuten", "कूल-डाउन स्ट्रेच - 3 मिनट", "تمدد تهدئة - 3 دقائق"],
        "Warm-up - 5 minutes": ["热身 - 5 分钟", "Calentamiento - 5 minutos", "Aufwärmen – 5 Minuten", "वार्म-अप - 5 मिनट", "إحماء - 5 دقائق"],
        "Slow squats - 3 sets of 8 reps": ["慢速深蹲 - 3 组，每组 8 次", "Sentadillas lentas - 3 series de 8 repeticiones", "Langsame Kniebeugen – 3 Sätze mit je 8 Wiederholungen", "धीमे स्क्वैट - 8 दोहराव के 3 सेट", "قرفصاء بطيئة - 3 مجموعات من 8 تكرارات"],
        "Wall push-ups - 3 sets of 8 reps": ["靠墙俯卧撑 - 3 组，每组 8 次", "Flexiones en pared - 3 series de 8 repeticiones", "Liegestütze an der Wand – 3 Sätze mit je 8 Wiederholungen", "दीवार पुश-अप - 8 दोहराव के 3 सेट", "ضغط على الحائط - 3 مجموعات من 8 تكرارات"],
        "Calf raises - 2 sets of 10 reps": ["提踵 - 2 组，每组 10 次", "Elevaciones de talones - 2 series de 10 repeticiones", "Wadenheben – 2 Sätze mit je 10 Wiederholungen", "एड़ी उठाना - 10 दोहराव के 2 सेट", "رفع الساق - مجموعتان من 10 تكرارات"],
        "Easy marching - 8 minutes": ["轻松踏步 - 8 分钟", "Marcha suave - 8 minutos", "Lockeres Marschieren – 8 Minuten", "हल्की मार्चिंग - 8 मिनट", "مشي هادئ في المكان - 8 دقائق"],
        "Squats - 2 sets of 10 reps": ["深蹲 - 2 组，每组 10 次", "Sentadillas - 2 series de 10 repeticiones", "Kniebeugen – 2 Sätze mit je 10 Wiederholungen", "स्क्वैट - 10 दोहराव के 2 सेट", "قرفصاء - مجموعتان من 10 تكرارات"],
        "Marching intervals - 6 minutes": ["间歇踏步 - 6 分钟", "Intervalos de marcha - 6 minutos", "Marsch-Intervalle – 6 Minuten", "मार्चिंग इंटरवल - 6 मिनट", "مشي متقطع - 6 دقائق"],
        "Easy stretch - 3 minutes": ["轻柔拉伸 - 3 分钟", "Estiramiento suave - 3 minutos", "Sanftes Dehnen – 3 Minuten", "हल्की स्ट्रेचिंग - 3 मिनट", "تمدد لطيف - 3 دقائق"],
        "Plan confidence:": ["计划可信度：", "Confianza del plan:", "Plan-Konfidenz:", "योजना का भरोसा:", "مدى موثوقية الخطة:"],
        "EXERCISE TIMER": ["单项运动计时器", "TEMPORIZADOR DE EJERCICIO", "ÜBUNGS-TIMER", "व्यायाम टाइमर", "مؤقت التمرين"],
        "Time one exercise at a time": ["一次计时一个动作", "Cronometra un ejercicio cada vez", "Jeweils eine Übung stoppen", "एक बार में एक व्यायाम का समय लें", "وقّت تمرينًا واحدًا في كل مرة"],
        "Exercise to time": ["要计时的动作", "Ejercicio a cronometrar", "Übung zum Stoppen", "जिस व्यायाम का समय लेना है", "التمرين المطلوب توقيته"],
        "Time for this exercise": ["此动作的计时时长", "Tiempo para este ejercicio", "Zeit für diese Übung", "इस व्यायाम का समय", "وقت هذا التمرين"],
        "Create a plan first": ["请先创建计划", "Crea un plan primero", "Erstelle zuerst einen Plan", "पहले योजना बनाएँ", "أنشئ خطة أولًا"],
        "30 seconds": ["30 秒", "30 segundos", "30 Sekunden", "30 सेकंड", "30 ثانية"],
        "1 minute": ["1 分钟", "1 minuto", "1 Minute", "1 मिनट", "دقيقة واحدة"],
        "Create a plan to choose an exercise.": ["创建计划后即可选择动作。", "Crea un plan para elegir un ejercicio.", "Erstelle einen Plan, um eine Übung auszuwählen.", "व्यायाम चुनने के लिए पहले योजना बनाएँ।", "أنشئ خطة لاختيار تمرين."],
        "Press start to time this exercise.": ["按开始为此动作计时。", "Pulsa iniciar para cronometrar este ejercicio.", "Drücke auf Start, um diese Übung zu stoppen.", "इस व्यायाम का समय लेने के लिए शुरू करें दबाएँ।", "اضغط ابدأ لتوقيت هذا التمرين."],
        "Timing this exercise.": ["正在为此动作计时。", "Cronometrando este ejercicio.", "Diese Übung wird gestoppt.", "इस व्यायाम का समय चल रहा है।", "يجري توقيت هذا التمرين."],
        "Exercise timer complete! Great work.": ["动作计时结束！做得好。", "¡Terminó el tiempo del ejercicio! Buen trabajo.", "Übungszeit abgelaufen! Gut gemacht.", "व्यायाम का समय पूरा हुआ! बहुत बढ़िया।", "انتهى وقت التمرين! أحسنت."],
        "Workout in progress.": ["训练进行中。", "Entrenamiento en curso.", "Training läuft.", "वर्कआउट चल रहा है।", "التمرين مستمر."],
        "Workout complete! Great work.": ["训练完成！做得好。", "¡Entrenamiento terminado! Buen trabajo.", "Training geschafft! Gut gemacht.", "वर्कआउट पूरा हुआ! बहुत बढ़िया।", "اكتمل التمرين! أحسنت."],
        "Paused.": ["已暂停。", "En pausa.", "Pausiert.", "रुका हुआ।", "متوقف مؤقتًا."],
        "The sound source could not load. Try another option.": ["无法加载此音频。请尝试其他选项。", "No se pudo cargar el audio. Prueba otra opción.", "Die Audioquelle konnte nicht geladen werden. Probiere eine andere Option.", "ध्वनि लोड नहीं हुई। कोई दूसरा विकल्प आज़माएँ।", "تعذر تحميل الصوت. جرب خيارًا آخر."],
        "Get ready...": ["准备好……", "Prepárate...", "Mach dich bereit ...", "तैयार हो जाएँ...", "استعد..."],
        "GO!": ["开始！", "¡YA!", "LOS!", "चलें!", "انطلق!"],
        "Too soon! Try another round.": ["太早了！再试一轮。", "¡Demasiado pronto! Prueba otra ronda.", "Zu früh! Versuch es noch einmal.", "बहुत जल्दी! एक और राउंड आज़माएँ।", "مبكر جدًا! جرب جولة أخرى."],
        "Nice!": ["不错！", "¡Bien!", "Gut gemacht!", "बहुत बढ़िया!", "أحسنت!"],
        "Mascot Max: Add honest details to get a general starting plan.": ["麦克斯：如实填写信息，获取一份通用入门计划。", "Mascota Max: añade datos reales para obtener un plan inicial general.", "Maskottchen Max: Gib ehrliche Angaben für einen allgemeinen Einstiegsplan ein.", "मैक्स: शुरुआती योजना पाने के लिए सही जानकारी दें।", "ماكس: أدخل معلومات دقيقة للحصول على خطة أولية عامة."],
        "Mascot Max: Use slow, controlled practice and stop for sharp pain.": ["麦克斯：缓慢并有控制地练习，出现刺痛时停止。", "Mascota Max: practica despacio y con control; para si sientes dolor agudo.", "Maskottchen Max: Übe langsam und kontrolliert. Höre bei stechendem Schmerz auf.", "मैक्स: धीरे और नियंत्रण से अभ्यास करें। तेज़ दर्द हो तो रुकें।", "ماكس: تدرب ببطء وتحكم، وتوقف عند الألم الحاد."],
        "Mascot Max: Keep water nearby and move at a comfortable pace.": ["麦克斯：把水放在身边，以舒适的速度运动。", "Mascota Max: ten agua cerca y muévete a un ritmo cómodo.", "Maskottchen Max: Halte Wasser bereit und bewege dich in angenehmem Tempo.", "मैक्स: पानी पास रखें और आरामदायक गति से चलें।", "ماكس: احتفظ بالماء وتحرك بوتيرة مريحة."],
        "Mascot Max: Pick a game and give your eyes and fingers a fun challenge.": ["麦克斯：选一个游戏，让眼睛和手指来挑战一下。", "Mascota Max: elige un juego y reta a tus ojos y dedos.", "Maskottchen Max: Wähle ein Spiel und fordere Augen und Finger heraus.", "मैक्स: खेल चुनें और आँखों व उँगलियों को चुनौती दें।", "ماكس: اختر لعبة وتحدّ عينيك وأصابعك."],
        "Mascot Max: Small goals add up. Try a goal you can finish today.": ["麦克斯：小目标也会积少成多。试试今天能完成的目标。", "Mascota Max: los pequeños objetivos suman. Elige uno que puedas terminar hoy.", "Maskottchen Max: Kleine Ziele summieren sich. Wähle eines, das du heute schaffst.", "मैक्स: छोटे लक्ष्य भी मायने रखते हैं। आज पूरा होने वाला लक्ष्य चुनें।", "ماكس: الأهداف الصغيرة تتراكم. اختر هدفًا يمكنك إنجازه اليوم."],
        "Mascot Max: Serious symptoms need a parent or health professional.": ["麦克斯：出现严重症状时，请告诉家长或医疗专业人员。", "Mascota Max: los síntomas graves requieren ayuda de un adulto o profesional de salud.", "Maskottchen Max: Bei ernsten Symptomen brauchst du eine erwachsene Vertrauensperson oder medizinische Hilfe.", "मैक्स: गंभीर लक्षणों पर माता-पिता या स्वास्थ्य विशेषज्ञ से मदद लें।", "ماكس: الأعراض الخطيرة تتطلب مساعدة ولي الأمر أو مختص صحي."],
        "Mascot Max: Choose colors and shade that feel easy to see.": ["麦克斯：选择看起来清晰舒适的颜色和色调。", "Mascota Max: elige colores y tonos que sean cómodos para la vista.", "Maskottchen Max: Wähle gut erkennbare Farben und einen angenehmen Farbton.", "मैक्स: ऐसे रंग और शेड चुनें जो देखने में आरामदायक हों।", "ماكس: اختر ألوانًا ودرجة سطوع مريحة للعين."],
        "Mascot Max: Good try! Wait for the cactus, then jump with one clean tap.": ["麦克斯：不错！等仙人掌靠近，再按一次跳跃。", "Mascota Max: ¡Buen intento! Espera al cactus y salta con un toque.", "Maskottchen Max: Guter Versuch! Warte auf den Kaktus und springe mit einem Tippen.", "मैक्स: अच्छा प्रयास! कैक्टस आने दें, फिर एक बार दबाकर कूदें।", "ماكس: محاولة جيدة! انتظر الصبار ثم اقفز بلمسة واحدة."],
        "Mascot Max: You crossed the trail. Try wider turns next time.": ["麦克斯：撞到自己的身体了。下次转弯时留出更多空间。", "Mascota Max: chocaste con tu cuerpo. Deja más espacio al girar.", "Maskottchen Max: Du hast deinen eigenen Weg gekreuzt. Lass beim nächsten Mal mehr Platz.", "मैक्स: आप अपनी ही पूँछ से टकरा गए। अगली बार मोड़ के लिए जगह रखें।", "ماكس: اصطدمت بجسمك. اترك مساحة أكبر عند الانعطاف."],
        "Mascot Max: Twenty targets complete. That was a focused hand-eye workout!": ["麦克斯：完成 20 个目标！你的手眼协调力很棒！", "Mascota Max: ¡Has acertado 20 objetivos! Buen ejercicio de coordinación.", "Maskottchen Max: Zwanzig Ziele geschafft! Ein tolles Training für die Hand-Augen-Koordination.", "मैक्स: बीस लक्ष्य पूरे! हाथ और आँखों का अच्छा अभ्यास हुआ।", "ماكس: أكملت عشرين هدفًا! تدريب رائع للتنسيق بين اليد والعين."],
        "Mascot Max: Fullscreen is not available in this browser. You can still play here.": ["麦克斯：此浏览器不支持全屏，但你仍可以在这里玩。", "Mascota Max: este navegador no permite pantalla completa. Puedes jugar aquí igualmente.", "Maskottchen Max: Dieser Browser unterstützt keinen Vollbildmodus. Du kannst hier weiterspielen.", "मैक्स: इस ब्राउज़र में फ़ुलस्क्रीन उपलब्ध नहीं है। आप यहीं खेल सकते हैं।", "ماكس: ملء الشاشة غير متاح في هذا المتصفح، ويمكنك اللعب هنا."],
        "Exit fullscreen": ["退出全屏", "Salir de pantalla completa", "Vollbild beenden", "फ़ुलस्क्रीन से बाहर", "إنهاء ملء الشاشة"],
        "Fullscreen": ["全屏", "Pantalla completa", "Vollbild", "फ़ुलस्क्रीन", "ملء الشاشة"],
        "Score": ["得分", "Puntuación", "Punktzahl", "स्कोर", "النتيجة"],
        "Targets": ["目标", "Objetivos", "Ziele", "लक्ष्य", "الأهداف"],
        "Your reaction time": ["你的反应时间", "Tu tiempo de reacción", "Deine Reaktionszeit", "आपका प्रतिक्रिया समय", "زمن رد فعلك"],
        "ms": ["毫秒", "ms", "ms", "मिलीसेकंड", "مللي ثانية"],
        "minutes": ["分钟", "minutos", "Minuten", "मिनट", "دقيقة"],
        "XP": ["经验值", "PX", "EP", "XP", "نقاط خبرة"],
        "Open": ["打开", "Abrir", "Öffnen", "खोलें", "فتح"],
        "Mover": ["活力者", "Activo", "Aktiv", "सक्रिय", "نشيط"],
        "Power Star": ["力量之星", "Estrella de fuerza", "Kraftstern", "पावर स्टार", "نجم القوة"],
        "Champion": ["冠军", "Campeón", "Champion", "चैंपियन", "بطل"],
        "Stopwatch": ["秒表", "Cronómetro", "Stoppuhr", "स्टॉपवॉच", "ساعة إيقاف"],
        "Recommended exercise time:": ["建议运动时长：", "Duración recomendada del ejercicio:", "Empfohlene Übungsdauer:", "सुझाया गया व्यायाम समय:", "مدة التمرين الموصى بها:"],
        "Recommended rest:": ["建议休息时间：", "Descanso recomendado:", "Empfohlene Pause:", "सुझाया गया विश्राम:", "وقت الراحة الموصى به:"],
        "seconds": ["秒", "segundos", "Sekunden", "सेकंड", "ثوانٍ"]
      };

      const translations = Object.fromEntries(localeOrder.map((locale) => [locale, {}]));
      Object.entries(translationRows).forEach(([english, values]) => {
        values.forEach((translation, index) => {
          translations[localeOrder[index]][english] = translation;
        });
      });
      const additionalTranslationRows = {
        "Totally Accurate Workout Simulator": ["Simulateur d'entraînement parfaitement exact", "完全に正確なワークアウトシミュレーター", "Совершенно точный симулятор тренировок", "Simulator Latihan yang Sangat Akurat"],
        "WORKOUT HQ": ["CENTRE D'ENTRAÎNEMENT", "ワークアウト本部", "ЦЕНТР ТРЕНИРОВОК", "PUSAT LATIHAN"],
        "Language": ["Langue", "言語", "Язык", "Bahasa"],
        "Level progress": ["Progression de niveau", "レベルの進行状況", "Прогресс уровня", "Progres level"],
        "Reset rank": ["Réinitialiser le rang", "ランクをリセット", "Сбросить ранг", "Atur ulang peringkat"],
        "Reset your rank and all saved XP?": ["Réinitialiser votre rang et tous les XP enregistrés ?", "ランクと保存済みのXPをすべてリセットしますか？", "Сбросить ранг и весь сохранённый опыт?", "Atur ulang peringkat dan semua XP yang tersimpan?"],
        "App sections": ["Sections de l'application", "アプリのセクション", "Разделы приложения", "Bagian aplikasi"],
        "Mascot helper": ["Assistant mascotte", "マスコットヘルパー", "Помощник-маскот", "Asisten maskot"],
        "Changing workout panorama": ["Panorama d'entraînement modifiable", "切り替え可能なワークアウト風景", "Сменная панорама тренировок", "Panorama latihan yang dapat diganti"],
        "Change panorama": ["Changer le panorama", "風景を変更", "Сменить панораму", "Ganti panorama"],
        "English": ["Anglais", "英語", "Английский", "Inggris"],
        "Chinese": ["Chinois", "中国語", "Китайский", "Mandarin"],
        "Spanish": ["Espagnol", "スペイン語", "Испанский", "Spanyol"],
        "German": ["Allemand", "ドイツ語", "Немецкий", "Jerman"],
        "Hindi": ["Hindi", "ヒンディー語", "Хинди", "Hindi"],
        "Arabic": ["Arabe", "アラビア語", "Арабский", "Arab"],
        "French": ["Français", "フランス語", "Французский", "Prancis"],
        "Japanese": ["Japonais", "日本語", "Японский", "Jepang"],
        "Russian": ["Russe", "ロシア語", "Русский", "Rusia"],
        "Indonesian": ["Indonésien", "インドネシア語", "Индонезийский", "Indonesia"],
        "Rookie": ["Débutant", "初心者", "Новичок", "Pemula"],
        "Change view": ["Changer de vue", "表示を変更", "Сменить вид", "Ganti tampilan"],
        "My Plan": ["Mon programme", "マイプラン", "Мой план", "Rencana Saya"],
        "Exercise Guide": ["Guide des exercices", "エクササイズガイド", "Справочник упражнений", "Panduan Latihan"],
        "Workout": ["Entraînement", "ワークアウト", "Тренировка", "Latihan"],
        "Mini Games": ["Mini-jeux", "ミニゲーム", "Мини-игры", "Mini Game"],
        "Places": ["Lieux", "場所", "Места", "Tempat"],
        "Goals": ["Objectifs", "目標", "Цели", "Target"],
        "Health Risks": ["Risques pour la santé", "健康上のリスク", "Риски для здоровья", "Risiko Kesehatan"],
        "Settings": ["Paramètres", "設定", "Настройки", "Pengaturan"],
        "Build your plan": ["Créez votre programme", "プランを作成", "Составьте план", "Buat Rencana"],
        "Optional inputs. Everything stays on this device.": ["Les informations sont facultatives et restent sur cet appareil.", "入力は任意です。情報はこの端末に保存されます。", "Поля необязательны. Все данные остаются на этом устройстве.", "Isian bersifat opsional. Semua data tetap di perangkat ini."],
        "Age": ["Âge", "年齢", "Возраст", "Usia"],
        "For example 14": ["Par exemple 14", "例: 14", "Например, 14", "Contoh 14"],
        "Height (cm)": ["Taille (cm)", "身長 (cm)", "Рост (см)", "Tinggi (cm)"],
        "Weight (kg)": ["Poids (kg)", "体重 (kg)", "Вес (кг)", "Berat (kg)"],
        "Current activity": ["Activité actuelle", "現在の運動量", "Текущая активность", "Aktivitas saat ini"],
        "Mostly inactive": ["Plutôt inactif", "ほとんど運動しない", "Почти неактивный", "Jarang beraktivitas"],
        "Some activity": ["Un peu actif", "少し運動する", "Умеренно активный", "Cukup aktif"],
        "Very active": ["Très actif", "とても活発", "Очень активный", "Sangat aktif"],
        "Goal": ["Objectif", "目標", "Цель", "Tujuan"],
        "General fitness": ["Forme générale", "全身の健康", "Общая физическая форма", "Kebugaran umum"],
        "Build strength": ["Développer la force", "筋力をつける", "Развить силу", "Membangun kekuatan"],
        "Build endurance": ["Développer l'endurance", "持久力をつける", "Развить выносливость", "Membangun daya tahan"],
        "Suggested session length": ["Durée suggérée de la séance", "おすすめの運動時間", "Рекомендуемая длительность занятия", "Durasi sesi yang disarankan"],
        "15 minutes": ["15 minutes", "15分", "15 минут", "15 menit"],
        "25 minutes": ["25 minutes", "25分", "25 минут", "25 menit"],
        "40 minutes": ["40 minutes", "40分", "40 минут", "40 menit"],
        "Create My Plan": ["Créer mon programme", "プランを作成", "Создать мой план", "Buat Rencana Saya"],
        "Delete plan": ["Supprimer le programme", "プランを削除", "Удалить план", "Hapus rencana"],
        "Your plan": ["Votre programme", "あなたのプラン", "Ваш план", "Rencana Anda"],
        "Add a few details and create a starter plan.": ["Ajoutez quelques détails pour créer un programme de départ.", "情報を入力して、最初のプランを作成しましょう。", "Добавьте немного информации, чтобы создать начальный план.", "Tambahkan beberapa detail untuk membuat rencana awal."],
        "General fitness information only. This app cannot predict illnesses or lifespan. Ask a parent or trusted health professional before starting a new routine.": ["Informations générales sur la forme physique uniquement. Cette application ne prédit ni les maladies ni l'espérance de vie. Demandez conseil à un parent ou à un professionnel de santé de confiance avant de commencer.", "一般的な体力づくりの情報です。このアプリは病気や寿命を予測できません。新しい運動を始める前に、保護者または信頼できる医療専門家に相談してください。", "Только общая информация о физической форме. Приложение не предсказывает болезни или продолжительность жизни. Перед началом занятий посоветуйтесь с родителем или медицинским специалистом.", "Informasi kebugaran umum saja. Aplikasi ini tidak dapat memprediksi penyakit atau harapan hidup. Tanyakan kepada orang tua atau tenaga kesehatan tepercaya sebelum memulai rutinitas baru."],
        "How to move safely": ["Comment bouger en toute sécurité", "安全な動き方", "Как двигаться безопасно", "Cara bergerak dengan aman"],
        "Bodyweight squat": ["Squat au poids du corps", "自重スクワット", "Приседания с собственным весом", "Jongkok dengan berat badan"],
        "Wall push-up": ["Pompe contre un mur", "壁腕立て伏せ", "Отжимания от стены", "Push-up di dinding"],
        "Easy marching": ["Marche sur place facile", "ゆっくりその場足踏み", "Лёгкий марш на месте", "Jalan di tempat dengan santai"],
        "Bird dog": ["Exercice du chien-oiseau", "バードドッグ", "Упражнение «птица-собака»", "Latihan bird dog"],
        "Standing calf raise": ["Élévation des mollets debout", "立った状態でのカーフレイズ", "Подъём на носки стоя", "Angkat tumit sambil berdiri"],
        "Gentle stretch": ["Étirement doux", "ゆっくりしたストレッチ", "Мягкая растяжка", "Peregangan ringan"],
        "Watch a form video": ["Regarder une vidéo de démonstration", "フォーム動画を見る", "Посмотреть видео с техникой", "Tonton video gerakan"],
        "Review a practice video": ["Regarder une vidéo d'entraînement", "練習動画を確認", "Просмотреть видео тренировки", "Tinjau video latihan"],
        "CURRENT SESSION": ["SÉANCE EN COURS", "現在のセッション", "ТЕКУЩАЯ ТРЕНИРОВКА", "SESI SAAT INI"],
        "Press start when you are ready.": ["Appuyez sur Démarrer quand vous êtes prêt.", "準備ができたら開始を押してください。", "Нажмите «Старт», когда будете готовы.", "Tekan Mulai saat siap."],
        "Start": ["Démarrer", "開始", "Старт", "Mulai"],
        "Pause": ["Pause", "一時停止", "Пауза", "Jeda"],
        "Reset": ["Réinitialiser", "リセット", "Сбросить", "Atur ulang"],
        "Coach & sounds": ["Conseils et sons", "コーチとサウンド", "Советы и звуки", "Panduan & Suara"],
        "Ambient sound": ["Sons d'ambiance", "環境音", "Фоновые звуки", "Suara latar"],
        "Off": ["Désactivé", "オフ", "Выкл.", "Nonaktif"],
        "Soft rain": ["Pluie douce", "小雨", "Лёгкий дождь", "Hujan rintik"],
        "Ocean waves": ["Vagues de l'océan", "波の音", "Океанские волны", "Ombak laut"],
        "Forest ambience": ["Ambiance de forêt", "森の環境音", "Звуки леса", "Suasana hutan"],
        "Wind": ["Vent", "風", "Ветер", "Angin"],
        "Cafe ambience": ["Ambiance de café", "カフェの環境音", "Звуки кафе", "Suasana kafe"],
        "Ambient music": ["Musique d'ambiance", "環境音楽", "Фоновая музыка", "Musik latar"],
        "Coach tip": ["Conseil du coach", "コーチのヒント", "Совет тренера", "Tips pelatih"],
        "Next tip": ["Conseil suivant", "次のヒント", "Следующий совет", "Tips berikutnya"],
        "Quick reaction break": ["Petite pause réflexe", "反射神経ミニゲーム", "Короткая проверка реакции", "Jeda reaksi cepat"],
        "When the button turns green, tap it as quickly as you can.": ["Quand le bouton devient vert, appuyez dessus aussi vite que possible.", "ボタンが緑色になったら、できるだけ早くタップしてください。", "Когда кнопка станет зелёной, нажмите на неё как можно быстрее.", "Saat tombol berubah hijau, ketuk secepat mungkin."],
        "Wait...": ["Attendez...", "待って...", "Ждите...", "Tunggu..."],
        "Tap when it turns green!": ["Appuyez quand il devient vert !", "緑色になったらタップ！", "Нажмите, когда станет зелёным!", "Ketuk saat berubah hijau!"],
        "Start a round to test your reaction.": ["Lancez une manche pour tester vos réflexes.", "ラウンドを開始して反応速度を試しましょう。", "Начните раунд, чтобы проверить реакцию.", "Mulai ronde untuk menguji reaksi."],
        "Start round": ["Lancer une manche", "ラウンド開始", "Начать раунд", "Mulai ronde"],
        "Start a round after or during a workout.": ["Lancez une manche après ou pendant une séance.", "ワークアウトの前後または途中にラウンドを始めましょう。", "Начните раунд после тренировки или во время неё.", "Mulai ronde setelah atau saat latihan."],
        "Mini games": ["Mini-jeux", "ミニゲーム", "Мини-игры", "Mini Game"],
        "Use the mouse, touch, or arrow keys where shown. The mascot has a tip for each game.": ["Utilisez la souris, l'écran tactile ou les flèches indiquées. La mascotte donne un conseil pour chaque jeu.", "表示されたゲームではマウス、タッチ、矢印キーを使います。マスコットが各ゲームのヒントを教えます。", "Используйте мышь, сенсорный экран или стрелки, если они указаны. Маскот подскажет для каждой игры.", "Gunakan mouse, layar sentuh, atau tombol panah sesuai petunjuk. Maskot memberi tips untuk setiap game."],
        "Dino runner": ["Course du dinosaure", "恐竜ランナー", "Забег динозавра", "Lari Dinosaurus"],
        "Dino runner game": ["Jeu de course du dinosaure", "恐竜ランナーゲーム", "Игра «Забег динозавра»", "Game Lari Dinosaurus"],
        "Cloud Glider": ["Planeur des nuages", "クラウドグライダー", "Облачный планёр", "Peluncur Awan"],
        "Cloud Glider game": ["Jeu Planeur des nuages", "クラウドグライダーゲーム", "Игра «Облачный планёр»", "Game Peluncur Awan"],
        "Tap or press Space to glide through the gates.": ["Appuyez ou utilisez la barre d'espace pour passer entre les portes.", "タップまたはスペースキーでゲートの間を飛び抜けます。", "Нажимайте или жмите пробел, чтобы пролетать через ворота.", "Ketuk atau tekan Spasi untuk meluncur melewati gerbang."],
        "Glider game over! Press Start / Glide to try again.": ["Partie terminée ! Appuyez sur Démarrer / Voler pour réessayer.", "ゲームオーバー！「開始 / 滑空」を押して再挑戦。", "Игра окончена! Нажмите «Старт / полёт», чтобы попробовать снова.", "Game selesai! Tekan Mulai / Meluncur untuk mencoba lagi."],
        "Start / Glide": ["Démarrer / Voler", "開始 / 滑空", "Старт / полёт", "Mulai / Meluncur"],
        "Score: 0": ["Score : 0", "スコア: 0", "Счёт: 0", "Skor: 0"],
        "Runs": ["Courses", "得点", "Ран", "Poin"],
        "Hits": ["Coups", "ヒット", "Удары", "Pukulan"],
        "Baseball batting": ["Batteur de baseball", "野球バッティング", "Бейсбольный удар", "Pukul Bisbol"],
        "Start a game, then swing when the pitch reaches the plate.": ["Lancez une partie, puis frappez quand la balle arrive au marbre.", "ゲームを開始し、ボールがホームベースに届いたらスイングします。", "Начните игру и ударьте, когда мяч долетит до базы.", "Mulai game, lalu ayunkan tongkat saat bola tiba di home plate."],
        "Start game": ["Lancer la partie", "ゲーム開始", "Начать игру", "Mulai game"],
        "Next pitch": ["Lancer suivant", "次の投球", "Следующая подача", "Lemparan berikutnya"],
        "Play again": ["Rejouer", "もう一度プレイ", "Играть снова", "Main lagi"],
        "Swing!": ["Frappez !", "スイング！", "Бейте!", "Pukul!"],
        "Start / Jump": ["Démarrer / Sauter", "開始 / ジャンプ", "Старт / прыжок", "Mulai / Lompat"],
        "Snake": ["Serpent", "スネーク", "Змейка", "Ular"],
        "Minesweeper": ["Démineur", "マインスイーパー", "Сапёр", "Minesweeper"],
        "Retro maze": ["Labyrinthe rétro", "レトロ迷路", "Ретро-лабиринт", "Labirin Retro"],
        "Reaction time": ["Temps de réaction", "反応時間", "Время реакции", "Waktu reaksi"],
        "Find the safe squares. Numbers show nearby mines.": ["Trouvez les cases sûres. Les chiffres indiquent les mines voisines.", "安全なマスを見つけましょう。数字は周囲の地雷の数です。", "Найдите безопасные клетки. Числа показывают количество соседних мин.", "Temukan kotak aman. Angka menunjukkan jumlah ranjau di sekitarnya."],
        "New board": ["Nouvelle grille", "新しい盤面", "Новое поле", "Papan baru"],
        "Start maze": ["Démarrer le labyrinthe", "迷路を開始", "Начать лабиринт", "Mulai labirin"],
        "Use arrow keys or WASD to collect dots and avoid the ghost.": ["Utilisez les flèches ou WASD pour ramasser les points et éviter le fantôme.", "矢印キーまたはWASDでドットを集め、ゴーストを避けます。", "Собирайте точки стрелками или WASD и избегайте призрака.", "Gunakan tombol panah atau WASD untuk mengambil titik dan menghindari hantu."],
        "Add goal": ["Ajouter un objectif", "目標を追加", "Добавить цель", "Tambah target"],
        "Done": ["Terminé", "完了", "Готово", "Selesai"],
        "Undo": ["Annuler", "元に戻す", "Отменить", "Urungkan"],
        "Remove": ["Supprimer", "削除", "Удалить", "Hapus"],
        "Health, illness & injury risks": ["Risques pour la santé, les maladies et les blessures", "健康・病気・けがのリスク", "Риски для здоровья, болезней и травм", "Risiko Kesehatan, Penyakit & Cedera"],
        "When to get help": ["Quand demander de l'aide", "助けを求めるタイミング", "Когда обратиться за помощью", "Kapan harus mencari bantuan"],
        "Page shade": ["Luminosité de la page", "ページの明るさ", "Яркость страницы", "Kecerahan halaman"],
        "Page zoom": ["Zoom de la page", "ページの拡大率", "Масштаб страницы", "Zoom halaman"],
        "Day": ["Jour", "昼", "День", "Siang"],
        "Sunset": ["Coucher de soleil", "夕暮れ", "Закат", "Senja"],
        "Night": ["Nuit", "夜", "Ночь", "Malam"],
        "Match the time": ["Selon l'heure", "時間に合わせる", "Как сейчас", "Ikuti waktu"],
        "Accent color": ["Couleur d'accentuation", "アクセントカラー", "Цвет акцента", "Warna aksen"],
        "Reset colors": ["Réinitialiser les couleurs", "色をリセット", "Сбросить цвета", "Atur ulang warna"],
        "Mascot Max": ["Mascotte Max", "マスコットのマックス", "Маскот Макс", "Maskot Max"],
        "Suggested session:": ["Séance suggérée :", "おすすめのセッション:", "Рекомендуемая тренировка:", "Sesi yang disarankan:"],
        "not calculated": ["non calculé", "未計算", "не рассчитано", "belum dihitung"],
        "below 18.5": ["moins de 18,5", "18.5未満", "ниже 18,5", "di bawah 18,5"],
        "between 18.5 and 24.9": ["entre 18,5 et 24,9", "18.5〜24.9", "от 18,5 до 24,9", "antara 18,5 dan 24,9"],
        "between 25 and 29.9": ["entre 25 et 29,9", "25〜29.9", "от 25 до 29,9", "antara 25 dan 29,9"],
        "30 or higher": ["30 ou plus", "30以上", "30 или выше", "30 atau lebih"],
        "Easy marching - 5 minutes": ["Marche facile - 5 minutes", "ゆっくり足踏み - 5分", "Лёгкий марш на месте — 5 минут", "Jalan santai di tempat - 5 menit"],
        "Squats - 2 sets of 8 reps": ["Squats - 2 séries de 8 répétitions", "スクワット - 8回を2セット", "Приседания — 2 подхода по 8 повторений", "Jongkok - 2 set, 8 repetisi"],
        "Wall push-ups - 2 sets of 8 reps": ["Pompes au mur - 2 séries de 8 répétitions", "壁腕立て伏せ - 8回を2セット", "Отжимания от стены — 2 подхода по 8 повторений", "Push-up di dinding - 2 set, 8 repetisi"],
        "Cool down stretch - 3 minutes": ["Étirements de récupération - 3 minutes", "クールダウンストレッチ - 3分", "Заминка с растяжкой — 3 минуты", "Peregangan pendinginan - 3 menit"],
        "Warm-up - 5 minutes": ["Échauffement - 5 minutes", "ウォームアップ - 5分", "Разминка — 5 минут", "Pemanasan - 5 menit"],
        "Slow squats - 3 sets of 8 reps": ["Squats lents - 3 séries de 8 répétitions", "ゆっくりスクワット - 8回を3セット", "Медленные приседания — 3 подхода по 8 повторений", "Jongkok perlahan - 3 set, 8 repetisi"],
        "Wall push-ups - 3 sets of 8 reps": ["Pompes au mur - 3 séries de 8 répétitions", "壁腕立て伏せ - 8回を3セット", "Отжимания от стены — 3 подхода по 8 повторений", "Push-up di dinding - 3 set, 8 repetisi"],
        "Calf raises - 2 sets of 10 reps": ["Élévations des mollets - 2 séries de 10 répétitions", "カーフレイズ - 10回を2セット", "Подъёмы на носки — 2 подхода по 10 повторений", "Angkat tumit - 2 set, 10 repetisi"],
        "Easy marching - 8 minutes": ["Marche facile - 8 minutes", "ゆっくり足踏み - 8分", "Лёгкий марш на месте — 8 минут", "Jalan santai di tempat - 8 menit"],
        "Squats - 2 sets of 10 reps": ["Squats - 2 séries de 10 répétitions", "スクワット - 10回を2セット", "Приседания — 2 подхода по 10 повторений", "Jongkok - 2 set, 10 repetisi"],
        "Marching intervals - 6 minutes": ["Intervalles de marche sur place - 6 minutes", "足踏みインターバル - 6分", "Интервальная ходьба на месте — 6 минут", "Jalan interval di tempat - 6 menit"],
        "Easy stretch - 3 minutes": ["Étirements faciles - 3 minutes", "軽いストレッチ - 3分", "Лёгкая растяжка — 3 минуты", "Peregangan ringan - 3 menit"],
        "EXERCISE TIMER": ["MINUTEUR D'EXERCICE", "エクササイズタイマー", "ТАЙМЕР УПРАЖНЕНИЙ", "TIMER LATIHAN"],
        "Time one exercise at a time": ["Chronométrez un exercice à la fois", "一度に1つの運動を計測", "Засекайте время для одного упражнения", "Atur waktu satu latihan sekaligus"],
        "Exercise to time": ["Exercice à chronométrer", "計測する運動", "Упражнение для таймера", "Latihan yang akan diatur waktunya"],
        "Time for this exercise": ["Durée de cet exercice", "この運動の時間", "Время для этого упражнения", "Waktu untuk latihan ini"],
        "Create a plan first": ["Créez d'abord un programme", "先にプランを作成してください", "Сначала создайте план", "Buat rencana terlebih dahulu"],
        "30 seconds": ["30 secondes", "30秒", "30 секунд", "30 detik"],
        "1 minute": ["1 minute", "1分", "1 минута", "1 menit"],
        "Create a plan to choose an exercise.": ["Créez un programme pour choisir un exercice.", "プランを作成すると運動を選べます。", "Создайте план, чтобы выбрать упражнение.", "Buat rencana untuk memilih latihan."],
        "Press start to time this exercise.": ["Appuyez sur Démarrer pour chronométrer cet exercice.", "開始を押してこの運動の計測を始めます。", "Нажмите «Старт», чтобы засечь время упражнения.", "Tekan Mulai untuk mengatur waktu latihan ini."],
        "Timing this exercise.": ["Chronométrage de cet exercice.", "この運動を計測中です。", "Время этого упражнения идёт.", "Latihan ini sedang dihitung waktunya."],
        "Exercise timer complete! Great work.": ["Exercice terminé ! Bravo !", "運動完了！よくできました。", "Упражнение завершено! Отличная работа.", "Latihan selesai! Kerja bagus."],
        "Workout in progress.": ["Entraînement en cours.", "ワークアウト中です。", "Тренировка продолжается.", "Latihan sedang berlangsung."],
        "Workout complete! Great work.": ["Entraînement terminé ! Bravo !", "ワークアウト完了！よくできました。", "Тренировка завершена! Отличная работа.", "Latihan selesai! Kerja bagus."],
        "Paused.": ["En pause.", "一時停止中。", "Пауза.", "Dijeda."],
        "Get ready...": ["Préparez-vous...", "準備してください...", "Приготовьтесь...", "Bersiap..."],
        "GO!": ["PARTEZ !", "スタート！", "ВПЕРЁД!", "MULAI!"],
        "Too soon! Try another round.": ["Trop tôt ! Réessayez.", "早すぎます！もう一度試してください。", "Слишком рано! Попробуйте ещё раз.", "Terlalu cepat! Coba ronde lagi."],
        "Nice!": ["Bien joué !", "いいですね！", "Отлично!", "Bagus!"],
        "Score": ["Score", "スコア", "Счёт", "Skor"],
        "Targets": ["Cibles", "ターゲット", "Цели", "Target"],
        "Your reaction time": ["Votre temps de réaction", "反応時間", "Ваше время реакции", "Waktu reaksi Anda"],
        "ms": ["ms", "ミリ秒", "мс", "ms"],
        "minutes": ["minutes", "分", "минут", "menit"],
        "XP": ["XP", "XP", "опыта", "XP"],
        "Fullscreen": ["Plein écran", "全画面", "Полный экран", "Layar penuh"],
        "Exit fullscreen": ["Quitter le plein écran", "全画面表示を終了", "Выйти из полноэкранного режима", "Keluar dari layar penuh"],
        "Search ready": ["Recherche prête", "検索の準備完了", "Поиск готов", "Pencarian siap"],
        "Game over! Final score:": ["Partie terminée ! Score final :", "ゲームオーバー！最終スコア:", "Игра окончена! Итоговый счёт:", "Game selesai! Skor akhir:"],
        "Mines left": ["Mines restantes", "残りの地雷", "Мин осталось", "Sisa ranjau"],
        "Adjacent mines": ["Mines voisines", "周囲の地雷", "Соседние мины", "Ranjau di sekitar"],
        "Open": ["Ouvrir", "開く", "Открыть", "Buka"],
        "Mover": ["Actif", "アクティブ", "Активный", "Aktif"],
        "Power Star": ["Étoile de puissance", "パワースター", "Звезда силы", "Bintang Kekuatan"],
        "Champion": ["Champion", "チャンピオン", "Чемпион", "Juara"],
        "Stopwatch": ["Chronomètre", "ストップウォッチ", "Секундомер", "Stopwatch"],
        "Recommended exercise time:": ["Durée d'exercice recommandée :", "おすすめの運動時間:", "Рекомендуемое время упражнения:", "Waktu latihan yang disarankan:"],
        "Recommended rest:": ["Repos recommandé :", "おすすめの休憩時間:", "Рекомендуемый отдых:", "Istirahat yang disarankan:"],
        "seconds": ["secondes", "秒", "секунд", "detik"],
        "Stunts & flips": ["Acrobaties et saltos", "アクロバットと宙返り", "Акробатика и сальто", "Akrobat & salto"],
        "Only try beginner acrobatics with a trained coach, proper mats, and permission from a parent or guardian.": ["N'essayez les mouvements acrobatiques pour débutants qu'avec un entraîneur qualifié, des tapis adaptés et l'autorisation d'un parent ou tuteur.", "初心者向けのアクロバットは、訓練を受けたコーチ、適切なマット、保護者の許可がある場合にのみ行ってください。", "Выполняйте начальные акробатические упражнения только с тренером, на подходящих матах и с разрешения родителя или опекуна.", "Coba akrobat pemula hanya dengan pelatih terlatih, matras yang sesuai, dan izin orang tua atau wali."],
        "Forward roll": ["Roulade avant", "前転", "Кувырок вперёд", "Guling depan"],
        "Learn only on a soft mat with a coach. Tuck the chin, keep the spine rounded, place hands beside the head, and roll smoothly instead of diving.": ["Apprenez uniquement sur un tapis souple avec un entraîneur. Rentrez le menton, arrondissez le dos, placez les mains près de la tête et roulez sans plonger.", "コーチと一緒に柔らかいマットの上で練習してください。あごを引き、背中を丸め、頭の横に手を置いて、飛び込まず滑らかに転がります。", "Учитесь только на мягком мате с тренером. Прижмите подбородок, округлите спину, поставьте руки рядом с головой и перекатывайтесь плавно, не ныряя.", "Berlatih hanya di atas matras empuk bersama pelatih. Tundukkan dagu, bulatkan punggung, letakkan tangan di samping kepala, lalu berguling dengan halus, bukan menyelam."],
        "Cartwheel": ["Roue", "側転", "Колесо", "Meroda"],
        "Start in a lunge on a mat. Place hands down one at a time, kick the legs over sideways, and land with control. Never attempt on hard ground.": ["Commencez en fente sur un tapis. Posez les mains l'une après l'autre, faites passer les jambes sur le côté et atterrissez avec contrôle. N'essayez jamais sur un sol dur.", "マットの上でランジの姿勢から始めます。手を一つずつつき、脚を横に蹴り上げ、安定して着地します。硬い地面では絶対に行わないでください。", "Начните с выпада на мате. Ставьте руки по одной, переносите ноги в сторону и приземляйтесь контролируемо. Никогда не выполняйте на твёрдой поверхности.", "Mulai dengan posisi lunge di atas matras. Letakkan tangan satu per satu, ayunkan kaki ke samping, lalu mendarat dengan terkendali. Jangan pernah mencobanya di permukaan keras."],
        "Handstand practice": ["Entraînement à l'équilibre sur les mains", "壁を使った倒立練習", "Подготовка к стойке на руках", "Latihan berdiri dengan tangan"],
        "Use a wall and a coach. Start with toes on the floor, walk your feet up gradually, keep breathing, and stop before fatigue or neck strain.": ["Utilisez un mur et faites-vous accompagner par un entraîneur. Commencez avec les orteils au sol, montez progressivement les pieds le long du mur, respirez et arrêtez-vous avant la fatigue ou une tension dans le cou.", "壁とコーチを使ってください。つま先を床につけた状態から始め、少しずつ足を壁に上げます。呼吸を続け、疲れたり首に負担を感じたりする前に止めてください。", "Используйте стену и занимайтесь с тренером. Начните, поставив носки на пол, постепенно поднимайте ноги по стене, дышите и остановитесь до усталости или напряжения в шее.", "Gunakan dinding dan pelatih. Mulai dengan ujung kaki di lantai, naikkan kaki di dinding secara bertahap, tetap bernapas, dan berhenti sebelum lelah atau leher terasa tegang."],
        "Backflip": ["Salto arrière", "後方宙返り", "Сальто назад", "Salto belakang"],
        "Aerial (no-handed cartwheel)": ["Roue sans les mains", "側宙", "Колесо без рук", "Meroda tanpa tangan"],
        "Kick-up to stand": ["Redressement avec impulsion", "キックアップから立ち上がる", "Подъём толчком в стойку", "Bangkit berdiri dengan tendangan"],
        "This can strain wrists, shoulders, back, or neck. Learn it only with a qualified gymnastics coach, proper mats, and guardian approval. Do not practise alone; this page does not teach the movement.": ["Ce mouvement peut solliciter les poignets, les épaules, le dos ou le cou. Apprenez-le uniquement avec un entraîneur de gymnastique qualifié, des tapis adaptés et l'accord d'un parent ou tuteur. Ne vous entraînez pas seul ; cette page n'explique pas le mouvement.", "手首、肩、背中、首に負担がかかることがあります。資格のある体操コーチ、適切なマット、保護者の許可のもとでのみ習ってください。一人で練習しないでください。このページは動作を教えるものではありません。", "Это движение может перегрузить запястья, плечи, спину или шею. Учитесь только с квалифицированным тренером по гимнастике, на подходящих матах и с разрешения родителя или опекуна. Не занимайтесь в одиночку; эта страница не обучает движению.", "Gerakan ini dapat membebani pergelangan tangan, bahu, punggung, atau leher. Pelajari hanya dengan pelatih senam berkualifikasi, matras yang tepat, dan izin wali. Jangan berlatih sendirian; halaman ini tidak mengajarkan gerakannya."],
        "Flips and aerials can cause severe injury. Learn only with a qualified coach, proper mats, and guardian approval—never practise from a video alone.": ["Les saltos et les roues sans les mains peuvent causer de graves blessures. Apprenez uniquement avec un entraîneur qualifié, des tapis adaptés et l'accord d'un parent ou tuteur ; ne vous entraînez jamais seul à partir d'une vidéo.", "宙返りや側宙は重いけがにつながることがあります。資格のあるコーチ、適切なマット、保護者の許可のもとでのみ習い、動画だけを見て一人で練習しないでください。", "Сальто и колёса без рук могут привести к тяжёлым травмам. Учитесь только с квалифицированным тренером, на подходящих матах и с разрешения родителя или опекуна — никогда не тренируйтесь в одиночку по видео.", "Salto dan meroda tanpa tangan dapat menyebabkan cedera serius. Pelajari hanya bersama pelatih berkualifikasi, dengan matras yang tepat, dan izin wali—jangan pernah berlatih sendiri hanya dari video."],
        "High-risk tumbling skill. Learn only in a proper gymnastics facility with a qualified coach, crash mats, and guardian approval. Never try from online instructions, at home, or on hard ground.": ["Mouvement acrobatique à haut risque. Apprenez-le uniquement dans une salle de gymnastique adaptée, avec un entraîneur qualifié, des tapis de réception et l'accord d'un parent ou tuteur. N'essayez jamais de le faire à la maison, sur un sol dur ou en suivant des instructions en ligne.", "危険度の高いタンブリング技です。設備の整った体操施設で、資格のあるコーチと安全マット、保護者の許可のもとでのみ習ってください。ネットの説明を見て、自宅や硬い地面で試さないでください。", "Это опасный акробатический элемент. Учитесь только в оборудованном гимнастическом зале с квалифицированным тренером, страховочными матами и разрешением родителя или опекуна. Не пробуйте дома, на твёрдой поверхности или по интернет-инструкциям.", "Ini gerakan akrobatik berisiko tinggi. Pelajari hanya di fasilitas senam yang sesuai bersama pelatih berkualifikasi, matras pengaman, dan izin wali. Jangan mencoba dari petunjuk online, di rumah, atau di permukaan keras."],
        "Advanced skill with serious head, neck, and landing risks. Do not attempt without a qualified gymnastics coach, a safe training facility, mats, and guardian approval. This page does not teach the movement.": ["Mouvement avancé présentant de graves risques pour la tête, le cou et la réception. Ne l'essayez pas sans entraîneur de gymnastique qualifié, salle sécurisée, tapis et accord d'un parent ou tuteur. Cette page n'enseigne pas le mouvement.", "頭、首、着地に重大な危険を伴う上級技です。資格のある体操コーチ、安全な施設、マット、保護者の許可なしに行わないでください。このページは動作を教えるものではありません。", "Это сложный элемент с серьёзным риском травмы головы, шеи и при приземлении. Не выполняйте его без квалифицированного тренера по гимнастике, безопасного зала, матов и разрешения родителя или опекуна. Эта страница не обучает движению.", "Ini gerakan tingkat lanjut dengan risiko serius pada kepala, leher, dan pendaratan. Jangan mencobanya tanpa pelatih senam berkualifikasi, fasilitas latihan yang aman, matras, dan izin wali. Halaman ini tidak mengajarkan gerakannya."],
        "Watch a supervised lesson": ["Regarder un cours encadré", "指導付きのレッスンを見る", "Посмотреть занятие под руководством тренера", "Tonton latihan dengan pengawasan"],
        "Choose a video from this device or record a short clip with your camera, then play it back here.": ["Choisissez une vidéo sur cet appareil ou enregistrez un court extrait avec votre caméra, puis visionnez-le ici.", "この端末から動画を選ぶか、カメラで短い動画を撮影し、ここで再生できます。", "Выберите видео на этом устройстве или снимите короткий ролик камерой, затем просмотрите его здесь.", "Pilih video dari perangkat ini atau rekam klip pendek dengan kamera, lalu putar di sini."],
        "Your video stays in this page on this device. It is not uploaded or saved. This app does not have AI video analysis, so ask a qualified coach to check your technique.": ["Votre vidéo reste sur cette page et cet appareil. Elle n'est ni envoyée ni enregistrée. Cette application n'analyse pas les vidéos avec l'IA ; demandez à un entraîneur qualifié de vérifier votre technique.", "動画はこの端末上のページ内にとどまり、アップロードも保存もされません。このアプリにAI動画分析機能はありません。フォームは資格のあるコーチに確認してもらいましょう。", "Видео остаётся на этой странице и устройстве. Оно не загружается и не сохраняется. В приложении нет ИИ-анализа видео, поэтому попросите квалифицированного тренера проверить технику.", "Video tetap di halaman ini pada perangkat ini. Video tidak diunggah atau disimpan. Aplikasi ini tidak memiliki analisis video AI, jadi mintalah pelatih berkualifikasi memeriksa teknik Anda."],
        "Choose a video from this device": ["Choisir une vidéo sur cet appareil", "この端末から動画を選ぶ", "Выбрать видео на этом устройстве", "Pilih video dari perangkat ini"],
        "Use camera": ["Utiliser la caméra", "カメラを使う", "Использовать камеру", "Gunakan kamera"],
        "Start recording": ["Démarrer l'enregistrement", "録画を開始", "Начать запись", "Mulai merekam"],
        "Stop recording": ["Arrêter l'enregistrement", "録画を停止", "Остановить запись", "Berhenti merekam"],
        "Stop camera": ["Arrêter la caméra", "カメラを停止", "Выключить камеру", "Matikan kamera"],
        "Clear video": ["Effacer la vidéo", "動画をクリア", "Очистить видео", "Hapus video"],
        "Choose a clip or start the camera. Camera access needs your permission.": ["Choisissez une vidéo ou démarrez la caméra. Vous devez autoriser l'accès à la caméra.", "動画を選ぶかカメラを起動してください。カメラへのアクセス許可が必要です。", "Выберите ролик или включите камеру. Для доступа к камере нужно разрешение.", "Pilih klip atau nyalakan kamera. Akses kamera memerlukan izin Anda."],
        "Requesting camera permission...": ["Demande d'autorisation d'accès à la caméra...", "カメラの使用許可を確認しています...", "Запрашиваем разрешение на использование камеры...", "Meminta izin kamera..."],
        "Camera is on. Preview stays on this device. Press start recording when ready.": ["La caméra est activée. L'aperçu reste sur cet appareil. Appuyez sur Démarrer l'enregistrement quand vous êtes prêt.", "カメラが起動しました。プレビューはこの端末にのみ表示されます。準備ができたら録画を開始してください。", "Камера включена. Предпросмотр остаётся на этом устройстве. Нажмите «Начать запись», когда будете готовы.", "Kamera aktif. Pratinjau tetap di perangkat ini. Tekan Mulai merekam saat siap."],
        "Recording... Press stop when you are done.": ["Enregistrement... Appuyez sur Arrêter lorsque vous avez terminé.", "録画中...終わったら停止を押してください。", "Идёт запись... Нажмите «Стоп», когда закончите.", "Merekam... Tekan berhenti setelah selesai."],
        "Clip ready to review. It is only available until you leave or refresh this page.": ["La vidéo est prête à être visionnée. Elle sera disponible jusqu'à ce que vous quittiez ou actualisiez cette page.", "動画を確認できます。このページを離れるか更新するまでのみ利用できます。", "Ролик готов к просмотру. Он доступен, пока вы не покинете или не обновите страницу.", "Klip siap ditinjau. Klip hanya tersedia sampai Anda meninggalkan atau memuat ulang halaman ini."],
        "Video selected. It stays on this device and is not uploaded.": ["Vidéo sélectionnée. Elle reste sur cet appareil et n'est pas envoyée.", "動画を選択しました。この端末にとどまり、アップロードされません。", "Видео выбрано. Оно остаётся на устройстве и не загружается в интернет.", "Video dipilih. Video tetap di perangkat ini dan tidak diunggah."],
        "Camera permission was denied. Allow camera access in your browser settings and try again.": ["L'accès à la caméra a été refusé. Autorisez-le dans les paramètres du navigateur, puis réessayez.", "カメラの使用が拒否されました。ブラウザーの設定でカメラを許可してから、もう一度お試しください。", "В доступе к камере отказано. Разрешите его в настройках браузера и попробуйте снова.", "Izin kamera ditolak. Izinkan akses kamera di pengaturan browser, lalu coba lagi."],
        "Camera is unavailable. Use HTTPS or localhost and check that a camera is connected.": ["La caméra est indisponible. Utilisez HTTPS ou localhost et vérifiez qu'une caméra est connectée.", "カメラを利用できません。HTTPSまたはlocalhostを使い、カメラが接続されているか確認してください。", "Камера недоступна. Используйте HTTPS или localhost и проверьте подключение камеры.", "Kamera tidak tersedia. Gunakan HTTPS atau localhost dan pastikan kamera tersambung."],
        "Could not start the camera. Check browser permissions and try again.": ["Impossible de démarrer la caméra. Vérifiez les autorisations du navigateur et réessayez.", "カメラを起動できませんでした。ブラウザーの権限を確認して、もう一度お試しください。", "Не удалось включить камеру. Проверьте разрешения браузера и попробуйте снова.", "Kamera tidak dapat dinyalakan. Periksa izin browser dan coba lagi."],
        "Camera preview could not start.": ["L'aperçu de la caméra n'a pas pu démarrer.", "カメラのプレビューを開始できませんでした。", "Не удалось запустить предпросмотр камеры.", "Pratinjau kamera tidak dapat dimulai."],
        "Camera stopped.": ["Caméra arrêtée.", "カメラを停止しました。", "Камера выключена.", "Kamera dihentikan."],
        "Your browser does not support video recording. You can still choose a video file.": ["Votre navigateur ne prend pas en charge l'enregistrement vidéo. Vous pouvez tout de même choisir un fichier vidéo.", "お使いのブラウザーは録画に対応していませんが、動画ファイルを選択できます。", "Браузер не поддерживает запись видео. Вы всё равно можете выбрать видеофайл.", "Browser Anda tidak mendukung perekaman video. Anda tetap dapat memilih file video."],
        "Could not record this video. Try another browser or choose a video file.": ["Impossible d'enregistrer cette vidéo. Essayez un autre navigateur ou choisissez un fichier vidéo.", "この動画を録画できませんでした。別のブラウザーを使うか動画ファイルを選んでください。", "Не удалось записать видео. Попробуйте другой браузер или выберите видеофайл.", "Video tidak dapat direkam. Coba browser lain atau pilih file video."],
        "Choose a video file to preview.": ["Choisissez un fichier vidéo à visionner.", "プレビューする動画ファイルを選んでください。", "Выберите видеофайл для просмотра.", "Pilih file video untuk ditinjau."],
        "Video preview cleared.": ["Aperçu vidéo effacé.", "動画のプレビューを消去しました。", "Предпросмотр видео очищен.", "Pratinjau video dihapus."],
        "Play sound": ["Lire le son", "サウンドを再生", "Включить звук", "Putar suara"],
        "Stop sound": ["Arrêter le son", "サウンドを停止", "Остановить звук", "Hentikan suara"],
        "Sound stopped.": ["Son arrêté.", "サウンドを停止しました。", "Звук выключен.", "Suara dihentikan."],
        "Loading sound...": ["Chargement du son...", "サウンドを読み込み中...", "Загрузка звука...", "Memuat suara..."],
        "Sound is playing.": ["Le son est en cours de lecture.", "サウンドを再生中です。", "Звук воспроизводится.", "Suara sedang diputar."],
        "Sound selected. Press play to start.": ["Son sélectionné. Appuyez sur Lire pour démarrer.", "サウンドを選択しました。再生を押して開始します。", "Звук выбран. Нажмите «Воспроизвести», чтобы включить его.", "Suara dipilih. Tekan putar untuk memulai."],
        "Choose a sound and press play. Internet is needed.": ["Choisissez un son et appuyez sur Lire. Une connexion Internet est nécessaire.", "サウンドを選んで再生を押してください。インターネット接続が必要です。", "Выберите звук и нажмите «Воспроизвести». Требуется интернет.", "Pilih suara dan tekan putar. Internet diperlukan."],
        "Could not load sound. Check your internet connection and try again.": ["Impossible de charger le son. Vérifiez votre connexion Internet et réessayez.", "サウンドを読み込めませんでした。インターネット接続を確認して、もう一度お試しください。", "Не удалось загрузить звук. Проверьте подключение к интернету и попробуйте снова.", "Suara tidak dapat dimuat. Periksa koneksi internet dan coba lagi."],
        "Keep a pace that lets you still speak in short sentences.": ["Gardez un rythme qui vous permet encore de parler par courtes phrases.", "短い文で話せるくらいのペースを保ちましょう。", "Двигайтесь в таком темпе, чтобы вы могли говорить короткими фразами.", "Jaga kecepatan agar Anda masih bisa berbicara dalam kalimat pendek."],
        "Use a stable chair or wall nearby for balance.": ["Gardez une chaise stable ou un mur à proximité pour garder l'équilibre.", "バランスを取れるよう、近くに安定した椅子や壁がある場所で行いましょう。", "Для равновесия используйте устойчивый стул или стену поблизости.", "Gunakan kursi kokoh atau dinding di dekat Anda untuk menjaga keseimbangan."],
        "Stop if you feel sharp pain, dizziness, or trouble breathing.": ["Arrêtez-vous en cas de douleur aiguë, de vertige ou de difficulté à respirer.", "鋭い痛み、めまい、息苦しさを感じたら運動を中止してください。", "Остановитесь, если почувствуете резкую боль, головокружение или затруднённое дыхание.", "Berhenti jika merasakan nyeri tajam, pusing, atau kesulitan bernapas."],
        "Breathe out when the movement is hardest.": ["Expirez au moment où le mouvement est le plus difficile.", "動きが最もきついところで息を吐きましょう。", "Выдыхайте в самой трудной части движения.", "Buang napas saat gerakan terasa paling berat."],
        "Move slowly and with control for a safer workout.": ["Bougez lentement et avec contrôle pour vous entraîner plus sûrement.", "安全のため、ゆっくりと動きをコントロールしましょう。", "Двигайтесь медленно и контролируемо, чтобы тренироваться безопаснее.", "Bergeraklah perlahan dan terkendali agar latihan lebih aman."],
        "Aim trainer": ["Entraînement de précision", "エイムトレーナー", "Тренировка меткости", "Latihan Bidik"],
        "Aim trainer game": ["Jeu d'entraînement de précision", "エイムトレーナーゲーム", "Игра на меткость", "Game Latihan Bidik"],
        "Targets: 0 / 20": ["Cibles : 0 / 20", "ターゲット: 0 / 20", "Цели: 0 / 20", "Target: 0 / 20"],
        "Start aim trainer": ["Démarrer l'entraînement de précision", "エイムトレーナーを開始", "Начать тренировку меткости", "Mulai latihan bidik"],
        "Baseball batting timing game": ["Jeu de timing de frappe au baseball", "野球のタイミングバッティングゲーム", "Игра на точность удара в бейсболе", "Game mengatur waktu pukulan bisbol"],
        "Pitch coming! Swing as it reaches the batter.": ["La balle arrive ! Frappez lorsqu'elle atteint le batteur.", "投球が来ます！打者に届いたらスイングしてください。", "Мяч летит! Бейте, когда он долетит до бьющего.", "Bola datang! Ayunkan tongkat saat bola mencapai pemukul."],
        "Strike! Try the next pitch.": ["Prise ! Essayez le prochain lancer.", "ストライク！次の投球を試してください。", "Страйк! Попробуйте отбить следующую подачу.", "Strike! Coba pukulan berikutnya."],
        "Base hit! +1 run.": ["Coup sûr ! +1 point.", "ヒット！+1点。", "Хит! +1 ран.", "Pukulan sah! +1 poin."],
        "Double! +2 runs.": ["Deux bases ! +2 points.", "二塁打！+2点。", "Дабл! +2 рана.", "Pukulan ganda! +2 poin."],
        "Home run! +4 runs.": ["Coup de circuit ! +4 points.", "ホームラン！+4点。", "Хоум-ран! +4 рана.", "Home run! +4 poin."],
        "Game ended when you started another minigame.": ["La partie s'est terminée lorsque vous avez lancé un autre mini-jeu.", "別のミニゲームを開始したため、ゲームを終了しました。", "Игра завершилась, когда вы запустили другую мини-игру.", "Game berakhir saat Anda memulai mini game lain."],
        "Boom! You found a mine. Start a new board.": ["Boum ! Vous avez trouvé une mine. Lancez une nouvelle grille.", "爆発！地雷を踏みました。新しい盤面を始めてください。", "Бум! Вы нашли мину. Начните новую игру.", "Boom! Anda menemukan ranjau. Mulai papan baru."],
        "You cleared the board!": ["Vous avez terminé la grille !", "盤面クリア！", "Вы очистили поле!", "Papan berhasil dibersihkan!"],
        "Empty safe cell": ["Case vide sans danger", "安全な空きマス", "Пустая безопасная клетка", "Kotak kosong yang aman"],
        "Flag mode: off": ["Mode drapeau : désactivé", "旗モード: オフ", "Режим флажка: выкл.", "Mode bendera: nonaktif"],
        "Flag mode: on": ["Mode drapeau : activé", "旗モード: オン", "Режим флажка: вкл.", "Mode bendera: aktif"],
        "Flagged cell": ["Case marquée", "旗を立てたマス", "Отмеченная клетка", "Kotak bertanda"],
        "Mine": ["Mine", "地雷", "Мина", "Ranjau"],
        "Hidden cell": ["Case masquée", "隠れたマス", "Скрытая клетка", "Kotak tersembunyi"],
        "Maze cleared! Great collecting.": ["Labyrinthe terminé ! Belle collecte.", "迷路クリア！よく集めました。", "Лабиринт пройден! Отлично собрали точки.", "Labirin selesai! Hebat, semua titik terkumpul."],
        "The ghost caught you. Start again to retry.": ["Le fantôme vous a attrapé. Recommencez pour réessayer.", "ゴーストに捕まりました。もう一度始めて挑戦しましょう。", "Призрак поймал вас. Начните заново и попробуйте ещё раз.", "Hantu menangkap Anda. Mulai lagi untuk mencoba kembali."],
        "Collect food. The wall and your own tail end the game.": ["Ramassez la nourriture. Le mur et votre propre queue mettent fin à la partie.", "エサを集めましょう。壁や自分のしっぽにぶつかるとゲーム終了です。", "Собирайте еду. Стена и собственный хвост завершают игру.", "Kumpulkan makanan. Dinding dan ekor Anda sendiri mengakhiri permainan."],
        "Game over! You hit the wall.": ["Partie terminée ! Vous avez heurté le mur.", "ゲームオーバー！壁にぶつかりました。", "Игра окончена! Вы врезались в стену.", "Game selesai! Anda menabrak dinding."],
        "Game over! You hit your tail.": ["Partie terminée ! Vous avez heurté votre queue.", "ゲームオーバー！自分のしっぽにぶつかりました。", "Игра окончена! Вы врезались в собственный хвост.", "Game selesai! Anda menabrak ekor sendiri."],
        "Snake minigame": ["Mini-jeu du serpent", "スネークミニゲーム", "Мини-игра «Змейка»", "Mini game Ular"],
        "Start snake": ["Démarrer le serpent", "スネークを開始", "Запустить змейку", "Mulai ular"],
        "Find places nearby": ["Trouver des lieux à proximité", "近くの場所を探す", "Найти места поблизости", "Cari tempat terdekat"],
        "Search food places, gyms, malls, arcades, parks, or another place by typing an area.": ["Saisissez un lieu pour rechercher des restaurants, salles de sport, centres commerciaux, salles d'arcade, parcs ou d'autres endroits.", "地域を入力すると、飲食店、ジム、モール、ゲームセンター、公園などを検索できます。", "Введите район, чтобы найти кафе, спортзалы, торговые центры, игровые залы, парки и другие места.", "Ketik wilayah untuk mencari tempat makan, gym, mal, arcade, taman, atau tempat lainnya."],
        "What are you looking for?": ["Que recherchez-vous ?", "何を探していますか？", "Что вы ищете?", "Apa yang Anda cari?"],
        "Food places and restaurants": ["Restaurants et lieux de restauration", "飲食店・レストラン", "Кафе и рестораны", "Tempat makan dan restoran"],
        "Gyms": ["Salles de sport", "ジム", "Спортзалы", "Gym"],
        "Malls": ["Centres commerciaux", "ショッピングモール", "Торговые центры", "Mal"],
        "Arcades": ["Salles d'arcade", "ゲームセンター", "Игровые залы", "Tempat permainan"],
        "Parks": ["Parcs", "公園", "Парки", "Taman"],
        "Other places": ["Autres lieux", "その他の場所", "Другие места", "Tempat lainnya"],
        "Another kind of place (optional)": ["Un autre type de lieu (facultatif)", "別の種類の場所（任意）", "Другой тип места (необязательно)", "Jenis tempat lain (opsional)"],
        "For example: bookshops or bowling": ["Par exemple : librairies ou bowling", "例: 書店、ボウリング場", "Например: книжные магазины или боулинг", "Contoh: toko buku atau boling"],
        "Area, town, or landmark": ["Quartier, ville ou lieu connu", "地域、街、または目印", "Район, город или достопримечательность", "Wilayah, kota, atau tempat terkenal"],
        "Type an area to search": ["Saisissez un lieu à rechercher", "検索する地域を入力", "Введите место для поиска", "Ketik wilayah untuk mencari"],
        "Enter an area to search.": ["Saisissez un lieu à rechercher.", "検索する地域を入力してください。", "Введите место для поиска.", "Masukkan wilayah untuk mencari."],
        "Prepare map search": ["Préparer la recherche sur la carte", "地図検索を準備", "Подготовить поиск на карте", "Siapkan pencarian peta"],
        "Your search is ready.": ["Votre recherche est prête.", "検索の準備ができました。", "Поиск готов.", "Pencarian Anda siap."],
        "Open results in Google Maps": ["Ouvrir les résultats dans Google Maps", "Google マップで結果を開く", "Открыть результаты в Google Картах", "Buka hasil di Google Maps"],
        "Opening the map sends your search words to Google Maps. This app does not use GPS or save your search.": ["L'ouverture de la carte envoie vos mots de recherche à Google Maps. Cette application n'utilise pas le GPS et n'enregistre pas votre recherche.", "地図を開くと検索語がGoogleマップに送信されます。このアプリはGPSを使用せず、検索内容も保存しません。", "При открытии карты поисковые слова отправляются в Google Карты. Приложение не использует GPS и не сохраняет запрос.", "Saat membuka peta, kata pencarian dikirim ke Google Maps. Aplikasi ini tidak menggunakan GPS atau menyimpan pencarian Anda."],
        "Example: Drink water after school": ["Exemple : Boire de l'eau après l'école", "例: 放課後に水を飲む", "Например: Выпить воды после школы", "Contoh: Minum air setelah sekolah"],
        "Task manager": ["Gestionnaire de tâches", "タスク管理", "Менеджер задач", "Pengelola tugas"],
        "Exercise can help many people, but it is not a replacement for medical advice. Stop and get help for chest pain, fainting, severe breathing trouble, or pain after injury.": ["L'exercice peut aider de nombreuses personnes, mais ne remplace pas un avis médical. Arrêtez-vous et demandez de l'aide en cas de douleur thoracique, d'évanouissement, de difficulté respiratoire importante ou de douleur après une blessure.", "運動は多くの人に役立ちますが、医療上の助言の代わりにはなりません。胸の痛み、失神、強い息苦しさ、けがの後の痛みがあれば中止して助けを求めてください。", "Физические упражнения полезны многим, но не заменяют медицинскую консультацию. Прекратите занятия и обратитесь за помощью при боли в груди, обмороке, сильном затруднении дыхания или боли после травмы.", "Olahraga dapat membantu banyak orang, tetapi bukan pengganti saran medis. Berhenti dan minta bantuan jika mengalami nyeri dada, pingsan, kesulitan bernapas parah, atau nyeri setelah cedera."],
        "Sprains & strains": ["Entorses et foulures", "捻挫と筋肉の損傷", "Растяжения и перенапряжение", "Keseleo & ketegangan otot"],
        "Sudden twisting or poor form can hurt muscles or ligaments. Rest, use the safe RICE steps if appropriate, and ask a health professional if pain is strong or lasting.": ["Une torsion soudaine ou une mauvaise posture peut blesser les muscles ou les ligaments. Reposez-vous, appliquez les mesures RICE adaptées et consultez un professionnel de santé si la douleur est forte ou persistante.", "急なひねりや不適切なフォームは筋肉や靭帯を傷めることがあります。休み、必要に応じて安全なRICE処置を行い、痛みが強い、または続く場合は医療専門家に相談してください。", "Резкое скручивание или неправильная техника могут повредить мышцы или связки. Отдохните, при необходимости используйте безопасные меры RICE и обратитесь к специалисту, если боль сильная или не проходит.", "Gerakan memutar tiba-tiba atau posisi yang salah dapat melukai otot atau ligamen. Istirahat, lakukan langkah RICE yang aman bila sesuai, dan hubungi tenaga kesehatan jika nyeri berat atau berkepanjangan."],
        "Overtraining": ["Surentraînement", "オーバートレーニング", "Перетренированность", "Latihan berlebihan"],
        "Too much exercise can cause tiredness, poor sleep, soreness, and lower performance. Include rest days and easier sessions.": ["Un excès d'exercice peut entraîner fatigue, mauvais sommeil, courbatures et baisse des performances. Prévoyez des jours de repos et des séances plus faciles.", "運動のしすぎは疲労、睡眠不足、筋肉痛、パフォーマンス低下につながることがあります。休息日や軽めの運動を取り入れましょう。", "Чрезмерные нагрузки могут вызвать усталость, плохой сон, болезненность мышц и снижение результатов. Добавляйте дни отдыха и лёгкие тренировки.", "Olahraga berlebihan dapat menyebabkan kelelahan, tidur buruk, nyeri otot, dan penurunan performa. Sertakan hari istirahat dan sesi yang lebih ringan."],
        "Heat illness": ["Maladie liée à la chaleur", "熱中症", "Перегрев организма", "Penyakit akibat panas"],
        "Hot environments can cause dehydration or heat illness. Drink water, rest in shade, and stop for headache, confusion, vomiting, or weakness.": ["La chaleur peut provoquer une déshydratation ou un malaise. Buvez de l'eau, reposez-vous à l'ombre et arrêtez-vous en cas de mal de tête, confusion, vomissements ou faiblesse.", "暑い環境では脱水症や熱中症になることがあります。水を飲み、日陰で休み、頭痛、混乱、嘔吐、脱力があれば運動を中止してください。", "Жара может вызвать обезвоживание или тепловое заболевание. Пейте воду, отдыхайте в тени и прекращайте занятия при головной боли, спутанности сознания, рвоте или слабости.", "Lingkungan panas dapat menyebabkan dehidrasi atau penyakit akibat panas. Minum air, istirahat di tempat teduh, dan berhenti jika sakit kepala, bingung, muntah, atau lemas."],
        "Head or neck injury": ["Blessure à la tête ou au cou", "頭や首のけが", "Травма головы или шеи", "Cedera kepala atau leher"],
        "Flips and gymnastic moves can cause serious injury. Never practice without trained supervision, correct equipment, and landing mats.": ["Les saltos et mouvements de gymnastique peuvent causer de graves blessures. Ne vous entraînez jamais sans supervision qualifiée, équipement adapté et tapis de réception.", "宙返りや体操の動きは重いけがにつながることがあります。訓練を受けた人の監督、適切な器具、安全マットなしで練習しないでください。", "Сальто и гимнастические упражнения могут привести к серьёзным травмам. Никогда не занимайтесь без обученного наставника, подходящего оборудования и матов для приземления.", "Gerakan salto dan senam dapat menyebabkan cedera serius. Jangan berlatih tanpa pengawasan terlatih, peralatan yang tepat, dan matras pendaratan."],
        "Contact emergency services for severe symptoms. Ask a parent or trusted health professional before exercise if you have a heart, joint, breathing, or long-term condition.": ["Appelez les services d'urgence en cas de symptômes graves. Demandez conseil à un parent ou à un professionnel de santé de confiance avant de faire de l'exercice si vous souffrez d'un problème cardiaque, articulaire, respiratoire ou chronique.", "症状が重い場合は救急サービスに連絡してください。心臓、関節、呼吸器、または長期的な病気がある場合は、運動前に保護者や信頼できる医療専門家に相談してください。", "При серьёзных симптомах вызовите экстренную помощь. Если у вас есть заболевание сердца, суставов, дыхательной системы или хроническое состояние, посоветуйтесь с родителем или медицинским специалистом перед тренировками.", "Hubungi layanan darurat untuk gejala parah. Tanyakan kepada orang tua atau tenaga kesehatan tepercaya sebelum berolahraga jika memiliki kondisi jantung, sendi, pernapasan, atau penyakit jangka panjang."],
        "Life expectancy": ["Espérance de vie", "平均余命", "Продолжительность жизни", "Harapan hidup"],
        "This app cannot responsibly predict lifespan. Genetics, environment, medical history, and luck all matter. It does not estimate illness risk or predict a future diagnosis.": ["Cette application ne peut pas prévoir de façon fiable l'espérance de vie. La génétique, l'environnement, les antécédents médicaux et le hasard comptent tous. Elle n'évalue pas le risque de maladie et ne prédit aucun diagnostic futur.", "このアプリは寿命を責任をもって予測することはできません。遺伝、環境、病歴、偶然など多くの要素が関係します。病気のリスクを評価したり、将来の診断を予測したりもしません。", "Приложение не может ответственно предсказать продолжительность жизни. На неё влияют генетика, окружающая среда, история болезни и случайность. Оно не оценивает риск заболеваний и не предсказывает диагнозы.", "Aplikasi ini tidak dapat memprediksi harapan hidup secara bertanggung jawab. Genetika, lingkungan, riwayat kesehatan, dan faktor keberuntungan juga berpengaruh. Aplikasi ini tidak memperkirakan risiko penyakit atau memprediksi diagnosis."],
        "BMI range:": ["Plage d'IMC :", "BMI範囲:", "Диапазон ИМТ:", "Rentang BMI:"],
        "Plan confidence:": ["Fiabilité indicative du programme :", "プランの目安の信頼度:", "Надёжность оценки плана:", "Keyakinan pada rencana:"],
        "Welcome! I can explain the exercises and mini games.": ["Bienvenue ! Je peux expliquer les exercices et les mini-jeux.", "ようこそ！運動やミニゲームについて説明できます。", "Добро пожаловать! Я могу рассказать об упражнениях и мини-играх.", "Selamat datang! Saya dapat menjelaskan latihan dan mini game."],
        "Mascot Max: Add honest details to get a general starting plan.": ["Mascotte Max : indiquez des informations exactes pour obtenir un programme de départ général.", "マスコットのマックス: 正確な情報を入力すると、一般的な初回プランを作成できます。", "Маскот Макс: укажите правдивые данные, чтобы получить общий начальный план.", "Maskot Max: masukkan informasi yang jujur untuk mendapatkan rencana awal umum."],
        "Mascot Max: Use slow, controlled practice and stop for sharp pain.": ["Mascotte Max : bougez lentement et avec contrôle, et arrêtez-vous en cas de douleur aiguë.", "マスコットのマックス: ゆっくり動きをコントロールし、鋭い痛みがあれば中止しましょう。", "Маскот Макс: занимайтесь медленно и контролируемо, остановитесь при резкой боли.", "Maskot Max: berlatihlah perlahan dan terkendali, lalu berhenti jika terasa nyeri tajam."],
        "Mascot Max: Keep water nearby and move at a comfortable pace.": ["Mascotte Max : gardez de l'eau à proximité et adoptez un rythme confortable.", "マスコットのマックス: 水を近くに置き、無理のないペースで動きましょう。", "Маскот Макс: держите рядом воду и двигайтесь в комфортном темпе.", "Maskot Max: siapkan air di dekat Anda dan bergeraklah dengan nyaman."],
        "Mascot Max: Pick a game and give your eyes and fingers a fun challenge.": ["Mascotte Max : choisissez un jeu et amusez-vous à mettre vos yeux et vos doigts au défi.", "マスコットのマックス: ゲームを選んで、目と指を楽しく鍛えましょう。", "Маскот Макс: выберите игру и весело потренируйте глаза и пальцы.", "Maskot Max: pilih game dan tantang mata serta jari Anda dengan menyenangkan."],
        "Mascot Max: Small goals add up. Try a goal you can finish today.": ["Mascotte Max : les petits objectifs s'additionnent. Choisissez-en un que vous pouvez atteindre aujourd'hui.", "マスコットのマックス: 小さな目標も積み重なります。今日達成できる目標に挑戦しましょう。", "Маскот Макс: маленькие цели складываются в большой результат. Выберите цель на сегодня.", "Maskot Max: target kecil akan bertambah. Coba target yang bisa diselesaikan hari ini."],
        "Mascot Max: Serious symptoms need a parent or health professional.": ["Mascotte Max : en cas de symptômes graves, prévenez un parent ou un professionnel de santé.", "マスコットのマックス: 深刻な症状があれば、保護者や医療専門家に相談してください。", "Маскот Макс: при серьёзных симптомах обратитесь к родителю или медицинскому специалисту.", "Maskot Max: gejala serius perlu ditangani orang tua atau tenaga kesehatan."],
        "Mascot Max: Choose colors and shade that feel easy to see.": ["Mascotte Max : choisissez des couleurs et une luminosité agréables à regarder.", "マスコットのマックス: 見やすい色と明るさを選びましょう。", "Маскот Макс: выберите удобные для глаз цвета и яркость.", "Maskot Max: pilih warna dan kecerahan yang nyaman dilihat."],
        "Mascot Max: Good try! Wait for the cactus, then jump with one clean tap.": ["Mascotte Max : bel essai ! Attendez le cactus, puis sautez d'une pression nette.", "マスコットのマックス: いい挑戦です！サボテンを待って、1回タップしてジャンプしましょう。", "Маскот Макс: хорошая попытка! Дождитесь кактуса и прыгните одним нажатием.", "Maskot Max: usaha bagus! Tunggu kaktus, lalu lompat dengan satu ketukan."],
        "Mascot Max: You crossed the trail. Try wider turns next time.": ["Mascotte Max : vous avez croisé votre trajectoire. Essayez des virages plus larges la prochaine fois.", "マスコットのマックス: 自分の進路にぶつかりました。次は大きく曲がってみましょう。", "Маскот Макс: вы пересекли собственный след. В следующий раз поворачивайте шире.", "Maskot Max: Anda melintasi jejak sendiri. Coba belokan yang lebih lebar lain kali."],
        "Mascot Max: Twenty targets complete. That was a focused hand-eye workout!": ["Mascotte Max : vingt cibles atteintes. Belle séance de coordination œil-main !", "マスコットのマックス: 20個のターゲットを達成！集中力と手と目の運動になりました。", "Маскот Макс: двадцать целей пройдены. Отличная тренировка координации!", "Maskot Max: dua puluh target selesai. Latihan koordinasi mata dan tangan yang bagus!"],
        "Mascot Max: Fullscreen is not available in this browser. You can still play here.": ["Mascotte Max : le plein écran n'est pas disponible dans ce navigateur. Vous pouvez quand même jouer ici.", "マスコットのマックス: このブラウザーでは全画面表示を使えませんが、ここでプレイできます。", "Маскот Макс: полноэкранный режим недоступен в этом браузере. Здесь всё равно можно играть.", "Maskot Max: layar penuh tidak tersedia di browser ini. Anda tetap bisa bermain di sini."],
        "Mascot Max: Press start, then jump over each cactus.": ["Mascotte Max : appuyez sur Démarrer, puis sautez par-dessus chaque cactus.", "マスコットのマックス: 開始を押し、それぞれのサボテンをジャンプで避けましょう。", "Маскот Макс: нажмите «Старт», затем перепрыгивайте через кактусы.", "Maskot Max: tekan Mulai, lalu lompati setiap kaktus."],
        "Mascot Max: Tap the glowing targets quickly, but stay relaxed.": ["Mascotte Max : touchez rapidement les cibles lumineuses, tout en restant détendu.", "マスコットのマックス: リラックスしながら、光るターゲットを素早くタップしましょう。", "Маскот Макс: быстро нажимайте на светящиеся цели, но не напрягайтесь.", "Maskot Max: ketuk target bercahaya dengan cepat, tetapi tetap santai."],
        "Mascot Max: Tap to reveal; turn on flag mode to mark a suspected mine.": ["Mascotte Max : touchez une case pour la révéler ; activez le mode drapeau pour marquer une mine possible.", "マスコットのマックス: タップしてマスを開き、地雷がありそうな場所には旗モードで印をつけましょう。", "Маскот Макс: нажмите, чтобы открыть клетку; включите флажок, чтобы отметить предполагаемую мину.", "Maskot Max: ketuk untuk membuka; aktifkan mode bendera untuk menandai dugaan ranjau."],
        "Mascot Max: Tap, click, or press Space to rise through the cloud gates.": ["Mascotte Max : touchez, cliquez ou appuyez sur Espace pour monter entre les portes nuageuses.", "マスコットのマックス: タップ、クリック、またはスペースキーで雲のゲートを上昇しましょう。", "Маскот Макс: нажимайте, щёлкайте или жмите пробел, чтобы пролетать через облачные ворота.", "Maskot Max: ketuk, klik, atau tekan Spasi untuk naik melewati gerbang awan."],
        "Mascot Max: Time your swing as the ball reaches the batter. Space also swings.": ["Mascotte Max : frappez au moment où la balle atteint le batteur. La barre d'espace permet aussi de frapper.", "マスコットのマックス: ボールが打者に届くタイミングでスイングします。スペースキーでもスイングできます。", "Маскот Макс: бейте, когда мяч долетит до бьющего. Пробел тоже выполняет удар.", "Maskot Max: ayunkan saat bola mencapai pemukul. Tombol Spasi juga untuk memukul."],
        "Mascot Max: Type an area and choose a place. Your search opens in Google Maps only when you click the link.": ["Mascotte Max : saisissez un lieu et choisissez une catégorie. La recherche ne s'ouvre dans Google Maps que lorsque vous cliquez sur le lien.", "マスコットのマックス: 地域を入力して場所を選びます。リンクをクリックしたときだけGoogleマップで検索します。", "Маскот Макс: введите район и выберите место. Поиск откроется в Google Картах, только если нажать на ссылку.", "Maskot Max: ketik wilayah dan pilih tempat. Pencarian hanya terbuka di Google Maps saat Anda mengeklik tautan."],
        "Mascot Max: Use arrow keys or WASD. Collect all the dots and watch for the ghost.": ["Mascotte Max : utilisez les flèches ou WASD. Ramassez tous les points et faites attention au fantôme.", "マスコットのマックス: 矢印キーまたはWASDを使います。ゴーストに注意してドットをすべて集めましょう。", "Маскот Макс: используйте стрелки или WASD. Соберите все точки и следите за призраком.", "Maskot Max: gunakan tombol panah atau WASD. Kumpulkan semua titik dan waspadai hantu."],
        "Mascot Max: Use arrow keys or WASD. Do not cross your own trail.": ["Mascotte Max : utilisez les flèches ou WASD. Ne croisez pas votre propre trajectoire.", "マスコットのマックス: 矢印キーまたはWASDを使い、自分の軌跡を横切らないようにしましょう。", "Маскот Макс: используйте стрелки или WASD. Не пересекайте собственный след.", "Maskot Max: gunakan tombol panah atau WASD. Jangan melintasi jejak sendiri."],
        "The battlefield-style option uses wind ambience only. It has no weapon or explosion sounds.": ["L'option sur le thème du champ de bataille utilise uniquement un bruit de vent. Elle ne contient aucun son d'arme ou d'explosion.", "戦場風の設定では風の音のみが再生され、武器や爆発の音はありません。", "В варианте с атмосферой поля боя звучит только ветер, без звуков оружия и взрывов.", "Pilihan bertema medan perang hanya menggunakan suara angin. Tidak ada suara senjata atau ledakan."],
        "Distant battlefield ambience (wind only)": ["Ambiance lointaine de champ de bataille (vent uniquement)", "遠くの戦場の環境音（風のみ）", "Звуки далёкого поля боя (только ветер)", "Suasana medan perang jauh (angin saja)"],
        "From hands and knees, reach one arm and the opposite leg out. Keep your hips level and return slowly.": ["À quatre pattes, tendez un bras et la jambe opposée. Gardez les hanches à niveau et revenez lentement.", "四つんばいになり、片腕と反対側の脚を伸ばします。腰の高さを保ち、ゆっくり戻します。", "Встаньте на четвереньки, вытяните одну руку и противоположную ногу. Держите таз ровно и медленно вернитесь.", "Mulai dengan posisi merangkak, luruskan satu lengan dan kaki yang berlawanan. Jaga pinggul tetap rata dan kembali perlahan."],
        "Stand with feet about shoulder-width apart. Push your hips back, keep your chest lifted, and stop before your knees move inward.": ["Écartez les pieds à peu près à la largeur des épaules. Reculez les hanches, gardez la poitrine relevée et arrêtez-vous avant que les genoux ne rentrent vers l'intérieur.", "足を肩幅ほどに開いて立ちます。腰を後ろに引き、胸を上げ、膝が内側に入る前に止めます。", "Поставьте ноги примерно на ширине плеч. Отведите таз назад, держите грудь поднятой и остановитесь, если колени начинают заваливаться внутрь.", "Berdiri dengan kaki selebar bahu. Dorong pinggul ke belakang, tegakkan dada, dan berhenti sebelum lutut bergerak ke dalam."],
        "Hands on a wall at chest height. Keep a straight line from head to heels and move slowly toward and away from the wall.": ["Placez les mains contre un mur à hauteur de poitrine. Gardez le corps aligné de la tête aux talons et rapprochez-vous puis éloignez-vous lentement du mur.", "胸の高さで壁に手をつきます。頭からかかとまで一直線を保ち、ゆっくり壁に近づいて戻ります。", "Поставьте руки на стену на уровне груди. Держите тело на прямой линии от головы до пяток и медленно приближайтесь к стене и отталкивайтесь.", "Letakkan tangan di dinding setinggi dada. Jaga tubuh tetap lurus dari kepala hingga tumit, lalu bergerak perlahan mendekati dan menjauhi dinding."],
        "March in place with a tall posture. Start slowly and lift your knees only as high as feels comfortable.": ["Marchez sur place en gardant le buste droit. Commencez lentement et levez les genoux uniquement à une hauteur confortable.", "背筋を伸ばしてその場で足踏みします。ゆっくり始め、無理のない高さまで膝を上げます。", "Маршируйте на месте с прямой осанкой. Начните медленно и поднимайте колени только на комфортную высоту.", "Jalan di tempat dengan postur tegak. Mulai perlahan dan angkat lutut hanya setinggi yang terasa nyaman."],
        "Hold a stable chair if needed. Rise onto your toes, pause, and lower with control.": ["Tenez-vous à une chaise stable si nécessaire. Montez sur la pointe des pieds, marquez une pause puis redescendez en contrôlant le mouvement.", "必要なら安定した椅子につかまります。つま先立ちになり、少し止まってからゆっくり下ろします。", "При необходимости держитесь за устойчивый стул. Поднимитесь на носки, задержитесь и контролируемо опуститесь.", "Pegang kursi yang kokoh jika perlu. Berdiri dengan ujung kaki, berhenti sejenak, lalu turunkan dengan terkendali."],
        "Move until you feel a mild stretch, never sharp pain. Hold still and breathe normally.": ["Étirez-vous jusqu'à ressentir une légère tension, jamais une douleur aiguë. Restez immobile et respirez normalement.", "軽く伸びを感じるところまで動かし、鋭い痛みが出る前に止めます。その姿勢を保ち、自然に呼吸します。", "Растягивайтесь до лёгкого ощущения натяжения, но не до резкой боли. Сохраняйте положение и дышите спокойно.", "Bergeraklah sampai terasa sedikit tertarik, bukan nyeri tajam. Tahan posisi dan bernapaslah dengan normal."],
        "The sound source could not load. Try another option.": ["La source sonore n'a pas pu être chargée. Essayez une autre option.", "サウンドを読み込めませんでした。別のオプションをお試しください。", "Не удалось загрузить источник звука. Попробуйте другой вариант.", "Sumber suara tidak dapat dimuat. Coba pilihan lain."]
      };
      Object.entries(additionalTranslationRows).forEach(([english, values]) => {
        values.forEach((translation, index) => {
          translations[localeOrder[index + 5]][english] = translation;
        });
      });
      const featureTranslationRows = {
        "Slow squats": ["慢速深蹲", "Sentadillas lentas", "Langsame Kniebeugen", "धीमे स्क्वैट्स", "قرفصاء بطيئة", "Squats lents", "ゆっくりスクワット", "Медленные приседания", "Jongkok perlahan"],
        "Glute bridge": ["臀桥", "Puente de glúteos", "Glute Bridge", "ग्लूट ब्रिज", "جسر الأرداف", "Pont fessier", "グルートブリッジ", "Ягодичный мостик", "Glute bridge"],
        "Step-touch": ["侧步并拢", "Paso lateral", "Seitwärtsschritt", "साइड स्टेप", "خطوة جانبية", "Pas chassé", "ステップタッチ", "Шаг в сторону", "Langkah samping"],
        "Seated knee extension": ["坐姿伸膝", "Extensión de rodilla sentado", "Sitzende Kniestreckung", "बैठकर घुटना सीधा करना", "مد الركبة أثناء الجلوس", "Extension du genou assis", "座って膝を伸ばす運動", "Разгибание колена сидя", "Luruskan lutut sambil duduk"],
        "Side leg raise": ["侧抬腿", "Elevación lateral de pierna", "Seitliches Beinheben", "बगल में पैर उठाना", "رفع الساق جانبًا", "Élévation latérale de la jambe", "横向き脚上げ", "Подъём ноги в сторону", "Angkat kaki ke samping"],
        "Dead bug": ["死虫式", "Dead bug", "Dead Bug", "डेड बग", "تمرين الحشرة الميتة", "Dead bug", "デッドバグ", "Упражнение «мёртвый жук»", "Dead bug"],
        "Short wall sit": ["短时靠墙静蹲", "Sentadilla isométrica breve en pared", "Kurzer Wandsitz", "दीवार के सहारे थोड़ी देर बैठना", "جلوس قصير على الحائط", "Chaise au mur courte", "短いウォールシット", "Короткое удержание у стены", "Duduk menempel dinding sebentar"],
        "Marching intervals": ["间歇踏步", "Marcha por intervalos", "Marschintervalle", "मार्चिंग इंटरवल", "مشي على فترات", "Marche par intervalles", "足踏みインターバル", "Интервальный марш", "Jalan interval"],
        "Use a comfortable range, move slowly, and stop if your knees or back hurt.": ["在舒适的幅度内慢慢活动；如果膝盖或背部疼痛，请停止。", "Muévete despacio y dentro de un rango cómodo; para si te duelen las rodillas o la espalda.", "Bewege dich langsam und in einem angenehmen Bewegungsbereich. Höre auf, wenn Knie oder Rücken schmerzen.", "आरामदायक सीमा में धीरे चलें और घुटनों या पीठ में दर्द हो तो रुकें।", "تحرك ببطء وفي نطاق مريح، وتوقف إذا شعرت بألم في الركبتين أو الظهر.", "Bougez lentement dans une amplitude confortable et arrêtez-vous si vos genoux ou votre dos vous font mal.", "無理のない範囲でゆっくり動き、膝や背中が痛くなったら止めてください。", "Двигайтесь медленно и в комфортном диапазоне. Остановитесь, если заболят колени или спина.", "Bergerak perlahan dalam batas nyaman dan berhenti jika lutut atau punggung terasa sakit."],
        "Lie on your back with knees bent and feet flat. Lift your hips a little, then lower slowly; stop if your back hurts.": ["仰卧，屈膝，双脚平放。轻轻抬起臀部再慢慢放下；背部疼痛时停止。", "Túmbate boca arriba con las rodillas flexionadas y los pies apoyados. Eleva un poco las caderas y bájalas despacio; para si te duele la espalda.", "Lege dich mit angewinkelten Knien und flachen Füßen auf den Rücken. Hebe die Hüfte leicht an und senke sie langsam. Bei Rückenschmerzen aufhören.", "पीठ के बल लेटें, घुटने मोड़ें और पैर ज़मीन पर रखें। कूल्हों को थोड़ा उठाकर धीरे नीचे करें; पीठ में दर्द हो तो रुकें।", "استلقِ على ظهرك مع ثني الركبتين والقدمين على الأرض. ارفع الوركين قليلًا ثم اخفضهما ببطء، وتوقف إذا آلمك ظهرك.", "Allongez-vous sur le dos, genoux pliés et pieds au sol. Soulevez légèrement les hanches puis redescendez lentement ; arrêtez-vous si vous avez mal au dos.", "仰向けで膝を曲げ、足裏を床につけます。お尻を少し上げてゆっくり下ろします。背中が痛んだら止めてください。", "Лягте на спину, согните колени и поставьте стопы на пол. Немного поднимите таз и медленно опустите; при боли в спине остановитесь.", "Berbaring telentang dengan lutut ditekuk dan telapak kaki di lantai. Angkat pinggul sedikit lalu turunkan perlahan; berhenti jika punggung sakit."],
        "Step gently to one side and bring the other foot beside it. Alternate sides at a comfortable pace.": ["轻轻向一侧迈步，再把另一只脚并拢。以舒适的速度交替两侧。", "Da un paso suave hacia un lado y junta el otro pie. Alterna los lados a un ritmo cómodo.", "Mache einen kleinen Schritt zur Seite und stelle den anderen Fuß dazu. Wechsle in angenehmem Tempo die Seite.", "धीरे से एक ओर कदम रखें और दूसरा पैर पास लाएँ। आरामदायक गति से बारी-बारी करें।", "اخطُ بلطف إلى جانب واحد ثم قرّب القدم الأخرى. بدّل الجانبين بوتيرة مريحة.", "Faites un petit pas sur le côté puis ramenez l'autre pied. Alternez à un rythme confortable.", "片側へ軽く踏み出し、もう片方の足をそろえます。無理のないペースで左右交互に行います。", "Сделайте лёгкий шаг в сторону и приставьте другую ногу. Чередуйте стороны в удобном темпе.", "Langkahkan satu kaki ke samping, lalu rapatkan kaki lainnya. Bergantian dengan tempo nyaman."],
        "Sit tall in a stable chair. Slowly straighten one knee, lower your foot, then switch sides.": ["坐在稳固的椅子上并坐直。慢慢伸直一侧膝盖，放下脚，再换另一侧。", "Siéntate erguido en una silla estable. Estira una rodilla despacio, baja el pie y cambia de lado.", "Sitze aufrecht auf einem stabilen Stuhl. Strecke ein Knie langsam, senke den Fuß und wechsle dann die Seite.", "मज़बूत कुर्सी पर सीधे बैठें। एक घुटने को धीरे सीधा करें, पैर नीचे रखें और दूसरी ओर करें।", "اجلس مستقيمًا على كرسي ثابت. مد ركبة واحدة ببطء، ثم اخفض القدم وبدّل الجانبين.", "Asseyez-vous droit sur une chaise stable. Tendez lentement un genou, reposez le pied puis changez de côté.", "安定した椅子に背筋を伸ばして座ります。片膝をゆっくり伸ばして足を下ろし、反対側も行います。", "Сядьте прямо на устойчивый стул. Медленно выпрямите одно колено, опустите ногу и повторите другой ногой.", "Duduk tegak di kursi yang kokoh. Luruskan satu lutut perlahan, turunkan kaki, lalu ganti sisi."],
        "Hold a stable chair if needed. Lift one leg gently to the side without leaning, then switch legs.": ["如有需要可扶稳固的椅子。身体不要倾斜，轻轻向侧面抬起一条腿，再换另一侧。", "Sujétate a una silla estable si hace falta. Levanta una pierna suavemente hacia un lado sin inclinarte y cambia de pierna.", "Halte dich bei Bedarf an einem stabilen Stuhl fest. Hebe ein Bein sanft zur Seite, ohne dich zu neigen, und wechsle dann.", "ज़रूरत हो तो मज़बूत कुर्सी पकड़ें। झुके बिना एक पैर को धीरे बगल में उठाएँ, फिर बदलें।", "تمسّك بكرسي ثابت إذا احتجت. ارفع ساقًا بلطف إلى الجانب دون الميل، ثم بدّل الساق.", "Tenez-vous à une chaise stable si nécessaire. Levez doucement une jambe sur le côté sans vous pencher, puis changez de jambe.", "必要なら安定した椅子につかまります。体を傾けず片脚を横に軽く上げ、反対側も行います。", "При необходимости держитесь за устойчивый стул. Мягко поднимите ногу в сторону, не наклоняясь, затем смените ногу.", "Pegang kursi kokoh jika perlu. Angkat satu kaki perlahan ke samping tanpa miring, lalu ganti kaki."],
        "Lie on your back and move one arm and the opposite leg slowly. Keep the movement comfortable and stop if your back hurts.": ["仰卧，慢慢移动一只手臂和对侧的腿。动作保持舒适，背部疼痛时停止。", "Túmbate boca arriba y mueve despacio un brazo y la pierna contraria. Hazlo cómodamente y para si te duele la espalda.", "Lege dich auf den Rücken und bewege langsam einen Arm und das gegenüberliegende Bein. Bleibe im angenehmen Bereich und höre bei Rückenschmerzen auf.", "पीठ के बल लेटकर एक हाथ और उल्टा पैर धीरे चलाएँ। आरामदायक रखें और पीठ में दर्द हो तो रुकें।", "استلقِ على ظهرك وحرك ذراعًا وساقًا مقابلة ببطء. اجعل الحركة مريحة وتوقف إذا آلمك ظهرك.", "Allongez-vous sur le dos et bougez lentement un bras et la jambe opposée. Restez à l'aise et arrêtez-vous si vous avez mal au dos.", "仰向けで、片腕と反対側の脚をゆっくり動かします。無理のない範囲で行い、背中が痛んだら止めてください。", "Лягте на спину и медленно двигайте одной рукой и противоположной ногой. Двигайтесь комфортно и остановитесь при боли в спине.", "Berbaring telentang dan gerakkan satu lengan serta kaki yang berlawanan perlahan. Tetap nyaman dan berhenti jika punggung sakit."],
        "Lean against a wall and bend your knees only a little. Hold briefly, stand up, and stop if you feel pain.": ["靠墙站立，只稍微弯曲膝盖。短暂保持后站起；感到疼痛时停止。", "Apóyate en la pared y flexiona poco las rodillas. Mantén la posición brevemente, ponte de pie y para si sientes dolor.", "Lehne dich an eine Wand und beuge die Knie nur leicht. Halte kurz, richte dich auf und höre bei Schmerzen auf.", "दीवार से टिकें और घुटनों को थोड़ा ही मोड़ें। थोड़ी देर रुकें, फिर खड़े हों; दर्द हो तो बंद करें।", "استند إلى الحائط واثنِ ركبتيك قليلًا فقط. اثبت لحظات ثم قف، وتوقف إذا شعرت بألم.", "Appuyez-vous contre un mur et pliez légèrement les genoux. Tenez brièvement, relevez-vous et arrêtez-vous en cas de douleur.", "壁にもたれ、膝を少しだけ曲げます。短く保って立ち上がり、痛みを感じたら中止してください。", "Обопритесь о стену и слегка согните колени. Ненадолго задержитесь, встаньте и остановитесь при боли.", "Bersandar di dinding dan tekuk lutut sedikit saja. Tahan sebentar, berdiri, dan berhenti jika terasa sakit."],
        "Alternate a short, quicker march with an easy pace. Keep the steps comfortable and rest whenever you need.": ["短暂加快踏步，再恢复轻松速度。步伐保持舒适，需要时随时休息。", "Alterna una marcha breve algo más rápida con un ritmo suave. Mantén pasos cómodos y descansa cuando lo necesites.", "Wechsle zwischen kurzem, etwas schnellerem Marschieren und lockerem Tempo. Bleibe bequem und mache bei Bedarf Pause.", "थोड़ी देर तेज़ मार्च और फिर आसान गति बारी-बारी करें। कदम आरामदायक रखें और ज़रूरत पर आराम करें।", "بدّل بين مشي أسرع لفترة قصيرة ومشي هادئ. اجعل خطواتك مريحة واسترح متى احتجت.", "Alternez une courte marche un peu plus rapide avec une allure tranquille. Gardez des pas confortables et reposez-vous au besoin.", "短い間だけ少し速く足踏みし、その後ゆっくりに戻します。無理のない歩幅で、必要なら休みましょう。", "Чередуйте короткий более быстрый марш с лёгким темпом. Шагайте комфортно и отдыхайте, когда нужно.", "Selang-seling jalan cepat sebentar dengan tempo santai. Langkahkan kaki dengan nyaman dan istirahatlah bila perlu."],
        "Easy marching - 5 minutes": ["轻松踏步 - 5分钟", "Marcha suave - 5 minutos", "Leichtes Marschieren - 5 Minuten", "हल्की मार्च - 5 मिनट", "مشي خفيف في المكان - 5 دقائق", "Marche facile - 5 minutes", "ゆっくり足踏み - 5分", "Лёгкий марш на месте — 5 минут", "Jalan santai di tempat - 5 menit"],
        "Easy stretch - 3 minutes": ["轻柔拉伸 - 3分钟", "Estiramiento suave - 3 minutos", "Sanftes Dehnen - 3 Minuten", "हल्की स्ट्रेचिंग - 3 मिनट", "تمدد لطيف - 3 دقائق", "Étirement facile - 3 minutes", "軽いストレッチ - 3分", "Лёгкая растяжка — 3 минуты", "Peregangan ringan - 3 menit"],
        "Bird dog - 2 sets of 6 reps per side": ["鸟狗式 - 每侧6次，共2组", "Bird dog - 2 series de 6 repeticiones por lado", "Bird Dog - 2 Sätze mit je 6 Wiederholungen pro Seite", "बर्ड डॉग - हर तरफ 6 बार के 2 सेट", "تمرين الطائر والكلب - مجموعتان من 6 تكرارات لكل جانب", "Bird dog - 2 séries de 6 répétitions par côté", "バードドッグ - 左右各6回を2セット", "«Птица-собака» — 2 подхода по 6 повторений на сторону", "Bird dog - 2 set, 6 repetisi tiap sisi"],
        "Calf raises - 2 sets of 10 reps": ["提踵 - 10次，共2组", "Elevaciones de talones - 2 series de 10 repeticiones", "Wadenheben - 2 Sätze mit je 10 Wiederholungen", "काफ़ रेज़ - 10 बार के 2 सेट", "رفع الساقين - مجموعتان من 10 تكرارات", "Élévations des mollets - 2 séries de 10 répétitions", "カーフレイズ - 10回を2セット", "Подъёмы на носки — 2 подхода по 10 повторений", "Angkat tumit - 2 set, 10 repetisi"],
        "Glute bridges - 2 sets of 8 reps": ["臀桥 - 8次，共2组", "Puentes de glúteos - 2 series de 8 repeticiones", "Glute Bridges - 2 Sätze mit je 8 Wiederholungen", "ग्लूट ब्रिज - 8 बार के 2 सेट", "جسر الأرداف - مجموعتان من 8 تكرارات", "Ponts fessiers - 2 séries de 8 répétitions", "グルートブリッジ - 8回を2セット", "Ягодичный мостик — 2 подхода по 8 повторений", "Glute bridge - 2 set, 8 repetisi"],
        "Glute bridges - 3 sets of 8 reps": ["臀桥 - 8次，共3组", "Puentes de glúteos - 3 series de 8 repeticiones", "Glute Bridges - 3 Sätze mit je 8 Wiederholungen", "ग्लूट ब्रिज - 8 बार के 3 सेट", "جسر الأرداف - 3 مجموعات من 8 تكرارات", "Ponts fessiers - 3 séries de 8 répétitions", "グルートブリッジ - 8回を3セット", "Ягодичный мостик — 3 подхода по 8 повторений", "Glute bridge - 3 set, 8 repetisi"],
        "Step-touch - 3 minutes": ["侧步并拢 - 3分钟", "Paso lateral - 3 minutos", "Seitwärtsschritte - 3 Minuten", "साइड स्टेप - 3 मिनट", "خطوة جانبية - 3 دقائق", "Pas chassé - 3 minutes", "ステップタッチ - 3分", "Шаги в сторону — 3 минуты", "Langkah samping - 3 menit"],
        "Seated knee extensions - 2 sets of 8 reps per side": ["坐姿伸膝 - 每侧8次，共2组", "Extensiones de rodilla sentado - 2 series de 8 por lado", "Sitzende Kniestreckung - 2 Sätze mit je 8 Wiederholungen pro Seite", "बैठकर घुटना सीधा करना - हर तरफ 8 बार के 2 सेट", "مد الركبة أثناء الجلوس - مجموعتان من 8 تكرارات لكل جانب", "Extensions du genou assis - 2 séries de 8 par côté", "座って膝を伸ばす運動 - 左右各8回を2セット", "Разгибание колена сидя — 2 подхода по 8 раз на сторону", "Luruskan lutut sambil duduk - 2 set, 8 repetisi tiap sisi"],
        "Side leg raises - 2 sets of 8 reps per side": ["侧抬腿 - 每侧8次，共2组", "Elevaciones laterales de pierna - 2 series de 8 por lado", "Seitliches Beinheben - 2 Sätze mit je 8 Wiederholungen pro Seite", "बगल में पैर उठाना - हर तरफ 8 बार के 2 सेट", "رفع الساق جانبًا - مجموعتان من 8 تكرارات لكل جانب", "Élévations latérales de jambe - 2 séries de 8 par côté", "横向き脚上げ - 左右各8回を2セット", "Подъём ноги в сторону — 2 подхода по 8 раз на сторону", "Angkat kaki ke samping - 2 set, 8 repetisi tiap sisi"],
        "Dead bug - 2 sets of 6 reps per side": ["死虫式 - 每侧6次，共2组", "Dead bug - 2 series de 6 repeticiones por lado", "Dead Bug - 2 Sätze mit je 6 Wiederholungen pro Seite", "डेड बग - हर तरफ 6 बार के 2 सेट", "تمرين الحشرة الميتة - مجموعتان من 6 تكرارات لكل جانب", "Dead bug - 2 séries de 6 répétitions par côté", "デッドバグ - 左右各6回を2セット", "«Мёртвый жук» — 2 подхода по 6 повторений на сторону", "Dead bug - 2 set, 6 repetisi tiap sisi"],
        "Short wall sit - 2 sets of 20 seconds": ["靠墙静蹲 - 20秒，共2组", "Sentadilla breve en pared - 2 series de 20 segundos", "Kurzer Wandsitz - 2 Sätze à 20 Sekunden", "दीवार के सहारे बैठना - 20 सेकंड के 2 सेट", "جلوس قصير على الحائط - مجموعتان مدة كل منهما 20 ثانية", "Chaise au mur courte - 2 séries de 20 secondes", "短いウォールシット - 20秒を2セット", "Удержание у стены — 2 подхода по 20 секунд", "Duduk menempel dinding - 2 set, 20 detik"],
        "Leave enough clear space around you before you begin.": ["开始前请确保周围有足够的空地。", "Deja suficiente espacio libre a tu alrededor antes de empezar.", "Sorge vor dem Start für genügend freien Platz um dich herum.", "शुरू करने से पहले आसपास पर्याप्त खाली जगह रखें।", "تأكد من وجود مساحة خالية كافية حولك قبل البدء.", "Laissez suffisamment d'espace libre autour de vous avant de commencer.", "始める前に、周りに十分なスペースがあることを確認しましょう。", "Перед началом освободите достаточно места вокруг себя.", "Pastikan ada cukup ruang kosong di sekitar sebelum mulai."],
        "Rest between sets so you can keep your movements controlled.": ["组间休息一下，这样动作更容易保持稳定。", "Descansa entre series para mantener los movimientos controlados.", "Mache zwischen den Sätzen Pause, damit deine Bewegungen kontrolliert bleiben.", "सेट के बीच आराम करें ताकि हरकतें नियंत्रित रहें।", "استرح بين المجموعات لتحافظ على التحكم في الحركة.", "Reposez-vous entre les séries pour garder des mouvements contrôlés.", "動きを安定させるため、セットの間に休みましょう。", "Отдыхайте между подходами, чтобы движения оставались контролируемыми.", "Istirahat di antara set agar gerakan tetap terkendali."],
        "Try a smaller movement if an exercise feels difficult.": ["如果某个动作很难，可以缩小动作幅度。", "Haz un movimiento más pequeño si un ejercicio te resulta difícil.", "Verkleinere die Bewegung, wenn dir eine Übung schwerfällt.", "व्यायाम कठिन लगे तो उसकी गति या सीमा कम करें।", "قلل نطاق الحركة إذا كان التمرين صعبًا.", "Réduisez l'amplitude si un exercice vous semble difficile.", "運動が難しいと感じたら、動きを小さくしてみましょう。", "Если упражнение кажется трудным, уменьшите амплитуду движения.", "Kurangi jangkauan gerakan jika latihan terasa sulit."],
        "A steady pace is more useful than rushing.": ["保持稳定节奏比匆忙完成更有帮助。", "Un ritmo constante es más útil que apresurarse.", "Ein gleichmäßiges Tempo ist besser als Hast.", "जल्दी करने से बेहतर है स्थिर गति बनाए रखना।", "الوتيرة الثابتة أفضل من الاستعجال.", "Un rythme régulier est plus utile que de se précipiter.", "急ぐより、安定したペースで動く方が効果的です。", "Ровный темп полезнее, чем спешка.", "Tempo yang stabil lebih baik daripada terburu-buru."],
        "Check that a chair is stable before using it for support.": ["用椅子支撑前，请先确认椅子稳固。", "Comprueba que la silla esté estable antes de apoyarte.", "Prüfe, ob ein Stuhl stabil steht, bevor du dich daran festhältst.", "सहारे के लिए कुर्सी इस्तेमाल करने से पहले उसकी स्थिरता जाँचें।", "تأكد من ثبات الكرسي قبل استخدامه للدعم.", "Vérifiez qu'une chaise est stable avant de vous y appuyer.", "椅子を支えに使う前に、安定しているか確認しましょう。", "Проверьте устойчивость стула, прежде чем опираться на него.", "Periksa apakah kursi kokoh sebelum menggunakannya sebagai pegangan."],
        "Take a water break whenever you feel thirsty.": ["口渴时就停下来喝点水。", "Haz una pausa para beber agua cuando tengas sed.", "Trinke Wasser, wenn du durstig bist.", "प्यास लगे तो पानी पीने के लिए विराम लें।", "خذ استراحة لشرب الماء عندما تشعر بالعطش.", "Faites une pause pour boire de l'eau dès que vous avez soif.", "喉が渇いたら、水分補給の休憩を取りましょう。", "Делайте перерыв и пейте воду, когда хочется пить.", "Beristirahatlah untuk minum air saat merasa haus."],
        "Stop and tell a trusted adult if something does not feel right.": ["如果感觉不舒服，请停止并告诉可信任的成年人。", "Para y avisa a un adulto de confianza si algo no te parece bien.", "Höre auf und sage einer Vertrauensperson Bescheid, wenn sich etwas nicht richtig anfühlt.", "कुछ ठीक न लगे तो रुकें और किसी भरोसेमंद बड़े को बताएँ।", "توقف وأخبر شخصًا بالغًا تثق به إذا شعرت أن هناك شيئًا غير طبيعي.", "Arrêtez-vous et prévenez un adulte de confiance si quelque chose ne va pas.", "違和感があれば止めて、信頼できる大人に伝えましょう。", "Остановитесь и сообщите взрослому, которому доверяете, если почувствуете себя некомфортно.", "Berhenti dan beri tahu orang dewasa tepercaya jika ada yang terasa tidak beres."],
        "Mascot Max: Every plan can be adjusted; pick a comfortable level.": ["麦克斯：计划可以调整；选择让你感觉舒适的强度。", "Mascota Max: puedes ajustar cualquier plan; elige un nivel cómodo.", "Maskottchen Max: Jeder Plan lässt sich anpassen. Wähle eine angenehme Stärke.", "मैक्स: हर योजना बदली जा सकती है; आरामदायक स्तर चुनें।", "ماكس: يمكنك تعديل أي خطة؛ اختر مستوى مريحًا.", "Mascotte Max : vous pouvez adapter chaque programme ; choisissez un niveau confortable.", "マスコットのマックス: プランは調整できます。無理のないレベルを選びましょう。", "Маскот Макс: план можно изменить — выберите комфортный уровень.", "Maskot Max: setiap rencana bisa disesuaikan; pilih tingkat yang nyaman."],
        "Mascot Max: Choose the version that feels steady and pain-free.": ["麦克斯：选择让你感觉稳定且不疼痛的动作版本。", "Mascota Max: elige la versión que se sienta estable y sin dolor.", "Maskottchen Max: Wähle die Variante, die sich sicher und schmerzfrei anfühlt.", "मैक्स: ऐसा तरीका चुनें जो स्थिर लगे और दर्द न करे।", "ماكس: اختر الطريقة التي تشعرك بالثبات دون ألم.", "Mascotte Max : choisissez la variante qui vous semble stable et sans douleur.", "マスコットのマックス: 安定していて痛みのない方法を選びましょう。", "Маскот Макс: выберите вариант, который ощущается устойчивым и безболезненным.", "Maskot Max: pilih gerakan yang terasa stabil dan tidak sakit."],
        "Mascot Max: Rest for a little while between sets.": ["麦克斯：组间稍微休息一下。", "Mascota Max: descansa un poco entre series.", "Maskottchen Max: Mache zwischen den Sätzen eine kurze Pause.", "मैक्स: सेट के बीच थोड़ी देर आराम करें।", "ماكس: استرح قليلًا بين المجموعات.", "Mascotte Max : reposez-vous un peu entre les séries.", "マスコットのマックス: セットの間に少し休みましょう。", "Маскот Макс: немного отдыхайте между подходами.", "Maskot Max: istirahat sebentar di antara set."],
        "Mascot Max: Take a short screen break whenever you need one.": ["麦克斯：需要时就短暂离开屏幕休息一下。", "Mascota Max: descansa un momento de la pantalla cuando lo necesites.", "Maskottchen Max: Lege eine kurze Bildschirmpause ein, wenn du sie brauchst.", "मैक्स: ज़रूरत पड़ने पर स्क्रीन से थोड़ा विराम लें।", "ماكس: خذ استراحة قصيرة من الشاشة متى احتجت.", "Mascotte Max : faites une courte pause d'écran quand vous en avez besoin.", "マスコットのマックス: 必要なときは画面から少し離れて休みましょう。", "Маскот Макс: делайте короткие перерывы от экрана, когда нужно.", "Maskot Max: istirahat sejenak dari layar jika perlu."],
        "Mascot Max: Check opening times before you go.": ["麦克斯：出发前请查看营业时间。", "Mascota Max: comprueba el horario antes de ir.", "Maskottchen Max: Prüfe die Öffnungszeiten, bevor du losgehst.", "मैक्स: जाने से पहले खुलने का समय जाँचें।", "ماكس: تحقق من أوقات العمل قبل الذهاب.", "Mascotte Max : vérifiez les horaires avant de partir.", "マスコットのマックス: 出かける前に営業時間を確認しましょう。", "Маскот Макс: проверьте часы работы перед выходом.", "Maskot Max: periksa jam buka sebelum pergi."],
        "Mascot Max: Pick one small goal to get started.": ["麦克斯：先选一个小目标开始吧。", "Mascota Max: empieza con un objetivo pequeño.", "Maskottchen Max: Beginne mit einem kleinen Ziel.", "मैक्स: शुरुआत के लिए एक छोटा लक्ष्य चुनें।", "ماكس: ابدأ باختيار هدف صغير.", "Mascotte Max : commencez par un petit objectif.", "マスコットのマックス: まずは小さな目標を一つ選びましょう。", "Маскот Макс: начните с небольшой цели.", "Maskot Max: mulai dengan satu target kecil."],
        "Mascot Max: If you are unsure, ask a trusted adult.": ["麦克斯：如果不确定，请询问你信任的成年人。", "Mascota Max: si tienes dudas, pregunta a un adulto de confianza.", "Maskottchen Max: Wenn du unsicher bist, frage eine erwachsene Vertrauensperson.", "मैक्स: संदेह हो तो किसी भरोसेमंद बड़े से पूछें।", "ماكس: إذا لم تكن متأكدًا، فاسأل شخصًا بالغًا تثق به.", "Mascotte Max : en cas de doute, demandez conseil à un adulte de confiance.", "マスコットのマックス: 迷ったときは、信頼できる大人に相談しましょう。", "Маскот Макс: если сомневаетесь, спросите взрослого, которому доверяете.", "Maskot Max: jika ragu, tanyakan kepada orang dewasa tepercaya."],
        "Mascot Max: You can change these settings whenever you like.": ["麦克斯：你可以随时更改这些设置。", "Mascota Max: puedes cambiar estos ajustes cuando quieras.", "Maskottchen Max: Du kannst diese Einstellungen jederzeit ändern.", "मैक्स: आप इन सेटिंग्स को कभी भी बदल सकते हैं।", "ماكس: يمكنك تغيير هذه الإعدادات متى شئت.", "Mascotte Max : vous pouvez modifier ces paramètres quand vous le souhaitez.", "マスコットのマックス: これらの設定はいつでも変更できます。", "Маскот Макс: эти настройки можно изменить в любое время.", "Maskot Max: Anda dapat mengubah pengaturan ini kapan saja."]
      };
      Object.entries(featureTranslationRows).forEach(([english, values]) => {
        values.forEach((translation, index) => {
          translations[localeOrder[index]][english] = translation;
        });
      });
      // Klingon word choices are checked against the CC BY-SA Klingon Pocket Dictionary:
      // https://klingonska.org/dict/
      Object.assign(translations.tlh, {
        Language: "Hol",
        Start: "yItagh",
        Pause: "yImev",
        Klingon: "tlhIngan Hol",
        "My Plan": "nabwIj",
        "Exercise Guide": "mI' DevwI'",
        Workout: "mI'",
        "Mini Games": "QujHommey",
        Places: "Daqmey",
        Goals: "ngoQmey",
        "Start game": "Quj yItagh",
        "Play again": "Quj yItagh",
        "Swing!": "yIQach",
        Score: "mI'",
        Runs: "mI'",
        Hits: "qIp",
        "Base hit! +1 run.": "qIp! +1",
        "Double! +2 runs.": "cha'logh qIp! +2",
        "Home run! +4 runs.": "Qapla'! +4"
      });

      const originalTextNodes = new WeakMap();
      const originalAttributes = new WeakMap();
      let currentLanguage = "en";
      const dynamicPhrases = {
        zh: { ready: "准备好开始", readyEnd: "的训练？", openFullscreen: "全屏打开", screening: "筛查数值" },
        es: { ready: "¿Listo para", readyEnd: "?", openFullscreen: "Abrir", openFullscreenEnd: " en pantalla completa", screening: "valor orientativo" },
        de: { ready: "Bereit für", readyEnd: "?", openFullscreen: "Öffne", openFullscreenEnd: " im Vollbild", screening: "Orientierungswert" },
        hi: { ready: "क्या आप", readyEnd: " के लिए?", openFullscreen: "फ़ुलस्क्रीन में खोलें", screening: "जाँच संख्या" },
        ar: { ready: "هل أنت مستعد لمدة", readyEnd: "؟", openFullscreen: "فتح", openFullscreenEnd: " بملء الشاشة", screening: "قيمة الفحص" },
        fr: { ready: "Prêt pour", readyEnd: " ?", openFullscreen: "Ouvrir", openFullscreenEnd: " en plein écran", screening: "valeur indicative" },
        ja: { ready: "準備はいいですか？", readyEnd: "分のトレーニング", openFullscreen: "全画面で開く", screening: "参考値" },
        ru: { ready: "Готовы заниматься", readyEnd: " минут?", openFullscreen: "Открыть", openFullscreenEnd: " на весь экран", screening: "ориентировочное значение" },
        id: { ready: "Siap berolahraga selama", readyEnd: " menit?", openFullscreen: "Buka", openFullscreenEnd: " dalam layar penuh", screening: "nilai skrining" },
        tlh: { ready: "Ready for", readyEnd: "?", openFullscreen: "Open", openFullscreenEnd: " in fullscreen", screening: "screening number" }
      };

      function translateText(text, language = currentLanguage) {
        if (language === "en") return text;
        const dictionary = translations[language] || {};
        if (dictionary[text]) return dictionary[text];

        let match = text.match(/^(\d+) minutes$/);
        if (match) return `${match[1]} ${dictionary.minutes || "minutes"}`;
        match = text.match(/^(\d+) seconds$/);
        if (match) return `${match[1]} ${dictionary.seconds || "seconds"}`;
        match = text.match(/^Score: (\d+) \/ (\d+)$/);
        if (match) return `${dictionary.Score || "Score"}: ${match[1]} / ${match[2]}`;
        match = text.match(/^Score: (\d+)$/);
        if (match) return `${dictionary.Score || "Score"}: ${match[1]}`;
        match = text.match(/^Runs: (\d+) \| Hits: (\d+) \/ 10$/);
        if (match) return `${dictionary.Runs || "Runs"}: ${match[1]} | ${dictionary.Hits || "Hits"}: ${match[2]} / 10`;
        match = text.match(/^Game over! Final score: (\d+) runs\.$/);
        if (match) return `${dictionary["Game over! Final score:"] || "Game over! Final score:"} ${match[1]} ${dictionary.Runs || "runs"}.`;
        match = text.match(/^Search ready: (.+)$/);
        if (match) return `${dictionary["Search ready"] || "Search ready"}: ${match[1]}`;
        match = text.match(/^Targets: (\d+) \/ (\d+)$/);
        if (match) return `${dictionary.Targets || "Targets"}: ${match[1]} / ${match[2]}`;
        match = text.match(/^Mines left: (\d+)$/);
        if (match) return `${dictionary["Mines left"] || "Mines left"}: ${match[1]}`;
        match = text.match(/^Adjacent mines: (\d+)$/);
        if (match) return `${dictionary["Adjacent mines"] || "Adjacent mines"}: ${match[1]}`;
        match = text.match(/^Your reaction time: (\d+) ms$/);
        if (match) return `${dictionary["Your reaction time"] || "Your reaction time"}: ${match[1]} ${dictionary.ms || "ms"}`;
        match = text.match(/^Ready for (\d+) minutes\?$/);
        if (match) {
          if (language === "ja") return `${match[1]}${dictionary.minutes || "分"}のトレーニングの準備はいいですか？`;
          const phrases = dynamicPhrases[language];
          return `${phrases.ready} ${match[1]} ${dictionary.minutes || "minutes"}${phrases.readyEnd}`;
        }
        match = text.match(/^(\d+) \/ (\d+) XP$/);
        if (match) return `${match[1]} / ${match[2]} ${dictionary.XP || "XP"}`;
        match = text.match(/^Fullscreen (.+)$/);
        if (match) return `${dictionary.Fullscreen || "Fullscreen"} ${translateText(match[1], language)}`;
        match = text.match(/^Open (.+) in fullscreen$/);
        if (match) {
          const phrases = dynamicPhrases[language];
          return `${phrases.openFullscreen} ${translateText(match[1], language)}${phrases.openFullscreenEnd || ""}`;
        }
        match = text.match(/^(.+) \(screening number ([\d.]+)\)$/);
        if (match) {
          return `${translateText(match[1], language)} (${dynamicPhrases[language].screening}: ${match[2]})`;
        }
        match = text.match(/^(\d+)% — more complete inputs add confidence, but this is not a medical result\.$/);
        if (match) {
          const explanation = {
            zh: "更多完整信息会提高可信度，但这不是医疗结果。",
            es: "Más datos completos aumentan la confianza, pero esto no es un resultado médico.",
            de: "Vollständigere Angaben erhöhen die Einschätzung, dies ist jedoch kein medizinisches Ergebnis.",
            hi: "अधिक पूरी जानकारी से भरोसा बढ़ता है, लेकिन यह चिकित्सा परिणाम नहीं है।",
            ar: "تزيد المعلومات المكتملة من الثقة، لكن هذه ليست نتيجة طبية.",
            fr: "Des informations plus complètes améliorent l'estimation, mais ce n'est pas un résultat médical.",
            ja: "入力が詳しいほど目安の信頼度は上がりますが、これは医療結果ではありません。",
            ru: "Более полные данные повышают надёжность оценки, но это не медицинское заключение.",
            id: "Informasi yang lebih lengkap meningkatkan keyakinan, tetapi ini bukan hasil medis.",
            tlh: "More complete inputs add confidence, but this is not a medical result."
          }[language];
          return `${match[1]}% — ${explanation}`;
        }

        return text;
      }

      function applyLanguage(language) {
        const supportedLanguages = ["en", ...localeOrder];
        currentLanguage = supportedLanguages.includes(language) ? language : "en";
        localStorage.setItem("workoutLanguage", currentLanguage);
        document.documentElement.lang = currentLanguage;
        document.body.dir = "ltr";
        document.querySelector("#languageSelect").value = currentLanguage;
        document.title = translateText("Totally Accurate Workout Simulator");

        const walker = document.createTreeWalker(document.body, 4);
        let textNode;
        while ((textNode = walker.nextNode())) {
          if (textNode.parentElement?.closest("[data-user-content]")) continue;
          if (!originalTextNodes.has(textNode)) originalTextNodes.set(textNode, textNode.nodeValue);
          const original = originalTextNodes.get(textNode);
          const leading = original.match(/^\s*/)[0];
          const trailing = original.match(/\s*$/)[0];
          const content = original.slice(leading.length, original.length - trailing.length);
          textNode.nodeValue = `${leading}${translateText(content)}${trailing}`;
        }

        document.querySelectorAll("[placeholder], [title], [aria-label]").forEach((element) => {
          let originals = originalAttributes.get(element);
          if (!originals) {
            originals = new Map();
            originalAttributes.set(element, originals);
          }
          ["placeholder", "title", "aria-label"].forEach((attribute) => {
            if (!element.hasAttribute(attribute)) return;
            if (!originals.has(attribute)) originals.set(attribute, element.getAttribute(attribute));
            element.setAttribute(attribute, translateText(originals.get(attribute)));
          });
        });
        updateExerciseRecommendation(true);
        document.querySelector("#coachTip").textContent = translateText(coachTips[coachIndex]);
        refreshGameLabels();
      }

      document.querySelector("#languageSelect").addEventListener("change", (event) => applyLanguage(event.target.value));
      function applyShade(shade) {
        localStorage.setItem("workoutShade", shade);
        let effective = shade;
        if (shade === "auto") {
          const hour = new Date().getHours();
          effective = hour < 7 || hour >= 19 ? "night" : hour >= 16 ? "sunset" : "day";
        }
        document.body.dataset.shade = effective;
        document.querySelector("#shadeSelect").value = shade;
      }

      document.querySelector("#shadeSelect").addEventListener("change", (event) => applyShade(event.target.value));

      const zoomInput = document.querySelector("#zoomInput");
      const zoomValue = document.querySelector("#zoomValue");
      function applyPageZoom(value) {
        const numericValue = Number(value);
        const validValue = Number.isFinite(numericValue) ? numericValue : 100;
        const zoom = Math.round(Math.max(80, Math.min(120, validValue)) / 5) * 5;
        document.documentElement.style.zoom = `${zoom}%`;
        zoomInput.value = String(zoom);
        zoomValue.textContent = `${zoom}%`;
        localStorage.setItem("workoutZoom", String(zoom));
      }

      zoomInput.addEventListener("input", (event) => applyPageZoom(event.currentTarget.value));
      applyPageZoom(localStorage.getItem("workoutZoom") || zoomInput.value);

      document.querySelector("#accentInput").addEventListener("input", (event) => {
        document.documentElement.style.setProperty("--accent", event.target.value);
        localStorage.setItem("workoutAccent", event.target.value);
      });

      document.querySelector("#resetTheme").addEventListener("click", () => {
        document.documentElement.style.setProperty("--accent", "#1877a8");
        document.querySelector("#accentInput").value = "#1877a8";
        localStorage.removeItem("workoutAccent");
        applyShade("day");
      });

      const savedShade = localStorage.getItem("workoutShade") || "day";
      applyShade(savedShade);
      const savedAccent = localStorage.getItem("workoutAccent");
      if (savedAccent) {
        document.documentElement.style.setProperty("--accent", savedAccent);
        document.querySelector("#accentInput").value = savedAccent;
      }

      function setMascotMessage(message) {
        document.querySelector("#mascotText").textContent = translateText(message);
      }

      const mascotMessagesByTab = {
        plan: [
          "Mascot Max: Add honest details to get a general starting plan.",
          "Mascot Max: Every plan can be adjusted; pick a comfortable level."
        ],
        learn: [
          "Mascot Max: Use slow, controlled practice and stop for sharp pain.",
          "Mascot Max: Choose the version that feels steady and pain-free."
        ],
        workout: [
          "Mascot Max: Keep water nearby and move at a comfortable pace.",
          "Mascot Max: Rest for a little while between sets."
        ],
        minigames: [
          "Mascot Max: Pick a game and give your eyes and fingers a fun challenge.",
          "Mascot Max: Take a short screen break whenever you need one."
        ],
        places: [
          "Mascot Max: Type an area and choose a place. Your search opens in Google Maps only when you click the link.",
          "Mascot Max: Check opening times before you go."
        ],
        goals: [
          "Mascot Max: Small goals add up. Try a goal you can finish today.",
          "Mascot Max: Pick one small goal to get started."
        ],
        health: [
          "Mascot Max: Serious symptoms need a parent or health professional.",
          "Mascot Max: If you are unsure, ask a trusted adult."
        ],
        settings: [
          "Mascot Max: Choose colors and shade that feel easy to see.",
          "Mascot Max: You can change these settings whenever you like."
        ]
      };
      const lastMascotMessageByTab = new Map();

      document.querySelectorAll(".tab").forEach((tab) => {
        tab.addEventListener("click", () => {
          const messages = mascotMessagesByTab[tab.dataset.tab];
          if (!messages) return;
          const previousMessage = lastMascotMessageByTab.get(tab.dataset.tab);
          let message = messages[Math.floor(Math.random() * messages.length)];
          if (messages.length > 1 && message === previousMessage) {
            message = messages[(messages.indexOf(message) + 1) % messages.length];
          }
          lastMascotMessageByTab.set(tab.dataset.tab, message);
          setMascotMessage(message);
        });
      });

      // Dino runner
      const gliderCanvas = document.querySelector("#gliderCanvas");
      const gliderContext = gliderCanvas.getContext("2d");
      const gliderRadius = 11;
      const gliderX = 72;
      const gliderGateWidth = 38;
      const gliderGapSize = 92;
      const gliderGravity = 0.16;
      const gliderFlapStrength = -3.5;
      const gliderGateSpeed = 1.6;
      const gliderGateSpacing = 190;
      let gliderRunning = false;
      let gliderSelected = false;
      let gliderFrame = null;
      let gliderLastFrame = null;
      let gliderY = gliderCanvas.height / 2;
      let gliderVelocity = 0;
      let gliderScore = 0;
      let gliderGates = [];
      let gliderStatusText = "Tap or press Space to glide through the gates.";

      function stopGlider() {
        gliderRunning = false;
        gliderSelected = false;
        window.cancelAnimationFrame(gliderFrame);
        gliderFrame = null;
        gliderLastFrame = null;
      }

      const dinoCanvas = document.querySelector("#dinoCanvas");
      const dinoContext = dinoCanvas.getContext("2d");
      let dinoRunning = false;
      let dinoScore = 0;
      let dinoFrame = null;
      let dino = { x: 35, y: 112, width: 24, height: 28, velocityY: 0 };
      let cactus = { x: 300, y: 120, width: 18, height: 20 };

      function drawDino() {
        dinoContext.clearRect(0, 0, dinoCanvas.width, dinoCanvas.height);
        dinoContext.fillStyle = "#eef4f8";
        dinoContext.fillRect(0, 0, dinoCanvas.width, dinoCanvas.height);
        dinoContext.fillStyle = "#607589";
        dinoContext.fillRect(0, 140, dinoCanvas.width, 2);
        dinoContext.fillStyle = "#12355b";
        dinoContext.fillRect(dino.x, dino.y, dino.width, dino.height);
        dinoContext.fillStyle = "#42b883";
        dinoContext.fillRect(cactus.x, cactus.y, cactus.width, cactus.height);
      }

      function dinoLoop() {
        dino.velocityY += 0.7;
        dino.y += dino.velocityY;
        if (dino.y >= 112) {
          dino.y = 112;
          dino.velocityY = 0;
        }
        cactus.x -= 4;
        if (cactus.x < -20) {
          cactus.x = 320 + Math.random() * 100;
          dinoScore += 1;
          document.querySelector("#dinoScore").textContent = translateText(`Score: ${dinoScore}`);
        }

        const hit = dino.x < cactus.x + cactus.width &&
          dino.x + dino.width > cactus.x &&
          dino.y < cactus.y + cactus.height &&
          dino.y + dino.height > cactus.y;

        drawDino();
        if (hit) {
          dinoRunning = false;
          window.cancelAnimationFrame(dinoFrame);
          setMascotMessage("Mascot Max: Good try! Wait for the cactus, then jump with one clean tap.");
          if (dinoScore >= 5) addXp(20);
          return;
        }
        dinoFrame = window.requestAnimationFrame(dinoLoop);
      }

      function startDino() {
        if (!dinoRunning) {
          stopOtherArcadeGames("dino");
          dinoRunning = true;
          dinoScore = 0;
          cactus.x = 300;
          dino.y = 112;
          dino.velocityY = 0;
          document.querySelector("#dinoScore").textContent = translateText("Score: 0");
          dinoLoop();
        } else if (dino.y >= 112) {
          dino.velocityY = -11;
        }
      }

      document.querySelector("#dinoStart").addEventListener("click", startDino);
      dinoCanvas.addEventListener("pointerdown", startDino);
      document.addEventListener("keydown", (event) => {
        if (
          event.code === "Space" &&
          document.querySelector("#minigames").classList.contains("active") &&
          !gliderSelected &&
          !baseballSessionActive &&
          !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
        ) {
          event.preventDefault();
          startDino();
        }
      });
      drawDino();

      // Snake
      const snakeCanvas = document.querySelector("#snakeCanvas");
      const snakeContext = snakeCanvas.getContext("2d");
      const snakeCell = 20;
      let snake = [{ x: 8, y: 8 }];
      let snakeFood = { x: 12, y: 12 };
      let snakeDirection = { x: 1, y: 0 };
      let snakeTimer = null;
      let snakeScore = 0;

      function drawSnake() {
        snakeContext.fillStyle = "#f8fbfd";
        snakeContext.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
        snakeContext.fillStyle = "#42b883";
        snakeContext.fillRect(snakeFood.x * snakeCell, snakeFood.y * snakeCell, snakeCell, snakeCell);
        snakeContext.fillStyle = "#1877a8";
        snake.forEach((part) => snakeContext.fillRect(part.x * snakeCell, part.y * snakeCell, snakeCell - 2, snakeCell - 2));
      }

      let snakeGameOverText = "";

      function moveSnake() {
        const head = {
          x: snake[0].x + snakeDirection.x,
          y: snake[0].y + snakeDirection.y
        };
        const hitWall = head.x < 0 || head.x >= 16 || head.y < 0 || head.y >= 16;
        const eatsFood = head.x === snakeFood.x && head.y === snakeFood.y;
        const bodyToCheck = eatsFood ? snake : snake.slice(0, -1);
        const hitTail = bodyToCheck.some((part) => part.x === head.x && part.y === head.y);

        if (hitWall || hitTail) {
          window.clearInterval(snakeTimer);
          snakeTimer = null;
          snakeGameOverText = hitWall ? "Game over! You hit the wall." : "Game over! You hit your tail.";
          document.querySelector("#snakeStatus").textContent = translateText(snakeGameOverText);
          setMascotMessage(hitWall
            ? "Mascot Max: You hit the edge. Restart and turn before the wall."
            : "Mascot Max: You crossed the trail. Try wider turns next time.");
          drawSnake();
          if (snakeScore >= 5) addXp(20);
          return;
        }
        snake.unshift(head);
        if (eatsFood) {
          snakeScore += 1;
          document.querySelector("#snakeScore").textContent = translateText(`Score: ${snakeScore}`);
          do {
            snakeFood = {
              x: Math.floor(Math.random() * 16),
              y: Math.floor(Math.random() * 16)
            };
          } while (snake.some((part) => part.x === snakeFood.x && part.y === snakeFood.y));
        } else {
          snake.pop();
        }
        drawSnake();
      }

      document.querySelector("#snakeStart").addEventListener("click", () => {
        stopOtherArcadeGames("snake");
        window.clearInterval(snakeTimer);
        snake = [{ x: 8, y: 8 }];
        snakeDirection = { x: 1, y: 0 };
        snakeScore = 0;
        snakeGameOverText = "";
        document.querySelector("#snakeStatus").textContent = translateText("Collect food. The wall and your own tail end the game.");
        document.querySelector("#snakeScore").textContent = translateText("Score: 0");
        drawSnake();
        snakeTimer = window.setInterval(moveSnake, 140);
      });

      document.addEventListener("keydown", (event) => {
        if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
        if (!snakeTimer) return;
        const directions = {
          arrowup: { x: 0, y: -1 },
          w: { x: 0, y: -1 },
          arrowdown: { x: 0, y: 1 },
          s: { x: 0, y: 1 },
          arrowleft: { x: -1, y: 0 },
          a: { x: -1, y: 0 },
          arrowright: { x: 1, y: 0 },
          d: { x: 1, y: 0 }
        };
        const key = event.key.toLowerCase();
        const next = directions[key];
        if (next && (next.x !== -snakeDirection.x || next.y !== -snakeDirection.y)) {
          if (snakeTimer && key.startsWith("arrow")) event.preventDefault();
          snakeDirection = next;
        }
      });

      snakeCanvas.addEventListener("pointerdown", (event) => {
        const rect = snakeCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (x > rect.width * 0.66) snakeDirection = { x: 1, y: 0 };
        else if (x < rect.width * 0.33) snakeDirection = { x: -1, y: 0 };
        else if (y < rect.height * 0.5) snakeDirection = { x: 0, y: -1 };
        else snakeDirection = { x: 0, y: 1 };
      });

      drawSnake();

      // Aim trainer
      const aimCanvas = document.querySelector("#aimCanvas");
      const aimContext = aimCanvas.getContext("2d");
      let aimCount = 0;
      let aimTarget = { x: 160, y: 160, radius: 22 };
      let aimActive = false;

      function drawAim() {
        aimContext.fillStyle = "#f8fbfd";
        aimContext.fillRect(0, 0, aimCanvas.width, aimCanvas.height);
        if (!aimActive) return;
        aimContext.beginPath();
        aimContext.arc(aimTarget.x, aimTarget.y, aimTarget.radius, 0, Math.PI * 2);
        aimContext.fillStyle = "#42b883";
        aimContext.fill();
        aimContext.strokeStyle = "#12355b";
        aimContext.lineWidth = 4;
        aimContext.stroke();
      }

      function placeAimTarget() {
        aimTarget = {
          x: 35 + Math.random() * 250,
          y: 35 + Math.random() * 250,
          radius: 18 + Math.random() * 10
        };
        drawAim();
      }

      document.querySelector("#aimStart").addEventListener("click", () => {
        stopGlider();
        aimCount = 0;
        aimActive = true;
        document.querySelector("#aimScore").textContent = translateText("Score: 0 / 20");
        placeAimTarget();
      });

      aimCanvas.addEventListener("pointerdown", (event) => {
        if (!aimActive) return;
        const rect = aimCanvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * (aimCanvas.width / rect.width);
        const y = (event.clientY - rect.top) * (aimCanvas.height / rect.height);
        const distance = Math.hypot(x - aimTarget.x, y - aimTarget.y);
        if (distance <= aimTarget.radius) {
          aimCount += 1;
          document.querySelector("#aimScore").textContent = translateText(`Score: ${aimCount} / 20`);
          if (aimCount >= 20) {
            aimActive = false;
            drawAim();
            addXp(25);
            setMascotMessage("Mascot Max: Twenty targets complete. That was a focused hand-eye workout!");
          } else {
            placeAimTarget();
          }
        }
      });

      drawAim();

      // Minesweeper
      const mineBoardElement = document.querySelector("#mineBoard");
      const mineSize = 8;
      const mineTotal = 10;
      let mineCells = [];
      let mineFlagsEnabled = false;
      let mineGameOver = false;
      let mineWon = false;
      let mineFirstReveal = true;
      let mineScore = 0;

      function updateMineScore() {
        document.querySelector("#mineScore").textContent = translateText(`Score: ${mineScore}`);
      }

      function updateMineStatus() {
        const status = mineWon
          ? "You cleared the board!"
          : mineGameOver
            ? "Boom! You found a mine. Start a new board."
            : mineScore > 0
              ? `Mines left: ${mineTotal - mineCells.flat().filter((cell) => cell.flagged).length}`
              : "Find the safe squares. Numbers show nearby mines.";
        document.querySelector("#mineStatus").textContent = translateText(status);
      }

      function adjacentMineCount(row, column) {
        let count = 0;
        for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
          for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
            if (rowOffset === 0 && columnOffset === 0) continue;
            const neighbor = mineCells[row + rowOffset]?.[column + columnOffset];
            if (neighbor?.mine) count += 1;
          }
        }
        return count;
      }

      function renderMinefield() {
        mineBoardElement.replaceChildren();
        mineBoardElement.style.gridTemplateColumns = `repeat(${mineSize}, minmax(0, 1fr))`;
        mineCells.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "mine-cell";
          button.setAttribute("role", "gridcell");

          if (cell.flagged) {
            button.textContent = "F";
            button.classList.add("flagged");
            button.setAttribute("aria-label", translateText("Flagged cell"));
          } else if (cell.revealed) {
            button.disabled = true;
            button.classList.add("revealed");
            if (cell.mine) {
              button.textContent = "X";
              button.classList.add("mine-hit");
              button.setAttribute("aria-label", translateText("Mine"));
            } else if (cell.neighbors > 0) {
              button.textContent = String(cell.neighbors);
              button.setAttribute("aria-label", translateText(`Adjacent mines: ${cell.neighbors}`));
            } else {
              button.setAttribute("aria-label", translateText("Empty safe cell"));
            }
          } else {
            button.setAttribute("aria-label", translateText("Hidden cell"));
          }

          button.addEventListener("click", () => {
            if (mineGameOver || cell.revealed) return;
            if (mineFlagsEnabled) {
              cell.flagged = !cell.flagged;
              updateMineStatus();
            } else if (!cell.flagged) {
              revealMineCell(rowIndex, columnIndex);
            }
            renderMinefield();
          });
          mineBoardElement.append(button);
        }));
      }

      function revealMineCell(startRow, startColumn) {
        const start = mineCells[startRow]?.[startColumn];
        if (!start || start.revealed || start.flagged) return;
        if (mineFirstReveal) {
          mineFirstReveal = false;
          if (start.mine) {
            start.mine = false;
            const safePositions = mineCells.flat().filter((cell) => !cell.mine && cell !== start);
            safePositions[Math.floor(Math.random() * safePositions.length)].mine = true;
          }
        }
        if (start.mine) {
          mineGameOver = true;
          mineCells.flat().forEach((cell) => {
            if (cell.mine) cell.revealed = true;
          });
          updateMineStatus();
          return;
        }

        const pending = [[startRow, startColumn]];
        while (pending.length) {
          const [rowIndex, columnIndex] = pending.pop();
          const cell = mineCells[rowIndex]?.[columnIndex];
          if (!cell || cell.revealed || cell.flagged || cell.mine) continue;
          cell.revealed = true;
          cell.neighbors = adjacentMineCount(rowIndex, columnIndex);
          mineScore += 1;

          if (cell.neighbors === 0) {
            for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
              for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
                if (rowOffset !== 0 || columnOffset !== 0) {
                  pending.push([rowIndex + rowOffset, columnIndex + columnOffset]);
                }
              }
            }
          }
        }

        updateMineScore();
        if (mineScore === mineSize * mineSize - mineTotal) {
          mineGameOver = true;
          mineWon = true;
          updateMineStatus();
          addXp(15);
        } else {
          updateMineStatus();
        }
      }

      function startMinefield() {
        stopGlider();
        mineGameOver = false;
        mineWon = false;
        mineFirstReveal = true;
        mineScore = 0;
        mineFlagsEnabled = false;
        mineCells = Array.from({ length: mineSize }, () =>
          Array.from({ length: mineSize }, () => ({
            mine: false,
            revealed: false,
            flagged: false,
            neighbors: 0
          }))
        );

        const positions = Array.from({ length: mineSize * mineSize }, (_, index) => index);
        for (let i = positions.length - 1; i > 0; i -= 1) {
          const swapIndex = Math.floor(Math.random() * (i + 1));
          [positions[i], positions[swapIndex]] = [positions[swapIndex], positions[i]];
        }
        positions.slice(0, mineTotal).forEach((position) => {
          mineCells[Math.floor(position / mineSize)][position % mineSize].mine = true;
        });

        updateMineStatus();
        document.querySelector("#mineMode").textContent = translateText("Flag mode: off");
        updateMineScore();
        renderMinefield();
      }

      document.querySelector("#mineMode").addEventListener("click", () => {
        mineFlagsEnabled = !mineFlagsEnabled;
        document.querySelector("#mineMode").textContent =
          translateText(`Flag mode: ${mineFlagsEnabled ? "on" : "off"}`);
      });
      document.querySelector("#mineRestart").addEventListener("click", startMinefield);
      mineBoardElement.addEventListener("contextmenu", (event) => {
        if (event.target.closest(".mine-cell")) event.preventDefault();
      });
      startMinefield();

      // Original, procedurally generated retro maze.
      const pacCanvas = document.querySelector("#pacCanvas");
      const pacContext = pacCanvas.getContext("2d");
      const pacSize = 19;
      const pacCell = pacCanvas.width / pacSize;
      let pacMap = [];
      let pacPlayer = { x: 1, y: 1 };
      let pacGhost = { x: pacSize - 2, y: pacSize - 2 };
      let pacDirection = { x: 0, y: 0 };
      let pacNextDirection = { x: 0, y: 0 };
      let pacGhostDirection = { x: 0, y: 0 };
      let pacDotsRemaining = 0;
      let pacScoreValue = 0;
      let pacTicks = 0;
      let pacTimer = null;
      let pacRunning = false;
      let pacGameResult = "";

      const baseballCanvas = document.querySelector("#baseballCanvas");
      const baseballContext = baseballCanvas.getContext("2d");
      const baseballPitchButton = document.querySelector("#baseballPitch");
      const baseballSwingButton = document.querySelector("#baseballSwing");
      let baseballSessionActive = false;
      let baseballPitchActive = false;
      let baseballTimer = null;
      let baseballPitchX = 284;
      let baseballRuns = 0;
      let baseballHits = 0;
      let baseballPitches = 0;
      let baseballStatusText = "Start a game, then swing when the pitch reaches the plate.";
      let baseballAnimation = null;
      let baseballAnimationFrame = null;
      const baseballAnimationDurations = {
        strike: 480,
        hit: 680,
        double: 820,
        homeRun: 1050
      };

      function stopOtherArcadeGames(activeGame) {
        if (activeGame === "glider") gliderSelected = true;
        else stopGlider();
        if (activeGame !== "dino") {
          dinoRunning = false;
          window.cancelAnimationFrame(dinoFrame);
        }
        if (activeGame !== "snake") {
          window.clearInterval(snakeTimer);
          snakeTimer = null;
        }
        if (activeGame !== "pac") {
          window.clearInterval(pacTimer);
          pacTimer = null;
          pacRunning = false;
        }
        if (activeGame !== "baseball" && (baseballSessionActive || baseballPitchActive || baseballAnimation)) {
          window.clearInterval(baseballTimer);
          baseballTimer = null;
          window.cancelAnimationFrame(baseballAnimationFrame);
          baseballAnimationFrame = null;
          baseballAnimation = null;
          baseballSessionActive = false;
          baseballPitchActive = false;
          baseballSwingButton.disabled = true;
          baseballStatusText = "Game ended when you started another minigame.";
          updateBaseballLabels();
          drawBaseball();
        }
      }

      function drawGliderCloud(x, y, size) {
        gliderContext.fillStyle = "rgba(255, 255, 255, 0.78)";
        gliderContext.beginPath();
        gliderContext.arc(x, y, size, 0, Math.PI * 2);
        gliderContext.arc(x + size * 1.1, y - size * 0.25, size * 0.78, 0, Math.PI * 2);
        gliderContext.arc(x + size * 2, y, size * 0.62, 0, Math.PI * 2);
        gliderContext.fill();
      }

      function drawGliderGate(gate) {
        const gapBottom = gate.gapTop + gliderGapSize;
        gliderContext.fillStyle = "#59b8aa";
        gliderContext.strokeStyle = "#277f79";
        gliderContext.lineWidth = 2;
        gliderContext.fillRect(gate.x + 5, 0, gliderGateWidth - 10, gate.gapTop);
        gliderContext.strokeRect(gate.x + 5, 0, gliderGateWidth - 10, gate.gapTop);
        gliderContext.fillRect(gate.x + 5, gapBottom, gliderGateWidth - 10, gliderCanvas.height - gapBottom);
        gliderContext.strokeRect(gate.x + 5, gapBottom, gliderGateWidth - 10, gliderCanvas.height - gapBottom);
        gliderContext.beginPath();
        gliderContext.arc(gate.x + gliderGateWidth / 2, gate.gapTop - 9, 9, 0, Math.PI * 2);
        gliderContext.arc(gate.x + gliderGateWidth / 2 - 7, gate.gapTop - 9, 7, 0, Math.PI * 2);
        gliderContext.arc(gate.x + gliderGateWidth / 2 + 7, gate.gapTop - 9, 7, 0, Math.PI * 2);
        gliderContext.arc(gate.x + gliderGateWidth / 2, gapBottom + 9, 9, 0, Math.PI * 2);
        gliderContext.arc(gate.x + gliderGateWidth / 2 - 7, gapBottom + 9, 7, 0, Math.PI * 2);
        gliderContext.arc(gate.x + gliderGateWidth / 2 + 7, gapBottom + 9, 7, 0, Math.PI * 2);
        gliderContext.fillStyle = "#8bddd0";
        gliderContext.fill();
        gliderContext.strokeStyle = "#277f79";
        gliderContext.stroke();
      }

      function drawGlider() {
        const sky = gliderContext.createLinearGradient(0, 0, 0, gliderCanvas.height);
        sky.addColorStop(0, "#8bd7f5");
        sky.addColorStop(1, "#e5f8ff");
        gliderContext.fillStyle = sky;
        gliderContext.fillRect(0, 0, gliderCanvas.width, gliderCanvas.height);
        drawGliderCloud(28, 38, 17);
        drawGliderCloud(214, 36, 12);
        gliderGates.forEach(drawGliderGate);

        gliderContext.fillStyle = "#ffca62";
        gliderContext.strokeStyle = "#875b20";
        gliderContext.lineWidth = 2;
        gliderContext.beginPath();
        gliderContext.moveTo(gliderX + 13, gliderY);
        gliderContext.lineTo(gliderX - 11, gliderY - 8);
        gliderContext.lineTo(gliderX - 5, gliderY);
        gliderContext.lineTo(gliderX - 11, gliderY + 8);
        gliderContext.closePath();
        gliderContext.fill();
        gliderContext.stroke();
      }

      function updateGliderLabels() {
        document.querySelector("#gliderScore").textContent = translateText(`Score: ${gliderScore}`);
        document.querySelector("#gliderStatus").textContent = translateText(gliderStatusText);
      }

      function endGliderGame() {
        gliderRunning = false;
        gliderSelected = true;
        gliderFrame = null;
        gliderLastFrame = null;
        gliderStatusText = "Glider game over! Press Start / Glide to try again.";
        updateGliderLabels();
        if (gliderScore >= 5) addXp(15);
      }

      function gliderLoop(timestamp) {
        const elapsed = gliderLastFrame === null ? 0 : timestamp - gliderLastFrame;
        const frameScale = Math.min(elapsed / (1000 / 60), 2);
        gliderLastFrame = timestamp;
        gliderVelocity += gliderGravity * frameScale;
        gliderY += gliderVelocity * frameScale;
        gliderGates.forEach((gate) => {
          gate.x -= gliderGateSpeed * frameScale;
          if (!gate.scored && gate.x + gliderGateWidth < gliderX - gliderRadius) {
            gate.scored = true;
            gliderScore += 1;
            document.querySelector("#gliderScore").textContent = translateText(`Score: ${gliderScore}`);
          }
        });

        if (gliderGates[gliderGates.length - 1].x < gliderCanvas.width - gliderGateSpacing) {
          const gapTop = 28 + Math.random() * (gliderCanvas.height - gliderGapSize - 56);
          gliderGates.push({
            x: gliderGates[gliderGates.length - 1].x + gliderGateSpacing,
            gapTop,
            scored: false
          });
        }
        gliderGates = gliderGates.filter((gate) => gate.x + gliderGateWidth > 0);

        const hitEdge = gliderY < gliderRadius || gliderY > gliderCanvas.height - gliderRadius;
        const hitGate = gliderGates.some((gate) => {
          const overlapsGate = gliderX + gliderRadius > gate.x &&
            gliderX - gliderRadius < gate.x + gliderGateWidth;
          const gapBottom = gate.gapTop + gliderGapSize;
          return overlapsGate &&
            (gliderY - gliderRadius < gate.gapTop || gliderY + gliderRadius > gapBottom);
        });
        drawGlider();
        if (hitEdge || hitGate) {
          endGliderGame();
          return;
        }
        gliderFrame = window.requestAnimationFrame(gliderLoop);
      }

      function flapGlider() {
        gliderVelocity = gliderFlapStrength;
      }

      function startGlider() {
        if (!gliderRunning) {
          stopOtherArcadeGames("glider");
          gliderScore = 0;
          gliderY = gliderCanvas.height / 2;
          gliderVelocity = 0;
          gliderLastFrame = null;
          gliderGates = [{
            x: gliderCanvas.width + 20,
            gapTop: 28 + Math.random() * (gliderCanvas.height - gliderGapSize - 56),
            scored: false
          }];
          gliderStatusText = "Tap or press Space to glide through the gates.";
          updateGliderLabels();
          drawGlider();
          gliderRunning = true;
          gliderFrame = window.requestAnimationFrame(gliderLoop);
        }
        flapGlider();
      }

      document.querySelector("#gliderStart").addEventListener("click", startGlider);
      gliderCanvas.addEventListener("pointerdown", () => {
        if (gliderRunning) flapGlider();
        else startGlider();
      });
      document.addEventListener("keydown", (event) => {
        if (
          event.code === "Space" &&
          gliderSelected &&
          document.querySelector("#minigames").classList.contains("active") &&
          !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
        ) {
          event.preventDefault();
          if (gliderRunning) flapGlider();
          else startGlider();
        }
      });
      drawGlider();

      function createPacMap() {
        pacMap = Array.from({ length: pacSize }, () => Array(pacSize).fill(1));
        const stack = [{ x: 1, y: 1 }];
        pacMap[1][1] = 2;
        const steps = [
          { x: 0, y: -2 }, { x: 0, y: 2 },
          { x: -2, y: 0 }, { x: 2, y: 0 }
        ];

        while (stack.length) {
          const current = stack[stack.length - 1];
          const neighbors = steps
            .map((step) => ({ x: current.x + step.x, y: current.y + step.y, step }))
            .filter(({ x, y }) =>
              x > 0 && y > 0 && x < pacSize - 1 && y < pacSize - 1 && pacMap[y][x] === 1
            );
          if (!neighbors.length) {
            stack.pop();
            continue;
          }

          const next = neighbors[Math.floor(Math.random() * neighbors.length)];
          pacMap[current.y + next.step.y / 2][current.x + next.step.x / 2] = 0;
          pacMap[next.y][next.x] = 0;
          stack.push({ x: next.x, y: next.y });
        }

        for (let y = 1; y < pacSize - 1; y++) {
          for (let x = 1; x < pacSize - 1; x++) {
            if (pacMap[y][x] !== 1) continue;
            const horizontalLoop = y % 2 === 1 && x % 2 === 0 &&
              pacMap[y][x - 1] === 0 && pacMap[y][x + 1] === 0;
            const verticalLoop = x % 2 === 1 && y % 2 === 0 &&
              pacMap[y - 1][x] === 0 && pacMap[y + 1][x] === 0;
            if ((horizontalLoop || verticalLoop) && Math.random() < 0.22) {
              pacMap[y][x] = 0;
            }
          }
        }

        pacDotsRemaining = pacMap.flat().filter((cell) => cell === 0).length;
      }

      function drawPacMaze() {
        const background = pacContext.createLinearGradient(0, 0, pacCanvas.width, pacCanvas.height);
        background.addColorStop(0, "#07152d");
        background.addColorStop(1, "#10123b");
        pacContext.fillStyle = background;
        pacContext.fillRect(0, 0, pacCanvas.width, pacCanvas.height);

        pacMap.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => {
          const x = columnIndex * pacCell;
          const y = rowIndex * pacCell;
          if (cell === 1) {
            pacContext.fillStyle = "#162c69";
            pacContext.fillRect(x + 1.5, y + 1.5, pacCell - 3, pacCell - 3);
            pacContext.strokeStyle = "#4b8ff0";
            pacContext.lineWidth = 1;
            pacContext.strokeRect(x + 2, y + 2, pacCell - 4, pacCell - 4);
          } else if (cell === 0 &&
                     (pacPlayer.x !== columnIndex || pacPlayer.y !== rowIndex) &&
                     (pacGhost.x !== columnIndex || pacGhost.y !== rowIndex)) {
            pacContext.fillStyle = "#fff1bd";
            pacContext.shadowColor = "#ffca62";
            pacContext.shadowBlur = 5;
            pacContext.beginPath();
            pacContext.arc(x + pacCell / 2, y + pacCell / 2, 2, 0, Math.PI * 2);
            pacContext.fill();
            pacContext.shadowBlur = 0;
          }
        }));

        const playerCenterX = pacPlayer.x * pacCell + pacCell / 2;
        const playerCenterY = pacPlayer.y * pacCell + pacCell / 2;
        const playerAngle = Math.atan2(pacDirection.y, pacDirection.x);
        pacContext.fillStyle = "#ffd449";
        pacContext.shadowColor = "#ffb01f";
        pacContext.shadowBlur = 11;
        pacContext.beginPath();
        pacContext.moveTo(playerCenterX, playerCenterY);
        pacContext.arc(playerCenterX, playerCenterY, pacCell * 0.4, playerAngle + 0.35, playerAngle + Math.PI * 2 - 0.35);
        pacContext.closePath();
        pacContext.fill();
        pacContext.shadowBlur = 0;

        const ghostCenterX = pacGhost.x * pacCell + pacCell / 2;
        const ghostCenterY = pacGhost.y * pacCell + pacCell / 2;
        const ghostRadius = pacCell * 0.39;
        pacContext.fillStyle = "#ff6686";
        pacContext.shadowColor = "#ff3b76";
        pacContext.shadowBlur = 10;
        pacContext.beginPath();
        pacContext.arc(ghostCenterX, ghostCenterY, ghostRadius, Math.PI, 0);
        pacContext.lineTo(ghostCenterX + ghostRadius, ghostCenterY + ghostRadius);
        pacContext.lineTo(ghostCenterX + ghostRadius * 0.35, ghostCenterY + ghostRadius * 0.72);
        pacContext.lineTo(ghostCenterX, ghostCenterY + ghostRadius);
        pacContext.lineTo(ghostCenterX - ghostRadius * 0.35, ghostCenterY + ghostRadius * 0.72);
        pacContext.lineTo(ghostCenterX - ghostRadius, ghostCenterY + ghostRadius);
        pacContext.closePath();
        pacContext.fill();
        pacContext.shadowBlur = 0;
        [-2.5, 2.5].forEach((offset) => {
          pacContext.fillStyle = "#ffffff";
          pacContext.beginPath();
          pacContext.ellipse(ghostCenterX + offset, ghostCenterY - 1, 2.2, 3, 0, 0, Math.PI * 2);
          pacContext.fill();
          pacContext.fillStyle = "#263b86";
          pacContext.beginPath();
          pacContext.arc(ghostCenterX + offset, ghostCenterY - 1, 1, 0, Math.PI * 2);
          pacContext.fill();
        });
      }

      function pacCanMove(position, direction) {
        const x = position.x + direction.x;
        const y = position.y + direction.y;
        return pacMap[y]?.[x] === 0 || pacMap[y]?.[x] === 2;
      }

      function endPacGame(won) {
        pacRunning = false;
        window.clearInterval(pacTimer);
        pacTimer = null;
        pacGameResult = won ? "Maze cleared! Great collecting." : "The ghost caught you. Start again to retry.";
        document.querySelector("#pacStatus").textContent = translateText(pacGameResult);
        if (won) addXp(25);
        setMascotMessage(won
          ? "Mascot Max: You collected every dot. Nice maze skills!"
          : "Mascot Max: The ghost got you. Try changing direction before it gets close.");
      }

      function movePacGhost() {
        const directions = [
          { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
        ].filter((direction) => pacCanMove(pacGhost, direction));
        if (!directions.length) return;
        const nonReverse = directions.filter((direction) =>
          direction.x !== -pacGhostDirection.x || direction.y !== -pacGhostDirection.y
        );
        const choices = nonReverse.length ? nonReverse : directions;
        const choice = choices[Math.floor(Math.random() * choices.length)];
        pacGhostDirection = choice;
        pacGhost = { x: pacGhost.x + choice.x, y: pacGhost.y + choice.y };
      }

      function tickPacGame() {
        if (pacCanMove(pacPlayer, pacNextDirection)) pacDirection = pacNextDirection;
        if (pacCanMove(pacPlayer, pacDirection)) {
          pacPlayer = { x: pacPlayer.x + pacDirection.x, y: pacPlayer.y + pacDirection.y };
        }

        if (pacMap[pacPlayer.y][pacPlayer.x] === 0) {
          pacMap[pacPlayer.y][pacPlayer.x] = 2;
          pacDotsRemaining -= 1;
          pacScoreValue += 10;
          document.querySelector("#pacScore").textContent = translateText(`Score: ${pacScoreValue}`);
        }

        if (pacPlayer.x === pacGhost.x && pacPlayer.y === pacGhost.y) {
          drawPacMaze();
          endPacGame(false);
          return;
        }

        pacTicks += 1;
        if (pacTicks % 2 === 0) movePacGhost();
        drawPacMaze();

        if (pacPlayer.x === pacGhost.x && pacPlayer.y === pacGhost.y) {
          endPacGame(false);
        } else if (pacDotsRemaining === 0) {
          endPacGame(true);
        }
      }

      function startPacGame() {
        stopOtherArcadeGames("pac");
        window.clearInterval(pacTimer);
        createPacMap();
        pacPlayer = { x: 1, y: 1 };
        pacGhost = { x: pacSize - 2, y: pacSize - 2 };
        pacDirection = { x: 0, y: 0 };
        pacNextDirection = { x: 0, y: 0 };
        pacGhostDirection = { x: 0, y: 0 };
        pacScoreValue = 0;
        pacTicks = 0;
        pacRunning = true;
        pacGameResult = "";
        document.querySelector("#pacScore").textContent = translateText("Score: 0");
        document.querySelector("#pacStatus").textContent = translateText("Use arrow keys or WASD to collect dots and avoid the ghost.");
        drawPacMaze();
        pacTimer = window.setInterval(tickPacGame, 145);
      }

      document.querySelector("#pacStart").addEventListener("click", startPacGame);
      document.addEventListener("keydown", (event) => {
        if (!pacRunning || ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
        const directions = {
          arrowup: { x: 0, y: -1 }, w: { x: 0, y: -1 },
          arrowdown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
          arrowleft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
          arrowright: { x: 1, y: 0 }, d: { x: 1, y: 0 }
        };
        const direction = directions[event.key.toLowerCase()];
        if (!direction) return;
        pacNextDirection = direction;
        if (event.key.startsWith("Arrow")) event.preventDefault();
      });

      pacCanvas.addEventListener("pointerdown", (event) => {
        if (!pacRunning) return;
        const bounds = pacCanvas.getBoundingClientRect();
        const touchX = Math.floor(((event.clientX - bounds.left) / bounds.width) * pacSize);
        const touchY = Math.floor(((event.clientY - bounds.top) / bounds.height) * pacSize);
        const deltaX = touchX - pacPlayer.x;
        const deltaY = touchY - pacPlayer.y;
        pacNextDirection = Math.abs(deltaX) > Math.abs(deltaY)
          ? { x: Math.sign(deltaX), y: 0 }
          : { x: 0, y: Math.sign(deltaY) };
      });

      createPacMap();
      drawPacMaze();

      function drawBaseballBall(x, y) {
        baseballContext.fillStyle = "#fffdf3";
        baseballContext.beginPath();
        baseballContext.arc(x, y, 6, 0, Math.PI * 2);
        baseballContext.fill();
        baseballContext.strokeStyle = "#d85252";
        baseballContext.lineWidth = 1;
        baseballContext.beginPath();
        baseballContext.moveTo(x - 2, y - 4);
        baseballContext.lineTo(x + 2, y + 4);
        baseballContext.moveTo(x + 2, y - 4);
        baseballContext.lineTo(x - 2, y + 4);
        baseballContext.stroke();
      }

      function drawBaseball(timestamp = performance.now()) {
        const animationElapsed = baseballAnimation
          ? timestamp - baseballAnimation.startedAt
          : 0;
        const animationDuration = baseballAnimation
          ? baseballAnimationDurations[baseballAnimation.kind]
          : 0;
        const animationProgress = animationDuration
          ? Math.min(animationElapsed / animationDuration, 1)
          : 0;
        const batSwing = baseballAnimation?.swung
          ? Math.sin(Math.min(animationElapsed / 320, 1) * Math.PI)
          : 0;
        const pitchProgress = baseballPitchActive
          ? Math.min((284 - baseballPitchX) / (284 - 46), 1)
          : 0;
        const sky = baseballContext.createLinearGradient(0, 0, 0, baseballCanvas.height);
        sky.addColorStop(0, "#9edbff");
        sky.addColorStop(0.58, "#e5f7ff");
        sky.addColorStop(0.59, "#4ea75c");
        sky.addColorStop(1, "#24734c");
        baseballContext.fillStyle = sky;
        baseballContext.fillRect(0, 0, baseballCanvas.width, baseballCanvas.height);

        baseballContext.fillStyle = "#ffffff";
        baseballContext.beginPath();
        baseballContext.arc(42, 42, 19, 0, Math.PI * 2);
        baseballContext.fill();
        baseballContext.fillStyle = "#d9efff";
        baseballContext.fillRect(0, 80, baseballCanvas.width, 40);

        baseballContext.strokeStyle = "rgba(255,255,255,0.8)";
        baseballContext.lineWidth = 2;
        baseballContext.beginPath();
        baseballContext.moveTo(55, 181);
        baseballContext.lineTo(245, 181);
        baseballContext.lineTo(292, 108);
        baseballContext.moveTo(55, 181);
        baseballContext.lineTo(111, 108);
        baseballContext.stroke();

        baseballContext.fillStyle = "#f2dfb6";
        baseballContext.beginPath();
        baseballContext.moveTo(55, 181);
        baseballContext.lineTo(111, 108);
        baseballContext.lineTo(245, 108);
        baseballContext.lineTo(292, 181);
        baseballContext.closePath();
        baseballContext.fill();
        baseballContext.fillStyle = "#ffffff";
        [[111, 108], [245, 108], [245, 181]].forEach(([x, y]) => {
          baseballContext.fillRect(x - 4, y - 4, 8, 8);
        });

        baseballContext.fillStyle = "#f8f6ec";
        baseballContext.beginPath();
        baseballContext.moveTo(55, 176);
        baseballContext.lineTo(61, 181);
        baseballContext.lineTo(55, 186);
        baseballContext.lineTo(49, 181);
        baseballContext.closePath();
        baseballContext.fill();

        baseballContext.fillStyle = "#e7a14d";
        baseballContext.beginPath();
        baseballContext.arc(230, 129, 8, 0, Math.PI * 2);
        baseballContext.fill();
        baseballContext.fillStyle = "#24334a";
        baseballContext.beginPath();
        baseballContext.arc(230, 101, 6, 0, Math.PI * 2);
        baseballContext.fill();
        baseballContext.strokeStyle = "#24334a";
        baseballContext.lineWidth = 4;
        baseballContext.beginPath();
        baseballContext.moveTo(230, 108);
        baseballContext.lineTo(230, 128);
        baseballContext.moveTo(230, 115);
        baseballContext.lineTo(
          220 - 10 * Math.sin(Math.PI * pitchProgress),
          122 - 16 * Math.sin(Math.PI * pitchProgress)
        );
        baseballContext.moveTo(230, 115);
        baseballContext.lineTo(237, 122);
        baseballContext.moveTo(230, 128);
        baseballContext.lineTo(223, 139);
        baseballContext.moveTo(230, 128);
        baseballContext.lineTo(237, 139);
        baseballContext.stroke();

        baseballContext.fillStyle = "#ffd34f";
        baseballContext.beginPath();
        baseballContext.arc(70, 127, 6, 0, Math.PI * 2);
        baseballContext.fill();
        baseballContext.fillStyle = "#294e83";
        baseballContext.fillRect(64, 134, 12, 24);
        baseballContext.strokeStyle = "#294e83";
        baseballContext.lineWidth = 4;
        baseballContext.beginPath();
        baseballContext.moveTo(67, 155);
        baseballContext.lineTo(61, 171);
        baseballContext.moveTo(73, 155);
        baseballContext.lineTo(80, 170);
        baseballContext.moveTo(67, 139);
        baseballContext.lineTo(84, 125);
        baseballContext.moveTo(74, 139);
        baseballContext.lineTo(84, 146);
        baseballContext.stroke();
        baseballContext.strokeStyle = "#9c6036";
        baseballContext.lineWidth = 5;
        baseballContext.beginPath();
        baseballContext.moveTo(80, 129);
        baseballContext.lineTo(
          80 + 30 * Math.cos(-0.96 + 2.1 * batSwing),
          129 + 30 * Math.sin(-0.96 + 2.1 * batSwing)
        );
        baseballContext.stroke();

        if (baseballPitchActive) {
          drawBaseballBall(baseballPitchX, 126);
        } else if (baseballAnimation) {
          let ballX;
          let ballY;
          let trailStartX;
          if (baseballAnimation.kind === "strike") {
            trailStartX = baseballAnimation.pitchX;
            const targetX = trailStartX > 46 ? 46 : 0;
            ballX = trailStartX + (targetX - trailStartX) * animationProgress;
            ballY = 126 + Math.sin(animationProgress * Math.PI) * 2;
          } else {
            const hitPath = {
              hit: { x: 170, y: 151, arc: 12, color: "#fffdf3" },
              double: { x: 245, y: 108, arc: 54, color: "#f7c95c" },
              homeRun: { x: 330, y: 18, arc: 82, color: "#ffb94f" }
            }[baseballAnimation.kind];
            ballX = 90 + (hitPath.x - 90) * animationProgress;
            ballY = 126 + (hitPath.y - 126) * animationProgress -
              hitPath.arc * 4 * animationProgress * (1 - animationProgress);
            trailStartX = 90;
            baseballContext.strokeStyle = hitPath.color;
            baseballContext.globalAlpha = 0.55;
            baseballContext.lineWidth = 2;
            baseballContext.beginPath();
            baseballContext.moveTo(trailStartX, 126);
            baseballContext.lineTo(ballX, ballY);
            baseballContext.stroke();
            baseballContext.globalAlpha = 1;
          }
          drawBaseballBall(ballX, ballY);
        }

        baseballContext.fillStyle = "#173b37";
        baseballContext.font = "bold 12px system-ui";
        baseballContext.fillText("SWING ZONE", 100, 198);
        baseballContext.strokeStyle = "#fff5bf";
        baseballContext.setLineDash([4, 4]);
        baseballContext.beginPath();
        baseballContext.moveTo(90, 113);
        baseballContext.lineTo(90, 160);
        baseballContext.stroke();
        baseballContext.setLineDash([]);
      }

      function animateBaseballResult(timestamp) {
        if (!baseballAnimation) return;
        drawBaseball(timestamp);
        const duration = baseballAnimationDurations[baseballAnimation.kind];
        if (timestamp - baseballAnimation.startedAt >= duration) {
          baseballAnimation = null;
          baseballAnimationFrame = null;
          drawBaseball(timestamp);
          return;
        }
        baseballAnimationFrame = window.requestAnimationFrame(animateBaseballResult);
      }

      function updateBaseballLabels() {
        document.querySelector("#baseballScore").textContent =
          translateText(`Runs: ${baseballRuns} | Hits: ${baseballHits} / 10`);
        document.querySelector("#baseballStatus").textContent = translateText(baseballStatusText);
        baseballPitchButton.textContent = translateText(
          baseballPitches >= 10 ? "Play again" : baseballSessionActive ? "Next pitch" : "Start game"
        );
        baseballPitchButton.disabled = baseballPitchActive;
        baseballSwingButton.textContent = translateText("Swing!");
        baseballSwingButton.disabled = !baseballPitchActive;
      }

      function finishBaseballPitch(message, animationKind = "strike", swung = false) {
        window.clearInterval(baseballTimer);
        baseballTimer = null;
        baseballPitchActive = false;
        baseballAnimation = {
          kind: animationKind,
          pitchX: baseballPitchX,
          startedAt: performance.now(),
          swung
        };
        baseballStatusText = message;
        if (baseballPitches >= 10) {
          baseballSessionActive = false;
          baseballStatusText = `Game over! Final score: ${baseballRuns} runs.`;
        }
        updateBaseballLabels();
        drawBaseball();
        baseballAnimationFrame = window.requestAnimationFrame(animateBaseballResult);
      }

      function launchBaseballPitch() {
        if (baseballPitches >= 10) return;
        window.cancelAnimationFrame(baseballAnimationFrame);
        baseballAnimationFrame = null;
        baseballAnimation = null;
        baseballPitches += 1;
        baseballPitchActive = true;
        baseballPitchX = 284;
        baseballStatusText = "Pitch coming! Swing as it reaches the batter.";
        updateBaseballLabels();
        drawBaseball();
        baseballTimer = window.setInterval(() => {
          baseballPitchX -= 5.5;
          if (baseballPitchX <= 46) {
            finishBaseballPitch("Strike! Try the next pitch.");
          } else {
            drawBaseball();
          }
        }, 40);
      }

      function startBaseballGame() {
        stopOtherArcadeGames("baseball");
        if (!baseballSessionActive) {
          baseballRuns = 0;
          baseballHits = 0;
          baseballPitches = 0;
          baseballSessionActive = true;
        }
        launchBaseballPitch();
      }

      function swingAtBaseball() {
        if (!baseballPitchActive) return;
        const timing = Math.abs(baseballPitchX - 90);
        if (baseballPitchX >= 66 && baseballPitchX <= 114) {
          baseballHits += 1;
          if (timing <= 5) {
            baseballRuns += 4;
            finishBaseballPitch("Home run! +4 runs.", "homeRun", true);
          } else if (timing <= 12) {
            baseballRuns += 2;
            finishBaseballPitch("Double! +2 runs.", "double", true);
          } else {
            baseballRuns += 1;
            finishBaseballPitch("Base hit! +1 run.", "hit", true);
          }
        } else {
          finishBaseballPitch("Strike! Try the next pitch.", "strike", true);
        }
      }

      baseballPitchButton.addEventListener("click", startBaseballGame);
      baseballSwingButton.addEventListener("click", swingAtBaseball);
      document.addEventListener("keydown", (event) => {
        if (
          event.code === "Space" &&
          baseballPitchActive &&
          document.querySelector("#minigames").classList.contains("active") &&
          !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)
        ) {
          event.preventDefault();
          swingAtBaseball();
        }
      });
      drawBaseball();
      updateBaseballLabels();

let placesSearchText = "";

function refreshGameLabels() {
  document.querySelector("#gliderScore").textContent = translateText(`Score: ${gliderScore}`);
  document.querySelector("#gliderStatus").textContent = translateText(gliderStatusText);
  document.querySelector("#dinoScore").textContent = translateText(`Score: ${dinoScore}`);
  document.querySelector("#snakeScore").textContent = translateText(`Score: ${snakeScore}`);
  document.querySelector("#snakeStatus").textContent = translateText(
    snakeGameOverText || "Collect food. The wall and your own tail end the game."
  );
  document.querySelector("#aimScore").textContent = translateText(`Score: ${aimCount} / 20`);
  updateReactionScore();
  document.querySelector("#reactionResult").textContent = translateText(reactionResultText);
  updateMineScore();
  updateMineStatus();
  document.querySelector("#mineMode").textContent =
    translateText(`Flag mode: ${mineFlagsEnabled ? "on" : "off"}`);
  document.querySelector("#pacScore").textContent = translateText(`Score: ${pacScoreValue}`);
  document.querySelector("#pacStatus").textContent = translateText(
    pacGameResult || "Use arrow keys or WASD to collect dots and avoid the ghost."
  );
  updateBaseballLabels();
  if (placesSearchText) {
    document.querySelector("#placesMessage").textContent = translateText(`Search ready: ${placesSearchText}`);
  }
  refreshVideoStatus();
}

function addFullscreenButton(target, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "fullscreen-control secondary";
  button.textContent = translateText(`Fullscreen ${label}`);
  button.setAttribute("aria-label", translateText(`Open ${label} in fullscreen`));
  button.dataset.fullscreenLabel = label;
  target.dataset.fullscreenLabel = label;
  button.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement === target) {
        await document.exitFullscreen();
      } else {
        await target.requestFullscreen();
      }
    } catch {
      setMascotMessage("Mascot Max: Fullscreen is not available in this browser. You can still play here.");
    }
  });
  target.prepend(button);
}

document.querySelectorAll(".panel").forEach((panel) => {
  const labels = {
    plan: "My Plan",
    learn: "Exercise Guide",
    workout: "Workout",
    minigames: "Mini Games",
    places: "Places",
    goals: "Goals",
    health: "Health Risks",
    settings: "Settings"
  };
  addFullscreenButton(panel, labels[panel.id]);
});
document.querySelectorAll(".game-card").forEach((card) => {
  addFullscreenButton(card, card.querySelector("h3").textContent);
});
document.querySelectorAll(".workout-card").forEach((card) => {
  addFullscreenButton(card, "Workout Timer");
});

document.addEventListener("fullscreenchange", () => {
  document.querySelectorAll(".fullscreen-control").forEach((button) => {
    const target = button.parentElement;
    const isFullscreen = document.fullscreenElement === target;
    button.textContent = translateText(isFullscreen ? "Exit fullscreen" : `Fullscreen ${target.dataset.fullscreenLabel || ""}`.trim());
    button.setAttribute("aria-label", isFullscreen ? translateText("Exit fullscreen") : translateText(`Open ${target.dataset.fullscreenLabel || ""} in fullscreen`));
  });
});

goalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = goalInput.value.trim();
  if (!text) return;
  goals.push({ text, done: false });
  goalInput.value = "";
  saveGoals();
  renderGoals();
  applyLanguage(localStorage.getItem("workoutLanguage") || "en");
});

document.querySelector("#placesForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const areaInput = document.querySelector("#placesArea");
  const area = areaInput.value.trim();
  if (!area) {
    areaInput.setCustomValidity(translateText("Enter an area to search."));
    areaInput.reportValidity();
    return;
  }
  areaInput.setCustomValidity("");

  const categories = {
    restaurants: "food places and restaurants",
    gyms: "gyms",
    "shopping malls": "shopping malls",
    arcades: "arcades",
    parks: "parks",
    other: "other places"
  };
  const interest = document.querySelector("#placesInterest").value.trim();
  const category = document.querySelector("#placesCategory").value;
  placesSearchText = `${interest || categories[category]} near ${area}`;
  const mapsUrl = new URL("https://www.google.com/maps/search/");
  mapsUrl.search = new URLSearchParams({ api: "1", query: placesSearchText }).toString();
  document.querySelector("#placesLink").href = mapsUrl.toString();
  document.querySelector("#placesMessage").textContent = translateText(`Search ready: ${placesSearchText}`);
  document.querySelector("#placesResults").hidden = false;
});

document.querySelector("#placesArea").addEventListener("input", (event) => {
  event.currentTarget.setCustomValidity("");
});

const videoFileInput = document.querySelector("#videoFileInput");
const videoPreview = document.querySelector("#videoPreview");
const cameraStartButton = document.querySelector("#cameraStart");
const recordStartButton = document.querySelector("#recordStart");
const recordStopButton = document.querySelector("#recordStop");
const cameraStopButton = document.querySelector("#cameraStop");
const videoClearButton = document.querySelector("#videoClear");
const videoStatusElement = document.querySelector("#videoStatus");
let videoStatusText = "Choose a clip or start the camera. Camera access needs your permission.";
let videoStream = null;
let videoRecorder = null;
let recordedVideoChunks = [];
let videoObjectUrl = null;
let videoPageLeaving = false;
let cameraRequestId = 0;
let videoRecordingFailed = false;

function refreshVideoStatus() {
  videoStatusElement.textContent = translateText(videoStatusText);
}

function setVideoStatus(message) {
  videoStatusText = message;
  refreshVideoStatus();
}

function releaseVideoObjectUrl() {
  if (!videoObjectUrl) return;
  URL.revokeObjectURL(videoObjectUrl);
  videoObjectUrl = null;
}

function stopVideoCamera() {
  cameraRequestId += 1;
  if (videoRecorder?.state === "recording") videoRecorder.stop();
  videoStream?.getTracks().forEach((track) => track.stop());
  videoStream = null;
  videoPreview.srcObject = null;
  cameraStartButton.disabled = false;
  cameraStopButton.disabled = true;
  recordStartButton.disabled = true;
  recordStopButton.disabled = true;
  if (!videoObjectUrl) {
    videoPreview.removeAttribute("src");
    videoPreview.hidden = true;
  }
}

function showVideoClip(clip) {
  stopVideoCamera();
  releaseVideoObjectUrl();
  videoObjectUrl = URL.createObjectURL(clip);
  videoPreview.srcObject = null;
  videoPreview.src = videoObjectUrl;
  videoPreview.muted = false;
  videoPreview.hidden = false;
  videoPreview.load();
  videoClearButton.disabled = false;
}

cameraStartButton.addEventListener("click", async () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    setVideoStatus("Camera is unavailable. Use HTTPS or localhost and check that a camera is connected.");
    return;
  }

  cameraStartButton.disabled = true;
  setVideoStatus("Requesting camera permission...");
  releaseVideoObjectUrl();
  videoFileInput.value = "";
  videoPreview.removeAttribute("src");
  const requestId = ++cameraRequestId;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    if (requestId !== cameraRequestId || videoPageLeaving) {
      stream.getTracks().forEach((track) => track.stop());
      return;
    }
    videoStream = stream;
    videoPreview.srcObject = videoStream;
    videoPreview.muted = true;
    videoPreview.hidden = false;
    await videoPreview.play();
    recordStartButton.disabled = false;
    cameraStopButton.disabled = false;
    videoClearButton.disabled = true;
    setVideoStatus("Camera is on. Preview stays on this device. Press start recording when ready.");
  } catch (error) {
    if (requestId !== cameraRequestId || videoPageLeaving) return;
    stopVideoCamera();
    setVideoStatus(error.name === "NotAllowedError" || error.name === "PermissionDeniedError"
      ? "Camera permission was denied. Allow camera access in your browser settings and try again."
      : error.name === "NotFoundError" || error.name === "NotSupportedError"
        ? "Camera is unavailable. Use HTTPS or localhost and check that a camera is connected."
        : "Could not start the camera. Check browser permissions and try again.");
  }
});

recordStartButton.addEventListener("click", () => {
  if (!videoStream) return;
  if (typeof MediaRecorder === "undefined") {
    setVideoStatus("Your browser does not support video recording. You can still choose a video file.");
    return;
  }

  try {
    const supportedTypes = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
    const mimeType = supportedTypes.find((type) => MediaRecorder.isTypeSupported?.(type));
    videoRecorder = mimeType
      ? new MediaRecorder(videoStream, { mimeType })
      : new MediaRecorder(videoStream);
    recordedVideoChunks = [];
    videoRecordingFailed = false;
    videoRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) recordedVideoChunks.push(event.data);
    });
    videoRecorder.addEventListener("error", () => {
      videoRecordingFailed = true;
      setVideoStatus("Could not record this video. Try another browser or choose a video file.");
      if (videoRecorder?.state === "recording") videoRecorder.stop();
    });
    videoRecorder.addEventListener("stop", () => {
      if (videoPageLeaving) return;
      const recordingFailed = videoRecordingFailed;
      videoRecordingFailed = false;
      const clip = new Blob(recordedVideoChunks, {
        type: videoRecorder?.mimeType || recordedVideoChunks[0]?.type || "video/webm"
      });
      recordedVideoChunks = [];
      videoRecorder = null;
      videoFileInput.disabled = false;
      stopVideoCamera();
      if (!recordingFailed && clip.size > 0) {
        showVideoClip(clip);
        setVideoStatus("Clip ready to review. It is only available until you leave or refresh this page.");
      } else {
        setVideoStatus("Could not record this video. Try another browser or choose a video file.");
      }
    });
    videoFileInput.disabled = true;
    videoClearButton.disabled = true;
    recordStartButton.disabled = true;
    recordStopButton.disabled = false;
    videoRecorder.start();
    setVideoStatus("Recording... Press stop when you are done.");
  } catch {
    videoFileInput.disabled = false;
    recordStartButton.disabled = !videoStream;
    recordStopButton.disabled = true;
    videoClearButton.disabled = !videoObjectUrl;
    setVideoStatus("Could not record this video. Try another browser or choose a video file.");
  }
});

recordStopButton.addEventListener("click", () => {
  if (videoRecorder?.state === "recording") videoRecorder.stop();
});

cameraStopButton.addEventListener("click", () => {
  const isRecording = videoRecorder?.state === "recording";
  stopVideoCamera();
  if (isRecording) {
    setVideoStatus("Recording... Press stop when you are done.");
  } else {
    setVideoStatus("Camera stopped.");
  }
});

videoFileInput.addEventListener("change", (event) => {
  const [file] = event.currentTarget.files;
  if (!file) return;
  if (!file.type.startsWith("video/")) {
    event.currentTarget.value = "";
    setVideoStatus("Choose a video file to preview.");
    return;
  }
  showVideoClip(file);
  setVideoStatus("Video selected. It stays on this device and is not uploaded.");
});

videoClearButton.addEventListener("click", () => {
  stopVideoCamera();
  releaseVideoObjectUrl();
  videoPreview.removeAttribute("src");
  videoPreview.load();
  videoPreview.hidden = true;
  videoFileInput.value = "";
  videoClearButton.disabled = true;
  setVideoStatus("Video preview cleared.");
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    if (tab.dataset.tab !== "learn" && (videoStream || cameraStartButton.disabled)) {
      stopVideoCamera();
      setVideoStatus("Camera stopped.");
    }
  });
});

window.addEventListener("pagehide", () => {
  videoPageLeaving = true;
  stopVideoCamera();
  releaseVideoObjectUrl();
  recordedVideoChunks = [];
  videoRecorder = null;
  videoFileInput.disabled = false;
  videoClearButton.disabled = true;
  videoPreview.removeAttribute("src");
  videoPreview.hidden = true;
  videoPreview.load();
});

window.addEventListener("pageshow", () => {
  videoPageLeaving = false;
});

renderGoals();
