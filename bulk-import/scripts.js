let currentStep = 1;
let currentImportType = 'sipoc';

const importTypeContent = {
    sipoc: {
        description: 'قالب استاندارد SIPOC فرایند آماده دریافت است.',
        templateTitle: 'قالب استاندارد SIPOC فرایند'
    },
    indicators: {
        description: 'قالب استاندارد شاخص‌های فرایندی آماده دریافت است.',
        templateTitle: 'قالب استاندارد شاخص‌های فرایندی'
    }
};

function renderIcons() {
    if (window.lucide) window.lucide.createIcons();
}

function setImportType(type) {
    currentImportType = type;
    document.querySelectorAll('.import-type-card').forEach((card) => {
        card.classList.toggle('selected', card.dataset.importType === type);
    });

    document.getElementById('selected-type-description').textContent = importTypeContent[type].description;
    document.getElementById('template-title').textContent = importTypeContent[type].templateTitle;
}

function setStep(step) {
    currentStep = Math.max(1, Math.min(4, step));

    document.querySelectorAll('.wizard-step').forEach((panel) => {
        panel.classList.toggle('hidden', Number(panel.dataset.stepPanel) !== currentStep);
    });

    document.querySelectorAll('.wizard-nav').forEach((button) => {
        button.classList.toggle('active', Number(button.dataset.step) === currentStep);
    });

    document.querySelectorAll('.flow-step').forEach((item) => {
        item.classList.toggle('active', Number(item.dataset.stepIndicator) === currentStep);
    });

    document.getElementById('prev-step').disabled = currentStep === 1;
    const nextButton = document.getElementById('next-step');
    if (currentStep === 3) {
        nextButton.textContent = 'ثبت نهایی در سیستم';
    } else {
        nextButton.textContent = currentStep === 4 ? 'پایان' : 'مرحله بعد';
    }
    renderIcons();
}

function confirmFinalImport() {
    return window.confirm(
        'آیا از ثبت نهایی اطلاعات تاییدشده در سیستم مطمئن هستید؟\n\n' +
        'این تغییرات مستقیما در سیستم اعمال می‌شود و امکان بازگشت وجود ندارد.'
    );
}

function navigateToStep(step) {
    if (currentStep === 3 && step >= 4 && !confirmFinalImport()) return;
    setStep(step);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.import-type-card').forEach((card) => {
        card.addEventListener('click', () => setImportType(card.dataset.importType));
    });

    document.querySelectorAll('.wizard-nav').forEach((button) => {
        button.addEventListener('click', () => navigateToStep(Number(button.dataset.step)));
    });

    document.getElementById('prev-step').addEventListener('click', () => navigateToStep(currentStep - 1));
    document.getElementById('next-step').addEventListener('click', () => navigateToStep(currentStep + 1));

    setImportType(currentImportType);
    setStep(currentStep);
    renderIcons();
});
