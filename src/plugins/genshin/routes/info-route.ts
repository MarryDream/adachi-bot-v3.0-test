import express from "express";

export default express.Router().get( "/", async ( req, res ) => {
	res.status( 200 ).send( true );
} );