'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GRUPOS, CORES } from './data/vestibulares'

const STATS = [
  { n: '2.600+', l: 'questões' },
  { n: '15', l: 'vestibulares' },
  { n: '2008–25', l: 'anos cobertos' },
]

const MODULOS = [
  { href: '/questoes',  emoji: '📋', label: 'Questões',    desc: 'Provas anteriores' },
  { href: '/simulados', emoji: '🎯', label: 'Simulados',   desc: 'Prova completa' },
  { href: '/revisao',   emoji: '📚', label: 'Revisão',     desc: 'Por tópico' },
  { href: '/gpt',       emoji: '🤖', label: 'OmegaGPT',   desc: 'Chat livre' },
]

const COR_GRUPO = {
  aeronautica: '#378ADD',
  exercito:    '#639922',
  marinha:     '#1D9E75',
  federais:    '#BA7517',
  estaduais:   '#D85A30',
  vestibulinhos: '#D4537E',
  particulares: '#7F77DD',
}

export default function Home() {
  const router = useRouter()
  const [busca, setBusca] = useState('')
  const [grupoAberto, setGrupoAberto] = useState(null)

  const filtrados = GRUPOS.map(g => ({
    ...g,
    instituicoes: g.instituicoes.filter(i =>
      busca === '' ||
      i.sigla.toLowerCase().includes(busca.toLowerCase()) ||
      i.nome.toLowerCase().includes(busca.toLowerCase())
    )
  })).filter(g => busca === '' || g.instituicoes.length > 0)

  return (
    <main style={{minHeight:'100vh', background:'#F7F8FA', fontFamily:"'DM Sans', system-ui, sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        .op-nav { display:flex; align-items:center; justify-content:space-between; padding:16px 24px; background:white; border-bottom:1px solid #EAEBEC; position:sticky; top:0; z-index:10; }
        .op-logo { font-family:'Sora',sans-serif; font-size:20px; font-weight:700; color:#1D9E75; letter-spacing:-0.5px; }
        .op-logo span { color:#1a1a2e; }
        .op-nav-links { display:flex; gap:24px; }
        .op-nav-link { font-size:13px; color:#6B7280; cursor:pointer; text-decoration:none; }
        .op-nav-link:hover { color:#1D9E75; }
        .op-nav-btn { background:#1D9E75; color:white; border:none; border-radius:8px; padding:8px 18px; font-size:13px; font-family:inherit; cursor:pointer; font-weight:500; }
        .op-nav-btn:hover { background:#0F6E56; }
        .op-hero { text-align:center; padding:40px 24px 32px; }
        .op-badge { display:inline-block; background:#E1F5EE; color:#0F6E56; font-size:12px; font-weight:500; padding:5px 14px; border-radius:20px; margin-bottom:18px; }
        .op-title { font-family:'Sora',sans-serif; font-size:32px; font-weight:700; line-height:1.2; margin:0 0 14px; letter-spacing:-0.8px; color:#1a1a2e; }
        .op-title em { color:#1D9E75; font-style:normal; }
        .op-sub { font-size:15px; color:#6B7280; max-width:440px; margin:0 auto 28px; line-height:1.7; }
        .op-stats { display:flex; justify-content:center; gap:40px; margin-bottom:36px; }
        .op-stat-n { font-family:'Sora',sans-serif; font-size:24px; font-weight:700; color:#1D9E75; }
        .op-stat-l { font-size:12px; color:#9CA3AF; margin-top:2px; }
        .op-modules { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; max-width:640px; margin:0 auto 32px; }
        .op-module { background:white; border:1px solid #EAEBEC; border-radius:14px; padding:16px 12px; text-align:center; cursor:pointer; transition:all 0.15s; }
        .op-module:hover { border-color:#1D9E75; box-shadow:0 2px 12px rgba(29,158,117,0.1); transform:translateY(-1px); }
        .op-module-icon { font-size:22px; margin-bottom:8px; }
        .op-module-name { font-size:13px; font-weight:500; color:#1a1a2e; }
        .op-module-desc { font-size:11px; color:#9CA3AF; margin-top:3px; }
        .op-content { max-width:680px; margin:0 auto; padding:0 16px 48px; }
        .op-search { display:flex; align-items:center; gap:10px; background:white; border:1px solid #EAEBEC; border-radius:12px; padding:11px 16px; margin-bottom:24px; box-shadow:0 1px 4px rgba(0,0,0,0.04); }
        .op-search:focus-within { border-color:#1D9E75; }
        .op-search-icon { color:#9CA3AF; font-size:16px; }
        .op-search input { border:none; background:transparent; font-family:inherit; font-size:14px; color:#1a1a2e; outline:none; flex:1; }
        .op-group { margin-bottom:20px; }
        .op-group-header { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
        .op-group-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
        .op-group-name { font-size:11px; font-weight:500; color:#9CA3AF; text-transform:uppercase; letter-spacing:0.07em; }
        .op-inst-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
        .op-inst-card { background:white; border:1px solid #EAEBEC; border-radius:12px; padding:14px 16px; cursor:pointer; transition:all 0.15s; }
        .op-inst-card:hover { border-color:#5DCAA5; box-shadow:0 2px 8px rgba(29,158,117,0.08); }
        .op-inst-sigla { font-family:'Sora',sans-serif; font-size:15px; font-weight:700; margin-bottom:3px; }
        .op-inst-nome { font-size:11px; color:#9CA3AF; margin-bottom:8px; line-height:1.4; }
        .op-inst-pills { display:flex; flex-wrap:wrap; gap:4px; }
        .op-inst-pill { font-size:10px; padding:3px 8px; border-radius:20px; font-weight:500; }
        .op-fases { font-size:10px; background:#FEF3C7; color:#92400E; padding:2px 7px; border-radius:10px; font-weight:500; margin-left:6px; }
        @media (max-width:600px) {
          .op-modules { grid-template-columns:repeat(2,1fr); }
          .op-inst-grid { grid-template-columns:1fr; }
          .op-title { font-size:24px; }
          .op-stats { gap:24px; }
          .op-nav-links { display:none; }
        }
      `}</style>

      <nav className="op-nav">
        <div className="op-logo">Omega<span>Prep</span></div>
        <div className="op-nav-links">
          <a className="op-nav-link" onClick={() => router.push('/questoes')}>Questões</a>
          <a className="op-nav-link" onClick={() => router.push('/simulados')}>Simulados</a>
          <a className="op-nav-link" onClick={() => router.push('/revisao')}>Revisão</a>
        </div>
        <button className="op-nav-btn">Entrar</button>
      </nav>

      <div className="op-hero">
        <div className="op-badge">IA didática para vestibulares</div>
        <h1 className="op-title">
          Aprovação nos<br/><em>melhores vestibulares</em><br/>do Brasil
        </h1>
        <p className="op-sub">
          Resolução passo a passo com IA. Gabarito oficial. Questões reais de ITA, EMBRAER, FUVEST e muito mais.
        </p>
        <div className="op-stats">
          {STATS.map(s => (
            <div key={s.l}>
              <div className="op-stat-n">{s.n}</div>
              <div className="op-stat-l">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="op-modules">
          {MODULOS.map(m => (
            <div key={m.href} className="op-module" onClick={() => router.push(m.href)}>
              <div className="op-module-icon">{m.emoji}</div>
              <div className="op-module-name">{m.label}</div>
              <div className="op-module-desc">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="op-content">
        <div className="op-search">
          <span className="op-search-icon">⌕</span>
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar vestibular... ex: ITA, FUVEST, EMBRAER"
          />
        </div>

        {filtrados.map(g => {
          const cor = COR_GRUPO[g.id] || '#888'
          const pilBg = cor + '18'
          const pilColor = cor
          const aberto = grupoAberto === g.id || busca !== ''
          return (
            <div key={g.id} className="op-group">
              <button
                onClick={() => setGrupoAberto(aberto && busca === '' ? null : g.id)}
                style={{
                  display:'flex', alignItems:'center', gap:10, width:'100%',
                  background: aberto ? cor+'12' : 'white',
                  border: `1px solid ${aberto ? cor : '#EAEBEC'}`,
                  borderRadius:12, padding:'10px 16px', cursor:'pointer',
                  transition:'all 0.15s', marginBottom: aberto ? 10 : 4,
                  fontFamily:'inherit'
                }}>
                <div style={{width:8,height:8,borderRadius:'50%',background:cor,flexShrink:0}} />
                <span style={{fontSize:13,fontWeight:600,color: aberto ? cor : '#6B7280',flex:1,textAlign:'left'}}>
                  {g.nome}
                </span>
                <span style={{fontSize:12,color:'#C4C9D4'}}>{g.instituicoes.length}</span>
                <span style={{fontSize:12,color: aberto ? cor : '#C4C9D4',transition:'transform 0.15s',display:'inline-block',transform: aberto ? 'rotate(90deg)' : 'rotate(0deg)'}}>›</span>
              </button>
              {aberto && (
                <div className="op-inst-grid">
                  {g.instituicoes.map((inst, i) => (
                    <div key={i} className="op-inst-card"
                      onClick={() => router.push('/questoes')}>
                      <div className="op-inst-sigla" style={{color: cor}}>
                        {inst.sigla}
                        {inst.fases === 2 && <span className="op-fases">2 fases</span>}
                      </div>
                      <div className="op-inst-nome">{inst.nome}</div>
                      <div className="op-inst-pills">
                        {inst.discs.slice(0,3).map((d,di) => (
                          <span key={di} className="op-inst-pill"
                            style={{background: pilBg, color: pilColor}}>
                            {d}
                          </span>
                        ))}
                        {inst.discs.length > 3 && (
                          <span className="op-inst-pill" style={{background:'#F3F4F6', color:'#9CA3AF'}}>
                            +{inst.discs.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
