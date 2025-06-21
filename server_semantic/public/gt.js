
let gt;

async function main() {
  const createGt = (ip) => {


    const gt = new GT(ip, { handleState: true })



    gt.on('state_object_updated', () => {
      // document.getElementById('number').innerText = gt.state.number;
    })

    // fires when WE disconnect.
    gt.on('disconnect', (reason) => {
      
    })

    // fires when we joined a room
    gt.on('joined', (room, roomState, users) => {
      

    })

    // fires when we authed with an id.
    gt.on('authed', (id, state) => {
      
      
    })

    // fires when someone has joined the room (including ourselves).
    gt.on('connected', (id, userState) => {
        
      })


    // fires when someone left the room
    gt.on('disconnected', (id, reason) => {
      
    })
    

    // these will fire when the room/user state changes.
    gt.on('user_updated_reliable', (id, payloadDelta) => {
      
    })

    gt.on('state_updated_reliable', (id, payloadDelta) => {

      })

    return gt
  }


  




  window.createGt = createGt;


// function to create a new cursor in a random color on the box to represent to a peer



}

main();