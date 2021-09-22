const reactivateAccountButtonHandler = async (user) => {
    console.log(`REACTIVATE ACCOUNT BUTTON HANDLER FIRED`)
        const id = user.target.getAttribute('data-id');

        const response = await fetch(`/api/users/reactivate/${id}`, {
            method: 'PUT',
        });

        if (response.ok) {
            document.location.replace('/');
        } else {
            alert('Failed to reactivate account');
        }
};

document
.querySelector('#reactivateAccountButton')
.addEventListener('click', reactivateAccountButtonHandler);