(function() {
    const src = document.currentScript ? document.currentScript.src : '';
    let params = {
        url: null,
        pos: 'bc',
        theme: 'dark',
        mode: 'full',
        gap: '2rem' 
    };

    try {
        if (src) {
            const urlObj = new URL(src);
            params.url = urlObj.searchParams.get('a');
            
            const p = urlObj.searchParams.get('p');
            if (['tl', 'tc', 'tr', 'bl', 'bc', 'br'].includes(p)) params.pos = p;

            const t = urlObj.searchParams.get('t');
            if (t === 'light') params.theme = 'light';

            const m = urlObj.searchParams.get('m');
            if (m === 'mini') params.mode = 'mini';

            const g = urlObj.searchParams.get('g');
            if (g) params.gap = g;
        }
    } catch (e) {
        console.error(e);
    }

    const isDark = params.theme === 'dark';
    const isMini = params.mode === 'mini';

    const styles = {
        bg: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.85)',
        textMain: isDark ? 'white' : '#1a1a1a',
        textSub: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
        border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        iconFilter: isDark ? 'invert(1)' : 'invert(0)',
        shadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.15)'
    };

    let posCss = 'position: fixed; z-index: 9999; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);';
    let yHidden = '1.5rem'; 
    let yVisible = '0';
    let xTransform = '0';

    if (params.pos.startsWith('t')) { 
        posCss += `top: ${params.gap}; bottom: auto; `;
        yHidden = '-1.5rem'; 
    } else { 
        posCss += `top: auto; bottom: ${params.gap}; `;
        yHidden = '1.5rem'; 
    }

    if (params.pos.endsWith('l')) { 
        posCss += 'left: 2rem; right: auto; ';
    } else if (params.pos.endsWith('r')) { 
        posCss += 'left: auto; right: 2rem; ';
    } else { 
        posCss += 'left: 50%; right: auto; ';
        xTransform = '-50%';
    }

    const hiddenTransform = `translate(${xTransform}, ${yHidden})`;
    const visibleTransform = `translate(${xTransform}, ${yVisible})`;

    const btnPadding = isMini ? '0.6rem 1.2rem' : '0.75rem 1.5rem';
    const btnGap = isMini ? '0.5rem' : '0.75rem';
    const iconSize = isMini ? '1.5rem' : '2rem';
    const titleSize = isMini ? '13px' : '14px';

    document.write(`
        <div id="installBanner" style="
            ${posCss}
            transform: ${hiddenTransform};
            opacity: 0;
            pointer-events: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        ">
            <button id="installBtn" style="
                display: flex;
                align-items: center;
                gap: ${btnGap};
                padding: ${btnPadding};
                padding-right: ${isMini ? '1.2rem' : '2rem'};
                background-color: ${styles.bg};
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                color: ${styles.textMain};
                border-radius: 9999px;
                box-shadow: ${styles.shadow};
                border: 1px solid ${styles.border};
                cursor: pointer;
                outline: none;
                transition: transform 0.1s ease;
            ">
                <img src="https://cdn.jsdelivr.net/gh/sllkx/olla@main/ring64.png" style="
                    width: ${iconSize};
                    height: ${iconSize};
                    border-radius: 50%;
                    object-fit: cover;
                ">
                
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    line-height: 1.2;
                ">
                    ${!isMini ? `
                    <span style="
                        font-size: 10px;
                        color: ${styles.textSub};
                        font-weight: 500;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        margin-bottom: 2px;
                    ">Install App</span>
                    ` : ''}
                    <span style="
                        font-size: ${titleSize};
                        font-weight: 700;
                    ">Download</span>
                </div>

                <img src="https://cdn.jsdelivr.net/npm/remixicon@4.9.1/icons/System/download-line.svg" style="
                    width: 1.25rem;
                    height: 1.25rem;
                    margin-left: ${isMini ? '0.2rem' : '0.5rem'};
                    opacity: 0.8;
                    filter: ${styles.iconFilter};
                ">
            </button>
        </div>
    `);

    let hideTimeout;
    const banner = document.getElementById('installBanner');

    document.addEventListener('click', function(e) {
        if (!banner) return;

        const btn = e.target.closest('#installBtn');
        
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = 'scale(1)', 150);

            if (params.url) {
                window.location.href = params.url;
            }
            return;
        }

        banner.style.opacity = '1';
        banner.style.pointerEvents = 'auto';
        banner.style.transform = visibleTransform;

        if (hideTimeout) clearTimeout(hideTimeout);

        hideTimeout = setTimeout(function() {
            banner.style.opacity = '0';
            banner.style.pointerEvents = 'none';
            banner.style.transform = hiddenTransform;
        }, 3000);
    });
})();
