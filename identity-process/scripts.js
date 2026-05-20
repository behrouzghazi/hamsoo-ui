const identityTabs = ['general', 'diagram', 'sipoc', 'indicators', 'docs', 'resources', 'complications', 'risks'];

const sipocColumns = [
    { key: 'suppliers', title: 'تأمین‌کننده', subtitle: 'Supplier', icon: 'users', color: '#2563eb', soft: '#eff6ff' },
    { key: 'inputs', title: 'ورودی', subtitle: 'Input', icon: 'file-input', color: '#0891b2', soft: '#ecfeff' },
    { key: 'process', title: 'فرایند', subtitle: 'Process', icon: 'settings-2', color: '#4f46e5', soft: '#eef2ff', locked: true },
    { key: 'outputs', title: 'خروجی', subtitle: 'Output', icon: 'file-output', color: '#d97706', soft: '#fffbeb' },
    { key: 'customers', title: 'مشتری', subtitle: 'Customer', icon: 'building-2', color: '#e11d48', soft: '#fff1f2' }
];

const sipocDefaultItems = [
    {
        id: 's1',
        column: 'suppliers',
        title: 'واحد متقاضی',
        category: 'واحد داخلی',
        description: 'ثبت‌کننده نیاز خرید کالا یا خدمت.',
        links: ['i1', 'i2']
    },
    {
        id: 's2',
        column: 'suppliers',
        title: 'تأمین‌کننده کالا',
        category: 'سازمان خارجی',
        description: 'ارائه‌دهنده پیش‌فاکتور و شرایط تأمین.',
        links: ['i3']
    },
    {
        id: 'i1',
        column: 'inputs',
        title: 'درخواست خرید',
        category: 'فرم سیستمی',
        description: 'درخواست ثبت‌شده در سامانه تدارکات.',
        links: ['s1', 'p1']
    },
    {
        id: 'i2',
        column: 'inputs',
        title: 'تأییدیه بودجه',
        category: 'سند کنترلی',
        description: 'مجوز مصرف بودجه برای درخواست.',
        links: ['s1', 'p1']
    },
    {
        id: 'i3',
        column: 'inputs',
        title: 'پیش‌فاکتور',
        category: 'سند مالی',
        description: 'اطلاعات قیمت و شرایط فروش.',
        links: ['s2', 'p1']
    },
    {
        id: 'p1',
        column: 'process',
        title: 'مدیریت تدارکات داخلی',
        category: 'نام فرایند',
        description: '',
        links: ['i1', 'i2', 'i3', 'o1', 'o2']
    },
    {
        id: 'o1',
        column: 'outputs',
        title: 'سفارش خرید',
        category: 'سند رسمی',
        description: 'سند نهایی سفارش برای تأمین‌کننده.',
        links: ['p1', 'c1']
    },
    {
        id: 'o2',
        column: 'outputs',
        title: 'به‌روزرسانی بودجه',
        category: 'رکورد سیستم',
        description: 'ثبت مصرف یا رزرو بودجه مرتبط.',
        links: ['p1', 'c2']
    },
    {
        id: 'c1',
        column: 'customers',
        title: 'حسابداری',
        category: 'واحد مالی',
        description: 'دریافت‌کننده سفارش برای فرایند پرداخت.',
        links: ['o1']
    },
    {
        id: 'c2',
        column: 'customers',
        title: 'کنترل بودجه',
        category: 'واحد داخلی',
        description: 'پایش اثر سفارش روی اعتبار مصوب.',
        links: ['o2']
    }
];

function getSipocState() {
    if (!window.identitySipocState) {
        window.identitySipocState = {
            view: 'board',
            selectedId: null,
            drawer: null,
            items: sipocDefaultItems.map((item) => ({ ...item, links: [...item.links] }))
        };
    }

    return window.identitySipocState;
}

