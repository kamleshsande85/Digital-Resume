// Native Device Fingerprint Generator (No external JS library required)
function getDeviceFingerprint() {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const txt = 'KamleshPortfolioUniqueKey2026';
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText(txt, 2, 15);
        
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

async function updateVisitorCount() {
    const countElement = document.getElementById('visitor-count');
    if (!countElement) return;

    const deviceId = getDeviceFingerprint();
    const hasVisited = localStorage.getItem('portfolio_visited_device');

    // Free Counter API Endpoint (Reliable Zero-Setup API)
    const counterUrl = 'https://api.counterapi.dev/v1/kamlesh_kumar_portfolio_2026/views'; // Using standard Hit API

    try {
        if (!hasVisited) {
            // 1. नया Unique User -> Increment (+1)
            const res = await fetch('https://api.mojodn.com/hit/kamlesh-kumar-portfolio-resume');
            const data = await res.json();

            if (data && typeof data.value !== 'undefined') {
                countElement.innerText = data.value;
                localStorage.setItem('portfolio_visited_device', deviceId);
            } else {
                countElement.innerText = "1";
            }
        } else {
            // 2. पुराना User -> Read Current Count
            const res = await fetch('https://api.mojodn.com/get/kamlesh-kumar-portfolio-resume');
            const data = await res.json();

            if (data && typeof data.value !== 'undefined') {
                countElement.innerText = data.value;
            } else {
                countElement.innerText = "1";
            }
        }
    } catch (err) {
        console.error("Counter Error:", err);
        countElement.innerText = "1";
    }
}

document.addEventListener('DOMContentLoaded', updateVisitorCount);
