// Browser Native Unique ID Generator (No External Library Needed)
function getUniqueVisitorId() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const txt = 'KamleshPortfolioFingerprint2026';
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125,1,62,20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);
    
    const b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
    let hash = 0;
    for (let i = 0; i < b64.length; i++) {
        const char = b64.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return 'visitor_' + Math.abs(hash) + '_' + navigator.language.replace('-', '');
}

async function trackUniqueVisitor() {
    const countElement = document.getElementById('visitor-count');
    if (!countElement) return;

    try {
        // 1. Native Fingerprint ID बनाएं
        const visitorId = getUniqueVisitorId();
        const savedVisitor = localStorage.getItem('portfolio_visitor_id');

        const namespace = "kamlesh_kumar_portfolio_views_2026";
        const key = "visits";

        if (savedVisitor !== visitorId) {
            // नया Unique Visitor -> API hit करून count +1 करा
            const response = await fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`);
            const data = await response.json();
            
            if (data && data.count !== undefined) {
                countElement.innerText = data.count;
                localStorage.setItem('portfolio_visitor_id', visitorId);
            } else {
                countElement.innerText = "1";
            }
        } else {
            // जुना Visitor -> Count फक्त वाचा (Read Only)
            const response = await fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/`);
            const data = await response.json();
            
            if (data && data.count !== undefined) {
                countElement.innerText = data.count;
            } else {
                countElement.innerText = "1";
            }
        }
    } catch (error) {
        console.error("Counter Error:", error);
        countElement.innerText = "1";
    }
}

document.addEventListener('DOMContentLoaded', trackUniqueVisitor);
