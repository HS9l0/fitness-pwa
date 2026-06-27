export const WORKOUTS = [
  {
    day: 1,
    label: 'Day 1 — Cardio',
    weekday: 'Monday',
    durationMin: 40,
    focus: 'Treadmill · Bike · Rowing · Elliptical · Stair Climber',
    warmup: "Start on the treadmill at a slow walk (4–5 km/h) for 5 minutes. This eases your heart rate up and loosens your joints before the real effort begins. Don't skip it — jumping straight into high intensity is how people pull muscles.",
    cooldown: ["Slow treadmill walk 3 min", "Hip flexor stretch (30s each)", "Quad stretch (30s each)", "Calf stretch on step (30s each)", "Child's pose (60s)"],
    exercises: [
      {
        name: 'Treadmill',
        muscles: 'Heart · Legs · Endurance',
        defaultSets: 1,
        setsLabel: '10 min · Intervals',
        isCardio: true,
        videoId: 'ufhM_9eLU-s',
        howTo: 'Alternate between a fast run and a recovery walk. Run at 10–12 km/h for 1 minute, then walk at 5 km/h for 1 minute. Repeat 5 times for a 10-minute session total.',
        keyPoints: "Don't hold the handrails during the run — let go and let your arms swing naturally. Land mid-foot, keep your chest up, and look ahead. Increase the speed slightly each week.",
        ifTooHard: "Drop the sprint speed to 8–9 km/h or extend the walk recovery to 90 seconds. Build up to the full effort over a few weeks — there's no rush.",
        settings: "Incline: 0–1%. Speed switches: use the quick-press buttons (+1, +2) to change speed fast so you don't waste time fumbling between intervals.",
        commonMistake: 'Holding the handrails the whole time. It reduces your effort, throws off your posture, and burns fewer calories. Let go — even if it feels harder at first.'
      },
      {
        name: 'Stationary Bike',
        muscles: 'Quads · Glutes · Cardio · Low Impact',
        defaultSets: 1,
        setsLabel: '8 min · Steady',
        isCardio: true,
        videoId: 'NwwDBARCGgo',
        howTo: "Set the seat height so your knee has a slight bend at the bottom of the pedal stroke — not fully locked out. Pedal at 80–90 RPM on a resistance level that feels like a moderate uphill. Keep steady for 8 minutes.",
        keyPoints: "Sit up straight — don't hunch over the handlebars. Push through the whole foot, not just your toes. The resistance should be high enough that coasting isn't possible.",
        settings: 'Start at level 6–8 out of 20. If you feel like you could do this for an hour, go higher. You should be breathing hard but able to speak a short sentence.',
        ifTooHard: 'Drop resistance to level 4–5 and build up over weeks.',
        commonMistake: "Seat too low, causing your knees to bend past 90° at the bottom. This puts strain on the knee joint. Raise the seat so your leg is nearly straight at the bottom of each stroke."
      },
      {
        name: 'Rowing Machine',
        muscles: 'Full Body · Back · Core · Arms · Cardio',
        defaultSets: 2,
        setsLabel: '2×3 min',
        isCardio: true,
        videoId: '4zWu1yuJ0_g',
        howTo: "Sit on the seat, strap your feet in, shins vertical. The stroke: push legs first → lean back slightly → pull the handle to your lower ribs. Return: arms extend → lean forward → bend knees. Aim for 22–26 strokes per minute. Rest 60 seconds between sets.",
        keyPoints: "Legs do 60% of the work — don't just pull with your arms. Keep your back straight throughout, never rounded. The drive comes from leg power, not your arms yanking the handle.",
        settings: 'Set the fan lever to 4–5. Lower = more aerobic cardio. Higher = more strength effort. 4–5 is the sweet spot for conditioning.',
        ifTooHard: 'Drop to 20 strokes per minute and reduce damper to 3.',
        commonMistake: 'Pulling the handle before your legs finish pushing. Sequence matters: legs drive first, arms follow second — every single stroke.'
      },
      {
        name: 'Elliptical Trainer',
        muscles: 'Full Body · Low Impact · Cardio',
        defaultSets: 1,
        setsLabel: '8 min · Steady',
        isCardio: true,
        videoId: '9L2b2khySLE',
        howTo: "Step on, hold the moving handles, and pedal in a smooth oval motion. Push and pull the handles actively. Use the resistance dial to make it feel like you're pushing through thick air. Keep going for 8 steady minutes.",
        keyPoints: "Stand upright — don't lean on the handles to take weight off your legs. Engage your core. Try going backwards for 2 minutes in the middle to hit your hamstrings and glutes differently.",
        settings: 'Start at level 6–8. If it feels too easy, increase resistance rather than going faster.',
        ifTooHard: 'Drop to level 4 and hold the stationary handles instead of the moving ones.',
        commonMistake: 'Leaning heavily on the handles so your feet barely feel the resistance. The handles are for balance only — your legs should be doing all the work.'
      },
      {
        name: 'Stair Climber',
        muscles: 'Glutes · Quads · Calves · Cardio Finisher',
        defaultSets: 1,
        setsLabel: '5 min · Burn Out',
        isCardio: true,
        videoId: 'SZU9Rm0sNOo',
        howTo: "Step onto the machine, set the speed to 50–60 steps per minute. Push through your whole foot on each step — heel to toe. Keep climbing at a steady pace for 5 minutes. This is your finisher, so push through the burn.",
        keyPoints: "Stay upright — don't hunch forward or lean on the rails. Let each step fall low before you take the next one. Short, shuffling steps reduce the effectiveness significantly.",
        settings: '50–60 steps per minute. If your legs are giving out, slow to 40 spm rather than using the rails for support.',
        ifTooHard: 'Drop to 35–40 spm and keep going — finishing is what counts.',
        commonMistake: 'Holding the rails and leaning forward. It offloads the effort from your legs. Touch the rails lightly for balance only.'
      }
    ]
  },
  {
    day: 2,
    label: 'Day 2 — Leg Day',
    weekday: 'Wednesday',
    durationMin: 50,
    focus: 'Quads · Glutes · Hamstrings · Calves',
    warmup: '5 minutes on the stationary bike at low resistance (level 3–4). Then do 10 bodyweight squats, 10 leg swings forward/back per leg, and 10 side-to-side leg swings. Warm joints and muscles before loading them.',
    cooldown: ['Lying hamstring stretch (45s each leg)', 'Pigeon pose or figure-4 stretch (45s each)', 'Quad stretch standing (30s each)', 'Calf stretch on step (30s each)', 'Slow walk 2 min'],
    exercises: [
      {
        name: 'Leg Press Machine',
        muscles: 'Quads · Glutes · Hamstrings',
        defaultSets: 4,
        setsLabel: '4×12',
        isCardio: false,
        videoId: 'IZxyjW7MPJQ',
        howTo: "Sit in the seat with your back flat against the pad. Place feet shoulder-width apart, toes slightly out. Push the platform away, unlocking the safety handles. Lower slowly (3 seconds down) until knees are at 90°. Press back up without locking your knees out completely. Do 4 sets of 12 reps.",
        keyPoints: "Knees track over your toes — don't let them cave inward. Keep your lower back pressed into the seat pad. Don't bounce at the bottom.",
        settings: 'Start with a weight where rep 10–12 feels genuinely hard but you can keep form. Increase weight by 5 kg when 12 reps feel easy across all 4 sets.',
        ifTooHard: 'Reduce to 3 sets. Use a lighter weight and focus on the slow lowering phase.',
        commonMistake: 'Using too much weight and only going halfway down. Full range of motion with lighter weight is always better than partial reps with heavy weight.'
      },
      {
        name: 'Leg Extension Machine',
        muscles: 'Quads (front of thigh)',
        defaultSets: 3,
        setsLabel: '3×12',
        isCardio: false,
        videoId: 'YyvSfVjQeL0',
        howTo: "Sit with your back against the pad, shins behind the roller pad. Adjust the seat so your knees line up with the machine's pivot point. Extend your legs until straight, hold for 1 second, then lower slowly (3 seconds). Repeat for 12 reps.",
        keyPoints: "Full extension at the top — don't stop short. Control the lowering phase. This is an isolation exercise so use moderate weight and feel the quads working, not momentum.",
        settings: 'Start light — this is not a heavy exercise. You should feel the front of your thighs burning by rep 10.',
        ifTooHard: 'Drop to 8 reps per set and build up over weeks.',
        commonMistake: "Letting the weight slam back down. The lowering phase is where growth happens. Take 2–3 seconds to bring it back."
      },
      {
        name: 'Leg Curl Machine',
        muscles: 'Hamstrings · Back of Knee',
        defaultSets: 3,
        setsLabel: '3×12',
        isCardio: false,
        videoId: '1Tq3QdYUuHs',
        howTo: "Lie face down (or sit, depending on machine type). Position the roller pad just above your heels. Curl your legs up as far as possible — ideally past 90° — hold for 1 second, then lower slowly. Keep your hips pressed down into the pad (lying version) or back (seated version).",
        keyPoints: "Don't rock your hips to get more range — that's cheating and strains your lower back. Full squeeze at the top of the curl matters more than the amount of weight.",
        settings: 'Start lighter than you think you need. Hamstrings are often undertrained and will fatigue quickly at first.',
        ifTooHard: 'Drop to 8 reps and reduce weight. Build up gradually.',
        commonMistake: 'Lifting your hips off the pad to get the weight higher. Grip the handles and keep hips pinned. Shorter range with hips down beats full range with hips up.'
      },
      {
        name: 'Hip Abductor Machine',
        muscles: 'Outer Glutes · Hip Abductors · IT Band',
        defaultSets: 3,
        setsLabel: '3×15',
        isCardio: false,
        videoId: 'OjI5OpV6IWA',
        howTo: "Sit in the machine with the pads on the outsides of your knees. Push your knees outward as wide as possible, hold for 1 second, then slowly bring them back together. The movement is smooth and controlled — not a sudden push.",
        keyPoints: "Sit upright, don't slouch. You should feel this in the outside of your glutes and hip. 15 reps should feel like a burn by the last 3–4.",
        settings: 'Medium weight — this is a high-rep exercise. Prioritize feeling the muscle work over moving maximum weight.',
        ifTooHard: 'Drop to 12 reps per set.',
        commonMistake: 'Going too heavy and using your whole body to push. Keep the movement isolated to your legs.'
      },
      {
        name: 'Hip Adductor Machine',
        muscles: 'Inner Thighs · Groin · Hip Adductors',
        defaultSets: 3,
        setsLabel: '3×15',
        isCardio: false,
        videoId: 'MLBm7i341Rw',
        howTo: "Sit with the pads on the insides of your knees, legs spread wide. Squeeze your knees together as far as the machine allows, hold for 1 second, then slowly open back out. Keep your back straight and core engaged.",
        keyPoints: "Control the opening phase — don't let the weight pull your legs apart. The inner thighs are working to resist the opening as much as the closing.",
        settings: 'Similar weight to the abductor machine. Light-medium, 15 reps with a burn.',
        ifTooHard: 'Reduce range of motion to something comfortable, then build up.',
        commonMistake: "Letting the weight fly open at the end. Control the eccentric (opening) phase — it's just as important as the squeeze."
      },
      {
        name: 'Seated Calf Raise Machine',
        muscles: 'Calves — Soleus (deep calf muscle)',
        defaultSets: 4,
        setsLabel: '4×15',
        isCardio: false,
        videoId: 'I1uQtobaNRQ',
        howTo: "Sit with the pad resting on your lower thighs (just above the knee). Place the balls of your feet on the platform edge, heels hanging off. Push up onto your toes as high as possible, hold for 1 second at the top, then lower your heels below the platform edge for a full stretch. 4 sets of 15.",
        keyPoints: "Full range: full stretch at the bottom, full squeeze at the top. Calves respond better to high reps and full range than heavy weight with partial reps. Slow and controlled.",
        settings: 'Moderate weight. You should feel a deep calf burn by rep 12–13.',
        ifTooHard: 'Body-weight only on the platform, no machine resistance. Build up the ankle strength first.',
        commonMistake: 'Only going halfway up and halfway down. Half reps on calves do almost nothing. Commit to the full stretch and full squeeze every rep.'
      }
    ]
  },
  {
    day: 3,
    label: 'Day 3 — Arms',
    weekday: 'Friday',
    durationMin: 45,
    focus: 'Biceps · Triceps · Forearms · Grip',
    warmup: '5 minutes on the stationary bike or treadmill walk. Then: 10 arm circles forward, 10 backward, 10 wrist rotations each direction, 10 shoulder rolls. Warm up the elbow joints gently — arm day puts a lot of stress on them.',
    cooldown: ['Cross-body shoulder stretch (30s each)', 'Overhead tricep stretch (30s each)', 'Wrist flexor stretch (30s each)', 'Wrist extensor stretch (30s each)', 'Chest doorway stretch (30s)'],
    exercises: [
      {
        name: 'Cable Bicep Curl',
        muscles: 'Biceps · Forearms',
        defaultSets: 3,
        setsLabel: '3×12',
        isCardio: false,
        videoId: '2MUEL4nL6hA',
        howTo: "Attach a straight bar or EZ-bar to the low cable pulley. Stand upright, grip the bar underhand (palms up), shoulder-width apart. Keep your elbows pinned to your sides — they don't move. Curl the bar up to your shoulders, squeeze for 1 second, then lower slowly (3 seconds) back to the starting position. 3 sets of 12.",
        keyPoints: "The cable keeps tension on the biceps throughout the full range of motion — unlike dumbbells which lose tension at the top. Don't swing your back to help lift. Elbows stay locked to your sides.",
        settings: "Start at a weight where rep 10–11 is genuinely hard. If you're swinging your torso, the weight is too heavy.",
        ifTooHard: "Drop weight by 5 kg and prioritize perfect form for 3 weeks before increasing.",
        commonMistake: "Swinging your torso backward on every rep. This turns a bicep exercise into a lower-back exercise. If you're swinging, the weight is too heavy."
      },
      {
        name: 'Preacher Curl Machine',
        muscles: 'Biceps Peak · Lower Bicep',
        defaultSets: 3,
        setsLabel: '3×10',
        isCardio: false,
        videoId: 'R-8Sa0_qiws',
        howTo: "Sit at the preacher curl station, adjust the seat so the top of the pad is in your armpits. Grab the handle with an underhand grip. Curl up slowly until just short of vertical (keeping tension), then lower very slowly — take 4 seconds on the way down. The slow eccentric builds the most muscle.",
        keyPoints: "The support pad eliminates all momentum — you can't cheat. This completely isolates the bicep. Focus on the squeeze at the top and the slow lowering.",
        settings: "Lighter than you think — you lose the ability to use body momentum here. Go one notch lighter than your regular curls.",
        ifTooHard: 'Drop to 8 reps. On this machine, rep quality beats rep quantity.',
        commonMistake: "Letting your elbows lift off the pad during the curl. The pads are there to keep your elbows fixed — if they're coming up, you're using too much weight."
      },
      {
        name: 'Cable Tricep Pushdown',
        muscles: 'Triceps — all 3 heads (back of arm)',
        defaultSets: 3,
        setsLabel: '3×12',
        isCardio: false,
        videoId: 'vB5OHsJ3EME',
        howTo: "Attach a straight bar or V-bar to the high cable. Stand upright, grip overhand (palms down), elbows pinned to your sides at ~90°. Push the bar straight down until your arms are fully extended. Squeeze your triceps hard at the bottom for 1 second, then let the bar rise slowly back to 90°. 3 sets of 12.",
        keyPoints: "Elbows stay locked to your sides the entire time — they act as the hinge point. At full extension, squeeze hard. The triceps make up two-thirds of your upper arm — this is one of the best exercises for arm size.",
        settings: 'Use a weight where the last 2–3 reps are a real grind. Rest 60–90 seconds between sets.',
        ifTooHard: 'Switch to a rope attachment and use lighter weight — the rope allows your wrists to rotate slightly which reduces strain.',
        commonMistake: "Letting your elbows flare out and using your shoulders to push down. Pin elbows to ribs. If they're moving, the weight is too heavy."
      },
      {
        name: 'Tricep Extension Machine',
        muscles: 'Triceps — Long Head (adds size overhead)',
        defaultSets: 3,
        setsLabel: '3×12',
        isCardio: false,
        videoId: 'GzmlxvSFE7A',
        howTo: "Sit in the overhead tricep extension machine, adjust the seat so your elbows line up with the machine's pivot point. Grip the handles and press upward (or forward, depending on machine) to full extension. Hold 1 second, then slowly lower back to the start. 3 sets of 12.",
        keyPoints: "The overhead position stretches the long head of the tricep — a part that pushdown exercises don't fully hit. Keep your back pressed against the seat pad. Don't arch your lower back to get the weight up.",
        settings: "Medium weight. This is not a max-strength exercise — it's about hitting the part of the tricep that the pushdown misses.",
        ifTooHard: 'Use cables instead: attach a rope to a low pulley, face away from the machine, and extend overhead. Lighter and more joint-friendly.',
        commonMistake: 'Arching the lower back when pushing. If your back lifts off the pad, the weight is too heavy. Keep your core tight and back flat.'
      },
      {
        name: 'Cable Hammer Curl',
        muscles: 'Brachialis · Forearms · Bicep Thickness',
        defaultSets: 3,
        setsLabel: '3×12',
        isCardio: false,
        videoId: 'TwD-YGVP4Bk',
        howTo: "Attach a rope to the low cable pulley. Stand upright and grip the rope with a neutral grip (thumbs pointing up — like you're holding a hammer). Curl the rope up, keeping your thumbs pointing up throughout. Bring your fists toward your shoulders, squeeze, then lower slowly. 3 sets of 12.",
        keyPoints: "The neutral grip targets the brachialis — a muscle underneath the bicep that pushes it up and makes arms look thicker from the side. Keep elbows pinned to your sides.",
        settings: 'Slightly lighter than your regular curl. Brachialis is smaller than the bicep and will fatigue faster at first.',
        ifTooHard: 'Use dumbbells instead — same hammer grip, same movement. Easier to get the weight exactly right.',
        commonMistake: 'Rotating your palms upward mid-curl, turning it into a regular bicep curl. Keep thumbs pointing up the entire time.'
      },
      {
        name: 'Cable Face Pull',
        muscles: 'Rear Deltoids · Forearms · Grip · Rotator Cuff',
        defaultSets: 3,
        setsLabel: '3×15',
        isCardio: false,
        videoId: 't4_ii8WbOq4',
        howTo: "Attach a rope to the high cable pulley at roughly face height. Step back, hold the rope with both hands, palms facing each other. Pull the rope toward your face, spreading your hands apart as it comes in — elbows stay high and flare out to the sides. Squeeze your rear delts at the end position for 1 second. 3 sets of 15.",
        keyPoints: "Elbows high and wide the whole time — this is what hits the rear delts and rotator cuff, not the traps. This exercise protects your shoulder joints and fixes the muscle imbalance caused by lots of pressing and curling.",
        settings: 'Light weight, high reps. This is a health exercise as much as a strength one. Never go heavy on face pulls.',
        ifTooHard: 'Move closer to the cable to reduce the effective load.',
        commonMistake: "Pulling the rope to your neck instead of your face, and letting elbows drop. Elbows must stay at or above shoulder height throughout."
      }
    ]
  }
];

export const DAYS_MAP = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 0: 'Sun' };

// Returns 1, 2, or 3 on Mon/Wed/Fri; null on all other days.
export function getTodayWorkoutDay() {
  const dow = new Date().getDay(); // 0=Sun … 6=Sat
  return { 1: 1, 3: 2, 5: 3 }[dow] ?? null;
}

// Kept for any code that still imports it — delegates to calendar.
export function getNextWorkoutDay() {
  return getTodayWorkoutDay();
}
