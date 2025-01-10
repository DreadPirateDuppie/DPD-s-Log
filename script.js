// Fetch logs from the backend
function fetchLogs() {
    fetch('/logs')
        .then(response => response.json())
        .then(data => {
            displayLogs(data);
        })
        .catch(error => console.error('Error fetching logs:', error));
}

// Display logs dynamically
function displayLogs(entries) {
    const logEntriesDiv = document.getElementById('log-entries');
    if (!logEntriesDiv) return;

    logEntriesDiv.innerHTML = ''; // Clear previous entries
    entries.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('blog-post');
        entryDiv.innerHTML = `
            <h2>${entry.title}</h2>
            <p>${new Date(entry.date).toLocaleDateString()}</p>
            <p>${entry.content}</p>
            <button onclick="editLog(${index})">Edit</button>
            <button onclick="confirmDeleteLog(${index})">Delete</button>
        `;
        logEntriesDiv.appendChild(entryDiv);
    });
}

// Handle form submission for adding a log entry
function handleFormSubmit(event) {
    event.preventDefault();
    const date = document.getElementById('log-date').value || new Date().toISOString().split('T')[0];
    const title = document.getElementById('log-title').value;
    const content = document.getElementById('log-content').value;

    const logData = { title, date, content };

    fetch('/logs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        fetchLogs(); // Refresh the logs after adding a new one
    })
    .catch(error => console.error('Error adding log:', error));

    event.target.reset(); // Reset the form
}

// Edit a log entry
function editLog(index) {
    const logs = fetchLogs();
    const log = logs[index];

    document.getElementById('log-date').value = log.date;
    document.getElementById('log-title').value = log.title;
    document.getElementById('log-content').value = log.content;
}

// Confirm and delete a log entry
function confirmDeleteLog(index) {
    if (confirm('Are you sure you want to delete this log?')) {
        deleteLog(index);
    }
}

function deleteLog(index) {
    fetch('/logs', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        fetchLogs(); // Refresh the logs after deleting one
    })
    .catch(error => console.error('Error deleting log:', error));
}

// Search logs by title
function searchLogs() {
    const query = document.getElementById('search-input')?.value.toLowerCase();
    fetch('/logs', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        params: {
            query
        }
    })
    .then(response => response.json())
    .then(data => {
        displayLogs(data);
    })
    .catch(error => console.error('Error searching logs:', error));
}

// Initialize the page
function initializePage() {
    const logEntriesDiv = document.getElementById('log-entries');
    const logForm = document.getElementById('log-form');
    const searchInput = document.getElementById('search-input');

    if (logEntriesDiv) {
        fetchLogs();
    }

    if (logForm) {
        logForm.addEventListener('submit', handleFormSubmit);
    }

    if (searchInput) {
        searchInput.addEventListener('input', searchLogs);
    }
}

// Run initialization on page load
window.onload = initializePage;

document.addEventListener("DOMContentLoaded", () => {
    const galleryGrid = document.getElementById("gallery-grid");

    // Dynamically fetch image files (update this part for server-side integration if needed)
    const imageFolder = "./gallery"; // Relative path to the gallery folder
    const imageExtensions = ["jpg", "jpeg", "png", "gif"]; // Supported image extensions

    // Simulated list of image files for client-side only (replace with a server call for real apps)
    const fetchImages = async () => {
        try {
            const response = await fetch(imageFolder); // This would require a server
            const files = await response.json(); // This assumes a server-side script returns the file list
            return files.filter(file => imageExtensions.some(ext => file.endsWith(ext)));
        } catch (error) {
            console.error("Error fetching images:", error);
            return ["image1.jpg", "image2.jpg", "image3.png"]; // Default fallback
        }
    };

    // Populate the gallery
    const loadGallery = async () => {
        const imageFiles = await fetchImages();

        imageFiles.forEach(fileName => {
            const img = document.createElement("img");
            img.src = `${imageFolder}/${fileName}`;
            img.alt = fileName;
            img.classList.add("gallery-image");
            galleryGrid.appendChild(img);
        });
    };

    loadGallery();
});
