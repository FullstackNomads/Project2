const joinEventButton = document.querySelector(`#join-event`)

const joinEventHandler = async (event) => {
  console.log(`JOIN EVENT BUTTON HANDLER FIRED`)
  let event_id = joinEventButton.getAttribute('data-event_id');
  console.log(event_id);
  await fetch(`/api/events/joinEvent`, {
    method: 'POST',
    body: JSON.stringify({ event_id: event_id }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then((response) => {
      console.log(response.body);
      alert(response.body.message)
    })
    .catch((err) => {
      alert(`Failed to join Event.`)
      console.log(err)
    })
};


joinEventButton.addEventListener(`click`, joinEventHandler)