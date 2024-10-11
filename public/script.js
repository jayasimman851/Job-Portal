function applyForJob(jobId) {
    const userId = getUserId(); // Replace with your method to get the logged-in user's ID

    

    fetch(`/jobs/apply/${jobId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while applying for the job.');
    });
}

// Example function to get user ID (you need to implement this)
function getUserId() {
    // This function should return the logged-in user's ID, e.g., from local storage or a session
    return localStorage.getItem('userId'); // Adjust according to your actual implementation
}
