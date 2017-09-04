let express = require( 'express' );
let session = require( 'express-session' );
let bodyParser = require( 'body-parser' );
var app = express();
//MIDDLEWARE:
app.use( bodyParser.json() );
app.use( session( {
    secret: 'ldkajflkejfakjelkfj;lafke', //**Required** This is the secret used to sign the session ID cookie. The secret is used to encrypt the session ID, session data is stored server side always, the ID is how its matched up. 
    resave: false, //When true it forces the session to be saved back to the session store, even if the session was never modified during the request.
    saveUninitialized: false //When true it forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
} ) )
app.use( function ( req, res, next ) {
    const { session } = req;  // const session = req.session. To store or access session data, you simply use the request property req.session.
    console.log( session )
    if ( !session.user ) { //Checks if there is not already a session.user
        session.user = {  //If there isn't then create one and give it the key value pairs of 'username' with an empty string and 'favorites' with an empty array. 
            username: '',
            favorites: []
        };
    }
    next(); // <- This is the trigger to indicate that our middleware was finished and to move on to the NEXT function in the chain. Remember you must call next in any middleware.
}
)
var port = 4000
//ENDPOINTS:
//Login 
app.get( '/api/login', function ( req, res ) {
    req.session.user.username = req.query.email; //Takes the email from the query and assigns it to the session as the username.
    res.status( 200 ).send( req.session.user ) //Sends back the entire user object on the session.
} );
//Get Favorites 
app.get( '/api/getFavorites', ( req, res, next ) => {
    const { user } = req.session; // const user = req.session.user
    res.status( 200 ).send( user ) //Another way to send back the entire user object is to use object destructoring above and then just send your new user variable.
} )
//Add to Favorites
app.post( '/api/addFavorites', ( req, res, next ) => {
    const { favorites } = req.session.user; // const user = req.session.user
    let { fav } = req.query //const favorite = req.query.fav
    favorites.push( fav ) //We are going to take what is on the query and push it to the favorites array on the user object on the sessions.
    res.send( req.session.user ) //We will then send back the entire user object on sessions.
} )
//You can use this add favorites endpoint instead if you would like it to first check if the item is already in the favorites array and if it is not then it will add it to the array. Uncomment out the full endpoint to see the code and comments. 
// app.post( '/api/addFavorites', (req, res, next) => {
//         const { favorites } = req.session.user; // const user = req.session.user
//         let { fav } = req.query //const favorite = req.query.fav

//         const favIndex = favorites.findIndex( favItem => favItem == fav ); //We are using the .findIndex() method which will search through our favorites array on sessions to see if the fav item from our query is already in the array. If it is findIndex will return the index of the item if it is not findIndex will return -1.
//         if ( favIndex === -1 ) { //If we did receive -1 from findIndex() we now now the item is not already in the array and needs to be added. 
//                 favorites.push(fav) //We push the new item to the favorites array on the sessions.
//                return res.send(req.session.user) //We will then send back the entire user object on sessions.
//         }
//         res.status(200).send(req.session.user) //If we already have that item in the array we will just send back the entire user object on sessions.
// })
app.listen( port, () => { console.log( `Server listening on port ${port}.` ); } );