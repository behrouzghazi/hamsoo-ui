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
        const monitoringDisplayTypeSelect = document.getElementById('monitoring-display-type');

        if (ownerTypeSelect) {
            ownerTypeSelect.addEventListener('change', updateOwnerField);
        }
        if (monitorTypeSelect) {
            monitorTypeSelect.addEventListener('change', updateMonitorField);
        }

        updateOwnerField();
        updateMonitorField();
        updateMonitoringDisplayTypeDescription();

        const selectedDataSource = document.querySelector('input[name="data_source"]:checked');
        selectDataSource(selectedDataSource ? selectedDataSource.id : 'system');

        const selectedMonitoringMethod = document.querySelector('input[name="monitoring_method"]:checked');
        selectMonitoringMethod(selectedMonitoringMethod && selectedMonitoringMethod.id === 'auto-method' ? 'auto' : 'manual');

        if (monitoringDisplayTypeSelect) {
            monitoringDisplayTypeSelect.addEventListener('change', updateMonitoringDisplayTypeDescription);
        }
    }
}

window.updateMonitoringDisplayTypeDescription = function() {
    const monitoringDisplayType = document.getElementById('monitoring-display-type');
    const descriptionElement = document.getElementById('monitoring-display-type-description');
    if (!monitoringDisplayType || !descriptionElement) return;

    const descriptions = {
        periodic: '<span class="font-medium text-slate-700">دوره‌ای:</span> در هنگام پایش، مقادیر فقط به صورت دوره‌ای نمایش داده می‌شود.',
        cumulative: '<span class="font-medium text-slate-700">تجمعی:</span> در هنگام پایش، مقادیر به صورت تجمعی نمایش داده می‌شود.',
        average: '<span class="font-medium text-slate-700">میانگینی:</span> در هنگام پایش، مقادیر به صورت تجمعی نمایش داده می‌شود.'
    };

    descriptionElement.innerHTML = descriptions[monitoringDisplayType.value] || descriptions.periodic;
};

window.selectDataSource = function(type) {
    const systemFields = document.getElementById('system-fields');
    const manualFields = document.getElementById('manual-fields');
    const systemRadio = document.getElementById('system');
    const manualRadio = document.getElementById('manual');
    const systemCard = document.querySelector('.radio-card[onclick*="system"]');
    const manualCard = document.querySelector('.radio-card[onclick*="manual"]');
    const dataSourceDescription = document.getElementById('data-source-description');

    if (type === 'system') {
        if (systemFields) systemFields.classList.remove('hidden');
        if (manualFields) manualFields.classList.add('hidden');
        if (systemRadio) systemRadio.checked = true;
        if (systemCard) systemCard.classList.add('selected');
        if (manualCard) manualCard.classList.remove('selected');
        if (dataSourceDescription) {
            dataSourceDescription.innerHTML = '<span class="font-medium text-blue-700">سیستمی:</span> اطلاعات شاخص در یک سامانه نرم‌افزاری موجود است.';
        }
    } else {
        if (systemFields) systemFields.classList.add('hidden');
        if (manualFields) manualFields.classList.remove('hidden');
        if (manualRadio) manualRadio.checked = true;
        if (manualCard) manualCard.classList.add('selected');
        if (systemCard) systemCard.classList.remove('selected');
        if (dataSourceDescription) {
            dataSourceDescription.innerHTML = '<span class="font-medium text-slate-700">سایر:</span> اطلاعات شاخص در سامانه نرم‌افزاری ذخیره نمی‌گردد.';
        }
    }
};

window.selectMonitoringMethod = function(method) {
    const webserviceLink = document.getElementById('webservice-link');
    const manualMethod = document.getElementById('manual-method');
    const autoMethod = document.getElementById('auto-method');
    const manualCard = document.querySelector('.radio-card[onclick*="selectMonitoringMethod(\'manual\')"]');
    const autoCard = document.querySelector('.radio-card[onclick*="selectMonitoringMethod(\'auto\')"]');
    const monitoringMethodDescription = document.getElementById('monitoring-method-description');

    if (method === 'auto') {
        if (webserviceLink) webserviceLink.classList.remove('hidden');
        if (autoMethod) autoMethod.checked = true;
        if (autoCard) autoCard.classList.add('selected');
        if (manualCard) manualCard.classList.remove('selected');
        if (monitoringMethodDescription) {
            monitoringMethodDescription.innerHTML = '<span class="font-medium text-blue-700">اتوماتیک:</span> همسو به‌صورت اتوماتیک مقادیر شاخص را از سامانه مدنظر فراخوانی می‌کند.';
        }
    } else {
        if (webserviceLink) webserviceLink.classList.add('hidden');
        if (manualMethod) manualMethod.checked = true;
        if (manualCard) manualCard.classList.add('selected');
        if (autoCard) autoCard.classList.remove('selected');
        if (monitoringMethodDescription) {
            monitoringMethodDescription.innerHTML = '<span class="font-medium text-slate-700">دستی:</span> مقادیر شاخص توسط تسهیلگر در سامانه همسو وارد می‌گردد.';
        }
    }
};

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
