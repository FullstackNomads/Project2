const joinEventHandler = async (event) => {
  console.log(`JOIN EVENT BUTTON HANDLER FIRED`)
  await fetch(`/api/events/joinEvent`, {
    method: 'POST'
  })
    .then((data) => {
      console.log(data.errors)
    })

}

document.querySelector(`#join-event`).addEventListener(`click`, joinEventHandler)