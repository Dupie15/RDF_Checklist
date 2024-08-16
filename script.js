// Register the service worker to handle offline capabilities
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('Service Worker Registered'))
    .catch(err => console.log('Service Worker registration failed:', err));
}

// Open (or create) the IndexedDB database
let db;
const request = indexedDB.open('ChecklistDB', 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore('checklists', { keyPath: 'id', autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
};

// Function to save the form data into IndexedDB
function saveChecklist(data) {
    const transaction = db.transaction(['checklists'], 'readwrite');
    const objectStore = transaction.objectStore('checklists');
    objectStore.add(data);
}

// Handle form submission
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => data[key] = value);
    saveChecklist(data);
    alert('Checklist saved locally. It will sync when online.');
});

// Sync data when the device is online
window.addEventListener('online', function() {
    syncChecklists();
});

// Function to sync data with the server
function syncChecklists() {
    const transaction = db.transaction(['checklists'], 'readonly');
    const objectStore = transaction.objectStore('checklists');
    const request = objectStore.getAll();

    request.onsuccess = function() {
        const data = request.result;
        if (data.length > 0) {
            fetch('/api/sync', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    const deleteTransaction = db.transaction(['checklists'], 'readwrite');
                    deleteTransaction.objectStore('checklists').clear();
                    alert('Data synced successfully!');
                }
            }).catch(error => console.error('Sync failed:', error));
        }
    };
}
