const delButtonHandler = async (event) => {
    console.log(`DEL BUTTON HANDLER FIRED`)
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');

        const response = await fetch(`/api/events/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            document.location.replace('/user');
        } else {
            alert('Failed to delete event');
        }
    }
};

let userCreatedEventCards = document.querySelectorAll('.event-list')

for (i = 0; i < userCreatedEventCards.length; i++) {
    userCreatedEventCards[i].addEventListener('click', delButtonHandler);
};