function getSipocColumn(columnKey) {
    return sipocColumns.find((column) => column.key === columnKey);
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function getSipocRelatedIds(item, items) {
    if (!item) return [];
    const backlinks = items
        .filter((candidate) => candidate.links.includes(item.id))
        .map((candidate) => candidate.id);

    return [...new Set([...item.links, ...backlinks])];
}

function renderSipocSummary(root, state) {
    const summary = root.querySelector('#sipoc-summary');
    summary.innerHTML = sipocColumns.map((column) => {
        const count = state.items.filter((item) => item.column === column.key).length;
        return `
            <div class="sipoc-stat" style="--sipoc-color:${column.color}; --sipoc-soft:${column.soft}">
                <span>${column.title}</span>
                <strong>${count}</strong>
            </div>
        `;
    }).join('');
}

function renderSipocBoard(root, state) {
    const board = root.querySelector('#sipoc-board');
    const selected = state.items.find((item) => item.id === state.selectedId);
    const relatedIds = getSipocRelatedIds(selected, state.items);

    board.innerHTML = sipocColumns.map((column) => {
        const columnItems = state.items.filter((item) => item.column === column.key);
        const cards = columnItems.map((item) => {
            const isSelected = item.id === state.selectedId;
            const isRelated = relatedIds.includes(item.id);
            const isDimmed = selected && !isSelected && !isRelated;
            const isLocked = Boolean(column.locked);

        return `
                <div class="sipoc-card ${isSelected ? 'selected' : ''} ${isRelated ? 'related' : ''} ${isDimmed ? 'dimmed' : ''} ${isLocked ? 'locked' : ''}"
                    data-select-sipoc="${item.id}"
                    style="--sipoc-color:${column.color}; --sipoc-soft:${column.soft}">
                    <span class="sipoc-card-title">
                        <strong>${escapeHtml(item.title)}</strong>
                        ${isLocked ? '<i data-lucide="lock-keyhole" class="w-4 h-4"></i>' : `
                            <button class="sipoc-icon-btn" data-edit-sipoc="${item.id}" title="ویرایش">
                                <i data-lucide="edit-3" class="w-4 h-4"></i>
                            </button>
                        `}
                    </span>
                    ${isLocked ? '' : `
                        <span class="sipoc-card-meta">${escapeHtml(item.category)}</span>
                        <span class="sipoc-card-desc">${escapeHtml(item.description)}</span>
                    `}
                </div>
            `;
        }).join('');

        return `
            <div class="sipoc-column">
                <div class="sipoc-column-header" style="--sipoc-color:${column.color}; --sipoc-soft:${column.soft}">
                    <div class="sipoc-column-title">
                        <i data-lucide="${column.icon}" style="color:${column.color}"></i>
                        <div>
                            <strong>${column.title}</strong>
                            <span>${column.subtitle}</span>
                        </div>
                    </div>
                    ${column.locked ? '' : `
                        <button class="sipoc-icon-btn" data-add-sipoc="${column.key}" title="افزودن ${column.title}">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                        </button>
                    `}
                </div>
                <div class="sipoc-column-body">
                    ${cards || '<div class="text-xs text-slate-400 text-center py-8">موردی ثبت نشده است.</div>'}
                </div>
            </div>
        `;
    }).join('');
}

function renderSipocTable(root, state) {
    const table = root.querySelector('#sipoc-table');
    table.innerHTML = `
        <div class="overflow-x-auto custom-scrollbar">
            <table>
                <thead>
                    <tr>
                        <th>بخش</th>
                        <th>عنوان</th>
                        <th>نوع</th>
                        <th>توضیح</th>
                        <th>ارتباطات</th>
                        <th>عملیات</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.items.map((item) => {
                        const column = getSipocColumn(item.column);
                        const linkedTitles = item.links
                            .map((linkId) => state.items.find((candidate) => candidate.id === linkId)?.title)
                            .filter(Boolean)
                            .join('، ');

                        return `
                            <tr>
                                <td class="font-bold" style="color:${column.color}">${column.title}</td>
                                <td class="font-bold text-slate-800">${escapeHtml(item.title)}</td>
                                <td>${escapeHtml(item.category)}</td>
                                <td>${escapeHtml(item.description || '-')}</td>
                                <td>${escapeHtml(linkedTitles || '-')}</td>
                                <td>
                                    ${column.locked ? '<span class="text-xs font-bold text-slate-400">ثابت</span>' : `
                                        <button class="sipoc-secondary-btn" data-edit-sipoc="${item.id}">
                                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                                            ویرایش
                                        </button>
                                    `}
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderSipocDrawer(root, state) {
    const drawer = root.querySelector('#sipoc-drawer');
    if (!state.drawer) {
        drawer.classList.add('hidden');
        drawer.innerHTML = '';
        return;
    }

    const isEdit = state.drawer.mode === 'edit';
    const item = isEdit
        ? state.items.find((candidate) => candidate.id === state.drawer.itemId)
        : {
            id: '',
            column: state.drawer.column,
            title: '',
            category: '',
            description: '',
            links: []
        };
    const column = getSipocColumn(item.column);

    drawer.classList.remove('hidden');
    drawer.innerHTML = `
        <div class="flex items-start justify-between gap-3 mb-5">
            <div>
                <div class="text-[11px] font-bold text-slate-400 mb-1">${isEdit ? 'ویرایش آیتم' : 'افزودن آیتم'}</div>
                <h3 class="text-base font-extrabold text-slate-800">${column.title}</h3>
            </div>
            <button class="sipoc-icon-btn" data-close-sipoc-drawer title="بستن">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>

        <form class="space-y-4" data-sipoc-form>
            <div class="sipoc-form-field">
                <label for="sipoc-title">عنوان</label>
                <input id="sipoc-title" name="title" value="${escapeHtml(item.title)}" placeholder="مثلاً درخواست خرید" required>
            </div>

            <div class="sipoc-form-field">
                <label for="sipoc-category">نوع / دسته</label>
                <input id="sipoc-category" name="category" value="${escapeHtml(item.category)}" placeholder="مثلاً سند رسمی">
            </div>

            <div class="sipoc-form-field">
                <label for="sipoc-description">توضیح کوتاه</label>
                <textarea id="sipoc-description" name="description" placeholder="شرح مختصر نقش این مورد در SIPOC">${escapeHtml(item.description)}</textarea>
            </div>

            <div class="sipoc-form-field">
                <label for="sipoc-links">ارتباط با موارد دیگر</label>
                <select id="sipoc-links" name="links" multiple>
                    ${state.items.filter((candidate) => candidate.id !== item.id).map((candidate) => `
                        <option value="${candidate.id}" ${item.links.includes(candidate.id) ? 'selected' : ''}>
                            ${getSipocColumn(candidate.column).title} - ${escapeHtml(candidate.title)}
                        </option>
                    `).join('')}
                </select>
            </div>

            <div class="flex items-center justify-between gap-3 pt-2">
                <button type="button" class="sipoc-secondary-btn" data-close-sipoc-drawer>انصراف</button>
                <div class="flex items-center gap-2">
                    ${isEdit ? `
                        <button type="button" class="sipoc-secondary-btn text-rose-600" data-delete-sipoc="${item.id}">
                            حذف
                        </button>
                    ` : ''}
                    <button type="submit" class="sipoc-primary-btn">ذخیره</button>
                </div>
            </div>
        </form>
    `;
}

function renderSipoc(root) {
    const state = getSipocState();
    const board = root.querySelector('#sipoc-board');
    const table = root.querySelector('#sipoc-table');

    root.querySelectorAll('[data-sipoc-view]').forEach((button) => {
        button.classList.toggle('active', button.dataset.sipocView === state.view);
    });

    board.classList.toggle('hidden', state.view !== 'board');
    table.classList.toggle('hidden', state.view !== 'table');

    renderSipocSummary(root, state);
    renderSipocBoard(root, state);
    renderSipocTable(root, state);
    renderSipocDrawer(root, state);

    if (window.lucide) window.lucide.createIcons();
}

function saveSipocForm(root, form) {
    const state = getSipocState();
    const formData = new FormData(form);
    const links = formData.getAll('links');

    if (state.drawer.mode === 'edit') {
        const item = state.items.find((candidate) => candidate.id === state.drawer.itemId);
        item.title = formData.get('title').trim();
        item.category = formData.get('category').trim() || 'بدون دسته';
        item.description = formData.get('description').trim();
        item.links = links;
    } else {
        state.items.push({
            id: `sipoc-${Date.now()}`,
            column: state.drawer.column,
            title: formData.get('title').trim(),
            category: formData.get('category').trim() || 'بدون دسته',
            description: formData.get('description').trim(),
            links
        });
    }

    state.drawer = null;
    renderSipoc(root);
}

function initSipocTab() {
    const root = document.getElementById('sipoc-workspace');
    if (!root) return;

    renderSipoc(root);

    root.addEventListener('click', (event) => {
        const state = getSipocState();
        const viewButton = event.target.closest('[data-sipoc-view]');
        const addButton = event.target.closest('[data-add-sipoc]');
        const selectButton = event.target.closest('[data-select-sipoc]');
        const editButton = event.target.closest('[data-edit-sipoc]');
        const closeButton = event.target.closest('[data-close-sipoc-drawer]');
        const deleteButton = event.target.closest('[data-delete-sipoc]');

        if (viewButton) {
            state.view = viewButton.dataset.sipocView;
            renderSipoc(root);
            return;
        }

        if (addButton) {
            const column = getSipocColumn(addButton.dataset.addSipoc);
            if (column.locked) return;
            state.drawer = { mode: 'add', column: column.key };
            state.selectedId = null;
            renderSipoc(root);
            return;
        }

        if (editButton) {
            const item = state.items.find((candidate) => candidate.id === editButton.dataset.editSipoc);
            if (!item || getSipocColumn(item.column).locked) return;
            state.drawer = { mode: 'edit', itemId: item.id };
            state.selectedId = item.id;
            renderSipoc(root);
            return;
        }

        if (selectButton) {
            state.selectedId = state.selectedId === selectButton.dataset.selectSipoc ? null : selectButton.dataset.selectSipoc;
            renderSipoc(root);
            return;
        }

        if (closeButton) {
            state.drawer = null;
            renderSipoc(root);
            return;
        }

        if (deleteButton && window.confirm('این مورد از SIPOC حذف شود؟')) {
            const itemId = deleteButton.dataset.deleteSipoc;
            state.items = state.items
                .filter((item) => item.id !== itemId)
                .map((item) => ({ ...item, links: item.links.filter((linkId) => linkId !== itemId) }));
            state.drawer = null;
            state.selectedId = null;
            renderSipoc(root);
        }
    });

    root.addEventListener('dblclick', (event) => {
        const state = getSipocState();
        const card = event.target.closest('[data-select-sipoc]');
        if (!card) return;
        const item = state.items.find((candidate) => candidate.id === card.dataset.selectSipoc);
        if (!item || getSipocColumn(item.column).locked) return;

        state.drawer = { mode: 'edit', itemId: item.id };
        state.selectedId = item.id;
        renderSipoc(root);
    });

    root.addEventListener('submit', (event) => {
        if (!event.target.matches('[data-sipoc-form]')) return;
        event.preventDefault();
        saveSipocForm(root, event.target);
    });
}

const riskDefaultItems = [
    {
        id: 'risk-1',
        description: 'اجرای پروژه بهبود مصوب بدون در نظر گرفتن ریسک‌های پروژه بهبود',
        cause: 'عدم بررسی همه جانبه پیشنهاد بهبود\nعدم بررسی پیشنهاد توسط اعضای خبره',
        effect: 'اختلال در سایر فرایندهای سازمان\nصرف هزینه و زمان',
        indicator: 'شاخصی وجود ندارد',
        severity: 4,
        probability: 5,
        contingency: 'داده‌ای وجود ندارد',
        contingencyProgress: 0,
        contingencyNote: '',
        prevention: 'داده‌ای وجود ندارد',
        preventionProgress: 0,
        preventionNote: ''
    },
    {
        id: 'risk-2',
        description: 'شفاف نبودن مراحل اجرای فرایند (فرصت)',
        cause: 'نبود چارچوب مشترک برای ثبت و انتشار مراحل اجرا',
        effect: 'کاهش قابلیت پیگیری و تحلیل عملکرد فرایند',
        indicator: 'درصد مراحل دارای مالک مشخص',
        severity: 3,
        probability: 2,
        contingency: 'بازبینی سریع مراحل بدون مالک',
        contingencyProgress: 35,
        contingencyNote: 'نیازمند تکمیل اطلاعات مالکیت مراحل',
        prevention: 'تعریف چک‌لیست ثبت مراحل فرایند',
        preventionProgress: 60,
        preventionNote: 'در حال تهیه قالب استاندارد'
    },
    {
        id: 'risk-3',
        description: 'معرفی پروژه بهبود برتر در جشنواره‌های بهبود وری مطابق برنامه انجام نشود',
        cause: 'عدم آماده بودن مستندات و شواهد اجرایی',
        effect: 'از دست رفتن فرصت معرفی و الگوسازی داخلی',
        indicator: 'درصد تکمیل مستندات پروژه',
        severity: 2,
        probability: 4,
        contingency: 'تکمیل فشرده مستندات کلیدی',
        contingencyProgress: 20,
        contingencyNote: 'نیاز به هماهنگی با مالک پروژه',
        prevention: 'تقویم مستندسازی همزمان با اجرای پروژه',
        preventionProgress: 45,
        preventionNote: ''
    }
];

function getRiskState() {
    if (!window.identityRiskState) {
        window.identityRiskState = {
            filter: 'all',
            selectedCell: null,
            expandedId: 'risk-1',
            editor: null,
            items: riskDefaultItems.map((item) => ({ ...item }))
        };
    }

    return window.identityRiskState;
}

function getRiskScore(risk) {
    return Number(risk.severity) * Number(risk.probability);
}

function getRiskLevel(score) {
    if (score >= 16) return { key: 'critical', title: 'بحرانی', color: '#ef4444', soft: '#fef2f2' };
    if (score >= 10) return { key: 'high', title: 'بالا', color: '#f59e0b', soft: '#fffbeb' };
    if (score >= 5) return { key: 'medium', title: 'متوسط', color: '#eab308', soft: '#fefce8' };
    return { key: 'low', title: 'پایین', color: '#22c55e', soft: '#f0fdf4' };
}

function renderRiskMatrix(risk, options = {}) {
    const selectedSeverity = Number(risk?.severity);
    const selectedProbability = Number(risk?.probability);
    const counts = options.counts || {};
    const cells = [];

    for (let probability = 1; probability <= 5; probability += 1) {
        for (let severity = 1; severity <= 5; severity += 1) {
            const score = severity * probability;
            const level = getRiskLevel(score);
            const isActive = severity === selectedSeverity && probability === selectedProbability;
            const count = counts[`${severity}-${probability}`] || 0;

            cells.push(`
                <button type="button"
                    class="risk-cell ${isActive ? 'active' : ''} ${count ? 'has-count' : ''}"
                    style="--risk-color:${level.color}; --risk-soft:${level.soft}"
                    data-risk-cell="${severity}-${probability}"
                    title="شدت ${severity}، احتمال ${probability}، امتیاز ${score}">
                    <span>${score}</span>
                    ${count ? `<strong>${count}</strong>` : ''}
                </button>
            `);
        }
    }

    return `
        <div class="risk-matrix-label risk-matrix-label-top">شدت</div>
        <div class="risk-matrix-label risk-matrix-label-side">احتمال</div>
        <div class="risk-matrix-grid">${cells.join('')}</div>
    `;
}

function getFilteredRisks(state) {
    return state.items.filter((risk) => {
        const level = getRiskLevel(getRiskScore(risk));
        const cell = `${risk.severity}-${risk.probability}`;
        const matchesLevel = state.filter === 'all' || level.key === state.filter;
        const matchesCell = !state.selectedCell || cell === state.selectedCell;
        return matchesLevel && matchesCell;
    });
}

function renderRiskStats(root, state) {
    const stats = root.querySelector('#risk-stats');
    const total = state.items.length;
    const critical = state.items.filter((risk) => getRiskLevel(getRiskScore(risk)).key === 'critical').length;
    const high = state.items.filter((risk) => getRiskLevel(getRiskScore(risk)).key === 'high').length;
    const maxScore = Math.max(...state.items.map(getRiskScore));

    stats.innerHTML = [
        { label: 'کل ریسک‌ها', value: total, icon: 'list-checks', color: '#2563eb' },
        { label: 'بحرانی', value: critical, icon: 'siren', color: '#ef4444' },
        { label: 'بالا', value: high, icon: 'alert-circle', color: '#f59e0b' },
        { label: 'بالاترین امتیاز', value: maxScore, icon: 'gauge', color: '#0f172a' }
    ].map((item) => `
        <div class="risk-stat" style="--risk-stat-color:${item.color}">
            <i data-lucide="${item.icon}" class="w-4 h-4"></i>
            <span>${item.label}</span>
            <strong>${item.value}</strong>
        </div>
    `).join('');
}

function renderRiskSummaryMatrix(root, state) {
    const matrix = root.querySelector('#risk-summary-matrix');
    const counts = state.items.reduce((acc, risk) => {
        const key = `${risk.severity}-${risk.probability}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const selected = state.selectedCell
        ? { severity: state.selectedCell.split('-')[0], probability: state.selectedCell.split('-')[1] }
        : null;
    matrix.innerHTML = renderRiskMatrix(selected, { counts });
}

function renderRiskList(root, state) {
    const list = root.querySelector('#risk-list');
    const caption = root.querySelector('#risk-list-caption');
    const risks = getFilteredRisks(state);

    caption.textContent = state.selectedCell
        ? `فیلتر خانه ماتریس ${state.selectedCell.replace('-', ' / ')}`
        : state.filter === 'all'
            ? 'نمایش همه ریسک‌های ثبت‌شده'
            : `نمایش ریسک‌های سطح ${getRiskLevelByKey(state.filter)}`;

    list.innerHTML = risks.map((risk) => {
        const score = getRiskScore(risk);
        const level = getRiskLevel(score);
        const isExpanded = state.expandedId === risk.id;

        return `
            <article class="risk-card ${isExpanded ? 'expanded' : ''}" style="--risk-color:${level.color}; --risk-soft:${level.soft}" data-risk-card="${risk.id}">
                <div class="risk-card-main" data-toggle-risk="${risk.id}" role="button" tabindex="0">
                    <div class="risk-card-copy">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="risk-level-pill">${level.title}</span>
                            <span class="risk-score-pill">امتیاز ${score}</span>
                        </div>
                        <h3>${escapeHtml(risk.description)}</h3>
                        <div class="risk-meta-grid">
                            <span><strong>شدت</strong>${risk.severity}</span>
                            <span><strong>احتمال</strong>${risk.probability}</span>
                            <span><strong>نشانگر</strong>${escapeHtml(risk.indicator || 'ثبت نشده')}</span>
                        </div>
                    </div>
                    <div class="risk-card-details">
                        <span><strong>علت وقوع</strong>${escapeHtml(risk.cause).replaceAll('\n', '، ')}</span>
                        <span><strong>پیامد</strong>${escapeHtml(risk.effect).replaceAll('\n', '، ')}</span>
                    </div>
                    <div class="risk-card-matrix risk-matrix">${renderRiskMatrix(risk)}</div>
                    <div class="risk-card-actions">
                        <button type="button" class="sipoc-icon-btn" data-edit-risk="${risk.id}" title="ویرایش">
                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button type="button" class="sipoc-icon-btn" data-delete-risk="${risk.id}" title="حذف">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                        <i data-lucide="chevron-down" class="risk-expand-icon w-4 h-4"></i>
                    </div>
                </div>
                <div class="risk-inline-details">
                    <div class="risk-action-row">
                        <div>
                            <strong>اقدام اقتضایی</strong>
                            <span>${escapeHtml(risk.contingency || 'ثبت نشده')}</span>
                        </div>
                        <div class="risk-progress">
                            <span>${risk.contingencyProgress || 0}%</span>
                            <div><i style="width:${risk.contingencyProgress || 0}%"></i></div>
                        </div>
                        <p>${escapeHtml(risk.contingencyNote || 'توضیحی ثبت نشده است.')}</p>
                    </div>
                    <div class="risk-action-row">
                        <div>
                            <strong>اقدام پیشگیرانه</strong>
                            <span>${escapeHtml(risk.prevention || 'ثبت نشده')}</span>
                        </div>
                        <div class="risk-progress">
                            <span>${risk.preventionProgress || 0}%</span>
                            <div><i style="width:${risk.preventionProgress || 0}%"></i></div>
                        </div>
                        <p>${escapeHtml(risk.preventionNote || 'توضیحی ثبت نشده است.')}</p>
                    </div>
                </div>
            </article>
        `;
    }).join('') || '<div class="risk-empty">ریسکی با این فیلتر پیدا نشد.</div>';
}

function getRiskLevelByKey(key) {
    const names = { critical: 'بحرانی', high: 'بالا', medium: 'متوسط', low: 'پایین' };
    return names[key] || 'همه';
}

function renderRiskEditor(root, state) {
    const editor = root.querySelector('#risk-editor');
    if (!state.editor) {
        editor.classList.add('hidden');
        editor.innerHTML = '';
        return;
    }

    const isEdit = state.editor.mode === 'edit';
    const risk = isEdit
        ? state.items.find((item) => item.id === state.editor.id)
        : {
            description: '',
            cause: '',
            effect: '',
            indicator: '',
            severity: 3,
            probability: 3,
            contingency: '',
            contingencyProgress: 0,
            contingencyNote: '',
            prevention: '',
            preventionProgress: 0,
            preventionNote: ''
        };
    const score = getRiskScore(risk);
    const level = getRiskLevel(score);

    editor.classList.remove('hidden');
    editor.innerHTML = `
        <div class="flex items-start justify-between gap-3 mb-5">
            <div>
                <div class="text-[11px] font-bold text-slate-400 mb-1">${isEdit ? 'ویرایش ریسک' : 'ایجاد ریسک'}</div>
                <h3 class="text-base font-extrabold text-slate-800">${level.title} - امتیاز ${score}</h3>
            </div>
            <button type="button" class="sipoc-icon-btn" data-close-risk-editor title="بستن">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>

        <form class="space-y-4" data-risk-form>
            <div class="sipoc-form-field">
                <label for="risk-description">شرح رویداد ریسک</label>
                <input id="risk-description" name="description" value="${escapeHtml(risk.description)}" required>
            </div>
            <div class="sipoc-form-field">
                <label for="risk-effect">پیامد</label>
                <textarea id="risk-effect" name="effect">${escapeHtml(risk.effect)}</textarea>
            </div>
            <div class="sipoc-form-field">
                <label for="risk-cause">علت وقوع</label>
                <textarea id="risk-cause" name="cause">${escapeHtml(risk.cause)}</textarea>
            </div>
            <div class="sipoc-form-field">
                <label for="risk-indicator">نشانگر ریسک</label>
                <input id="risk-indicator" name="indicator" value="${escapeHtml(risk.indicator)}">
            </div>

            <div class="risk-editor-matrix">
                <div class="grid grid-cols-2 gap-3">
                    <div class="sipoc-form-field">
                        <label for="risk-severity">شدت</label>
                        <input id="risk-severity" name="severity" type="number" min="1" max="5" value="${risk.severity}" data-risk-live-input>
                    </div>
                    <div class="sipoc-form-field">
                        <label for="risk-probability">احتمال</label>
                        <input id="risk-probability" name="probability" type="number" min="1" max="5" value="${risk.probability}" data-risk-live-input>
                    </div>
                </div>
                <div class="risk-matrix">${renderRiskMatrix(risk)}</div>
            </div>

            <details open>
                <summary>اقدام اقتضایی</summary>
                <div class="space-y-3 pt-3">
                    <div class="sipoc-form-field">
                        <label for="risk-contingency">شرح اقدام</label>
                        <input id="risk-contingency" name="contingency" value="${escapeHtml(risk.contingency)}">
                    </div>
                    <div class="sipoc-form-field">
                        <label for="risk-contingency-progress">درصد پیشرفت</label>
                        <input id="risk-contingency-progress" name="contingencyProgress" type="number" min="0" max="100" value="${risk.contingencyProgress || 0}">
                    </div>
                    <div class="sipoc-form-field">
                        <label for="risk-contingency-note">توضیحات</label>
                        <textarea id="risk-contingency-note" name="contingencyNote">${escapeHtml(risk.contingencyNote)}</textarea>
                    </div>
                </div>
            </details>

            <details>
                <summary>اقدام پیشگیرانه</summary>
                <div class="space-y-3 pt-3">
                    <div class="sipoc-form-field">
                        <label for="risk-prevention">شرح اقدام</label>
                        <input id="risk-prevention" name="prevention" value="${escapeHtml(risk.prevention)}">
                    </div>
                    <div class="sipoc-form-field">
                        <label for="risk-prevention-progress">درصد پیشرفت</label>
                        <input id="risk-prevention-progress" name="preventionProgress" type="number" min="0" max="100" value="${risk.preventionProgress || 0}">
                    </div>
                    <div class="sipoc-form-field">
                        <label for="risk-prevention-note">توضیحات</label>
                        <textarea id="risk-prevention-note" name="preventionNote">${escapeHtml(risk.preventionNote)}</textarea>
                    </div>
                </div>
            </details>

            <div class="flex items-center justify-between gap-3 pt-2">
                <button type="button" class="sipoc-secondary-btn" data-close-risk-editor>انصراف</button>
                <button type="submit" class="sipoc-primary-btn">ذخیره ریسک</button>
            </div>
        </form>
    `;
}

function renderRisks(root) {
    const state = getRiskState();

    root.querySelectorAll('[data-risk-filter]').forEach((button) => {
        button.classList.toggle('active', button.dataset.riskFilter === state.filter && !state.selectedCell);
    });

    renderRiskStats(root, state);
    renderRiskSummaryMatrix(root, state);
    renderRiskList(root, state);
    renderRiskEditor(root, state);

    if (window.lucide) window.lucide.createIcons();
}

function saveRiskForm(root, form) {
    const state = getRiskState();
    const formData = new FormData(form);
    const riskData = {
        description: formData.get('description').trim(),
        cause: formData.get('cause').trim(),
        effect: formData.get('effect').trim(),
        indicator: formData.get('indicator').trim(),
        severity: Math.min(5, Math.max(1, Number(formData.get('severity') || 1))),
        probability: Math.min(5, Math.max(1, Number(formData.get('probability') || 1))),
        contingency: formData.get('contingency').trim(),
        contingencyProgress: Math.min(100, Math.max(0, Number(formData.get('contingencyProgress') || 0))),
        contingencyNote: formData.get('contingencyNote').trim(),
        prevention: formData.get('prevention').trim(),
        preventionProgress: Math.min(100, Math.max(0, Number(formData.get('preventionProgress') || 0))),
        preventionNote: formData.get('preventionNote').trim()
    };

    if (state.editor.mode === 'edit') {
        const risk = state.items.find((item) => item.id === state.editor.id);
        Object.assign(risk, riskData);
        state.expandedId = risk.id;
    } else {
        const newRisk = { id: `risk-${Date.now()}`, ...riskData };
        state.items.unshift(newRisk);
        state.expandedId = newRisk.id;
    }

    state.editor = null;
    renderRisks(root);
}

function initRiskTab() {
    const root = document.getElementById('risk-workspace');
    if (!root) return;

    renderRisks(root);

    root.addEventListener('click', (event) => {
        const state = getRiskState();
        const addButton = event.target.closest('[data-add-risk]');
        const editButton = event.target.closest('[data-edit-risk]');
        const deleteButton = event.target.closest('[data-delete-risk]');
        const toggleButton = event.target.closest('[data-toggle-risk]');
        const closeButton = event.target.closest('[data-close-risk-editor]');
        const filterButton = event.target.closest('[data-risk-filter]');
        const matrixCell = event.target.closest('[data-risk-cell]');

        if (addButton) {
            state.editor = { mode: 'add' };
            renderRisks(root);
            return;
        }

        if (editButton) {
            event.stopPropagation();
            state.editor = { mode: 'edit', id: editButton.dataset.editRisk };
            state.expandedId = editButton.dataset.editRisk;
            renderRisks(root);
            return;
        }

        if (deleteButton) {
            event.stopPropagation();
            if (window.confirm('این ریسک حذف شود؟')) {
                state.items = state.items.filter((risk) => risk.id !== deleteButton.dataset.deleteRisk);
                if (state.expandedId === deleteButton.dataset.deleteRisk) state.expandedId = null;
                renderRisks(root);
            }
            return;
        }

        if (closeButton) {
            state.editor = null;
            renderRisks(root);
            return;
        }

        if (filterButton) {
            state.filter = filterButton.dataset.riskFilter;
            state.selectedCell = null;
            renderRisks(root);
            return;
        }

        if (matrixCell && matrixCell.closest('#risk-summary-matrix')) {
            state.selectedCell = state.selectedCell === matrixCell.dataset.riskCell ? null : matrixCell.dataset.riskCell;
            state.filter = 'all';
            renderRisks(root);
            return;
        }

        if (toggleButton && !event.target.closest('[data-edit-risk], [data-delete-risk]')) {
            state.expandedId = state.expandedId === toggleButton.dataset.toggleRisk ? null : toggleButton.dataset.toggleRisk;
            renderRisks(root);
        }
    });

    root.addEventListener('input', (event) => {
        if (!event.target.matches('[data-risk-live-input]')) return;
        const form = event.target.closest('[data-risk-form]');
        const preview = form.querySelector('.risk-editor-matrix .risk-matrix');
        const liveRisk = {
            severity: Math.min(5, Math.max(1, Number(form.elements.severity.value || 1))),
            probability: Math.min(5, Math.max(1, Number(form.elements.probability.value || 1)))
        };
        preview.innerHTML = renderRiskMatrix(liveRisk);
    });

    root.addEventListener('submit', (event) => {
        if (!event.target.matches('[data-risk-form]')) return;
        event.preventDefault();
        saveRiskForm(root, event.target);
    });
}

function setActiveTab(tabName) {
    document.querySelectorAll('.identity-tab-btn').forEach((button) => {
        button.classList.toggle('active', button.dataset.tab === tabName);
    });
}

function loadIdentityTab(tabName) {
    const container = document.getElementById('identity-tab-container');
    if (!container || !identityTabs.includes(tabName)) return;

    setActiveTab(tabName);

    fetch(`/identity-process/tabs/${tabName}.html`)
        .then((response) => {
            if (!response.ok) throw new Error(`Tab not found: ${tabName}`);
            return response.text();
        })
        .then((html) => {
            container.innerHTML = html;
            if (tabName === 'sipoc') initSipocTab();
            if (tabName === 'risks') initRiskTab();
            if (window.lucide) window.lucide.createIcons();
        })
        .catch(() => {
            container.innerHTML = '<div class="text-center text-slate-500 py-12">خطا در بارگذاری محتوای تب</div>';
        });
}

function initProcessSummary() {
    const menuToggle = document.querySelector('[data-process-menu-toggle]');
    const menu = document.querySelector('[data-process-menu]');
    const renameButton = document.querySelector('[data-rename-process]');
    const deleteButton = document.querySelector('[data-delete-process]');
    const historyButton = document.querySelector('[data-open-history]');
    const historyDrawer = document.querySelector('[data-history-drawer]');
    const historyBackdrop = document.querySelector('[data-history-backdrop]');
    const closeHistoryButton = document.querySelector('[data-close-history]');
    const completionButton = document.querySelector('[data-open-completion-modal]');
    const completionModal = document.querySelector('[data-completion-modal]');
    const completionBackdrop = document.querySelector('[data-completion-backdrop]');
    const closeCompletionButton = document.querySelector('[data-close-completion-modal]');
    const versionButtons = document.querySelectorAll('[data-version-state]');
    const versionPill = document.querySelector('[data-version-pill]');
    const title = document.querySelector('[data-process-title]');
    const breadcrumbCurrent = document.querySelector('.process-breadcrumb strong');

    if (!menuToggle || !menu || !title) return;

    function closeMenu() {
        menu.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    function openHistory() {
        historyDrawer?.classList.add('is-open');
        historyDrawer?.setAttribute('aria-hidden', 'false');
        historyBackdrop?.classList.remove('hidden');
        closeMenu();
    }

    function closeHistory() {
        historyDrawer?.classList.remove('is-open');
        historyDrawer?.setAttribute('aria-hidden', 'true');
        historyBackdrop?.classList.add('hidden');
    }

    function openCompletionModal() {
        completionModal?.classList.remove('hidden');
        completionBackdrop?.classList.remove('hidden');
    }

    function closeCompletionModal() {
        completionModal?.classList.add('hidden');
        completionBackdrop?.classList.add('hidden');
    }

    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = !menu.classList.contains('hidden');
        menu.classList.toggle('hidden', isOpen);
        menuToggle.setAttribute('aria-expanded', String(!isOpen));
    });

    versionButtons.forEach((button) => {
        button.addEventListener('click', () => {
            versionButtons.forEach((candidate) => candidate.classList.toggle('active', candidate === button));
            if (!versionPill) return;
            versionPill.textContent = button.dataset.versionState === 'target' ? 'To-Be' : 'As-Is';
            versionPill.classList.toggle('target', button.dataset.versionState === 'target');
        });
    });

    historyButton?.addEventListener('click', openHistory);
    closeHistoryButton?.addEventListener('click', closeHistory);
    historyBackdrop?.addEventListener('click', closeHistory);
    completionButton?.addEventListener('click', openCompletionModal);
    closeCompletionButton?.addEventListener('click', closeCompletionModal);
    completionBackdrop?.addEventListener('click', closeCompletionModal);

    renameButton?.addEventListener('click', () => {
        const nextName = window.prompt('نام جدید فرایند را وارد کنید:', title.textContent.trim());
        if (!nextName || !nextName.trim()) {
            closeMenu();
            return;
        }

        title.textContent = nextName.trim();
        if (breadcrumbCurrent) breadcrumbCurrent.textContent = nextName.trim();
        document.title = `${nextName.trim()} | شناسنامه فرایند | همسو`;
        closeMenu();
    });

    deleteButton?.addEventListener('click', () => {
        if (window.confirm('این فرایند حذف شود؟')) {
            window.alert('در نسخه نمایشی، حذف واقعی فرایند انجام نمی‌شود.');
        }
        closeMenu();
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.process-menu-wrap')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
            closeHistory();
            closeCompletionModal();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initProcessSummary();

    document.querySelectorAll('.identity-tab-btn').forEach((button) => {
        button.addEventListener('click', () => loadIdentityTab(button.dataset.tab));
    });

    loadIdentityTab('general');
});
