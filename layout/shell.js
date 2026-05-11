(function () {
    const navItems = [
        { id: 'root', title: 'روت', href: 'http://127.0.0.1:5500/index.html', icon: 'layers' },
        { id: 'home', title: 'خانه', href: '#', icon: 'house' },
        { id: 'dashboard', title: 'داشبورد', href: '#', icon: 'layout-dashboard' },
        { id: 'worklist', title: 'کارتابل وظایف', href: '/worklist/index.html', icon: 'clipboard-list' },
        { id: 'measure', title: 'مدیریت شاخص', href: '#', icon: 'bar-chart-3' },
        { id: 'advanced-search', title: 'جستجوی پیشرفته', href: '#', icon: 'search' },
        { id: 'pcf-tree', title: 'درخت PCF', href: '#', icon: 'git-branch' },
        { id: 'reports', title: 'گزارش ها', href: '#', icon: 'file-text' },
        { id: 'base-data', title: 'اطلاعات پایه', href: '#', icon: 'settings' }
    ];

    function renderIcons() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    function navClasses(isActive) {
        return isActive
            ? 'group/nav relative p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl transition-all'
            : 'group/nav relative p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all';
    }

    function renderTooltip(title) {
        return `
            <span class="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg shadow-slate-900/20 transition-opacity group-hover/nav:opacity-100 group-focus-visible/nav:opacity-100">
                ${title}
            </span>
        `;
    }

    function ensurePcfTreeStyles() {
        if (document.getElementById('hamsoo-pcf-tree-style')) return;

        const style = document.createElement('style');
        style.id = 'hamsoo-pcf-tree-style';
        style.textContent = `
            .hamsoo-pcf-panel {
                width: 0;
                opacity: 0;
                overflow: hidden;
                transition: width 0.24s ease, opacity 0.18s ease;
            }
            .hamsoo-pcf-panel.is-open {
                width: 420px;
                opacity: 1;
                overflow: visible;
            }
            .hamsoo-pcf-panel-inner {
                width: 420px;
            }
            .hamsoo-pcf-node {
                display: flex;
                align-items: center;
                gap: 8px;
                min-height: 34px;
                padding: 6px 8px;
                border-radius: 8px;
                color: #475569;
                font-size: 12px;
                line-height: 1.6;
                transition: background-color 0.18s ease, color 0.18s ease;
            }
            .hamsoo-pcf-node:hover,
            .hamsoo-pcf-node.is-active {
                background: #eff6ff;
                color: #1d4ed8;
            }
            .hamsoo-pcf-children {
                margin-right: 18px;
                padding-right: 14px;
                border-right: 1px dashed #cbd5e1;
            }
            .hamsoo-wide-sidebar-hidden {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    function pcfTreeMarkup() {
        return `
            <div class="hamsoo-pcf-panel-inner h-full flex flex-col bg-white">
                <div class="h-16 px-4 border-b border-slate-200 flex items-center justify-between">
                    <div>
                        <h2 class="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <i data-lucide="git-branch" class="w-4 h-4 text-blue-600"></i>
                            درخت PCF
                        </h2>
                        <p class="text-[11px] text-slate-400 mt-1">نقشه سازمان، گروه فرایندها و فرایندهای کسب و کار</p>
                    </div>
                    <button type="button" data-hamsoo-pcf-close class="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center" title="بستن">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
                <div class="p-4 border-b border-slate-100">
                    <div class="h-10 border border-slate-200 rounded-lg px-3 flex items-center gap-2 bg-slate-50">
                        <i data-lucide="search" class="w-4 h-4 text-slate-400"></i>
                        <input data-hamsoo-pcf-search class="w-full bg-transparent outline-none text-xs placeholder:text-slate-400" placeholder="جستجوی درخت..." />
                    </div>
                </div>
                <div class="flex-1 overflow-y-auto p-3 text-right">
                    <button type="button" class="hamsoo-pcf-node is-active w-full font-bold" data-hamsoo-pcf-branch data-hamsoo-pcf-node-type="root" data-hamsoo-pcf-node-title="نقشه سازمان" aria-expanded="true">
                        <i data-lucide="map" class="w-4 h-4 text-amber-500"></i>
                        <span class="flex-1 text-right">نقشه سازمان</span>
                        <i data-lucide="minus-square" class="w-3.5 h-3.5 text-slate-400" data-hamsoo-pcf-expander></i>
                    </button>
                    <div class="hamsoo-pcf-children mt-1 space-y-1">
                        <button type="button" class="hamsoo-pcf-node w-full font-semibold" data-hamsoo-pcf-node-type="group" data-hamsoo-pcf-node-title="مدیریت و توسعه استراتژی">
                            <i data-lucide="network" class="w-4 h-4 text-fuchsia-500"></i>
                            <span class="flex-1 text-right">مدیریت و توسعه استراتژی</span>
                            <i data-lucide="plus-square" class="w-3.5 h-3.5 text-slate-300"></i>
                        </button>
                        <button type="button" class="hamsoo-pcf-node w-full font-semibold" data-hamsoo-pcf-branch data-hamsoo-pcf-node-type="group" data-hamsoo-pcf-node-title="مدیریت تامین" aria-expanded="true">
                            <i data-lucide="network" class="w-4 h-4 text-fuchsia-500"></i>
                            <span class="flex-1 text-right">مدیریت تامین</span>
                            <i data-lucide="minus-square" class="w-3.5 h-3.5 text-slate-400" data-hamsoo-pcf-expander></i>
                        </button>
                        <div class="hamsoo-pcf-children space-y-1">
                            <button type="button" class="hamsoo-pcf-node w-full font-medium" data-hamsoo-pcf-branch data-hamsoo-pcf-node-type="group" data-hamsoo-pcf-node-title="تهیه مواد" aria-expanded="true">
                                <i data-lucide="network" class="w-4 h-4 text-fuchsia-500"></i>
                                <span class="flex-1 text-right">تهیه مواد</span>
                                <i data-lucide="minus-square" class="w-3.5 h-3.5 text-slate-400" data-hamsoo-pcf-expander></i>
                            </button>
                            <div class="hamsoo-pcf-children space-y-1">
                                <button type="button" class="hamsoo-pcf-node w-full" data-hamsoo-pcf-node-type="process" data-hamsoo-pcf-node-title="پیشنهاد خرید مصرفی و غیرمصرفی">
                                    <i data-lucide="workflow" class="w-4 h-4 text-blue-500"></i>
                                    <span class="flex-1 text-right truncate">پیشنهاد خرید مصرفی و غیرمصرفی</span>
                                </button>
                                <button type="button" class="hamsoo-pcf-node w-full" data-hamsoo-pcf-node-type="process" data-hamsoo-pcf-node-title="پیشنهاد خرید قطعات یدکی">
                                    <i data-lucide="workflow" class="w-4 h-4 text-blue-500"></i>
                                    <span class="flex-1 text-right">پیشنهاد خرید قطعات یدکی</span>
                                </button>
                                <button type="button" class="hamsoo-pcf-node w-full" data-hamsoo-pcf-node-type="process" data-hamsoo-pcf-node-title="سفارش خرید">
                                    <i data-lucide="workflow" class="w-4 h-4 text-blue-500"></i>
                                    <span class="flex-1 text-right">سفارش خرید</span>
                                </button>
                                <button type="button" class="hamsoo-pcf-node w-full" data-hamsoo-pcf-node-type="process" data-hamsoo-pcf-node-title="درخواست خرید">
                                    <i data-lucide="workflow" class="w-4 h-4 text-blue-500"></i>
                                    <span class="flex-1 text-right">درخواست خرید</span>
                                </button>
                                <button type="button" class="hamsoo-pcf-node w-full" data-hamsoo-pcf-node-type="process" data-hamsoo-pcf-node-title="درخواست خرید تحویل مستقیم">
                                    <i data-lucide="workflow" class="w-4 h-4 text-blue-500"></i>
                                    <span class="flex-1 text-right">درخواست خرید تحویل مستقیم</span>
                                </button>
                                <button type="button" class="hamsoo-pcf-node w-full" data-hamsoo-pcf-node-type="process" data-hamsoo-pcf-node-title="سازماندهی خرید">
                                    <i data-lucide="workflow" class="w-4 h-4 text-blue-500"></i>
                                    <span class="flex-1 text-right">سازماندهی خرید</span>
                                </button>
                            </div>
                        </div>
                        <button type="button" class="hamsoo-pcf-node w-full font-semibold" data-hamsoo-pcf-node-type="group" data-hamsoo-pcf-node-title="امور گمرکی خرید">
                            <i data-lucide="network" class="w-4 h-4 text-fuchsia-500"></i>
                            <span class="flex-1 text-right">امور گمرکی خرید</span>
                            <i data-lucide="plus-square" class="w-3.5 h-3.5 text-slate-300"></i>
                        </button>
                        <button type="button" class="hamsoo-pcf-node w-full font-semibold" data-hamsoo-pcf-node-type="group" data-hamsoo-pcf-node-title="مدیریت تامین کنندگان">
                            <i data-lucide="network" class="w-4 h-4 text-fuchsia-500"></i>
                            <span class="flex-1 text-right">مدیریت تامین کنندگان</span>
                            <i data-lucide="plus-square" class="w-3.5 h-3.5 text-slate-300"></i>
                        </button>
                        <button type="button" class="hamsoo-pcf-node w-full font-semibold" data-hamsoo-pcf-node-type="group" data-hamsoo-pcf-node-title="مدیریت منابع انسانی">
                            <i data-lucide="network" class="w-4 h-4 text-fuchsia-500"></i>
                            <span class="flex-1 text-right">مدیریت منابع انسانی</span>
                            <i data-lucide="plus-square" class="w-3.5 h-3.5 text-slate-300"></i>
                        </button>
                        <button type="button" class="hamsoo-pcf-node w-full font-semibold" data-hamsoo-pcf-node-type="group" data-hamsoo-pcf-node-title="مدیریت منابع مالی">
                            <i data-lucide="network" class="w-4 h-4 text-fuchsia-500"></i>
                            <span class="flex-1 text-right">مدیریت منابع مالی</span>
                            <i data-lucide="plus-square" class="w-3.5 h-3.5 text-slate-300"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function setPcfBranchState(branch, isExpanded) {
        const children = branch.nextElementSibling;
        if (!children || !children.classList.contains('hamsoo-pcf-children')) return;

        branch.setAttribute('aria-expanded', String(isExpanded));
        children.classList.toggle('hidden', !isExpanded);

        const icon = branch.querySelector('[data-hamsoo-pcf-expander]');
        if (icon) {
            icon.outerHTML = `<i data-lucide="${isExpanded ? 'minus-square' : 'plus-square'}" class="w-3.5 h-3.5 text-slate-400" data-hamsoo-pcf-expander></i>`;
            renderIcons();
        }
    }

    function togglePcfBranch(branch) {
        const isExpanded = branch.getAttribute('aria-expanded') === 'true';
        setPcfBranchState(branch, !isExpanded);
    }

    function hideCompetingWideSidebars(primarySidebar, shouldHide) {
        const siblings = Array.from(primarySidebar.parentElement.children);
        siblings.forEach((element) => {
            if (element === primarySidebar || element.hasAttribute('data-hamsoo-pcf-tree-panel')) return;

            const isWideSidebar = element.matches('[data-worklist-sidebar]');
            if (isWideSidebar) {
                element.classList.toggle('hamsoo-wide-sidebar-hidden', shouldHide);
            }
        });
    }

    function setPcfTreePanelOpen(primarySidebar, panel, isOpen) {
        if (isOpen) {
            hideCompetingWideSidebars(primarySidebar, true);
            document.querySelectorAll('[data-hamsoo-pcf-tree-panel].is-open').forEach((openPanel) => {
                if (openPanel !== panel) openPanel.classList.remove('is-open');
            });
        } else {
            hideCompetingWideSidebars(primarySidebar, false);
        }

        panel.classList.toggle('is-open', isOpen);
    }

    function openPcfNodeContent(primarySidebar, node) {
        const nodeType = node.dataset.hamsooPcfNodeType;
        const nodeTitle = node.dataset.hamsooPcfNodeTitle || node.textContent.trim();

        if (nodeType === 'process') {
            window.location.href = '/identity-process/index.html';
            return;
        }

        if (nodeType === 'root') {
            window.location.href = '/dashborad/enterprisemap.html';
        } else if (nodeType === 'group') {
            window.location.href = `/dashboard/ProcessGroup.html?group=${encodeURIComponent(nodeTitle)}`;
        }
    }

    function ensurePcfTreePanel(primarySidebar) {
        ensurePcfTreeStyles();

        let panel = primarySidebar.parentElement.querySelector(':scope > [data-hamsoo-pcf-tree-panel]');
        if (!panel) {
            panel = document.createElement('aside');
            panel.dataset.hamsooPcfTreePanel = '';
            panel.className = 'hamsoo-pcf-panel shrink-0 bg-white border-l border-slate-200 shadow-xl z-20 h-screen';
            panel.innerHTML = pcfTreeMarkup();
            primarySidebar.insertAdjacentElement('afterend', panel);

            panel.querySelector('[data-hamsoo-pcf-close]').addEventListener('click', () => {
                setPcfTreePanelOpen(primarySidebar, panel, false);
            });

            panel.querySelectorAll('.hamsoo-pcf-node').forEach((node) => {
                node.addEventListener('click', () => {
                    panel.querySelectorAll('.hamsoo-pcf-node').forEach((item) => item.classList.remove('is-active'));
                    node.classList.add('is-active');

                    if (node.hasAttribute('data-hamsoo-pcf-branch')) {
                        togglePcfBranch(node);
                    }

                    openPcfNodeContent(primarySidebar, node);
                });
            });

            panel.querySelector('[data-hamsoo-pcf-search]').addEventListener('input', (event) => {
                const query = event.target.value.trim();
                panel.querySelectorAll('.hamsoo-pcf-node').forEach((node) => {
                    node.classList.toggle('hidden', Boolean(query) && !node.textContent.includes(query));
                });
            });

            renderIcons();
        }

        return panel;
    }

    function togglePcfTreePanel(primarySidebar) {
        const panel = ensurePcfTreePanel(primarySidebar);
        setPcfTreePanelOpen(primarySidebar, panel, !panel.classList.contains('is-open'));
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
            const tooltip = renderTooltip(item.title);

            return `<a href="${item.href}" class="${classes}" title="${item.title}" aria-label="${item.title}" data-hamsoo-nav-id="${item.id}">${content}${badge}${tooltip}</a>`;
        }).join('');

        container.className = 'w-16 shrink-0 bg-slate-900 flex flex-col items-center py-4 gap-4 z-30 overflow-visible';
        container.innerHTML = `
            <nav class="flex flex-col gap-3">
                ${links}
            </nav>
        `;

        const pcfLink = container.querySelector('[data-hamsoo-nav-id="pcf-tree"]');
        if (pcfLink) {
            pcfLink.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                togglePcfTreePanel(container);
            });
        }
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
