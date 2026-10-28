// Blog (blog.html del template): categorías destacadas y listado de entradas con enlace a cada detalle.
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../../data/contenido.js';

export default function BlogPage() {
  return (
    <div className="container mt-5 pb-5">
      <h2 className="mb-4">Blogs</h2>
      <div className="row g-3">
        {BLOG_POSTS.map((post) => (
          <div className="col-md-6" key={post.slug}>
            <article className="card h-100">
              <img src={post.imagen} className="card-img-top" alt={post.titulo} style={{ maxHeight: '220px', objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{post.titulo}</h5>
                <p className="card-text">{post.resumen}</p>
                <Link to={`/blog/${post.slug}`} className="btn btn-primary mt-auto align-self-start">
                  Explorar
                </Link>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}
