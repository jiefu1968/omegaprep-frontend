'use client'
import { useState, useRef } from 'react'
import { GRUPOS, CORES } from '../data/vestibulares'
import { useRouter } from 'next/navigation'
import MarkdownResposta from '@/components/MarkdownResposta'

const API = "https://omegaprep-backend-production.up.railway.app";

const ASSUNTOS = {
  'Matemática':  ['Álgebra','Funções','Trigonometria','Geometria Plana','Geometria Espacial','Geometria Analítica','Logaritmos','Progressões','Combinatória','Probabilidade','Estatística','Matrizes','Números Complexos'],
  'Física':      ['Cinemática','Dinâmica','Energia e Trabalho','Gravitação','Hidrostática','Termodinâmica','Ondas','Óptica','Eletrostática','Eletrodinâmica','Eletromagnetismo','Física Moderna'],
  'Química':     ['Estrutura Atômica','Tabela Periódica','Ligações Químicas','Funções Inorgânicas','Reações Químicas','Estequiometria','Soluções','Eletroquímica','Termoquímica','Cinética','Equilíbrio','Química Orgânica'],
  'Biologia':    ['Citologia','Genética Mendeliana','Genética Molecular','Evolução','Ecologia','Botânica','Zoologia','Fisiologia Humana'],
  'História':    ['Brasil Colonial','Brasil Império','República Velha','Era Vargas','Ditadura Militar','Redemocratização','Guerras Mundiais','Guerra Fria'],
  'Geografia':   ['Cartografia','Climatologia','Geomorfologia','Hidrografia','Biomas','Geopolítica','Urbanização','Meio Ambiente'],
  'Português':   ['Interpretação de Texto','Gramática','Morfologia','Sintaxe','Literatura Brasileira','Literatura Portuguesa','Figuras de Linguagem'],
  'Inglês':      ['Interpretação de Texto','Gramática','Vocabulário','Tempos Verbais','Modal Verbs'],
  'Redação':     ['Dissertação Argumentativa','Estrutura do Texto','Tese e Argumentos','Proposta de Intervenção'],
}

export default function Revisao() {
  const router = useRouter()
  const [inst, setInst] = useState(null)
  const [disc, setDisc] = useState(null)
  const [assunto, setAssunto] = useState(null)
  const [profund, setProfund] = useState('completa')
  const [resposta, setResposta] = useState('')
  const [loading, setLoading] = useState(false)
  const textoRef = useRef('')

  const assuntos = disc ? (ASSUNTOS[disc] || []) : []

  async function revisar() {
    if (!inst || !disc) return
    setLoading(true)
    setResposta('')
    textoRef.current = ''

    const pergunta = assunto
      ? `Revisão completa de ${assunto} em ${disc} para ${inst.sigla}. Profundidade: ${profund}.`
      : `Revisão geral de ${disc} para ${inst.sigla}. Profundidade: ${profund}.`

    try {
      const res = await fetch(`${API}/questoes/agente/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modo: 'revisao',
          pergunta,
          escola: inst.sigla,
          disciplina: disc.toLowerCase(),
          nivel: 'medio',
          quantidade: 5,
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
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Revisão</h1>
        <p className="text-sm text-gray-500 mb-6">Teoria completa com fórmulas, exemplos e dicas de prova</p>

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
                          onClick={() => { setInst(i); setDisc(null); setAssunto(null); setResposta(''); textoRef.current = '' }}
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
                  <button key={d} onClick={() => { setDisc(d); setAssunto(null) }}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition
                      ${disc === d ? 'bg-gray-800 text-white border-gray-800' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {disc && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Assunto</label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setAssunto(null)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition
                    ${!assunto ? 'bg-gray-800 text-white border-gray-800' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                  Revisão geral
                </button>
                {assuntos.map(a => (
                  <button key={a} onClick={() => setAssunto(a)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition
                      ${assunto === a ? 'bg-gray-800 text-white border-gray-800' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}

          {disc && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Profundidade</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {id:'resumida', label:'Resumida', desc:'Pontos principais'},
                  {id:'completa', label:'Completa', desc:'Teoria + exemplos'},
                  {id:'avancada', label:'Avançada', desc:'Tudo + questões'},
                ].map(p => (
                  <button key={p.id} onClick={() => setProfund(p.id)}
                    className={`p-3 rounded-xl border text-left transition
                      ${profund === p.id ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                    <div className={`text-xs font-medium mb-0.5 ${profund === p.id ? 'text-white' : 'text-gray-700'}`}>{p.label}</div>
                    <div className={`text-xs ${profund === p.id ? 'text-purple-200' : 'text-gray-400'}`}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {inst && disc && (
            <button onClick={revisar} disabled={loading}
              className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium text-sm hover:bg-purple-700 disabled:opacity-40 transition">
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="animate-pulse">●</span> Gerando revisão...</span>
                : `Gerar revisão — ${inst.sigla} · ${disc}${assunto ? ` · ${assunto}` : ''}`}
            </button>
          )}
        </div>

        {resposta && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-medium text-purple-700">AI</div>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Revisão · {inst?.sigla} · {disc}{assunto ? ` · ${assunto}` : ''}</span>
              {loading && <span className="animate-pulse text-purple-400 text-xs">● gerando...</span>}
            </div>
            <MarkdownResposta texto={resposta} loading={loading} />
          </div>
        )}
      </div>
    </main>
  )
}
