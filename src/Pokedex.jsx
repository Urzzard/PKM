import React, {useState, useEffect, useRef} from "react";
/* import './Pokedex.css'; */

export function VerPokedex(){
    const [pkdexInfo, setPkdexInfo ] = useState([]);

    useEffect(() => {
        async function fetchPkdex(url){
            try{
                const response = await fetch(url);
                const datadex = await response.json();
                console.log(datadex.pokemon_entries);

            } catch(error){
                console.error('Error buscando informacion: ', error)
            }
        }
        fetchPkdex('https://pokeapi.co/api/v2/pokedex/national');
    }, []);
}