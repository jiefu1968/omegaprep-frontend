'use client'
import { useState, useRef, useEffect } from 'react'
import { GRUPOS, CORES } from '../data/vestibulares'
import { useRouter } from 'next/navigation'
import MarkdownResposta from '@/components/MarkdownResposta'

const API = 'http://localhost:8000'

const COR_GRUPO = {
  aeronautica:   '#378ADD',
  exercito:      '#639922',
  marinha:       '#1D9E75',
  federais:      '#BA7517',
  estaduais:     '#D85A30',
  vestibulinhos: '#D4537E',
  particulares:  '#7F77DD',
}

function semAcento(texto) {
  return texto.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
}

function altCorreta(alt, gabarito) {
  if (!gabarito) return false
  const g = gabarito.trim().toUpperCase()
  const a = alt.trim().toUpperCase()
  return a.startsWith(g + ')') || a.startsWith(g + '.') || a.startsWith(g + ' ') || a === g
}

function getCorGrupo(sigla) {
  for (const g of GRUPOS) {
    if (g.instituicoes.find(i => i.sigla === sigla)) return COR_GRUPO[g.id] || '#1D9E75'
  }
  return '#1D9E75'
}

export default function Questoes() {
  const router = useRouter()
  const textoRef = useRef('')
  const [inst, setInst] = useState(null)
  const [disc, setDisc] = useState(null)
  const [ano, setAno] = useState(null)
  const [fase, setFase] = useState(1)
  const [questoes, setQuestoes] = useState([])
  const [questaoAtual, setQuestaoAtual] = useState(null)
  const [resposta, setResposta] = useState('')
  const [loading, setLoading] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [anosDisponiveis, setAnosDisponiveis] = useState([])
  const [gaboritosVisiveis, setGaboritosVisiveis] = useState({})

  useEffect(() => {
    if (!inst || !disc) return
    setCarregando(true); setAno(null); setQuestoes([]); setQuestaoAtual(null); setResposta('')
    fetch(`${API}/questoes/?escola=${inst.sigla}&disciplina=${semAcento(disc)}`)
      .then(r => r.json())
      .then(data => {
        setAnosDisponiveis([...new Set(data.map(q => q.ano))].sort((a,b) => b - a))
        setCarregando(false)
      }).catch(() => setCarregando(false))
  }, [inst, disc])

  useEffect(() => {
    if (!inst || !disc || !ano) return
    setCarregando(true); setQuestaoAtual(null); setResposta('')
    fetch(`${API}/questoes/?escola=${inst.sigla}&disciplina=${semAcento(disc)}&ano=${ano}`)
      .then(r => r.json())
      .then(data => {
        setQuestoes(data.filter(q => Number(q.fase) === Number(fase)))
        setGaboritosVisiveis({})
        setCarregando(false)
      }).catch(() => setCarregando(false))
  }, [inst, disc, ano, fase])

  function toggleGabarito(id) {
    setGaboritosVisiveis(prev => ({ ...prev, [id]: !prev[id] }))
  }

  async function resolverQuestao(questao) {
    setQuestaoAtual(questao); setResposta(''); textoRef.current = ''; setLoading(true)
    const alts = (() => { try { return JSON.parse(questao.alternativas || '[]') } catch { return [] } })()
    const pergunta = `Resolva esta questão do ${inst.sigla} ${questao.ano} de ${disc}:\nQuestão ${questao.numero}:\n${questao.enunciado}\n${alts.join('\n')}\nSiga a estrutura de 9 seções.`
    try {
      const res = await fetch(`${API}/questoes/agente/stream`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modo:'questoes', pergunta, escola:inst.sigla, disciplina:semAcento(disc), nivel:'dificil', quantidade:1, gabarito:questao.gabarito||'' })
      })
      const reader = res.body.getReader(); const decoder = new TextDecoder(); let buf = ''
      while (true) {
        const { done, value } = await reader.read(); if (done) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n'); buf = lines.pop()
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const d = line.slice(6); if (d === '[DONE]') break
          textoRef.current += d === '' ? '\n' : d
          setResposta(textoRef.current)
        }
      }
    } catch { setResposta('Erro ao conectar com o servidor.') }
    finally { setLoading(false) }
  }

  const cor = inst ? getCorGrupo(inst.sigla) : '#1D9E75'
  const corLight = cor + '15'

  return (
    <main style={{minHeight:'100vh', background:'#F7F8FA', fontFamily:"'DM Sans', system-ui, sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        .op-nav { display:flex; align-items:center; justify-content:space-between; padding:14px 24px; background:white; border-bottom:1px solid #EAEBEC; position:sticky; top:0; z-index:10; }
        .op-logo { font-family:'Sora',sans-serif; font-size:18px; font-weight:700; color:#1D9E75; letter-spacing:-0.5px; cursor:pointer; }
        .op-logo span { color:#1a1a2e; }
        .op-back { font-size:13px; color:#9CA3AF; cursor:pointer; display:flex; align-items:center; gap:6px; }
        .op-back:hover { color:#1D9E75; }
        .op-body { max-width:720px; margin:0 auto; padding:24px 16px 48px; }
        .op-page-title { font-family:'Sora',sans-serif; font-size:22px; font-weight:700; color:#1a1a2e; margin-bottom:4px; letter-spacing:-0.3px; }
        .op-page-sub { font-size:13px; color:#9CA3AF; margin-bottom:24px; }
        .op-card { background:white; border:1px solid #EAEBEC; border-radius:16px; padding:20px; margin-bottom:16px; }
        .op-section-label { font-size:10px; font-weight:500; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:10px; }
        .op-group-label { font-size:11px; color:#C4C9D4; margin-bottom:6px; margin-top:12px; }
        .op-group-label:first-child { margin-top:0; }
        .op-pills { display:flex; flex-wrap:wrap; gap:6px; }
        .op-pill { font-size:12px; padding:6px 14px; border-radius:20px; border:1px solid #EAEBEC; background:white; cursor:pointer; font-weight:500; transition:all 0.12s; color:#6B7280; font-family:inherit; }
        .op-pill:hover { border-color:#5DCAA5; color:#0F6E56; }
        .op-divider { height:1px; background:#F3F4F6; margin:16px 0; }
        .op-q-count { font-size:13px; color:#9CA3AF; margin-bottom:16px; }
        .op-q-count strong { color:#1a1a2e; font-weight:500; }
        .op-q-item { border:1px solid #EAEBEC; border-radius:12px; margin-bottom:10px; overflow:hidden; transition:border-color 0.15s; }
        .op-q-item:hover { border-color:#C5E8DC; }
        .op-q-item.ativa { border-color:#1D9E75; }
        .op-q-top { display:flex; align-items:flex-start; gap:12px; padding:14px 16px; cursor:pointer; background:white; transition:background 0.12s; }
        .op-q-top:hover { background:#FAFFFE; }
        .op-q-item.ativa .op-q-top { background:#F0FBF7; }
        .op-q-num { min-width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:600; font-family:'Sora',sans-serif; flex-shrink:0; background:#F3F4F6; color:#9CA3AF; }
        .op-q-item.ativa .op-q-num { background:#1D9E75; color:white; }
        .op-q-enunciado { flex:1; font-size:13px; line-height:1.7; color:#374151; }
        .op-q-arrow { color:#D1D5DB; font-size:16px; flex-shrink:0; margin-top:6px; transition:color 0.12s; }
        .op-q-item.ativa .op-q-arrow { color:#1D9E75; }
        .op-alts { display:grid; grid-template-columns:1fr 1fr; gap:6px; padding:0 16px 14px; }
        .op-alt { font-size:12px; padding:8px 12px; border:1px solid #EAEBEC; border-radius:8px; background:#FAFAFA; cursor:pointer; transition:all 0.12s; line-height:1.5; }
        .op-alt { cursor:default; }
        .op-alt.correta { background:#E1F5EE; border-color:#1D9E75; color:#065F46; font-weight:500; }
        .op-gab-bar { padding:10px 16px; border-top:1px solid #F3F4F6; display:flex; align-items:center; gap:10px; background:white; }
        .op-gab-btn { font-size:11px; padding:5px 14px; border-radius:20px; border:1px solid #E5E7EB; background:white; color:#6B7280; cursor:pointer; font-weight:500; font-family:inherit; transition:all 0.12s; }
        .op-gab-btn:hover { border-color:#1D9E75; color:#0F6E56; }
        .op-gab-btn.vis { background:#1D9E75; color:white; border-color:#1D9E75; }
        .op-gab-hint { font-size:11px; color:#C4C9D4; }
        .op-resolve-wrap { margin:0 16px 16px; }
        .op-resolve-btn { display:flex; align-items:center; gap:8px; background:#1D9E75; color:white; border:none; border-radius:10px; padding:10px 18px; font-size:13px; font-family:inherit; cursor:pointer; font-weight:500; margin-bottom:14px; transition:background 0.12s; }
        .op-resolve-btn:hover { background:#0F6E56; }
        .op-loading { padding:24px; text-align:center; }
        .op-loading-dot { width:8px; height:8px; border-radius:50%; background:#1D9E75; display:inline-block; animation:pulse 1.2s infinite; margin:0 3px; }
        .op-loading-dot:nth-child(2) { animation-delay:0.2s; }
        .op-loading-dot:nth-child(3) { animation-delay:0.4s; }
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        .op-resposta-wrap { background:#FAFFFE; border-top:1px solid #E1F5EE; border-radius:0 0 10px 10px; padding:16px; }
        .op-resposta-header { display:flex; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap; }
        .op-ai-badge { width:24px; height:24px; border-radius:8px; background:#E1F5EE; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:600; color:#0F6E56; }
        .op-resposta-label { font-size:11px; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.06em; }
        .op-gab-tag { font-size:11px; background:#E1F5EE; color:#065F46; padding:3px 10px; border-radius:20px; font-weight:500; }
        .op-stream-dot { width:6px; height:6px; border-radius:50%; background:#1D9E75; display:inline-block; animation:pulse 1s infinite; margin-left:6px; }
        .op-empty { text-align:center; padding:40px 20px; color:#9CA3AF; font-size:13px; }
        @media(max-width:600px) {
          .op-alts { grid-template-columns:1fr; }
          .op-body { padding:16px 12px 48px; }
        }
      `}</style>

      <nav className="op-nav">
        <div className="op-logo" onClick={() => router.push('/')}>Omega<span>Prep</span></div>
        <span className="op-back" onClick={() => router.push('/')}>← Voltar</span>
      </nav>

      <div className="op-body">
        <div className="op-page-title">Questões de provas anteriores</div>
        <div className="op-page-sub">Questões reais com resolução didática e gabarito oficial</div>

        <div className="op-card">
          <div className="op-section-label">Instituição</div>
          {GRUPOS.map(g => (
            <div key={g.id}>
              <div className="op-group-label">{g.nome}</div>
              <div className="op-pills">
                {g.instituicoes.map(i => (
                  <button key={i.sigla}
                    onClick={() => { setInst(i); setDisc(null); setAno(null); setQuestoes([]); setQuestaoAtual(null); setResposta(''); setAnosDisponiveis([]) }}
                    className="op-pill"
                    style={inst?.sigla === i.sigla ? {background: getCorGrupo(i.sigla)+'15', borderColor: getCorGrupo(i.sigla), color: getCorGrupo(i.sigla), fontWeight:600} : {}}>
                    {i.sigla}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {inst && (<>
            <div className="op-divider" />
            <div className="op-section-label">Disciplina</div>
            <div className="op-pills">
              {inst.discs.map(d => (
                <button key={d}
                  onClick={() => { setDisc(d); setAno(null); setQuestoes([]); setQuestaoAtual(null); setResposta('') }}
                  className="op-pill"
                  style={disc === d ? {background: cor+'15', borderColor: cor, color: cor, fontWeight:600} : {}}>
                  {d}
                </button>
              ))}
            </div>
          </>)}

          {inst?.fases === 2 && disc && (<>
            <div className="op-divider" />
            <div className="op-section-label">Fase</div>
            <div className="op-pills">
              {[1,2].map(f => (
                <button key={f} onClick={() => setFase(f)} className="op-pill"
                  style={fase === f ? {background: cor+'15', borderColor: cor, color: cor, fontWeight:600} : {}}>
                  {f}ª fase
                </button>
              ))}
            </div>
          </>)}

          {disc && (<>
            <div className="op-divider" />
            <div className="op-section-label">
              Ano {carregando && <span style={{color:'#C4C9D4', fontWeight:400, textTransform:'none', letterSpacing:0}}>carregando...</span>}
            </div>
            {anosDisponiveis.length > 0 ? (
              <div className="op-pills">
                {anosDisponiveis.map(a => (
                  <button key={a} onClick={() => setAno(a)} className="op-pill"
                    style={ano === a ? {background: cor+'15', borderColor: cor, color: cor, fontWeight:600} : {}}>
                    {a}
                  </button>
                ))}
              </div>
            ) : !carregando && (
              <p style={{fontSize:13, color:'#C4C9D4', fontStyle:'italic'}}>
                Nenhuma questão encontrada para {inst?.sigla} — {disc}
              </p>
            )}
          </>)}
        </div>

        {questoes.length > 0 && (
          <div>
            <div className="op-q-count">
              <strong>{questoes.length} questões</strong> — {inst?.sigla} {ano} · {disc}{inst?.fases === 2 ? ` · ${fase}ª fase` : ''}
            </div>
            {questoes.map((q, i) => {
              const alts = (() => { try { return JSON.parse(q.alternativas || '[]') } catch { return [] } })()
              const ativa = questaoAtual?.id === q.id
              const gabVis = gaboritosVisiveis[q.id]
              return (
                <div key={q.id} className={`op-q-item${ativa ? ' ativa' : ''}`}>
                  <div className="op-q-top"
                    onClick={() => { if (ativa) { setQuestaoAtual(null); setResposta('') } else { resolverQuestao(q) } }}>
                    <div className="op-q-num">Q{q.numero || i+1}</div>
                    <div className="op-q-enunciado">
                      <MarkdownResposta texto={q.enunciado} loading={false} />
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); resolverQuestao(q) }}
                      style={{
                        background: ativa ? '#1D9E75' : '#F0FBF7',
                        border: '1px solid ' + (ativa ? '#1D9E75' : '#C5E8DC'),
                        borderRadius:8, padding:'5px 12px', fontSize:11,
                        color: ativa ? 'white' : '#0F6E56', cursor:'pointer',
                        fontWeight:500, fontFamily:'inherit', flexShrink:0,
                        whiteSpace:'nowrap', transition:'all 0.12s'
                      }}>
                      {ativa ? '▲ fechar' : '✦ IA'}
                    </button>
                  </div>

                  {alts.length > 0 && (
                    <div className="op-alts">
                      {alts.map((alt, ai) => (
                        <div key={ai} className={`op-alt${gabVis && altCorreta(alt, q.gabarito) ? ' correta' : ''}`}>
                          <MarkdownResposta texto={alt} loading={false} />
                        </div>
                      ))}
                    </div>
                  )}

                  {q.gabarito && (
                    <div className="op-gab-bar">
                      <button className={`op-gab-btn${gabVis ? ' vis' : ''}`}
                        onClick={() => toggleGabarito(q.id)}>
                        {gabVis ? `✓ Gabarito: ${q.gabarito}` : 'Ver gabarito'}
                      </button>
                    </div>
                  )}

                  {ativa && loading && !resposta && (
                    <div className="op-loading">
                      <div className="op-loading-dot" /><div className="op-loading-dot" /><div className="op-loading-dot" />
                      <p style={{fontSize:12, color:'#9CA3AF', marginTop:10}}>Resolvendo e validando com gabarito oficial...</p>
                    </div>
                  )}

                  {ativa && resposta && (
                    <div className="op-resposta-wrap">
                      <div className="op-resposta-header">
                        <div className="op-ai-badge">AI</div>
                        <span className="op-resposta-label">Resolução · {inst?.sigla} {ano} · Q{q.numero || i+1}</span>
                        {q.gabarito && <span className="op-gab-tag">Gabarito: {q.gabarito}</span>}
                        {loading && <span className="op-stream-dot" />}
                      </div>
                      <MarkdownResposta texto={resposta} loading={loading} />
                    </div>
                  )}


                </div>
              )
            })}
          </div>
        )}

        {ano && questoes.length === 0 && !carregando && (
          <div className="op-empty">
            Nenhuma questão para {inst?.sigla} {ano} · {disc}{inst?.fases === 2 ? ` · ${fase}ª fase` : ''}
          </div>
        )}
      </div>
    </main>
  )
}
