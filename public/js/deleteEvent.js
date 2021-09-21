// This script is only loaded for users viewing their own page, so I am including the function to append delete buttons. 

// need to add a res.redirect to the /users/:id route so that if the session user_id matches the req.params.id it will redirect to /user route

let userCreatedEventCards = document.querySelectorAll('.event-list')

document.addEventListener('DOMContentLoaded', () => {
    let eventCards = document.querySelectorAll(`.event-card`)
    console.log(eventCards);
    for (let i = 0; i < eventCards.length; i++) {
        // create delete button
        let delBtn = document.createElement('button')
        delBtn.classList.add("btn", "btn-sm", "btn-danger", "delete");
        delBtn.innerText = "DELETE";

        //append delete button to each event card
        eventCards[i].appendChild(delBtn);
    }
})

const delButtonHandler = async (event) => {
    console.log(`DEL BUTTON HANDLER FIRED`)
    if (event.target.classList.contains('delete')) {
        const id = event.target.parentElement.parentElement.getAttribute('data-id');
        console.log(id)
        const response = await fetch(`/api/events/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            document.location.replace('/user');
        } else {
            alert('Failed to delete event');
        }
    }
    return;
};


for (i = 0; i < userCreatedEventCards.length; i++) {
    userCreatedEventCards[i].addEventListener('click', delButtonHandler);
};