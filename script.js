document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");
    const errorMessage = document.getElementById("error-message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = form.username.value;
        const email = form.email.value;

        try {
            const response = await fetch("/check-unique", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email })
            });
            const result = await response.json();

            if (result.isUnique) {
                form.submit();
            } else {
                errorMessage.textContent = result.message;
            }
        } catch (error) {
            errorMessage.textContent = "An error occurred. Please try again.";
        }
    });
});
