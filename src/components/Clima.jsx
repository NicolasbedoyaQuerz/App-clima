import React, { useState, useEffect } from 'react';

const Clima = () => {

  const iconos = [
    {
      id: 1,
      src: `/assets/icono1.svg`
    },
    {
      id: 2,
      src: `/assets/icono2.svg`
    },
    {
      id: 3,
      src: `/assets/icono3.svg`
    },
    {
      id: 4,
      src: `/assets/icono4.svg`
    },
    {
      id: 5,  
      src: `/assets/icono5.svg`
    },
    {
      id: 6,
      src: `/assets/icono6.svg`
    },
    {
      id: 7,
      src: `/assets/icono7.svg`
    },
    {
      id: 8,
      src: `/assets/icono8.svg`
    },
    {
      id: 9,
      src: `/assets/icono9.svg`
    },
  ];

  const [temperatura, setTemperatura] = useState(0);
  const [unidad, setUnidad] = useState('Celsius');
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [icono, setIcono] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const API_KEY = '1d86643d26a1f0b2d0c72e72d1a20668';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${busqueda}&appid=${API_KEY}`;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetch(`${url}&lat=${latitude}&lon=${longitude}`)
        .then((response) => response.json())
        .then((data) => {
          setCiudad(data.name);
          setPais(data.sys.country);
          setDescripcion(data.weather[0].description);
          setTemperatura(data.main.temp - 273.15); // Convertir de Kelvin a Celsius
          const iconCode = parseInt(data.weather[0].icon, 9);
          const iconObj = iconos.find(icon => icon.id === iconCode);
          if (iconObj) {
            setIcono(iconObj.src);
          }
        });
    });
  }, [url]);

  const handleUnidadCambio = () => {
    if (unidad === 'Celsius') {
      setUnidad('Fahrenheit');
      setTemperatura((temperatura * 9) / 5 + 32); // Convertir de Celsius a Fahrenheit
    } else {
      setUnidad('Celsius');
      setTemperatura((temperatura - 32) * (5 / 9)); // Convertir de Fahrenheit a Celsius
    }
  };

  const handleBusquedaCambio = (event) => {
    setBusqueda(event.target.value);
  };

  const handleBusquedaSubmit = (event) => {
    event.preventDefault();
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCiudad(data.name);
        setPais(data.sys.country);
        setDescripcion(data.weather[0].description);
        setTemperatura(data.main.temp - 273.15); // Convertir de Kelvin a Celsius
        const iconCode = data.weather[0].icon;
        const iconObj = iconos.find(icon => icon.id === iconCode);
        if (iconObj) {
          setIcono(iconObj.src);
        }
      });
  };

  return (
    <div>
        <div className='contenedor'>
         <h1 className='title'>Weather app</h1>
        <form onSubmit={handleBusquedaSubmit}>
        <input type="text" value={busqueda} onChange={handleBusquedaCambio} placeholder="Buscar país" className='barra-de-busqueda'/>
      </form>
      </div>
      <button className='cambiar-grados' onClick={handleUnidadCambio}>Cambiar a {unidad === 'Celsius' ? 'F°' : 'C°'}</button>
      <div className='clima-card'>
      {icono && <img src={icono} alt="Icono del clima" />}
      <h1 className='grados-temp'>{temperatura.toFixed(2)}° <span>{unidad}</span></h1>
      <h3 className='grados-ciudad'>{ciudad}, {pais}</h3>
      <h3 className='grados-descrip'>{descripcion}</h3>
      </div>
    </div>
  );
};

export default Clima;
