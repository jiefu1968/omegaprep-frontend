'use client'
import { useState, useRef } from 'react'
import { GRUPOS } from '../data/vestibulares'
import { useRouter } from 'next/navigation'
import MarkdownResposta from '@/components/MarkdownResposta'

const API = 'http://localhost:8000'
const DISCS = ['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação']

export default function GPT() {
  const router = useRouter()
  const [inst, setInst] = useState('ITA')
  const [disc, setDisc] = useState('Matemática')
  const [enunciado, setEnunciado] = useState('')
  const [imagem, setImagem] = useState(null)
  const [preview, setPreview] = useState(null)
  const [modo, setModo] = useState('texto')
  const [resposta, setResposta] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef(null)
  const textoRef = useRef('')

  function handleImagem(e) {
    const file = e.target.files[0]
    if (!file) return
    setImagem(file)
    setPreview(URL.createObjectURL(file))
  }

  function handleColar(e) {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        setImagem(file)
        setPreview(URL.createObjectURL(file))
        break
      }
    }
  }

  async function resolver() {
    if (!enunciado.trim() && !imagem) return
    setLoading(true)
    setResposta('')
    textoRef.current = ''

    try {
      const formData = new FormData()
      formData.append('escola', inst)
      formData.append('disciplina', disc)
      formData.append('enunciado', enunciado)
      if (imagem) formData.append('imagem', imagem)

      const res = await fetch(`${API}/questoes/resolver`, {
        method: 'POST',
        body: formData
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
          // Preserva quebras de linha — empty data = newline
          if (d === '') {
            textoRef.current += '\n'
          } else {
            textoRef.current += d
          }
          setResposta(textoRef.current)
        }
      }
    } catch (e) {
      setResposta('Erro ao conectar com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.push('/')}
          className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1">
          ← Voltar
        </button>
        <h1 className="text-xl font-semibold text-gray-900 mb-1">OmegaPrep GPT</h1>
        <p className="text-sm text-gray-500 mb-6">Tutor com IA — cole questões com texto ou imagem</p>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Vestibular</label>
              <select value={inst} onChange={e => setInst(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
                {GRUPOS.flatMap(g => g.instituicoes.map(i => (
                  <option key={i.sigla} value={i.sigla}>{i.sigla} — {i.nome}</option>
                )))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Disciplina</label>
              <select value={disc} onChange={e => setDisc(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400">
                {DISCS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            {[
              {id:'texto', label:'Só texto', icon:'✏️'},
              {id:'imagem', label:'Foto da questão', icon:'📷'},
              {id:'misto', label:'Texto + foto', icon:'📝'},
            ].map(m => (
              <button key={m.id} onClick={() => setModo(m.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-medium transition
                  ${modo === m.id ? 'bg-teal-600 text-white border-teal-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                <span style={{fontSize:13}}>{m.icon}</span> {m.label}
              </button>
            ))}
          </div>

          {(modo === 'texto' || modo === 'misto') && (
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Enunciado ou dúvida</label>
              <textarea rows={5} value={enunciado}
                onChange={e => setEnunciado(e.target.value)}
                onPaste={handleColar}
                placeholder="Digite ou cole o enunciado aqui... Você também pode colar uma imagem (Cmd+V)"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-gray-400 leading-relaxed"/>
            </div>
          )}

          {(modo === 'imagem' || modo === 'misto') && (
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">Imagem da questão</label>
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Questão"
                    className="w-full rounded-xl border border-gray-200 object-contain max-h-80"/>
                  <button onClick={() => { setImagem(null); setPreview(null) }}
                    className="absolute top-2 right-2 bg-white border border-gray-200 rounded-full w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 text-xs">
                    ✕
                  </button>
                </div>
              ) : (
                <div onClick={() => fileRef.current?.click()} onPaste={handleColar}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition">
                  <div className="text-3xl mb-2">📷</div>
                  <p className="text-sm text-gray-500 mb-1">Clique para escolher uma foto</p>
                  <p className="text-xs text-gray-400">ou cole com Cmd+V</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImagem} className="hidden"/>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={resolver}
              disabled={loading || (!enunciado.trim() && !imagem)}
              className="flex-1 py-3 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 disabled:opacity-40 transition">
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="animate-pulse">●</span> Resolvendo...</span>
                : 'Resolver com explicação didática'}
            </button>
            {(enunciado || imagem || resposta) && (
              <button onClick={() => { setEnunciado(''); setImagem(null); setPreview(null); setResposta(''); textoRef.current = '' }}
                className="px-4 py-3 bg-gray-100 text-gray-500 rounded-xl text-sm hover:bg-gray-200 transition">
                Limpar
              </button>
            )}
          </div>
        </div>

        {resposta && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-xs font-medium text-teal-700">AI</div>
              <span className="text-xs text-gray-400 uppercase tracking-wide">OmegaPrep GPT · {inst} · {disc}</span>
              {loading && <span className="animate-pulse text-teal-400 text-xs">● resolvendo...</span>}
            </div>
            <MarkdownResposta texto={resposta} loading={loading} />
          </div>
        )}
      </div>
    </main>
  )
}
