function toggleForm(formId) {
    const form = document.getElementById(formId);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function setButtonsDisabled(disabled) {
    document.querySelectorAll('button').forEach(btn => btn.disabled = disabled);
}