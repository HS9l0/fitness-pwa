export const WORKOUTS = [
  {
    day: 1,
    label: 'Day 1 — Cardio',
    weekday: 'Monday',
    durationMin: 40,
    focus: 'Jumping Jacks · High Knees · Mountain Climbers · Burpees · Squat Jumps',
    warmup: "Start with 2 minutes of marching in place or a slow jog on the spot. This eases your heart rate up and loosens your joints before the real effort begins. Don't skip it — jumping straight into high intensity is how people pull muscles.",
    cooldown: ["Slow march in place 3 min", "Hip flexor stretch (30s each)", "Quad stretch (30s each)", "Calf stretch on step (30s each)", "Child's pose (60s)"],
    exercises: [
      {
        name: 'Jumping Jacks',
        muscles: 'Full Body · Heart Rate · Coordination',
        defaultSets: 1,
        setsLabel: '3 min · Warm-Up',
        isCardio: true,
        videoId: 'home-cardio-1',
        howTo: 'Stand with feet together, arms at your sides. Jump your feet out wide while raising your arms overhead, then jump back to start. Keep a steady rhythm for 3 minutes to get your heart rate up and loosen your joints before the harder work.',
        keyPoints: "Land softly on the balls of your feet, knees slightly bent. Keep your core braced. This is a warm-up pace, not a sprint — save your energy.",
        ifTooHard: "Step side-to-side instead of jumping (raising your arms overhead each step) to keep it low-impact while still warming up.",
        settings: "Aim for a steady, sustainable rhythm — about 50–60 jacks per minute. You should be breathing harder but still able to talk.",
        commonMistake: 'Starting too fast and gassing out. This is a warm-up — ease into it and let your heart rate climb gradually.'
      },
      {
        name: 'High Knees',
        muscles: 'Legs · Hip Flexors · Cardio',
        defaultSets: 1,
        setsLabel: '8 min · Steady',
        isCardio: true,
        videoId: 'home-cardio-2',
        howTo: "Stand tall and jog in place, driving your knees up toward your chest as high as you can with each step. Pump your arms to match your leg speed. Keep going at a steady pace for 8 minutes.",
        keyPoints: "Stay on the balls of your feet. Keep your torso upright, don't lean back. Drive with your hip flexors, not just bouncing up and down.",
        settings: 'Aim for a pace where you\'re breathing hard but can still speak in short sentences — similar effort to a moderate bike ride.',
        ifTooHard: 'Slow the pace and reduce how high your knees come up, or march in place instead of jogging.',
        commonMistake: "Leaning back to make it easier. Keep your chest up and core tight — leaning back takes the work out of your hips and strains your lower back."
      },
      {
        name: 'Mountain Climbers',
        muscles: 'Full Body · Core · Arms · Cardio',
        defaultSets: 1,
        setsLabel: '2×3 min',
        isCardio: true,
        videoId: 'home-cardio-3',
        howTo: "Start in a high plank position, hands under shoulders. Drive one knee toward your chest, then quickly switch legs, like you're running horizontally. Keep your hips low and core tight. Go for 3 minutes, rest briefly, then repeat for a second round.",
        keyPoints: "Keep your hips level — don't let them pike up or sag down. Hands stay planted firmly under your shoulders throughout.",
        settings: 'Move at a pace where your form stays clean — quality over raw speed. Faster isn\'t better if your hips are bouncing all over.',
        ifTooHard: 'Slow down and step your knees in one at a time instead of a fast run — still works the same muscles with less cardio demand.',
        commonMistake: 'Letting your hips rise up into a pike position. This takes the work off your core. Keep your body in a straight line from head to heels.'
      },
      {
        name: 'Burpees',
        muscles: 'Full Body · Chest · Legs · Cardio',
        defaultSets: 1,
        setsLabel: '8 min · Intervals',
        isCardio: true,
        videoId: 'home-cardio-4',
        howTo: "From standing, drop into a squat and place your hands on the floor. Kick your feet back into a plank, do a push-up, then jump your feet back to your hands and explode upward into a jump. Repeat continuously, resting briefly as needed, for 8 minutes.",
        keyPoints: "Move with control on the way down to protect your lower back and wrists. The push-up and jump are optional intensity add-ons if you need to scale down.",
        settings: 'Work in short bursts you can sustain — e.g. 30 seconds of work, 15–30 seconds of rest, repeated for 8 minutes.',
        ifTooHard: 'Drop the push-up and the jump — step back into plank, step forward, and stand up instead of jumping. Build up to the full version over time.',
        commonMistake: 'Rounding your lower back when bending down to place your hands. Bend your knees more and keep your back flat throughout the movement.'
      },
      {
        name: 'Squat Jumps',
        muscles: 'Glutes · Quads · Calves · Cardio Finisher',
        defaultSets: 1,
        setsLabel: '5 min · Burn Out',
        isCardio: true,
        videoId: 'home-cardio-5',
        howTo: "Stand with feet shoulder-width apart. Drop into a squat, then explode upward into a jump, swinging your arms up for momentum. Land softly back into the squat position and immediately go into the next rep. Keep going for 5 minutes — this is your finisher, so push through the burn.",
        keyPoints: "Land soft, knees tracking over your toes, not caving inward. Absorb the landing through your legs before jumping again.",
        settings: 'Go at a pace you can sustain with good landings — a controlled jump beats a sloppy fast one every time.',
        ifTooHard: 'Drop the jump and do bodyweight squats at a brisk pace instead — same muscles, lower impact on the joints.',
        commonMistake: 'Landing stiff-legged. Always bend your knees to absorb the landing — locking out on impact is hard on your joints.'
      }
    ]
  },
  {
    day: 2,
    label: 'Day 2 — Leg Day',
    weekday: 'Wednesday',
    durationMin: 50,
    focus: 'Quads · Glutes · Hamstrings · Calves',
    warmup: 'March in place or jog lightly on the spot for 5 minutes. Then do 10 bodyweight squats, 10 leg swings forward/back per leg, and 10 side-to-side leg swings. Warm joints and muscles before loading them.',
    cooldown: ['Lying hamstring stretch (45s each leg)', 'Pigeon pose or figure-4 stretch (45s each)', 'Quad stretch standing (30s each)', 'Calf stretch on step (30s each)', 'Slow walk 2 min'],
    exercises: [
      {
        name: 'Bodyweight Squats',
        muscles: 'Quads · Glutes · Hamstrings',
        defaultSets: 4,
        setsLabel: '4×15',
        isCardio: false,
        videoId: 'home-legs-1',
        howTo: "Stand with feet shoulder-width apart, toes slightly out. Push your hips back and bend your knees to lower down until your thighs are at least parallel to the floor, keeping your chest up. Drive through your heels to stand back up. Do 4 sets of 15.",
        keyPoints: "Knees track over your toes — don't let them cave inward. Keep your weight in your heels and mid-foot, not your toes. Don't round your lower back.",
        settings: 'If bodyweight gets easy, slow the tempo down (3 seconds on the way down) or hold something heavy like a backpack full of books to add resistance.',
        ifTooHard: 'Reduce depth — only go as low as feels controlled, and build range of motion over time. Hold onto a wall or chair for balance if needed.',
        commonMistake: 'Letting your knees cave inward on the way up. Actively push your knees out in line with your toes throughout the movement.'
      },
      {
        name: 'Walking Lunges',
        muscles: 'Quads (front of thigh) · Balance',
        defaultSets: 3,
        setsLabel: '3×12 each leg',
        isCardio: false,
        videoId: 'home-legs-2',
        howTo: "Step forward with one leg and lower your body until both knees are bent at about 90°, back knee hovering just above the floor. Push off your front foot to step into the next lunge with the other leg. Continue alternating for 12 reps per leg.",
        keyPoints: "Keep your torso upright, don't lean forward. Your front knee should track over your ankle, not push past your toes.",
        settings: 'Take controlled, deliberate steps rather than rushing — balance matters more than speed here.',
        ifTooHard: 'Do stationary lunges instead of walking ones (step back to the same spot each rep), or hold onto a wall for balance.',
        commonMistake: "Taking a step that's too short, causing your front knee to shoot forward past your toes. Take a bigger step so your shin stays more vertical."
      },
      {
        name: 'Glute Bridges',
        muscles: 'Hamstrings · Glutes · Lower Back',
        defaultSets: 3,
        setsLabel: '3×15',
        isCardio: false,
        videoId: 'home-legs-3',
        howTo: "Lie on your back, knees bent, feet flat on the floor hip-width apart. Push through your heels to lift your hips up until your body forms a straight line from shoulders to knees. Squeeze your glutes hard at the top for 1 second, then lower slowly. 3 sets of 15.",
        keyPoints: "Squeeze your glutes at the top rather than arching your lower back to get height. Keep your core braced throughout.",
        settings: 'For extra challenge, place a heavy book or bag across your hips, or try single-leg glute bridges.',
        ifTooHard: 'Reduce the range of motion — lift only as high as feels controlled and build up over time.',
        commonMistake: 'Overarching the lower back at the top instead of squeezing the glutes. The lift should come from your glutes, not from bending your spine.'
      },
      {
        name: 'Standing Side Leg Raises',
        muscles: 'Outer Glutes · Hip Abductors · IT Band',
        defaultSets: 3,
        setsLabel: '3×15 each leg',
        isCardio: false,
        videoId: 'home-legs-4',
        howTo: "Stand tall, holding onto a wall or chair for balance if needed. Keeping your leg straight, lift it out to the side as high as comfortable, then lower it back down with control. Do 15 reps, then switch legs.",
        keyPoints: "Keep your standing leg slightly bent and your torso upright — don't lean to the side to fake extra height. Move slowly on the way down.",
        settings: 'For extra resistance, loop a towel or light resistance band around your ankles if you have one.',
        ifTooHard: 'Reduce the range of motion, or do the movement lying on your side instead of standing, which is easier to control.',
        commonMistake: 'Leaning your torso to the opposite side to swing the leg higher. Keep your hips square and let the outer glute do the work, not momentum.'
      },
      {
        name: 'Sumo Squats',
        muscles: 'Inner Thighs · Groin · Hip Adductors',
        defaultSets: 3,
        setsLabel: '3×15',
        isCardio: false,
        videoId: 'home-legs-5',
        howTo: "Stand with feet wider than shoulder-width, toes turned out about 45°. Bend your knees and lower straight down until your thighs are close to parallel with the floor. Push through your heels to stand back up, squeezing your inner thighs together at the top. 3 sets of 15.",
        keyPoints: "Keep your chest up and knees tracking in the same direction as your toes throughout the movement.",
        settings: 'Hold a backpack or heavy household item at your chest for extra resistance once bodyweight feels easy.',
        ifTooHard: "Reduce your stance width slightly and don't go as deep — build up range of motion gradually.",
        commonMistake: 'Letting your knees collapse inward at the bottom. Keep them pushed out in line with your toes the whole way down and up.'
      },
      {
        name: 'Standing Calf Raises',
        muscles: 'Calves — Soleus & Gastrocnemius',
        defaultSets: 4,
        setsLabel: '4×20',
        isCardio: false,
        videoId: 'home-legs-6',
        howTo: "Stand with the balls of your feet on the edge of a step (or flat on the floor if no step is available), holding onto a wall or rail for balance. Push up onto your toes as high as possible, hold for 1 second, then lower your heels below the step for a full stretch. 4 sets of 20.",
        keyPoints: "Full range: full stretch at the bottom, full squeeze at the top. Move slowly and controlled rather than bouncing.",
        settings: 'Once bodyweight feels easy, try single-leg calf raises or hold something heavy for extra load.',
        ifTooHard: 'Do the raises flat on the floor without a step to reduce the range of motion, or hold onto something more supportive for balance.',
        commonMistake: 'Only going halfway up and halfway down. Half reps on calves do almost nothing — commit to the full stretch and full squeeze every rep.'
      }
    ]
  },
  {
    day: 3,
    label: 'Day 3 — Arms',
    weekday: 'Friday',
    durationMin: 45,
    focus: 'Biceps · Triceps · Forearms · Grip',
    warmup: '5 minutes of light jogging in place or jumping jacks. Then: 10 arm circles forward, 10 backward, 10 wrist rotations each direction, 10 shoulder rolls. Warm up the elbow joints gently — arm day puts a lot of stress on them.',
    cooldown: ['Cross-body shoulder stretch (30s each)', 'Overhead tricep stretch (30s each)', 'Wrist flexor stretch (30s each)', 'Wrist extensor stretch (30s each)', 'Chest doorway stretch (30s)'],
    exercises: [
      {
        name: 'Chair Dips',
        muscles: 'Triceps · Chest · Shoulders',
        defaultSets: 3,
        setsLabel: '3×12',
        isCardio: false,
        videoId: 'home-arms-1',
        howTo: "Sit on the edge of a sturdy chair or low table, hands gripping the edge next to your hips, fingers pointing forward. Slide your hips off the edge and lower your body by bending your elbows until they're at about 90°, then push back up to straighten your arms. 3 sets of 12.",
        keyPoints: "Keep your elbows pointing backward, not flaring out to the sides. Keep your hips close to the chair throughout the movement, don't let them drift forward.",
        settings: 'Bend your knees more to make it easier, or straighten your legs out in front of you to make it harder.',
        ifTooHard: 'Bend your knees to 90° and keep your feet close to the chair — this reduces the amount of bodyweight you\'re lifting.',
        commonMistake: 'Letting your shoulders creep up toward your ears. Keep them pulled down and back throughout the set to protect your shoulder joints.'
      },
      {
        name: 'Diamond Push-Ups',
        muscles: 'Triceps · Chest · Shoulders',
        defaultSets: 3,
        setsLabel: '3×10',
        isCardio: false,
        videoId: 'home-arms-2',
        howTo: "Get into a push-up position with your hands close together under your chest, thumbs and index fingers touching to form a diamond shape. Lower your chest toward your hands, keeping elbows close to your body, then push back up. 3 sets of 10.",
        keyPoints: "Keep your body in a straight line from head to heels — don't let your hips sag or pike up. Elbows stay tucked close to your ribs, not flared out.",
        settings: 'Do these from your knees if the full version is too hard, or elevate your hands on a step to reduce the load.',
        ifTooHard: 'Drop to your knees, or do the push-up against a wall or raised surface instead of the floor.',
        commonMistake: 'Flaring the elbows out wide, which turns it into a chest-focused push-up and takes stress off the triceps. Keep them tucked in.'
      },
      {
        name: 'Table Rows',
        muscles: 'Biceps · Back · Forearms',
        defaultSets: 3,
        setsLabel: '3×12',
        isCardio: false,
        videoId: 'home-arms-3',
        howTo: "Lie underneath a sturdy table (or hold a secure door frame edge), grip it with both hands, and with your body straight and heels on the ground, pull your chest up toward the table by bending your elbows. Lower back down with control. 3 sets of 12.",
        keyPoints: "Keep your body rigid like a plank throughout — don't let your hips sag. Squeeze your biceps and back at the top of each pull.",
        settings: 'Walk your feet closer to make it easier, or further away (more horizontal body) to make it harder.',
        ifTooHard: 'Walk your feet in closer to your body so more of your weight is supported, reducing the load on your arms.',
        commonMistake: 'Letting your hips sag toward the floor mid-pull. Keep your core braced so your body moves as one straight unit.'
      },
      {
        name: 'Towel Curls',
        muscles: 'Biceps Peak · Forearms',
        defaultSets: 3,
        setsLabel: '3×20s holds each arm',
        isCardio: false,
        videoId: 'home-arms-4',
        howTo: "Fold a towel and step on one end with one foot. Grip the other end with your hand, palm up, and curl upward against the towel's resistance, pulling as hard as you comfortably can. Hold the curled position for 20 seconds, feeling the bicep burn, then switch arms. 3 rounds per arm.",
        keyPoints: "Keep tension on the towel throughout the hold — don't let it go slack. Breathe steadily rather than holding your breath.",
        settings: 'Increase the pulling effort (more tension) rather than the hold time if it starts feeling easy.',
        ifTooHard: 'Reduce how hard you pull, or shorten the hold to 10 seconds and build up from there.',
        commonMistake: 'Using your whole body to yank on the towel instead of isolating the bicep. Keep your elbow pinned to your side and pull smoothly.'
      },
      {
        name: 'Backpack Hammer Curls',
        muscles: 'Brachialis · Forearms · Bicep Thickness',
        defaultSets: 3,
        setsLabel: '3×12 each arm',
        isCardio: false,
        videoId: 'home-arms-5',
        howTo: "Fill a backpack or bag with books or other household items to a comfortable weight. Hold it by the straps with a neutral grip (like carrying a suitcase), and curl it up toward your shoulder, keeping your palm facing your body throughout. Lower slowly. 3 sets of 12 per arm.",
        keyPoints: "Keep your elbow pinned to your side and your wrist neutral — don't let it rotate. Control the lowering phase, don't just drop it.",
        settings: 'Adjust the weight by adding or removing items from the bag — you should struggle to finish the last 2–3 reps with good form.',
        ifTooHard: 'Use a lighter bag, or do the movement with just your bodyweight arm curl (no added weight) to practice the motion.',
        commonMistake: 'Swinging your body to help lift the bag. Keep your torso still and let your arm do all the work.'
      },
      {
        name: 'Prone Y-Raises',
        muscles: 'Rear Deltoids · Upper Back · Rotator Cuff',
        defaultSets: 3,
        setsLabel: '3×15',
        isCardio: false,
        videoId: 'home-arms-6',
        howTo: "Lie face down on the floor or a bench, arms extended overhead in a 'Y' shape, thumbs pointing up. Squeeze your shoulder blades together and lift your arms a few inches off the ground, hold for 1 second, then lower with control. 3 sets of 15.",
        keyPoints: "This is a small movement — you don't need to lift high, just squeeze your upper back and rear shoulders. Keep your neck relaxed, don't crane it up.",
        settings: 'Hold light household items (like small water bottles) in each hand once bodyweight feels easy.',
        ifTooHard: 'Do the movement standing, hinged forward at the hips, instead of lying face down — easier to control.',
        commonMistake: 'Using momentum to jerk the arms up instead of a slow, controlled squeeze. This is a health/posture exercise — go light and controlled, never heavy.'
      }
    ]
  }
];

export const DAYS_MAP = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 0: 'Sun' };

// Returns 1, 2, or 3 on Mon/Wed/Fri; null on all other days.
// Test mode (set via settings) can override the calendar.
export function getTodayWorkoutDay() {
  try {
    const s = JSON.parse(localStorage.getItem('fit_settings') ?? '{}');
    if (s.testMode) {
      const d = s.testDay ?? 1;
      return d === 0 ? null : d; // 0 = simulate rest day
    }
  } catch {}
  const dow = new Date().getDay(); // 0=Sun … 6=Sat
  return { 1: 1, 3: 2, 5: 3 }[dow] ?? null;
}

// Kept for any code that still imports it — delegates to calendar.
export function getNextWorkoutDay() {
  return getTodayWorkoutDay();
}
