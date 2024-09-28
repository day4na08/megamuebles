import React from 'react';
import '../../css/filtros.css';

function Filtros({ filtros, setFiltros }) {
  const handleChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  const estilos = ["", "Contemporáneo", "Rústico", "Moderno"];
  const telas = ["", "Cuero", "Telabonita", "Lino"];
  const acabados = ["", "Cuero", "Aceite", "Liso", "Transparente", "Mate", "Brillante"];
  const colores = ["", "Negro", "Madera", "Blanco", "Azul Marino", "Marrón"];
  const tapizMateriales = ["", "Cuero", "Tela"];
  const materialesInternos = ["", "Triplex", "Contrachapado", "Espuma", "Metal"];

  return (
    <div className="filtros-container">
      <h3>Filtros de Búsqueda</h3>

      <label>
        <span>Categoría: </span>
        <select name="categoria" value={filtros.categoria} onChange={handleChange}>
          <option value="">Todas</option>
          <option value="mueble">Mueble</option>
        </select>
      </label>

      <label>
        <span>Estilo: </span>
        <select name="estilo" value={filtros.estilo} onChange={handleChange}>
          {estilos.map(estilo => (
            <option key={estilo} value={estilo}>{estilo}</option>
          ))}
        </select>
      </label>

      <label>
        <span>Tela: </span>
        <select name="tela" value={filtros.tela} onChange={handleChange}>
          {telas.map(tela => (
            <option key={tela} value={tela}>{tela}</option>
          ))}
        </select>
      </label>

      <label>
        <span>Acabado: </span>
        <select name="acabado" value={filtros.acabado} onChange={handleChange}>
          {acabados.map(acabado => (
            <option key={acabado} value={acabado}>{acabado}</option>
          ))}
        </select>
      </label>

      <label>
        <span>Color: </span>
        <select name="color" value={filtros.color} onChange={handleChange}>
          {colores.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
      </label>

      <label>
        <span>Precio Min: </span>
        <input
          type="number"
          name="minPrecio"
          value={filtros.minPrecio}
          onChange={handleChange}
        />
      </label>

      <label>
        <span>Precio Max:</span>
        <input
          type="number"
          name="maxPrecio"
          value={filtros.maxPrecio}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}

export default Filtros;
