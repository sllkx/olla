(function() {
    // 1. 파라미터 가져오기
    const src = document.currentScript ? document.currentScript.src : '';
    let params = {
        url: null,
        pos: 'bc',    // 위치 기본값: Bottom-Center
        theme: 'dark',// 테마 기본값: Dark
        mode: 'full'  // 모드 기본값: Full (일반)
    };

    try {
        if (src) {
            const urlObj = new URL(src);
            params.url = urlObj.searchParams.get('a');
            
            // p = position (tl, tc, tr, bl, bc, br)
            const p = urlObj.searchParams.get('p');
            if (['tl', 'tc', 'tr', 'bl', 'bc', 'br'].includes(p)) params.pos = p;

            // t = theme (dark, light)
            const t = urlObj.searchParams.get('t');
            if (t === 'light') params.theme = 'light';

            // m = mode (full, mini)
            const m = urlObj.searchParams.get('m');
            if (m === 'mini') params.mode = 'mini';
        }
    } catch (e) {
        console.error('URL parsing error', e);
    }

    // 2. 설정에 따른 스타일 값 계산
    const isDark = params.theme === 'dark';
    const isMini = params.mode === 'mini';

    // 테마별 색상
    const styles = {
        bg: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.85)',
        textMain: isDark ? 'white' : '#1a1a1a',
        textSub: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
        border: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        iconFilter: isDark ? 'invert(1)' : 'invert(0)', // 아이콘 색상 반전
        shadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.15)'
    };

    // 위치별 CSS 및 애니메이션 좌표
    // yHidden: 숨겨져 있을 때 Y축 이동값
    let posCss = 'position: fixed; z-index: 9999; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);';
    let yHidden = '1.5rem'; 
    let yVisible = '0';
    let xTransform = '0';

    if (params.pos.startsWith('t')) { // Top
        posCss += 'top: 2rem; bottom: auto; ';
        yHidden = '-1.5rem'; // 위로 숨김
    } else { // Bottom
        posCss += 'top: auto; bottom: 2rem; ';
        yHidden = '1.5rem'; // 아래로 숨김
    }

    if (params.pos.endsWith('l')) { // Left
        posCss += 'left: 2rem; right: auto; ';
    } else if (params.pos.endsWith('r')) { // Right
        posCss += 'left: auto; right: 2rem; ';
    } else { // Center
        posCss += 'left: 50%; right: auto; ';
        xTransform = '-50%';
    }

    // 초기 숨김 상태 Transform 계산
    const hiddenTransform = `translate(${xTransform}, ${yHidden})`;
    const visibleTransform = `translate(${xTransform}, ${yVisible})`;

    // 미니 모드 사이즈 조정
    const btnPadding = isMini ? '0.6rem 1.2rem' : '0.75rem 1.5rem';
    const btnGap = isMini ? '0.5rem' : '0.75rem';
    const iconSize = isMini ? '1.5rem' : '2rem';
    const titleSize = isMini ? '13px' : '14px';

    // 3. HTML 렌더링
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

    // 4. 이벤트 로직
    let hideTimeout;
    const banner = document.getElementById('installBanner');

    // 클릭 이벤트 (문서 전체)
    document.addEventListener('click', function(e) {
        if (!banner) return;

        const btn = e.target.closest('#installBtn');
        
        // 1) 배너 버튼 클릭 시: 이동
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = 'scale(1)', 150);

            if (params.url) {
                window.location.href = params.url;
            }
            return;
        }

        // 2) 문서 다른 곳 클릭 시: 배너 표시
        banner.style.opacity = '1';
        banner.style.pointerEvents = 'auto';
        banner.style.transform = visibleTransform;

        // 기존 타이머 취소 및 재설정
        if (hideTimeout) clearTimeout(hideTimeout);

        hideTimeout = setTimeout(function() {
            banner.style.opacity = '0';
            banner.style.pointerEvents = 'none';
            banner.style.transform = hiddenTransform;
        }, 3000);
    });
})();
