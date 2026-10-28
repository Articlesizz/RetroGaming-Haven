// Nosotros (nosotros.html del template): banner, historia, misión, visión, innovación y equipo.
import { EQUIPO, NOSOTROS_SECCIONES } from '../../data/contenido.js';

export default function AboutPage() {
  return (
    <div className="container mt-5 pb-5">
      <div className="card">
        <img src="/imagenes/banners/banner2.png" className="card-img-top" alt="Videojuegos Retro" style={{ maxHeight: '320px', objectFit: 'cover' }} />
        <div className="card-body">
          <h4 className="card-title text-center mb-3">🎮 Historia de RetroGaming Haven</h4>
          {NOSOTROS_SECCIONES.map((section) => (
            <div key={section.titulo} className="mb-4">
              <h4 className="mb-2 text-muted">{section.titulo}</h4>
              <p className="card-text">{section.texto}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="row text-center mt-5 g-4">
        {EQUIPO.map((member) => (
          <div className="col-lg-4" key={member.nombre}>
            <img src={member.imagen} alt={`Foto de ${member.nombre}`} className="bd-placeholder-img rounded-circle" width="140" height="140" style={{ objectFit: 'cover' }} />
            <h2 className="fw-normal mt-2">{member.nombre}</h2>
            <p className="mb-1">
              <strong>{member.rol}</strong>
            </p>
            <p>{member.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
