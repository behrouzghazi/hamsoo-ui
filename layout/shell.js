(function () {
    const navItems = [
        { id: 'home', title: 'خانه', href: '/index.html', icon: 'house' },
        { id: 'worklist', title: 'مدیریت درخواست‌ها', href: '/worklist/index.html', icon: 'git-pull-request' },
        { id: 'reports', title: 'گزارش', href: '#', icon: 'bar-chart-3', button: true },
        { id: 'settings', title: 'اطلاعات پایه', href: '#', icon: 'settings', button: true }
    ];

    function renderIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function navClasses(isActive) {
        return isActive
            ? 'p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl transition-all'
            : 'p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all';
    }

    function renderPrimarySidebar(container) {
        const active = container.dataset.active || 'home';
        const worklistBadge = container.dataset.worklistBadge;
        const links = navItems.map((item) => {
            const badge = item.id === 'worklist' && worklistBadge
                ? `<span class="absolute -top-2 -left-2 min-w-5 h-5 px-1.5 rounded-full bg-rose-500 text-white text-[11px] font-bold leading-5 text-center shadow-sm shadow-rose-900/30">${worklistBadge}</span>`
                : '';
            const content = `<i data-lucide="${item.icon}" class="w-6 h-6"></i>`;
            const classes = `${navClasses(active === item.id)} ${badge ? 'relative' : ''}`;

            if (item.button) {
                return `<button class="${classes}" title="${item.title}" type="button">${content}</button>`;
            }

            return `<a href="${item.href}" class="${classes}" title="${item.title}">${content}${badge}</a>`;
        }).join('');

        container.className = 'w-16 bg-slate-900 flex flex-col items-center py-6 gap-6 z-30';
        container.innerHTML = `
            <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4">
                <a href="/index.html" aria-label="صفحه اصلی">
                    <i data-lucide="layers" class="w-6 h-6"></i>
                </a>
            </div>
            <nav class="flex flex-col gap-4">
                ${links}
            </nav>
        `;
    }

    function renderHeader(container) {
        const title = 'همسو';
        const subtitle = 'مدیریت فرایندهای کسب و کار';
        const icon = 'layers';
        const actionText = container.dataset.actionText || 'بازطراحی';
        const actionHref = container.dataset.actionHref;

        const action = actionHref
            ? `<a href="${actionHref}" class="text-xs bg-white/15 hover:bg-white/20 px-3 py-1 rounded-full transition-all">${actionText}</a>`
            : `<span class="text-xs bg-white/15 px-3 py-1 rounded-full">${actionText}</span>`;

        container.className = 'h-16 bg-blue-700 text-white border-b border-blue-800 flex items-center justify-between px-6 shrink-0';
        container.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
                    <i data-lucide="${icon}" class="w-5 h-5"></i>
                </div>
                <div>
                    <div class="text-sm font-bold">${title}</div>
                    <div class="text-[11px] text-blue-100">${subtitle}</div>
                </div>
            </div>
            ${action}
        `;
    }

    function renderShell() {
        document.querySelectorAll('[data-hamsoo-primary-sidebar]').forEach(renderPrimarySidebar);
        document.querySelectorAll('[data-hamsoo-header]').forEach(renderHeader);
        renderIcons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderShell);
    } else {
        renderShell();
    }
})();
