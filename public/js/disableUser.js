const disableAccountButtonHandler = async (user) => {
    console.log(`DISABLE ACCOUNT BUTTON HANDLER FIRED`)
        const id = user.target.getAttribute('data-id');

        const response = await fetch(`/api/users/${id}`, {
            method: 'PUT',
        });

        if (response.ok) {
            document.location.replace('/login');
        } else {
            alert('Failed to disable user');
        }
};

document
.querySelector('#disableAccountButton')
.addEventListener('click', disableAccountButtonHandler);