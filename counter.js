

// ===== FIREBASE SETUP =====
// Step 3 से Copy किया हुआ Config यहाँ Paste करो
const firebaseConfig = {
  apiKey: "AIzaSyDJEfrvzNqv-OMZanX3gAR_RE3shFPJ3uk",
  authDomain: "my-portfolio-counter-11a9a.firebaseapp.com",
  databaseURL: "https://my-portfolio-counter-11a9a-default-rtdb.firebaseio.com",
  projectId: "my-portfolio-counter-11a9a",
  storageBucket: "my-portfolio-counter-11a9a.firebasestorage.app",
  messagingSenderId: "431976575656",
  appId: "1:431976575656:web:315c3a46f866f13a30089d"
};

// Firebase Initialize करो
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ===== DEVICE FINGERPRINT (Unique Visitor Detect) =====
function getDeviceId() {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = "top";
        ctx.font = "14px Arial";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText('PortfolioFingerprint2026', 2, 15);
        
        const b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
        let hash = 0;
        for (let i = 0; i < b64.length; i++) {
            hash = ((hash << 5) - hash) + b64.charCodeAt(i);
            hash |= 0;
        }
        return 'dev_' + Math.abs(hash);
    } catch (e) {
        return 'dev_' + Math.random().toString(36).substring(7);
    }
}

// ===== VISITOR COUNTER =====
async function updateVisitorCount() {
    const countElement = document.getElementById('visitor-count');
    if (!countElement) return;

    const deviceId = getDeviceId();
    const hasVisited = localStorage.getItem('portfolio_visited_' + deviceId);
    const visitorRef = database.ref('totalVisitors'); // Firebase में count save होगा

    try {
        if (!hasVisited) {
            // Naya Visitor - Global Count ++
            await visitorRef.transaction((currentCount) => {
                return (currentCount || 0) + 1;
            }, (error, committed, snapshot) => {
                if (error) {
                    console.error('Firebase Error:', error);
                    // Fallback - Local Storage
                    let fallback = parseInt(localStorage.getItem('fallback_count') || '0') + 1;
                    countElement.innerText = fallback;
                    localStorage.setItem('fallback_count', fallback);
                } else if (committed) {
                    countElement.innerText = snapshot.val();
                    localStorage.setItem('portfolio_visited_' + deviceId, 'true');
                }
            });
        } else {
            // Wapas Aaya Visitor - Sirf Count Dikhao
            visitorRef.once('value', (snapshot) => {
                const count = snapshot.val() || 1;
                countElement.innerText = count;
            }).catch((error) => {
                // Fallback
                let fallback = localStorage.getItem('fallback_count') || '1';
                countElement.innerText = fallback;
            });
        }
    } catch (error) {
        console.error('Counter Error:', error);
        let fallback = localStorage.getItem('fallback_count') || '1';
        countElement.innerText = fallback;
    }
}

// ===== AUTO-RUN =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateVisitorCount);
} else {
    updateVisitorCount();
}
