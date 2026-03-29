async function toggleComplete(checkbox) {
    const coinId = checkbox.dataset.coinId;
    const complete = checkbox.checked;
    const statusEl = document.getElementById(checkbox.dataset.statusId);

    try {
        const response = await fetch(`/proxy/coin/${coinId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ complete })
        });

        if (!response.ok) throw new Error('Request failed');

        const updated = await response.json();
        statusEl.textContent = `Saved! Complete: ${updated.complete}`;
    } catch (err) {
        if (statusEl) statusEl.textContent = 'Error saving — reverting.';
        checkbox.checked = !complete;
    }
}

async function deleteCoin(coin_id) {
    const deleteStatusEl = document.getElementById(`delete-status-${coin_id}`);
    setButtonsDisabled(true);

    try {
        deleteStatusEl.textContent = 'Deleting...';
        const response = await fetch(`/proxy/coin/${coin_id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Request failed');

        location.reload();
    } catch (err) {
        deleteStatusEl.textContent = 'Error deleting coin.';
        setButtonsDisabled(false);
    }
}

async function submitCoin(event) {
    event.preventDefault();
    const name = document.getElementById('coin-name').value.trim();
    const description = document.getElementById('coin-description').value.trim();
    const statusEl = document.getElementById('form-status');

    setButtonsDisabled(true);

    if (!name || !description) {
        statusEl.textContent = 'Please fill in all fields.';
        setButtonsDisabled(false);
        return;
    }

    try {
        const response = await fetch(`/proxy/coins`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description })
        });

        if (!response.ok) throw new Error('Request failed');

        location.reload();
    } catch (err) {
        setButtonsDisabled(false);
        statusEl.textContent = 'Error creating coin.';
    }
}

async function submitEditCoin(event, coinId) {
    event.preventDefault();
    const name = document.getElementById(`edit-coin-name-${coinId}`).value.trim();
    const description = document.getElementById(`edit-coin-description-${coinId}`).value.trim();
    const statusEl = document.getElementById(`edit-status-${coinId}`);

    if (!name && !description) {
        statusEl.textContent = 'Please fill in at least one field.';
        return;
    }

    const body = {};
    if (name) body.name = name;
    if (description) body.description = description;

    setButtonsDisabled(true);

    try {
        const response = await fetch(`/proxy/coin/${coinId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) throw new Error('Request failed');

        location.reload();
    } catch (err) {
        statusEl.textContent = 'Error updating coin.';
        setButtonsDisabled(false);
    }
}