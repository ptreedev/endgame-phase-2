async function toggleComplete(checkbox) {
    const coinId = checkbox.dataset.coinId;
    const complete = checkbox.checked;
    const statusId = checkbox.dataset.statusId;
    const statusEl = document.getElementById(statusId);

    try {
        const response = await fetch(`${API_URL}/coin/${coinId}`, {
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

async function deleteCoin(coin_id, deleteBtn) {
    const deleteStatusEl = document.getElementById(`delete-status-${coin_id}`);
    deleteBtn.disabled = true;

    try {
        deleteStatusEl.textContent = 'Deleting...';
        const response = await fetch(`${API_URL}/coin/${coin_id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Request failed');

        location.reload();
    } catch (err) {
        deleteStatusEl.textContent = 'Error deleting coin.';
        deleteBtn.disabled = false;
    }
}

async function submitCoin(event) {
    event.preventDefault();
    const name = document.getElementById('coin-name').value.trim();
    const description = document.getElementById('coin-description').value.trim();
    const statusEl = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (!name || !description) {
        statusEl.textContent = 'Please fill in all fields.';
        return;
    }

    submitBtn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/coins`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description })
        });

        if (!response.ok) throw new Error('Request failed');

        location.reload();
    } catch (err) {
        console.error('Caught error:', err);
        submitBtn.disabled = false;
        statusEl.textContent = 'Error creating coin.';
    }
}

async function submitEditCoin(event, form, coinId) {
    event.preventDefault();
    const name = form.querySelector('input[name="name"]').value.trim();
    const description = form.querySelector('input[name="description"]').value.trim();
    const statusEl = document.getElementById(`edit-status-${coinId}`);
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!name && !description) {
        statusEl.textContent = 'Please fill in at least one field.';
        return;
    }

    const body = {};
    if (name) body.name = name;
    if (description) body.description = description;

    submitBtn.disabled = true;

    try {
        const response = await fetch(`${API_URL}/coin/${coinId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) throw new Error('Request failed');

        location.reload();
    } catch (err) {
        statusEl.textContent = 'Error updating coin.';
        submitBtn.disabled = false;
    }
}