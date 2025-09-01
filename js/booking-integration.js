// --- PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE ---
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxRTKK0uY17SvbqV-pBF544DFGbpWHp2_VWyhSTRli3h421DLy-ZjjX7VliQ7ijcnCCyA/exec';

document.addEventListener('DOMContentLoaded', () => {
    // Select the dropdowns and the final form button
    const serviceSelect = document.getElementById('service-select');
    const hairdresserSelect = document.getElementById('hairdresser-select');
    const finalBookingButton = document.querySelector('#step-4 .primary-cta-button');

    // --- 1. Functions to Fetch Data and Populate Dropdowns ---

    async function fetchData(action) {
        try {
            const response = await fetch(`${GAS_URL}?action=${action}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const result = await response.json();
            if (result.status === 'success') {
                return result.data;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error(`Failed to fetch ${action}:`, error);
            return []; // Return empty array on failure
        }
    }

    // REPLACE the old populateServices function with this new one

    async function populateServices() {
        // CHANGE #1: We now call 'getServices' instead of 'getProducts'
        const services = await fetchData('getServices');

        serviceSelect.innerHTML = '<option value="" disabled selected>Select a Service</option>'; // Reset

        // CHANGE #2: We loop through 'services' and use the new header names
        services.forEach(service => {
            const option = document.createElement('option');

            // The data structure here matches the new "Services" sheet headers
            option.value = `${service['Service ID']}|${service['Service Name']}|${service['Price']}`;
            option.textContent = `${service['Service Name']} - £${Number(service['Price']).toFixed(2)}`;

            serviceSelect.appendChild(option);
        });
    }

    // ... (The rest of your file, like populateHairdressers and handleBookingSubmit, remains unchanged)

    async function populateHairdressers() {
        const hairdressers = await fetchData('getHairdressers');
        hairdresserSelect.innerHTML = '<option value="" disabled selected>Select a Stylist</option>'; // Reset
        hairdressers.forEach(hd => {
            const option = document.createElement('option');
            option.value = hd['Hairdresser ID'];
            option.textContent = `${hd['First Name']} ${hd['Last Name']}`;
            hairdresserSelect.appendChild(option);
        });
    }

    // --- 2. Function to Handle the Final Booking Submission ---

    async function handleBookingSubmit(event) {
        event.preventDefault(); // Stop form from submitting traditionally
        finalBookingButton.textContent = 'Booking...';
        finalBookingButton.disabled = true;

        // --- Gather all data from the form ---
        const [serviceId, serviceName, servicePrice] = serviceSelect.value.split('|');
        const hairdresserId = hairdresserSelect.value;
        const date = '2025-10-09'; // Placeholder: This should be read from the calendar UI
        const time = '10:30 AM';   // Placeholder: This should be read from the time slot UI

        const firstName = document.querySelector('input[placeholder="Full Name"]').value.split(' ')[0];
        const lastName = document.querySelector('input[placeholder="Full Name"]').value.split(' ').slice(1).join(' ');
        const email = document.querySelector('input[placeholder="Email Address"]').value;
        const phone = document.querySelector('input[placeholder="Phone Number"]').value;

        // --- Build the URL with parameters for the GET request ---
        const params = new URLSearchParams({
            action: 'createBooking',
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            date: date,
            time: time,
            hairdresserId: hairdresserId,
            style: serviceName,
            locationId: 'LOC-01', // Hardcoded for this example
            notes: 'Web booking'
        });

        try {
            const response = await fetch(`${GAS_URL}?${params.toString()}`);
            const result = await response.json();

            if (result.status === 'success' && result.data.status === 'Booking Created') {
                alert(`Booking successful! Your Booking ID is: ${result.data.bookingId}`);
                // Here you would redirect to a "thank you" page
                window.location.reload();
            } else {
                throw new Error(result.message || 'An unknown error occurred.');
            }
        } catch (error) {
            alert(`Booking failed: ${error.message}`);
            finalBookingButton.textContent = 'Confirm & Pay';
            finalBookingButton.disabled = false;
        }
    }

    // --- 3. Initialise the form and attach event listeners ---

    populateServices();
    populateHairdressers();
    finalBookingButton.addEventListener('click', handleBookingSubmit);
});