import { useState } from 'react'
import { Icon } from '../../../components/SceniaUI'
import { crearPostMuro, reaccionarPost, comentarPost } from '../services/clases'

export default function MuroCurso({ clase, ejecutar }) {
  const [nuevoTitulo, setNuevoTitulo] = useState('')
  const [nuevoContenido, setNuevoContenido] = useState('')
  const [tipo, setTipo] = useState('anuncio')
  const [comentariosAbiertos, setComentariosAbiertos] = useState({})
  const [textoComentario, setTextoComentario] = useState({})
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [enviando, setEnviando] = useState(false)

  const posts = clase.posts || []

  const handleCrearPost = async (e) => {
    e.preventDefault()
    if (!nuevoContenido.trim()) return
    setEnviando(true)
    try {
      await ejecutar(async () => {
        await crearPostMuro(clase.id, {
          titulo: nuevoTitulo,
          contenido: nuevoContenido,
          tipo,
          autor: 'Prof. Carla Mendoza',
          rol: 'Docente',
        })
      })
      setNuevoTitulo('')
      setNuevoContenido('')
      setTipo('anuncio')
    } finally {
      setEnviando(false)
    }
  }

  const handleLike = (postId) => {
    ejecutar(() => reaccionarPost(clase.id, postId))
  }

  const handleComentar = async (postId, e) => {
    e.preventDefault()
    const texto = textoComentario[postId]
    if (!texto?.trim()) return
    await ejecutar(async () => {
      await comentarPost(clase.id, postId, {
        texto,
        autor: 'Prof. Carla Mendoza',
        rol: 'Docente',
      })
    })
    setTextoComentario((prev) => ({ ...prev, [postId]: '' }))
  }

  const toggleComentarios = (postId) => {
    setComentariosAbiertos((prev) => ({ ...prev, [postId]: !prev[postId] }))
  }

  const postsFiltrados = posts.filter((p) => {
    if (filtroTipo === 'todos') return true
    return p.tipo === filtroTipo
  })

  const BADGES_TIPO = {
    anuncio: { label: '📢 Anuncio', color: 'badge-anuncio' },
    reflexion: { label: '💡 Pregunta / Reflexión', color: 'badge-reflexion' },
    salida: { label: '🎭 Salida al Teatro', color: 'badge-salida' },
    recurso: { label: '📚 Recurso Didáctico', color: 'badge-recurso' },
  }

  return (
    <div className="dc-muro-container">
      {/* Caja de publicación estilo Classroom */}
      <section className="dc-card-muro dc-composer">
        <div className="dc-composer-header">
          <div className="dc-avatar-circle">CM</div>
          <div className="dc-composer-title">
            <strong>Compartir con la clase ({clase.grade} {clase.section})</strong>
            <span>Publica anuncios, preguntas de debate o indicaciones para la obra teatral</span>
          </div>
        </div>

        <form onSubmit={handleCrearPost} className="dc-composer-form">
          <div className="dc-composer-controls">
            <label className="dc-input-label">Tipo de publicación:</label>
            <div className="dc-pill-selector">
              {['anuncio', 'reflexion', 'salida', 'recurso'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`dc-pill-btn ${tipo === t ? 'active' : ''}`}
                  onClick={() => setTipo(t)}
                >
                  {BADGES_TIPO[t].label}
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            className="dc-input-muro"
            placeholder="Título del aviso o pregunta (opcional)..."
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.target.value)}
          />

          <textarea
            className="dc-textarea-muro"
            rows={3}
            placeholder={`Escribe aquí lo que deseas comunicar a ${clase.grade} ${clase.section}...`}
            value={nuevoContenido}
            onChange={(e) => setNuevoContenido(e.target.value)}
            required
          />

          <div className="dc-composer-actions">
            <span className="dc-composer-hint">Visible para todos los estudiantes matriculados</span>
            <button type="submit" className="dc-btn primary" disabled={enviando || !nuevoContenido.trim()}>
              {enviando ? 'Publicando...' : 'Publicar en el Muro'}
            </button>
          </div>
        </form>
      </section>

      {/* Barra de Filtros */}
      <div className="dc-muro-filter-bar">
        <span className="dc-filter-label">Filtrar publicaciones:</span>
        <div className="dc-filter-pills">
          {[
            ['todos', 'Todas'],
            ['anuncio', 'Anuncios'],
            ['reflexion', 'Reflexiones'],
            ['salida', 'Salidas Teatrales'],
            ['recurso', 'Recursos'],
          ].map(([val, txt]) => (
            <button
              key={val}
              type="button"
              className={`dc-filter-pill ${filtroTipo === val ? 'selected' : ''}`}
              onClick={() => setFiltroTipo(val)}
            >
              {txt}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Publicaciones */}
      {postsFiltrados.length === 0 ? (
        <div className="dc-empty-muro">
          <Icon name="spark" size={32} />
          <h3>No hay publicaciones aún en este filtro</h3>
          <p>Escribe tu primer mensaje en el muro para iniciar el diálogo con el aula.</p>
        </div>
      ) : (
        <div className="dc-feed-list">
          {postsFiltrados.map((post) => {
            const badge = BADGES_TIPO[post.tipo] || BADGES_TIPO.anuncio
            const numComentarios = (post.comentarios || []).length
            const abiertos = comentariosAbiertos[post.id]

            return (
              <article key={post.id} className="dc-card-muro dc-post-card">
                <header className="dc-post-header">
                  <div className="dc-post-author-box">
                    <div className="dc-avatar-circle">{post.avatar || 'CM'}</div>
                    <div>
                      <div className="dc-author-name">
                        <strong>{post.autor}</strong>
                        <span className="dc-author-role">{post.rol}</span>
                      </div>
                      <span className="dc-post-date">{post.fecha}</span>
                    </div>
                  </div>
                  <span className={`dc-type-badge ${badge.color}`}>{badge.label}</span>
                </header>

                <div className="dc-post-body">
                  {post.titulo && <h4 className="dc-post-title">{post.titulo}</h4>}
                  <p className="dc-post-content">{post.contenido}</p>
                </div>

                <footer className="dc-post-footer">
                  <div className="dc-post-stats">
                    <button
                      type="button"
                      className="dc-interaction-btn"
                      onClick={() => handleLike(post.id)}
                      title="Dar me gusta"
                    >
                      <span className="dc-heart-icon">❤️</span> {post.likes || 0} Me gusta
                    </button>

                    <button
                      type="button"
                      className="dc-interaction-btn"
                      onClick={() => toggleComentarios(post.id)}
                    >
                      <Icon name="mic" size={16} /> {numComentarios} comentarios
                    </button>
                  </div>

                  {/* Sección de Comentarios */}
                  {abiertos && (
                    <div className="dc-comments-section">
                      <div className="dc-comments-list">
                        {(post.comentarios || []).map((com) => (
                          <div key={com.id} className="dc-comment-item">
                            <div className="dc-comment-avatar">
                              {com.autor
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')}
                            </div>
                            <div className="dc-comment-bubble">
                              <div className="dc-comment-meta">
                                <strong>{com.autor}</strong>
                                <span className="dc-comment-role">({com.rol})</span>
                                <small>{com.fecha}</small>
                              </div>
                              <p className="dc-comment-text">{com.texto}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Formulario de Respuesta Rápida */}
                      <form
                        onSubmit={(e) => handleComentar(post.id, e)}
                        className="dc-comment-form"
                      >
                        <input
                          type="text"
                          className="dc-comment-input"
                          placeholder="Escribe una respuesta pedagógica o comentario..."
                          value={textoComentario[post.id] || ''}
                          onChange={(e) =>
                            setTextoComentario({ ...textoComentario, [post.id]: e.target.value })
                          }
                        />
                        <button type="submit" className="dc-btn primary small">
                          Responder
                        </button>
                      </form>
                    </div>
                  )}
                </footer>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
