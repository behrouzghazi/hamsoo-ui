(function () {
    const inboxCount = 3;
    const processItems = [
        {
            id: 'kpi-change',
            title: 'تغییر/تایید شاخص',
            href: '/worklist/kpi-change/detail.html?mode=edit',
            icon: 'file-edit'
        }
    ];

    function navItemClasses(isActive) {
        return isActive
            ? 'w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white transition-all text-right shadow-sm'
            : 'w-full group flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-right';
    }

    function processItemClasses(isActive) {
        return isActive
            ? 'w-full group flex items-center justify-between p-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 transition-all text-right shadow-sm shadow-blue-100/50'
            : 'w-full group flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-right';
    }

    function renderSidebar(container) {
        const active = container.dataset.active || 'inbox';
        const processLinks = processItems.map((item) => {
            const isActive = active === item.id;
            return `
                <a href="${item.href}" class="${processItemClasses(isActive)}">
                    <div class="flex items-center gap-3">
                        <div class="p-2 bg-blue-500 rounded-lg text-white ${isActive ? 'group-hover:scale-110 transition-transform' : ''}">
                            <i data-lucide="${item.icon}" class="w-4 h-4"></i>
                        </div>
                        <span class="text-sm font-semibold ${isActive ? '' : 'text-slate-700'}">${item.title}</span>
                    </div>
                    <i data-lucide="chevron-left" class="w-4 h-4 opacity-50"></i>
                </a>
            `;
        }).join('');

        container.innerHTML = `
            <div class="p-6">
                <h2 class="text-xl font-bold text-slate-800 tracking-tight">مدیریت درخواست‌ها</h2>
            </div>

            <div class="px-4 py-2">
                <div class="relative group">
                    <i data-lucide="search" class="absolute right-3 top-2.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                    <input type="text" placeholder="جستجوی فرآیند..." class="w-full bg-slate-50 border border-slate-100 rounded-xl pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                </div>
            </div>

            <div class="px-4 py-3 border-b border-slate-100">
                <a href="/worklist/index.html" class="${navItemClasses(active === 'inbox')}">
                    <div class="flex items-center gap-3">
                        <div class="p-2 ${active === 'inbox' ? 'bg-white/10 text-white' : 'bg-blue-500 text-white'} rounded-lg">
                            <i data-lucide="inbox" class="w-4 h-4"></i>
                        </div>
                        <span class="text-sm font-semibold ${active === 'inbox' ? '' : 'text-slate-700'}">صندوق ورودی وظایف</span>
                    </div>
                    <span class="min-w-6 h-6 px-2 rounded-full bg-rose-500 text-white text-xs font-bold leading-6 text-center">${inboxCount}</span>
                </a>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                <div class="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">فرآیندهای همسو</div>
                ${processLinks}
            </div>
        `;
    }

    function renderAllSidebars() {
        document.querySelectorAll('[data-worklist-sidebar]').forEach(renderSidebar);
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderAllSidebars);
    } else {
        renderAllSidebars();
    }
})();
