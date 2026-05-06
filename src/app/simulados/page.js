'use client'
import { useState, useRef } from 'react'
import { GRUPOS, CORES } from '../data/vestibulares'
import { useRouter } from 'next/navigation'
import MarkdownResposta from '@/components/MarkdownResposta'

const API = 'http://localhost:8000'

export default function Simulados() {
  const router = useRouter()
  const [inst, setInst] = useState(null)
  const [disc, setDisc] = useState(null)
  const [nivel, setNivel] = useState('medio')
  const [quantidade, setQuantidade] = useState(5)
  const [fase, setFase] = useState(1)
  const [resposta, setResposta] = useState('')
  const [loading, setLoading] = useState(false)
  const textoRef = useRef('')

  async function gerar() {
    if (!inst || !disc) return
    setLoading(true)
    setResposta('')
    textoRef.current = ''

    try {
      const res = await fetch(`${API}/questoes/agente/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modo: 'simulado',
          pergunta: `Gere ${quantidade} questões de ${disc} para ${inst.sigla}`,
          escola: inst.sigla,
          disciplina: disc.toLowerCase(),
          nivel,
          quantidade,
          fase,
        })
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buf = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop()
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const d = line.slice(6)
          if (d === '[DONE]') break
          if (d === '') {
            textoRef.current += '\n'
          } else {
            textoRef.current += d
          }
          setResposta(textoRef.current)
        }
      }
    } catch { setResposta('Erro ao conectar com o servidor.') }
    finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.push('/')}
          className="text-sm text-gray-400 hover:text-gray-600 mb-6">← Voltar</button>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Simulados</h1>
        <p className="text-sm text-gray-500 mb-6">Questões inéditas geradas por IA no nível exato do seu vestibular</p>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Instituição</label>
            <div className="space-y-3">
              {GRUPOS.map(g => {
                const c = CORES[g.cor]
                return (
                  <div key={g.id}>
                    <p className="text-xs text-gray-400 mb-1.5">{g.nome}</p>
                    <div className="flex flex-wrap gap-2">
                      {g.instituicoes.map(i => (
                        <button key={i.sigla}
                          onClick={() => { setInst(i); setDisc(null); setResposta(''); textoRef.current = '' }}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition
                            ${inst?.sigla === i.sigla ? c.ativo : `${c.bg} ${c.border} ${c.titulo} hover:opacity-80`}`}>
                          {i.sigla}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {inst && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Disciplina</label>
              <div className="flex flex-wrap gap-2">
                {inst.discs.map(d => (
                  <button key={d} onClick={() => setDisc(d)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition
                      ${disc === d ? 'bg-gray-800 text-white border-gray-800' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {inst && disc && (
            <>
              {inst.fases === 2 && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Fase</label>
                  <div className="flex gap-2">
                    {[1,2].map(f => (
                      <button key={f} onClick={() => setFase(f)}
                        className={`px-5 py-2 rounded-xl border text-sm font-medium transition
                          ${fase === f ? 'bg-gray-800 text-white border-gray-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                        {f}ª fase
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Nível</label>
                <div className="flex gap-2">
                  {[
                    {id:'facil', label:'Fácil', cor:'bg-green-50 border-green-200 text-green-700', ativo:'bg-green-600 text-white border-green-600'},
                    {id:'medio', label:'Médio', cor:'bg-amber-50 border-amber-200 text-amber-700', ativo:'bg-amber-500 text-white border-amber-500'},
                    {id:'dificil', label:'Difícil', cor:'bg-red-50 border-red-200 text-red-700', ativo:'bg-red-600 text-white border-red-600'},
                  ].map(n => (
                    <button key={n.id} onClick={() => setNivel(n.id)}
                      className={`flex-1 py-2 rounded-xl border text-sm font-medium transition
                        ${nivel === n.id ? n.ativo : n.cor}`}>
                      {n.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Quantidade: <span className="text-gray-800 font-semibold">{quantidade} questões</span>
                </label>
                <input type="range" min={1} max={10} step={1} value={quantidade}
                  onChange={e => setQuantidade(Number(e.target.value))}
                  className="w-full"/>
              </div>

              <button onClick={gerar} disabled={loading}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-medium text-sm hover:bg-green-700 disabled:opacity-40 transition">
                {loading
                  ? <span className="flex items-center justify-center gap-2"><span className="animate-pulse">●</span> Gerando...</span>
                  : 'Gerar simulado'}
              </button>
            </>
          )}
        </div>

        {resposta && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-700">AI</div>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Simulado · {inst?.sigla} · {disc}</span>
              {loading && <span className="animate-pulse text-green-400 text-xs">● gerando...</span>}
            </div>
            <MarkdownResposta texto={resposta} loading={loading} />
          </div>
        )}
      </div>
    </main>
  )
}
