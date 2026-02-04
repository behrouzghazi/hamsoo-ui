// اسکریپت‌های مشترک ورک‌لیست همسو

// Initialize Icons
lucide.createIcons();

// تابع عمومی برای انتخاب گزینه‌ها
window.selectOption = function(element, type, value) {
    const parent = element.parentElement;
    const groupElements = parent.querySelectorAll(`.trend-option, .option-card`);

    groupElements.forEach(el => {
        el.classList.remove('selected');
        const radio = el.querySelector('input[type="radio"]');
        if (radio) radio.checked = false;
    });

    element.classList.add('selected');
    const radio = element.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;

    updateDescription(type, value);
};

function updateDescription(type, value) {
    const descriptionElement = document.getElementById(`${type}-description`);
    if (!descriptionElement) return;

    const descriptions = {
        'trend': {
            'increase': '<span class="font-medium text-emerald-700">صعودی:</span> افزایش مقدار شاخص مطلوب است.',
            'decrease': '<span class="font-medium text-rose-700">نزولی:</span> کاهش مقدار شاخص مطلوب است.',
            'maintain': '<span class="font-medium text-blue-700">حفظ وضعیت موجود:</span> ثبات مقدار شاخص در محدوده مشخص مطلوب است.'
        },
        'kpi-type': {
            'performance': '<span class="font-medium text-blue-700">عملکردی:</span> شاخص‌های کمی و مبتنی بر داده.',
            'perceptual': '<span class="font-medium text-purple-700">برداشتی:</span> شاخص‌های مبتنی بر نظرسنجی و ادراک.'
        },
        'monitoring-type': {
            'efficiency': '<span class="font-medium text-green-700">کارایی:</span> نسبت خروجی به ورودی.',
            'effectiveness': '<span class="font-medium text-orange-700">اثربخشی:</span> میزان تحقق هدف.'
        }
    };

    if (descriptions[type] && descriptions[type][value]) {
        descriptionElement.innerHTML = descriptions[type][value];
    }
}

// Tab Switching Logic
window.switchTab = function(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = document.getElementById(`btn-${tabName}`);
    if (activeBtn) activeBtn.classList.add('active');

    loadTabContent(tabName);
};

function loadTabContent(tabName) {
    const container = document.getElementById('tab-container');
    if (!container) return;

    fetch(`tab-${tabName}.html`)
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
            lucide.createIcons();
            setTimeout(() => {
                initializeSelections();
                initializeTabEvents(tabName);
            }, 100);
        })
        .catch(error => {
            console.error('خطا در بارگذاری تب:', error);
            container.innerHTML = '<div class="text-center text-slate-500 py-8">خطا در بارگذاری محتوا</div>';
        });
}

function initializeSelections() {
    const trendElement = document.querySelector('.trend-option.selected');
    if (trendElement) {
        const trendValue = trendElement.getAttribute('data-trend');
        updateDescription('trend', trendValue);
    }

    const kpiTypeElement = document.querySelector('.option-card.selected[data-kpi-type]');
    if (kpiTypeElement) {
        const kpiTypeValue = kpiTypeElement.getAttribute('data-kpi-type');
        updateDescription('kpi-type', kpiTypeValue);
    }

    const monitoringTypeElement = document.querySelector('.option-card.selected[data-monitoring-type]');
    if (monitoringTypeElement) {
        const monitoringTypeValue = monitoringTypeElement.getAttribute('data-monitoring-type');
        updateDescription('monitoring-type', monitoringTypeValue);
    }
}

function initializeTabEvents(tabName) {
    if (tabName === 'monitoring') {
        const ownerTypeSelect = document.getElementById('owner-type');
        const monitorTypeSelect = document.getElementById('monitor-type');

        if (ownerTypeSelect) {
            ownerTypeSelect.addEventListener('change', updateOwnerField);
        }
        if (monitorTypeSelect) {
            monitorTypeSelect.addEventListener('change', updateMonitorField);
        }

        updateOwnerField();
        updateMonitorField();
    }
}

function updateOwnerField() {
    const ownerTypeSelect = document.getElementById('owner-type');
    if (!ownerTypeSelect) return;

    const ownerType = ownerTypeSelect.value;
    const personField = document.getElementById('owner-person-field');
    const unitDisplay = document.getElementById('owner-unit-display');

    if (ownerType === 'person') {
        if (personField) personField.classList.remove('hidden');
        if (unitDisplay) unitDisplay.textContent = 'واحد بازاریابی';
    } else {
        if (personField) personField.classList.add('hidden');
        if (unitDisplay) unitDisplay.textContent = 'واحد بازاریابی';
    }
}

function updateMonitorField() {
    const monitorTypeSelect = document.getElementById('monitor-type');
    if (!monitorTypeSelect) return;

    const monitorType = monitorTypeSelect.value;
    const personField = document.getElementById('monitor-person-field');
    const unitDisplay = document.getElementById('monitor-unit-display');

    if (monitorType === 'person') {
        if (personField) personField.classList.remove('hidden');
        if (unitDisplay) unitDisplay.textContent = 'واحد کنترل کیفیت';
    } else {
        if (personField) personField.classList.add('hidden');
        if (unitDisplay) unitDisplay.textContent = 'واحد کنترل کیفیت';
    }
}

window.approveTask = function() {
    alert('درخواست تایید شد و به مرحله بعدی ارسال گردید.');
};

window.rejectTask = function() {
    alert('درخواست رد شد و به فرستنده بازگشت داده شد.');
};

window.requestChanges = function() {
    alert('درخواست نیازمند اصلاحات به فرستنده ارجاع شد.');
};

// Initial load
document.addEventListener('DOMContentLoaded', function() {
    loadTabContent('basic');
});
