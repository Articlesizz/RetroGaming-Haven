// Detalle de una entrada de blog (blog-items.html del template), ruta /blog/:slug.
import { Link, useParams } from 'react-router-dom';
import { BLOG_POSTS, EQUIPO } from '../../data/contenido.js';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((item) => item.slug === slug);

  if (!post) {
    return (
      <div className="container mt-5">
        <EmptyState title="Entrada no encontrada" actionLabel="Volver al blog" actionTo="/blog" />
      </div>
    );
  }

  return (
    <div className="container mt-5 pb-5">
      <p className="small mb-2">
        <Link to="/blog">← Blogs</Link>
      </p>
      <div className="card">
        <img src={post.imagen} className="card-img-top" alt={post.titulo} style={{ maxHeight: '320px', objectFit: 'cover' }} />
        <div className="card-body">
          <h4 className="card-title text-center mb-3">🎮 {post.titulo}</h4>
          {post.secciones.map((section) => (
            <div key={section.titulo} className="mb-4">
              <h4 className="mb-2 text-muted">{section.titulo}</h4>
              <p className="card-text">{section.texto}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="row text-center mt-4 g-4">
        {EQUIPO.map((member) => (
          <div className="col-lg-4" key={member.nombre}>
            <img src={member.imagen} alt={`Foto de ${member.nombre}`} className="rounded-circle" width="140" height="140" style={{ objectFit: 'cover' }} />
            <h2 className="fw-normal mt-2">{member.nombre}</h2>
            <p>{member.rol}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
