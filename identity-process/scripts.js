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
            if (window.lucide) window.lucide.createIcons();
        })
        .catch(() => {
            container.innerHTML = '<div class="text-center text-slate-500 py-12">خطا در بارگذاری محتوای تب</div>';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.identity-tab-btn').forEach((button) => {
        button.addEventListener('click', () => loadIdentityTab(button.dataset.tab));
    });

    loadIdentityTab('general');
});
