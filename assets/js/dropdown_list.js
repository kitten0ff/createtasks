document.addEventListener('DOMContentLoaded', function() {
    const customSelects = document.querySelectorAll('.custom_select');
    const MAX_DROPDOWN_HEIGHT = 200;
    
    customSelects.forEach(select => {
        const hiddenInput = select.parentElement.querySelector('input[type="hidden"]');
        const trigger = select.querySelector('.custom_select__trigger span');
        
        if (hiddenInput.value) {
            const selectedOption = select.querySelector(`.custom_option[data-value="${hiddenInput.value}"]`);
            if (selectedOption) {
                trigger.textContent = selectedOption.textContent;
                selectedOption.setAttribute('selected', '');
            }
        }
    });

    customSelects.forEach((select, index) => {
        const trigger = select.querySelector('.custom_select__trigger');
        const options = select.querySelector('.custom_options');
        
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            
            document.querySelectorAll('.custom_select').forEach(s => {
                if (s !== select) {
                    s.classList.remove('open');
                    s.querySelector('.custom_options').style.maxHeight = '0';
                }
            });
            
            const isOpen = select.classList.toggle('open');
            
            if (isOpen) {
                positionDropdown(options, select, MAX_DROPDOWN_HEIGHT);
            } else {
                options.style.maxHeight = '0';
            }
        });
        
        select.querySelectorAll('.custom_option').forEach(option => {
            option.addEventListener('click', function() {
                const hiddenInput = select.parentElement.querySelector('input[type="hidden"]');
                const triggerSpan = select.querySelector('.custom_select__trigger span');
                
                select.querySelectorAll('.custom_option').forEach(opt => {
                    opt.removeAttribute('selected');
                });
                
                option.setAttribute('selected', '');
                triggerSpan.textContent = option.textContent;
                hiddenInput.value = option.dataset.value;
                select.classList.remove('open');
                options.style.maxHeight = '0';
            });
        });
    });
    
    document.addEventListener('click', function() {
        document.querySelectorAll('.custom_select').forEach(select => {
            select.classList.remove('open');
            select.querySelector('.custom_options').style.maxHeight = '0';
        });
    });
});

function positionDropdown(options, select, maxHeight) {
    const viewportHeight = window.innerHeight;
    const triggerRect = select.querySelector('.custom_select__trigger').getBoundingClientRect();
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const contentHeight = options.scrollHeight;
    
    options.style.overflow = 'hidden';
    const neededHeight = Math.min(contentHeight, maxHeight);
    
    if (spaceBelow < neededHeight && spaceAbove > spaceBelow) {
        options.style.top = 'auto';
        options.style.bottom = '100%';
        options.style.maxHeight = `${Math.min(neededHeight, spaceAbove - 10)}px`;
    } else {
        options.style.top = '100%';
        options.style.bottom = 'auto';
        options.style.maxHeight = `${Math.min(neededHeight, spaceBelow - 10)}px`;
    }
    
    setTimeout(() => {
        if (options.scrollHeight > options.clientHeight) {
            options.style.overflowY = 'auto';
            options.classList.add('need-scrollbar');
        } else {
            options.style.overflowY = 'hidden';
            options.classList.remove('need-scrollbar');
        }
    }, 300);
}