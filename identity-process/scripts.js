const identityTabs = ['general', 'diagram', 'sipoc', 'indicators', 'docs', 'resources', 'complications', 'risks'];

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
