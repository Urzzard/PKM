import React, {useState, useEffect} from "react";
import pikachu from './assets/pikachu.gif'
import './Pokemon.css';

export function VerPokemon(){
    //SE DEFINEN LOS ESTADOS: PKMINFO PARA ALMACENAR LOS DETALLES DE LOS POKEMON
    const [pkmInfo, setPkmInfo] = useState([]);
    //LOADING PARA INDICAR SI SE CARGAN O NO LOS DATOS
    const [loading, setLoading] = useState(true);
    /* //Y OFFSET PARA LA PAGINACION, EN DEFECTO EN 0 PARA QUE TRAIGA SIEMPRE LOS PRIMEROS RESULTADOS, SI SE CAMBIA PUEDE HABER CONFLICTO!!!
    const [offset, setOffset] = useState(0); */

    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("index");

    /* const [modVisible, setModVisible] = useState(false); */
    //ESTABLECE EL LIMITE DE LOS RESULTADOS CARGADOS
    /* const limit = 54;  */

    //ESTO SIRVE PARA OBTENER LOS DETALLES DE LOS PKM EN LA VENTANA EMERGENTE
    const [selectedPokemon, setSelectedPokemon] = useState(null)

    const [totalPokemon, setTotalPokemon] = useState(0);

    async function fetchTotalPokemon(){
        try{
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1')
            const data = await response.json();
            setTotalPokemon(data.count);
        }catch (error){
            console.log('Error fetching total Pokémon count: ', error)
        }
    }


    async function fetchPkm(offset, limit){
        try{
            //SE ESTABLECE LA CARGA DE DATOS EN TRUE
            setLoading(true);
            //AQUI PASAMOS LA URL CON TEMPLATE LITERALS PARA PODER USAR LAS VARIABLES DENTRO DE LA MISMA.
            const response =  await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
            const data = await response.json();
            const results = data.results
            const pkmDetails = [];

            //AQUI SE ITERA SOBRE LA LISTA DE RESULTADOS, ES DECIR EN CADA VUELTA "pkm" OBTENDRA LOS VALORES DE "results" PARA ASI PODER OBTENER LA DIRECCION URL DE LAS DEMAS APIS Y FINALMENTE GUARDANDOLO EN EL ARREGLO "pkmDetails[]"
            for(const pkm of results){
                const pkmResponse = await fetch(pkm.url);
                const pkmData = await pkmResponse.json();
                pkmDetails.push(pkmData);
            }

            //ESTO ES IMPORTANTE PARA LA PAGINACION, YA QUE SI EL offset es 0 NO ESTAMOS PAGINANDO Y SE ESTABLECE LA INFORMACION DE LOS POKEMON CON LA CANTIDAD INDICADA
            if (offset === 0) {
                setPkmInfo(pkmDetails);
                console.log(pkmDetails);
            } else {
                //PERO SI ES DIFERENTE A 0, SE EMPIEZA A PAGINAR Y SE AGREGA AL ANTERIOR LOS NUEVOS DETALLES DE POKEMON AL FINAL DE LA LISTA EXISTENTE
                setPkmInfo(prevPkmInfo => [...prevPkmInfo, ...pkmDetails]);
            }
            //DESPUES DE HABER EJECUTADO TODO LO ANTERIOR SE ESTABLECE LA CARGA EN FALSE
            setLoading(false);
            

        }catch(error){
            console.error('Error buscando informacion del pokemon: ', error)
            setLoading(false);
        }

    }

    useEffect(() => {
        fetchTotalPokemon();
    }, []);

    useEffect(() => {
        if(totalPokemon > 0){
            const fetchTodosPkm = async () =>{
                const limit = 100;
                for(let offset = 0; offset < totalPokemon; offset+=limit){
                    await fetchPkm(offset, limit);
                }
            };
            fetchTodosPkm();
        }
    }, [totalPokemon]);


    /* //USAMOS useEffect(SE EJECUTA DESPUES DE QUE EL COMPONENTE SE HAYA RENDERIZADO EN EL DOM) PARA EJECUTAR LA FUNCION HACIENDO LA CARGA INICIAL DE LOS PRIMEROS POKEMONES
    useEffect(() => {
        fetchPkm(0);
        //EL ARREGLO VACIO DE ABAJO SIGNIFICA QUE LA FUNCION SE EJECUTARA UNA VEZ DESPUES DE QUE SE RENDERICE EL COMPONENTE
    }, []); */

    //ESTA FUNCION ACTUALIZA EL ESTADO DE offset, AQUI SE AGREGA AL ESTADO ANTERIOR EL LIMITE ESTABLECIDO, ES DECIR QUE SE OBTENGA LOS SIGUIENTES limit CANTIDAD DE POKEMONES
    const loadMorePokemon = () => {
        setOffset(prevOffset => prevOffset + limit);
    };

    /* //AQUI ESTAMOS MANEJANDO LA PAGINACION, SE EJECUTA CADA VEZ QUE EL ESTADO DE offset CAMBIA
    useEffect(() => {
        //SI offset ES DIFERENTE A 0 SE LLAMA A LA FUNCION PARA OBTENER LOS SIGUIENTES POKEMONES DE LA LISTA UTILIZANDO offset COMO VALOR.
        if (offset !== 0) {
            fetchPkm(offset);
        }
        //AQUI ESPECIFIQUEMOS QUE ESTAMOS MONITOREANDO offset
    }, [offset]); */
        

    const handlePokemonClick = (pokemon) => {
        setSelectedPokemon(pokemon);
        /* setModVisible(true); */
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    }

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    }

    const filteredPkmInfo = pkmInfo.filter(pokemon => 
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())  
    );

    const sortedPkmInfo = [...filteredPkmInfo].sort((a,b) =>{
        if(sortOrder === "alphabetical"){
            return a.name.localeCompare(b.name);
        } else{
            return a.id - b.id;
        }
    });


    return(
        <div className="mostrando-pkm-total">
            <div className="pkm-filtros">
                <input
                    type="text"
                    placeholder="Buscar Pokémon"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select value={sortOrder} onChange={handleSortChange}>
                    <option value="index">1 - 99</option>
                    <option value="alphabetical">A - Z</option>
                </select>
            </div>
            <div className="mostrando-pkm">
                <div className="lista-pkm">
                    {sortedPkmInfo.map((pokemon, index) => (
                        <div className="caja-pkm" onClick={() => handlePokemonClick(pokemon)} key={index}>
                            <img className="pkm-img" src={pokemon.sprites.front_default} alt={pokemon.name} />
                            <div className="pkm-tittle">
                                <div className="pkm-index">#{pokemon.id}</div>
                                <h4 className="pkm-nombre"> {pokemon.name.toUpperCase()}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="msg-load">
                {loading && 
                    <div className="caja-load">
                        <img src={pikachu} alt="" width="100px"/>
                        <p>Cargando...</p>
                    </div>}
            </div>
            {selectedPokemon && (
                <DetallesPkm pokemon = {selectedPokemon} onClose = {() => setSelectedPokemon(null)} /* modVisible={modVisible} *//>
            )}
        </div>
    )
}


function DetallesPkm({ pokemon, onClose, /* modVisible */ }) {
    /* const modalClassName = `detalle-pkm ${modVisible ? 'show' : ''}`; */

    const [cambioimg, setCambioImg] = useState(false);
    const [cambioimg2, setCambioImg2] = useState(false);
    const [cambioinfo, setCambioInfo] = useState(false);
    const [cambioinfo2, setCambioInfo2] = useState(false);

    const handleCambio1 = () => {
        setCambioImg(true);
        setCambioImg2(true);
    }

    const handleCambio2 = () => {
        setCambioImg(false);
        setCambioImg2(false);
    }

    const handleCambioInfo1 = () => {
        setCambioInfo(true)
        setCambioInfo2(true)
    }

    const handleCambioInfo2 = () => {
        setCambioInfo(false)
        setCambioInfo2(false)
    }

    const statsNames = (statName) => {
        const statMap = {
            'hp': 'HP',
            'attack': 'ATK',
            'defense': 'DEF',
            'special-attack': 'SP. ATK',
            'special-defense': 'SP. DEF',
            'speed': 'SPD'
        };
        return statMap[statName] || statName.toUpperCase();
    }

    return (
        <div className="detalle-pkm">
            <span className="close" onClick={onClose}>&times;</span>
            <div className="detalle-content">
                <h2>{pokemon.name.toUpperCase()}</h2>
                <div className="tipo-pkm">
                    {pokemon.types.map((type, typeIndex) => (
                        //AQUI HAY QUE CONDICIONAR POR EL TIPO PARA CAMBIAR LOS COLORES DE TEXTO Y BACKGROUND
                        <div className={`type-${type.type.name}`} key={typeIndex}>{
                            type.type.name.toUpperCase()
                        }</div>
                    ))}
                </div>
                <div className="info-pkm">

                    {/* PARA LA IMAGEN DEL PKM NORMAL */}

                    <div className="pkm-detalle-imagen">
                        <div className={`pkm-img-normal ${cambioimg2 ? 'ocult' : ''}`}>
                            <div className="img-normal">
                                <img src={pokemon.sprites.front_default} alt={pokemon.name} width="110px"/>
                            </div>
                            <div className="pkm-cambio">
                                <div className="pkm-cambio-caja">
                                    <div className="cambio-content-1">
                                        <div className="pkm-c-label">
                                            DEFAULT
                                        </div>
                                        <div className="cambio-1">
                                            °o
                                        </div>
                                    </div>
                                    <div className="cambio-2" onClick={handleCambio1}>
                                        °o
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PARA LA IMAGEN DEL SHINY */}
                        <div className={`pkm-img-shiny ${cambioimg ? 'show' : ''}`}>
                            <div className="img-shiny">
                                <img src={pokemon.sprites.front_shiny} alt={pokemon.name} width="110px"/>
                            </div>
                            
                            <div className="pkm-cambio">
                                <div className="pkm-cambio-caja">
                                    <div className="cambio-content-1">
                                        <div className="pkm-c-label">
                                            SHINY
                                        </div>
                                        <div className="cambio-2" onClick={handleCambio2}>
                                            °o
                                        </div>
                                        <div className="cambio-1">
                                        °o
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pkm-detalle-info">
                        <div className={`pkm-info-1 ${cambioinfo2 ? 'ocult': ''}`}>
                            <div className="cambio-oculto">
                                {'<'}
                            </div>
                            <div className="content-info-1">
                                <h4>BASIC INFO</h4>
                                <div className="info-basica-1">
                                    <div className="info-height">
                                        <div className="ib-name">Height:</div>
                                        <div className="ib-value">{parseFloat(pokemon.height*0.1).toFixed(2)}m</div>
                                    </div>
                                    <div className="info-weight">
                                        <div className="ib-name">Weight:</div>
                                        <div className="ib-value">{parseFloat(pokemon.weight*0.1).toFixed(2)}kg</div>
                                    </div>    
                                </div>
                            </div>
                            
                            <div className="info-basica-1-cambio" onClick={handleCambioInfo1}>
                                {'>'}
                            </div>
                        </div>

                        <div className={`pkm-info-2 ${cambioinfo ? 'show': ''}`}>
                            <div className="info-basica-1-cambio" onClick={handleCambioInfo2}>
                                {'<'}
                            </div>
                            
                            <div className="content-info-2">
                                <h4>BASE STATS</h4>
                                <div className="info-basica-2">
                                    {pokemon.stats.map((stat, statindex) => (
                                        <div className="stats-info" key={statindex}>
                                            <div className="stat-name">{statsNames(stat.stat.name)}:</div>
                                            <div className="stat-number">{stat.base_stat}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="cambio-oculto">
                                {'>'}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

