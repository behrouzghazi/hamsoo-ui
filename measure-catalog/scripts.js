// اسکریپت‌های مشترک پروژه شناسنامه شاخص

// Initialize Icons
lucide.createIcons();

// Tab Switching Logic
function switchTab(tabId) {
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    document.getElementById('btn-' + tabId).classList.add('active');
    
    // Load tab content
    loadTabContent(tabId);
}

// Load Tab Content - اصلاح شده: نام فایل‌ها با tab- شروع می‌شوند
async function loadTabContent(tabId) {
    try {
        // نام فایل: tab- + نام تب + .html
        const fileName = `tab-${tabId}.html`;
        const response = await fetch(fileName);
        const content = await response.text();
        document.getElementById('tab-container').innerHTML = content;
        
        // Reinitialize icons for the new content
        lucide.createIcons();
        
        // Initialize event listeners for the loaded content
        initializeTabEvents(tabId);
    } catch (error) {
        console.error(`Error loading tab ${tabId}:`, error);
        document.getElementById('tab-container').innerHTML = `
            <div class="p-8 text-center text-red-500">
                <i data-lucide="alert-circle" class="w-12 h-12 mx-auto mb-4"></i>
                <p>خطا در بارگذاری محتوای تب. لطفا از اجرای پروژه با Live Server اطمینان حاصل کنید.</p>
                <p class="text-xs mt-2">فایل مورد نظر: tab-${tabId}.html</p>
            </div>
        `;
        lucide.createIcons();
    }
}

// Initialize Tab Events
function initializeTabEvents(tabId) {
    // Radio Card Selection
    document.querySelectorAll('.radio-card').forEach(card => {
        card.addEventListener('click', function(e) {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                
                // Update UI
                document.querySelectorAll('.radio-card').forEach(c => {
                    c.classList.remove('selected');
                });
                this.classList.add('selected');
                
                // Handle specific tab events
                if (tabId === 'monitoring' && radio.name === 'data_source') {
                    selectDataSource(radio.id);
                }
            }
        });
    });
    
    // Initialize specific tab functions
    if (tabId === 'monitoring') {
        // Add a small delay to ensure DOM is fully loaded
        setTimeout(() => {
            updateOwnerField();
            updateMonitorField();
            
            // Set up event listeners for select changes
            const ownerTypeSelect = document.getElementById('owner-type');
            if (ownerTypeSelect) {
                ownerTypeSelect.addEventListener('change', updateOwnerField);
            }
            
            const monitorTypeSelect = document.getElementById('monitor-type');
            if (monitorTypeSelect) {
                monitorTypeSelect.addEventListener('change', updateMonitorField);
            }
        }, 100);
    }
    
    // Initialize for basic tab if needed
    if (tabId === 'basic') {
        setTimeout(() => {
            // Initialize any basic tab specific events
            const radioCards = document.querySelectorAll('#tab-basic .radio-card');
            radioCards.forEach(card => {
                const radio = card.querySelector('input[type="radio"]');
                if (radio && radio.checked) {
                    card.classList.add('selected');
                }
            });
        }, 100);
    }
}

// Select Data Source
function selectDataSource(sourceType) {
    const systemFields = document.getElementById('system-fields');
    const manualFields = document.getElementById('manual-fields');
    
    if (sourceType === 'system') {
        if (systemFields) systemFields.classList.remove('hidden');
        if (manualFields) manualFields.classList.add('hidden');
    } else {
        if (systemFields) systemFields.classList.add('hidden');
        if (manualFields) manualFields.classList.remove('hidden');
    }
}

// Update Owner Field based on selection
function updateOwnerField() {
    const ownerTypeSelect = document.getElementById('owner-type');
    if (!ownerTypeSelect) return;
    
    const ownerType = ownerTypeSelect.value;
    const positionField = document.getElementById('owner-position-field');
    const personField = document.getElementById('owner-person-field');
    const unitDisplay = document.getElementById('owner-unit-display');
    
    if (ownerType === 'position') {
        if (positionField) positionField.classList.remove('hidden');
        if (personField) personField.classList.add('hidden');
        if (unitDisplay) unitDisplay.textContent = 'واحد بازاریابی';
    } else {
        if (positionField) positionField.classList.add('hidden');
        if (personField) personField.classList.remove('hidden');
        if (unitDisplay) unitDisplay.textContent = 'واحد بازاریابی';
    }
}

// Update Monitor Field based on selection
function updateMonitorField() {
    const monitorTypeSelect = document.getElementById('monitor-type');
    if (!monitorTypeSelect) return;
    
    const monitorType = monitorTypeSelect.value;
    const positionField = document.getElementById('monitor-position-field');
    const personField = document.getElementById('monitor-person-field');
    const unitDisplay = document.getElementById('monitor-unit-display');
    
    if (monitorType === 'position') {
        if (positionField) positionField.classList.remove('hidden');
        if (personField) personField.classList.add('hidden');
        if (unitDisplay) unitDisplay.textContent = 'واحد کنترل کیفیت';
    } else {
        if (positionField) positionField.classList.add('hidden');
        if (personField) personField.classList.remove('hidden');
        if (unitDisplay) unitDisplay.textContent = 'واحد کنترل کیفیت';
    }
}

// Radio Card Selection Helper
function selectRadio(radioId) {
    const radio = document.getElementById(radioId);
    if (radio) {
        radio.checked = true;
        
        // Update UI for radio cards
        document.querySelectorAll('.radio-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Find parent radio-card and add selected class
        const parentCard = radio.closest('.radio-card');
        if (parentCard) {
            parentCard.classList.add('selected');
        }
    }
}

// Form Submit Simulation
document.addEventListener('DOMContentLoaded', function() {
    const kpiForm = document.getElementById('kpi-form');
    if (kpiForm) {
        kpiForm.onsubmit = (e) => {
            e.preventDefault();
            alert('اطلاعات شناسنامه شاخص با موفقیت در سیستم همسو ذخیره شد.');
        };
    }
    
    // Log for debugging
    console.log('Scripts loaded successfully');
    console.log('Project structure:');
    console.log('- index.html');
    console.log('- tab-basic.html');
    console.log('- tab-monitoring.html');
    console.log('- tab-formula.html');
    console.log('- tab-thresholds.html');
    console.log('- styles.css');
    console.log('- scripts.js');
});