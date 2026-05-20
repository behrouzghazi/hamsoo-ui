const identityTabs = ['general', 'diagram', 'sipoc', 'indicators', 'docs', 'resources', 'complications', 'risks'];

const sipocColumns = [
    { key: 'suppliers', title: 'تأمین‌کننده', subtitle: 'Supplier', icon: 'users', color: '#2563eb', soft: '#eff6ff' },
    { key: 'inputs', title: 'ورودی', subtitle: 'Input', icon: 'file-input', color: '#0891b2', soft: '#ecfeff' },
    { key: 'process', title: 'فرایند', subtitle: 'Process', icon: 'settings-2', color: '#4f46e5', soft: '#eef2ff', locked: true },
    { key: 'outputs', title: 'خروجی', subtitle: 'Output', icon: 'file-output', color: '#d97706', soft: '#fffbeb' },
    { key: 'customers', title: 'مشتری', subtitle: 'Customer', icon: 'building-2', color: '#e11d48', soft: '#fff1f2' }
];

const sipocEndpointTypes = {
    internal: { title: 'فرایند داخلی', score: 1 },
    external: { title: 'فرایند خارجی', score: 1 },
    other: { title: 'سایر', score: 0.45 }
};

const sipocSuggestions = {
    inputs: ['درخواست خرید', 'تأییدیه بودجه', 'پیش‌فاکتور', 'درخواست اصلاح سفارش', 'مجوز خرید اضطراری'],
    outputs: ['سفارش خرید', 'به‌روزرسانی بودجه', 'رسید دریافت کالا', 'درخواست پرداخت', 'گزارش مغایرت'],
    suppliers: ['واحد متقاضی', 'تأمین‌کننده کالا', 'برنامه‌ریزی خرید', 'کنترل بودجه', 'انبار مرکزی'],
    customers: ['حسابداری', 'کنترل بودجه', 'انبار مرکزی', 'واحد متقاضی', 'پرداخت‌ها']
};

