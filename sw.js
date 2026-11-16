// Bump VERSION whenever any file changes so phones pick up the update.
const VERSION = "posture-reset-v2";
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "img/all_fours_quad_stretch_0.jpg", "img/all_fours_quad_stretch_1.jpg", "img/band_pull_apart_0.jpg", "img/band_pull_apart_1.jpg", "img/barbell_hip_thrust_0.jpg", "img/barbell_hip_thrust_1.jpg", "img/cat_stretch_0.jpg", "img/cat_stretch_1.jpg", "img/childs_pose_0.jpg", "img/childs_pose_1.jpg", "img/dead_bug_0.jpg", "img/dead_bug_1.jpg", "img/dumbbell_incline_row_0.jpg", "img/dumbbell_incline_row_1.jpg", "img/dumbbell_rear_lunge_0.jpg", "img/dumbbell_rear_lunge_1.jpg", "img/face_pull_0.jpg", "img/face_pull_1.jpg", "img/kneeling_hip_flexor_0.jpg", "img/kneeling_hip_flexor_1.jpg", "img/lying_rear_delt_raise_0.jpg", "img/lying_rear_delt_raise_1.jpg", "img/pallof_press_0.jpg", "img/pallof_press_1.jpg", "img/pelvic_tilt_into_bridge_0.jpg", "img/pelvic_tilt_into_bridge_1.jpg", "img/plank_0.jpg", "img/plank_1.jpg", "img/romanian_deadlift_0.jpg", "img/romanian_deadlift_1.jpg", "img/side_bridge_0.jpg", "img/side_bridge_1.jpg", "img/side_neck_stretch_0.jpg", "img/side_neck_stretch_1.jpg", "img/single_leg_glute_bridge_0.jpg", "img/single_leg_glute_bridge_1.jpg", "img/split_squat_with_dumbbells_0.jpg", "img/split_squat_with_dumbbells_1.jpg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Google Fonts: cache on first use so the app keeps its type offline.
  if (url.hostname.endsWith("googleapis.com") || url.hostname.endsWith("gstatic.com")) {
    e.respondWith(caches.open(VERSION).then(c => c.match(req).then(hit => hit || fetch(req).then(res => { c.put(req, res.clone()); return res; }))));
    return;
  }
  if (url.origin !== location.origin) return;
  // App shell: network first so updates land, cache when offline.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; }).catch(() => caches.match(req).then(r => r || caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
