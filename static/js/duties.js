async function openDutyModal(dutyId) {
    const dialog = document.getElementById(`duty-dialog-${dutyId}`);
    const nameEl = document.getElementById(`duty-dialog-name-${dutyId}`);
    const descriptionEl = document.getElementById(`duty-dialog-description-${dutyId}`);

    nameEl.textContent = 'Loading...';
    descriptionEl.textContent = '';
    dialog.showModal();

    try {
        const response = await fetch(`${API_URL}/duty/${dutyId}`);
        const data = await response.json();
        nameEl.textContent = data.name;
        descriptionEl.textContent = data.description;
    } catch (error) {
        nameEl.textContent = 'Error loading duty.';
        console.error('Error fetching duty data:', error);
    }
}