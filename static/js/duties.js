async function openDutyModal(dutyId) {
    const dialog = document.getElementById(`duty-dialog-${dutyId}`);
    const nameEl = document.getElementById(`duty-dialog-name-${dutyId}`);
    const descriptionEl = document.getElementById(`duty-dialog-description-${dutyId}`);

    nameEl.textContent = 'Loading...';
    descriptionEl.textContent = '';
    dialog.showModal();

    try {
        const response = await fetch(`/proxy/duty/${dutyId}`);
        const duty = await response.json();
        nameEl.textContent = duty.name;
        descriptionEl.textContent = duty.description;

        if (duty.coins && duty.coins.length > 0) {
            const coinsEl = document.createElement('h4');
            coinsEl.textContent = 'Associated Coins: ';
            for (const coin of duty.coins) {
                const coinEl = document.createElement('p');
                coinEl.textContent = coin.name;
                coinsEl.appendChild(coinEl);
            }
            descriptionEl.appendChild(coinsEl);
        }
    } catch (error) {
        nameEl.textContent = 'Error loading duty.';
        console.error('Error fetching duty data:', error);
    }
}