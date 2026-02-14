(function() {
    const src = document.currentScript.src;
    const targetUrl = new URL(src).searchParams.get('a');

    document.write(`
        <script src="https://cdn.tailwindcss.com"></script>
        <div id="installBanner" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 opacity-0 pointer-events-none translate-y-4 transition-all duration-1000 ease-in-out">
            <button id="installBtn" class="flex items-center gap-3 px-6 py-3 pr-8 bg-black/70 backdrop-blur-md text-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.25)] border border-white/10 active:scale-95 transition-all">
                <img src="https://cdn.jsdelivr.net/gh/sllkx/olla@main/ring128.png" class="w-8 h-8 rounded-full object-cover">
                <div class="flex flex-col items-start">
                    <span class="text-[10px] text-white/60 font-medium uppercase tracking-wider">Install App</span>
                    <span class="text-sm font-bold">Download</span>
                </div>
                <img src="https://cdn.jsdelivr.net/npm/remixicon@4.9.1/icons/System/download-line.svg" class="w-5 h-5 ml-2 opacity-80 invert">
            </button>
        </div>
    `);

    let hideTimeout;

    document.addEventListener('click', function(e) {
        const banner = document.getElementById('installBanner');
        if (!banner) return;

        const btn = e.target.closest('#installBtn');
        
        if (btn) {
            if (targetUrl) {
                window.location.href = targetUrl;
            }
            return;
        }

        banner.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        banner.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');

        if (hideTimeout) clearTimeout(hideTimeout);

        hideTimeout = setTimeout(function() {
            banner.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
            banner.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        }, 3000);
    });
})();
