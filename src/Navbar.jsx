import React, {useState, useEffect} from "react";
import pokeball from './assets/pokeball.png'
import menu from './assets/menu.png'
import './Navbar.css'

export function NavbarIndex(){

    const [menuDesplegable, setMenuDesplegable] = useState(false);

    const menuActivo = () =>{
        if(menuDesplegable == false){
            setMenuDesplegable(true)
        }else{
            setMenuDesplegable(false)
        }   
    }
    

    

    return(
        <nav className="nav-principal">
            <div className="n-logo">
                <a href="./"><img src={pokeball} alt="" width="50px"/></a>
            </div>
            <div className={`np-1 ${menuDesplegable ? 'menu' : ''}`}>
                <ul>
                    <li>
                        <a href="./">INICIO</a>
                    </li>
                    <li>
                        <a href="./Pokemon">POKEMON</a>
                    </li>
                    <li>
                        <a href="./Pokedex">POKEDEX</a>
                    </li>
                    <li>
                        <a href="./Habilidades">HABILIDADES</a>
                    </li>
                </ul>
            </div>
            <div className="menu-desplegable" onClick={menuActivo}>
                <img src={menu} alt="" width="50px"/>
            </div>
        </nav>
    )
}