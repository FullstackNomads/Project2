const delAccountButtonHandler = async (user) => {
    console.log(`DEL ACCOUNT BUTTON HANDLER FIRED`)
    if (user.target.hasAttribute('data-id')) {
        const id = user.target.getAttribute('data-id');

        const response = await fetch(`/api/users/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            document.location.replace('/login');
        } else {
            alert('Failed to delete user');
        }
    }
};

document
.querySelector('#deleteAccountButton')
.addEventListener('click', delAccountButtonHandler);