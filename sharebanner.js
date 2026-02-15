(function() {
    const src = document.currentScript ? document.currentScript.src : '';
    let targetUrl = null;
    try {
        if (src) {
            targetUrl = new URL(src).searchParams.get('a');
        }
    } catch (e) {
        console.error('URL parsing error', e);
    }

    document.write(`
        <div id="installBanner" style="
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translate(-50%, 1rem);
            z-index: 50;
            opacity: 0;
            pointer-events: none;
            transition: all 1s ease-in-out;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        ">
            <button id="installBtn" style="
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1.5rem;
                padding-right: 2rem;
                background-color: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                color: white;
                border-radius: 9999px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.25);
                border: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;
                outline: none;
            ">
                <img src="https://cdn.jsdelivr.net/gh/sllkx/olla@main/ring128.png" style="
                    width: 2rem;
                    height: 2rem;
                    border-radius: 50%;
                    object-fit: cover;
                ">
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    line-height: 1.2;
                ">
                    <span style="
                        font-size: 10px;
                        color: rgba(255, 255, 255, 0.6);
                        font-weight: 500;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    ">Install App</span>
                    <span style="
                        font-size: 14px;
                        font-weight: 700;
                    ">Download</span>
                </div>
                <img src="https://cdn.jsdelivr.net/npm/remixicon@4.9.1/icons/System/download-line.svg" style="
                    width: 1.25rem;
                    height: 1.25rem;
                    margin-left: 0.5rem;
                    opacity: 0.8;
                    filter: invert(1);
                ">
            </button>
        </div>
    `);

    let hideTimeout;

    document.addEventListener('click', function(e) {
        const banner = document.getElementById('installBanner');
        if (!banner) return;

        const btn = e.target.closest('#installBtn');
        
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = 'scale(1)', 150);

            if (targetUrl) {
                window.location.href = targetUrl;
            }
            return;
        }

        banner.style.opacity = '1';
        banner.style.pointerEvents = 'auto';
        banner.style.transform = 'translate(-50%, 0)';

        if (hideTimeout) clearTimeout(hideTimeout);

        hideTimeout = setTimeout(function() {
            banner.style.opacity = '0';
            banner.style.pointerEvents = 'none';
            banner.style.transform = 'translate(-50%, 1rem)';
        }, 3000);
    });
})();