const sipocDefaultItems = [
    {
        id: 's1',
        column: 'suppliers',
        title: 'واحد متقاضی',
        category: 'سایر',
        endpointType: 'other',
        description: 'ثبت‌کننده نیاز خرید کالا یا خدمت.',
        links: ['i1', 'i2']
    },
    {
        id: 's2',
        column: 'suppliers',
        title: 'تأمین‌کننده کالا',
        category: 'فرایند خارجی',
        endpointType: 'external',
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
        category: 'فرایند داخلی',
        endpointType: 'internal',
        reciprocalConfirmed: false,
        description: 'دریافت‌کننده سفارش برای فرایند پرداخت.',
        links: ['o1']
    },
    {
        id: 'c2',
        column: 'customers',
        title: 'کنترل بودجه',
        category: 'سایر',
        endpointType: 'other',
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

function getSipocItemsByColumn(items, columnKey) {
    return items.filter((item) => item.column === columnKey);
}

function isSipocEndpoint(item) {
    return item?.column === 'suppliers' || item?.column === 'customers';
}

function getSipocEndpointType(item) {
    if (!isSipocEndpoint(item)) return null;
    if (sipocEndpointTypes[item.endpointType]) return item.endpointType;

    const category = `${item.category || ''} ${item.description || ''}`;
    if (/فرایند خارجی|سازمان خارجی/.test(category)) return 'external';
    if (/فرایند داخلی/.test(category)) return 'internal';
    return 'other';
}

function getSipocEndpointTypeTitle(item) {
    const type = getSipocEndpointType(item);
    return type ? sipocEndpointTypes[type].title : item.category;
}

function isSipocOtherEndpoint(item) {
    return getSipocEndpointType(item) === 'other';
}

function isSipocInternalProcess(item) {
    return getSipocEndpointType(item) === 'internal';
}

function isLinkedToColumn(item, items, columnKey) {
    const linkedIds = getSipocRelatedIds(item, items);
    return linkedIds.some((id) => items.find((candidate) => candidate.id === id)?.column === columnKey);
}

function getSipocLinkedItemsByColumn(item, items, columnKey) {
    const linkedIds = getSipocRelatedIds(item, items);
    return linkedIds
        .map((id) => items.find((candidate) => candidate.id === id))
        .filter((candidate) => candidate?.column === columnKey);
}

function getSipocLinkCandidates(item, items) {
    if (!item) return [];
    const candidateColumns = {
        suppliers: ['inputs'],
        inputs: ['suppliers', 'process'],
        outputs: ['process', 'customers'],
        customers: ['outputs']
    }[item.column] || ['suppliers', 'inputs', 'process', 'outputs', 'customers'];

    return items.filter((candidate) => candidate.id !== item.id && candidateColumns.includes(candidate.column));
}

function getSipocCoverage(state) {
    const items = state.items;
    const suppliers = getSipocItemsByColumn(items, 'suppliers');
    const inputs = getSipocItemsByColumn(items, 'inputs');
    const processItems = getSipocItemsByColumn(items, 'process');
    const outputs = getSipocItemsByColumn(items, 'outputs');
    const customers = getSipocItemsByColumn(items, 'customers');
    const warnings = [];

    const structureScore = (inputs.length ? 15 : 0) + (outputs.length ? 15 : 0);

    if (!inputs.length) warnings.push('ورودی ثبت نشده است؛ برای فرایندهای واقعی معمولا حداقل یک ورودی انتظار می‌رود.');
    if (!outputs.length) warnings.push('خروجی ثبت نشده است؛ برای فرایندهای واقعی معمولا حداقل یک خروجی انتظار می‌رود.');

    inputs
        .filter((item) => !getSipocLinkedItemsByColumn(item, items, 'suppliers').length)
        .forEach((item) => warnings.push(`ورودی «${item.title}» تأمین‌کننده مشخص ندارد.`));

    outputs
        .filter((item) => !getSipocLinkedItemsByColumn(item, items, 'customers').length)
        .forEach((item) => warnings.push(`خروجی «${item.title}» مشتری مشخص ندارد.`));

    const internalEndpoints = [...suppliers, ...customers].filter(isSipocInternalProcess);
    const reciprocalIssues = internalEndpoints.filter((item) => !item.reciprocalConfirmed);

    reciprocalIssues.forEach((item) => {
        warnings.push(`ارتباط فرایند داخلی «${item.title}» نیازمند تطبیق با SIPOC فرایند متناظر است.`);
    });

    const otherEndpoints = [...suppliers, ...customers].filter(isSipocOtherEndpoint);
    otherEndpoints.forEach((item) => {
        warnings.push(`«${item.title}» از نوع سایر ثبت شده است؛ وجود حتی یک مورد سایر، امتیاز کیفیت نوع طرف ارتباط را صفر می‌کند.`);
    });

    const endpoints = [...suppliers, ...customers];
    const endpointTypeScore = endpoints.length && !otherEndpoints.length ? 40 : 0;
    const integrationScore = reciprocalIssues.length ? 0 : 30;
    const score = Math.round(Math.min(100, structureScore + endpointTypeScore + integrationScore));

    return {
        score,
        warnings,
        structureScore: Math.round(structureScore),
        traceabilityScore: Math.round(endpointTypeScore),
        integrationScore: Math.round(integrationScore),
        counts: {
            suppliers: suppliers.length,
            inputs: inputs.length,
            process: processItems.length,
            outputs: outputs.length,
            customers: customers.length,
            otherEndpoints: otherEndpoints.length
        }
    };
}

function renderSipocQuality(root, state) {
    const panel = root.querySelector('#sipoc-quality-panel');
    if (!panel) return;

    const coverage = getSipocCoverage(state);
    const visibleWarnings = coverage.warnings.slice(0, 4);

    panel.innerHTML = `
        <div class="sipoc-quality-score">
            <span>پوشش SIPOC</span>
            <strong>${coverage.score}%</strong>
            <div class="sipoc-quality-bar"><div style="width:${coverage.score}%"></div></div>
        </div>
        <div class="sipoc-quality-parts">
            <div><span>پایه: وجود ورودی و خروجی</span><strong>${coverage.structureScore}/30</strong></div>
            <div><span>کیفیت نوع طرف ارتباط</span><strong>${coverage.traceabilityScore}/40</strong></div>
            <div><span>یکپارچگی ارتباطات</span><strong>${coverage.integrationScore}/30</strong></div>
        </div>
        <div class="sipoc-quality-warnings">
            <div class="sipoc-quality-title">
                <i data-lucide="triangle-alert" class="w-4 h-4"></i>
                <span>${coverage.warnings.length} هشدار کیفیت داده</span>
            </div>
            <ul>
                ${visibleWarnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join('')}
            </ul>
        </div>
    `;
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
            const relatedAddColumn = item.column === 'inputs' ? 'suppliers' : item.column === 'outputs' ? 'customers' : '';

        return `
                <div class="sipoc-card ${isSelected ? 'selected' : ''} ${isRelated ? 'related' : ''} ${isDimmed ? 'dimmed' : ''} ${isLocked ? 'locked' : ''}"
                    data-select-sipoc="${item.id}"
                    style="--sipoc-color:${column.color}; --sipoc-soft:${column.soft}">
                    <span class="sipoc-card-title">
                        <strong>${escapeHtml(item.title)}</strong>
                        ${isLocked ? '<i data-lucide="lock-keyhole" class="w-4 h-4"></i>' : `
                            <span class="sipoc-card-actions">
                                ${relatedAddColumn ? `
                                    <button class="sipoc-relation-btn" data-add-sipoc="${relatedAddColumn}" data-linked-sipoc="${item.id}" title="${item.column === 'inputs' ? 'افزودن تأمین‌کننده' : 'افزودن مشتری'}">
                                        <i data-lucide="${item.column === 'inputs' ? 'user-round-plus' : 'building-2'}" class="w-4 h-4"></i>
                                    </button>
                                ` : ''}
                                <button class="sipoc-icon-btn" data-edit-sipoc="${item.id}" title="ویرایش">
                                    <i data-lucide="edit-3" class="w-4 h-4"></i>
                                </button>
                                <button class="sipoc-icon-btn danger" data-delete-sipoc="${item.id}" title="حذف">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            </span>
                        `}
                    </span>
                    ${isLocked ? '' : `
                        <span class="sipoc-card-meta">${escapeHtml(isSipocEndpoint(item) ? getSipocEndpointTypeTitle(item) : item.category)}</span>
                        ${item.description ? `<span class="sipoc-card-desc">${escapeHtml(item.description)}</span>` : ''}
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
                    ${['inputs', 'outputs'].includes(column.key) ? `
                        <button class="sipoc-add-primary" data-add-sipoc="${column.key}" title="افزودن ${column.title}">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                            <span>افزودن ${column.title}</span>
                        </button>
                    ` : ''}
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
                                <td>${escapeHtml(isSipocEndpoint(item) ? getSipocEndpointTypeTitle(item) : item.category)}</td>
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
    const backdrop = root.querySelector('#sipoc-form-backdrop');
    if (!state.drawer) {
        drawer.classList.add('hidden');
        drawer.innerHTML = '';
        backdrop?.classList.add('hidden');
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
            endpointType: state.drawer.column === 'suppliers' || state.drawer.column === 'customers' ? 'internal' : '',
            reciprocalConfirmed: false,
            description: '',
            links: state.drawer.linkedId ? [state.drawer.linkedId] : []
        };
    const column = getSipocColumn(item.column);
    const isEndpoint = isSipocEndpoint(item);
    const linkedItem = item.links
        .map((linkId) => state.items.find((candidate) => candidate.id === linkId))
        .find(Boolean);
    const suggestionId = `sipoc-suggestions-${item.column}`;

    drawer.classList.remove('hidden');
    backdrop?.classList.remove('hidden');
    drawer.innerHTML = `
        <div class="flex items-start justify-between gap-3 mb-5">
            <div>
                <div class="text-[11px] font-bold text-slate-400 mb-1">${isEdit ? 'ویرایش' : 'افزودن'}</div>
                <h3 class="text-base font-extrabold text-slate-800">${column.title}</h3>
            </div>
            <button class="sipoc-icon-btn" data-close-sipoc-drawer title="بستن">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>

        <form class="space-y-4" data-sipoc-form>
            ${isEndpoint ? `
                <div class="sipoc-linked-label">
                    <span>${item.column === 'suppliers' ? 'ورودی' : 'خروجی'}</span>
                    <strong>${escapeHtml(linkedItem?.title || 'مورد انتخاب‌شده')}</strong>
                </div>

                <div class="sipoc-form-field">
                    <label for="sipoc-category">نوع ${column.title}</label>
                    <select id="sipoc-category" name="endpointType">
                        ${Object.entries(sipocEndpointTypes).map(([key, config]) => `
                            <option value="${key}" ${getSipocEndpointType(item) === key ? 'selected' : ''}>${config.title}</option>
                        `).join('')}
                    </select>
                </div>
            ` : ''}

            <div class="sipoc-form-field">
                <label for="sipoc-title">${isEndpoint ? `نام ${column.title}` : `نام ${column.title}`}</label>
                <input id="sipoc-title" name="title" list="${suggestionId}" value="${escapeHtml(item.title)}" placeholder="${isEndpoint ? 'از فهرست انتخاب کنید' : 'نام مورد را انتخاب کنید'}" required>
                <datalist id="${suggestionId}">
                    ${(sipocSuggestions[item.column] || []).map((suggestion) => `<option value="${escapeHtml(suggestion)}"></option>`).join('')}
                </datalist>
            </div>

            <div class="flex items-center justify-between gap-3 pt-2">
                <button type="button" class="sipoc-secondary-btn" data-close-sipoc-drawer>انصراف</button>
                <button type="submit" class="sipoc-primary-btn">ذخیره</button>
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

    renderSipocQuality(root, state);
    renderSipocSummary(root, state);
    renderSipocBoard(root, state);
    renderSipocTable(root, state);
    renderSipocDrawer(root, state);

    if (window.lucide) window.lucide.createIcons();
}

function saveSipocForm(root, form) {
    const state = getSipocState();
    const formData = new FormData(form);
    const links = state.drawer.linkedId ? [state.drawer.linkedId] : formData.getAll('links');

    if (state.drawer.mode === 'edit') {
        const item = state.items.find((candidate) => candidate.id === state.drawer.itemId);
        const column = getSipocColumn(item.column);
        item.title = formData.get('title').trim();
        if (isSipocEndpoint(item)) {
            item.endpointType = formData.get('endpointType') || 'internal';
            item.category = sipocEndpointTypes[item.endpointType].title;
            item.reciprocalConfirmed = item.endpointType !== 'internal' ? true : item.reciprocalConfirmed;
        } else {
            item.category = item.column === 'inputs' ? 'ورودی فرایند' : item.column === 'outputs' ? 'خروجی فرایند' : 'بدون دسته';
            if (column.locked) item.category = item.category || 'نام فرایند';
        }
        item.description = item.description || '';
    } else {
        const columnKey = state.drawer.column;
        const endpointType = columnKey === 'suppliers' || columnKey === 'customers'
            ? formData.get('endpointType') || 'internal'
            : '';
        state.items.push({
            id: `sipoc-${Date.now()}`,
            column: columnKey,
            title: formData.get('title').trim(),
            category: endpointType ? sipocEndpointTypes[endpointType].title : columnKey === 'inputs' ? 'ورودی فرایند' : columnKey === 'outputs' ? 'خروجی فرایند' : 'بدون دسته',
            endpointType,
            reciprocalConfirmed: endpointType !== 'internal',
            description: '',
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
            const linkedId = addButton.dataset.linkedSipoc || null;
            const linkedItem = linkedId ? state.items.find((item) => item.id === linkedId) : null;
            const selectedItem = linkedItem || state.items.find((item) => item.id === state.selectedId);
            if (column.key === 'suppliers' && selectedItem?.column !== 'inputs') {
                window.alert('برای ثبت تأمین‌کننده، ابتدا یک ورودی را از برد SIPOC انتخاب کنید.');
                return;
            }
            if (column.key === 'customers' && selectedItem?.column !== 'outputs') {
                window.alert('برای ثبت مشتری، ابتدا یک خروجی را از برد SIPOC انتخاب کنید.');
                return;
            }
            const shouldCarryLink = column.key === 'suppliers' || column.key === 'customers';
            state.drawer = { mode: 'add', column: column.key, linkedId: shouldCarryLink ? selectedItem?.id || null : null };
            if (selectedItem) state.selectedId = selectedItem.id;
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
    const sipocGuideButton = document.querySelector('[data-open-sipoc-modal]');
    const sipocGuideModal = document.querySelector('[data-sipoc-modal]');
    const sipocGuideBackdrop = document.querySelector('[data-sipoc-backdrop]');
    const closeSipocGuideButton = document.querySelector('[data-close-sipoc-modal]');
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

    function openSipocGuideModal() {
        sipocGuideModal?.classList.remove('hidden');
        sipocGuideBackdrop?.classList.remove('hidden');
    }

    function closeSipocGuideModal() {
        sipocGuideModal?.classList.add('hidden');
        sipocGuideBackdrop?.classList.add('hidden');
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
    sipocGuideButton?.addEventListener('click', openSipocGuideModal);
    closeSipocGuideButton?.addEventListener('click', closeSipocGuideModal);
    sipocGuideBackdrop?.addEventListener('click', closeSipocGuideModal);

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
            closeSipocGuideModal();
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
