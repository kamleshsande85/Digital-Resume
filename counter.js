// Device fingerprint - unique visitor identification
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

// Main function to update visitor count
async function updateVisitorCount() {
    const countElement = document.getElementById('visitor-count');
    if (!countElement) {
        console.warn('Element with id "visitor-count" not found');
        return;
    }

    const deviceId = getDeviceId();
    const hasVisited = localStorage.getItem('portfolio_visited');

    // CountAPI v2 endpoint (Working - No 410 error)
    const namespace = "kamlesh_portfolio";
    const key = "visitors";

    try {
        if (!hasVisited) {
            // New visitor - increment count
            const response = await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`);
            const data = await response.json();
            
            if (data && typeof data.value !== 'undefined') {
                countElement.innerText = data.value;
                localStorage.setItem('portfolio_visited', 'true');
                localStorage.setItem('visitor_device', deviceId);
            } else {
                // Fallback: local storage
                let count = parseInt(localStorage.getItem('local_count') || '0') + 1;
                countElement.innerText = count;
                localStorage.setItem('local_count', count);
                localStorage.setItem('portfolio_visited', 'true');
            }
        } else {
            // Returning visitor - get current count
            const response = await fetch(`https://api.countapi.xyz/get/${namespace}/${key}`);
            const data = await response.json();
            
            if (data && typeof data.value !== 'undefined') {
                countElement.innerText = data.value;
            } else {
                // Fallback: local storage
                let count = localStorage.getItem('local_count') || '1';
                countElement.innerText = count;
            }
        }
    } catch (error) {
        console.error('Visitor Counter Error:', error);
        // Ultimate fallback: local storage
        let count = localStorage.getItem('local_count') || '1';
        countElement.innerText = count;
    }
}

// Auto-run when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateVisitorCount);
} else {
    updateVisitorCount();
}
