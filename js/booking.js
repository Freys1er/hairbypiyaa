document.addEventListener('DOMContentLoaded', () => {
    const nextButtons = document.querySelectorAll('.primary-cta-button');
    const backButtons = document.querySelectorAll('.back-button');
    const steps = document.querySelectorAll('.booking-step');
    const progressSteps = document.querySelectorAll('.progress-step');

    let currentStep = 0;

    function updateStepDisplay() {
        // Hide all steps
        steps.forEach(step => {
            step.classList.remove('active');
        });

        // Show the current step
        steps[currentStep].classList.add('active');

        // Update progress bar
        progressSteps.forEach((step, index) => {
            if (index <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // --- Event Listeners for NEXT buttons ---
    // Note: We use a standard for loop because querySelectorAll returns a NodeList, not a true Array
    for (let i = 0; i < nextButtons.length; i++) {
        const button = nextButtons[i];
        button.addEventListener('click', (event) => {
            // Prevent form submission if it's the last button
            event.preventDefault(); 
            
            // Go to the next step if we aren't at the end
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateStepDisplay();
            } else {
                // Logic for the final button (e.g., submit the form)
                alert('Appointment Confirmed! (This would go to a payment page)');
            }
        });
    }
    
    // --- Event Listeners for BACK buttons ---
    for (let i = 0; i < backButtons.length; i++) {
        const button = backButtons[i];
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                updateStepDisplay();
            }
        });
    }

    // Initialize the first step
    updateStepDisplay();
});