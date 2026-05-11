'use client'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

const API = "https://omegaprep-backend-production.up.railway.app";

function renderizarComSVG(texto) {
  if (!texto) return []
  const partes = []
  const regex = /<svg[\s\S]*?<\/svg>/gi
  let ultimo = 0
  let match
  let i = 0
  while ((match = regex.exec(texto)) !== null) {
    if (match.index > ultimo) {
      partes.push({ tipo: 'texto', conteudo: texto.slice(ultimo, match.index), key: i++ })
    }
    partes.push({ tipo: 'svg', conteudo: match[0], key: i++ })
    ultimo = match.index + match[0].length
  }
  if (ultimo < texto.length) {
    partes.push({ tipo: 'texto', conteudo: texto.slice(ultimo), key: i++ })
  }
  return partes
}

function renderizarComImagens(texto) {
  if (!texto) return []
  const partes = []
  const regex = /\[IMAGEM:([^\]]+)\]/g
  let ultimo = 0
  let match
  let i = 0
  while ((match = regex.exec(texto)) !== null) {
    if (match.index > ultimo) {
      partes.push({ tipo: 'texto', conteudo: texto.slice(ultimo, match.index), key: i++ })
    }
    partes.push({ tipo: 'imagem', src: match[1].trim(), key: i++ })
    ultimo = match.index + match[0].length
  }
  if (ultimo < texto.length) {
    partes.push({ tipo: 'texto', conteudo: texto.slice(ultimo), key: i++ })
  }
  return partes
}

function limpar(texto) {
  if (!texto) return ''
  // Protege R$ de ser interpretado como LaTeX
  texto = texto.replace(/R\$/g, 'R\\$')
  return texto
    .replace(/\\\[([^]*?)\\\]/g, (_, formula) => `$$${formula}$$`)
    .replace(/\\\(([^]*?)\\\)/g, (_, formula) => `$${formula}$`)
    .replace(/^\s*\[\s*\n?([\s\S]*?)\n?\s*\]\s*$/gm, (_, formula) => `$$${formula}$$`)
    .replace(/\\checkmark/g, '✓')
    .replace(/\\boxed\{([^}]+)\}/g, '$1')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\quad/g, ' ')
    .replace(/\\tau/g, 'τ')
    .replace(/([^\n])\n(#{1,3} )/g, '$1\n\n$2')
    .replace(/(#{1,3} [^\n]+)\n([^\n#])/g, '$1\n\n$2')
    .replace(/([^\n])\n(\*\*Passo)/g, '$1\n\n$2')
}

const mdComponents = {
  h1: ({children}) => (
    <h1 style={{fontSize:'16px',fontWeight:'700',color:'#1d4ed8',padding:'10px 14px',background:'#eff6ff',borderRadius:'8px',borderLeft:'4px solid #3b82f6',margin:'28px 0 14px'}}>
      {children}
    </h1>
  ),
  h2: ({children}) => (
    <h2 style={{fontSize:'15px',fontWeight:'700',color:'#1d4ed8',padding:'10px 14px',background:'#eff6ff',borderRadius:'8px',borderLeft:'4px solid #3b82f6',margin:'24px 0 12px'}}>
      {children}
    </h2>
  ),
  h3: ({children}) => (
    <h3 style={{fontSize:'14px',fontWeight:'700',color:'#374151',margin:'18px 0 8px',paddingLeft:'10px',borderLeft:'3px solid #d1d5db'}}>
      {children}
    </h3>
  ),
  p: ({children}) => (
    <p style={{margin:'0 0 16px',lineHeight:'1.9',color:'#374151',fontSize:'15px'}}>
      {children}
    </p>
  ),
  strong: ({children}) => (
    <strong style={{fontWeight:'700',color:'#111827'}}>{children}</strong>
  ),
  ul: ({children}) => (
    <ul style={{margin:'0 0 16px',paddingLeft:'22px',listStyle:'disc'}}>{children}</ul>
  ),
  ol: ({children}) => (
    <ol style={{margin:'0 0 16px',paddingLeft:'22px',listStyle:'decimal'}}>{children}</ol>
  ),
  li: ({children}) => (
    <li style={{margin:'6px 0',lineHeight:'1.8',color:'#374151'}}>{children}</li>
  ),
  hr: () => (
    <hr style={{border:'none',borderTop:'2px solid #e5e7eb',margin:'24px 0'}}/>
  ),
  table: ({children}) => (
    <div style={{overflowX:'auto',margin:'16px 0'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:'14px'}}>
        {children}
      </table>
    </div>
  ),
  th: ({children}) => (
    <th style={{background:'#f8fafc',border:'1px solid #e2e8f0',padding:'8px 12px',textAlign:'left',fontWeight:'600',color:'#374151'}}>
      {children}
    </th>
  ),
  td: ({children}) => (
    <td style={{border:'1px solid #e2e8f0',padding:'8px 12px',color:'#374151',lineHeight:'1.6'}}>
      {children}
    </td>
  ),
  code: ({inline, children}) => inline
    ? <code style={{background:'#f3f4f6',color:'#7c3aed',padding:'2px 6px',borderRadius:'4px',fontSize:'13px'}}>{children}</code>
    : <pre style={{background:'#1e293b',color:'#e2e8f0',padding:'16px',borderRadius:'10px',overflow:'auto',fontSize:'13px',margin:'12px 0'}}><code>{children}</code></pre>,
}

export default function MarkdownResposta({ texto, loading }) {
  if (!texto) return null
  // Primeiro detecta SVGs, depois imagens dentro de cada parte texto
  const partesComSVG = renderizarComSVG(texto)
  const partes = []
  partesComSVG.forEach((p, idx) => {
    if (p.tipo === 'svg') {
      partes.push(p)
    } else {
      renderizarComImagens(p.conteudo).forEach((sub, sidx) => {
        partes.push({...sub, key: idx * 1000 + sidx})
      })
    }
  })

  return (
    <div className="resposta">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"/>
      {partes.map(parte => {
        if (parte.tipo === 'svg') {
          return (
            <div key={parte.key} style={{margin:'20px 0',textAlign:'center',overflowX:'auto'}}
              dangerouslySetInnerHTML={{__html: parte.conteudo}}
            />
          )
        }
        if (parte.tipo === 'imagem') {
          return (
            <div key={parte.key} style={{margin:'16px 0',textAlign:'center'}}>
              <img
                src={`${API}${parte.src}`}
                alt="Imagem da questão"
                style={{maxWidth:'320px',width:'100%',borderRadius:'8px',border:'1px solid #e5e7eb',display:'block',margin:'0 auto'}}
              />
            </div>
          )
        }
        return (
          <ReactMarkdown
            key={parte.key}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[[rehypeKatex, {
              throwOnError: false,
              strict: false,
              trust: true,
              macros: {
                "\\checkmark": "\\checkmark",
                "\\R": "\\mathbb{R}",
                "\\N": "\\mathbb{N}",
                "\\Z": "\\mathbb{Z}",
              }
            }]]}
            components={mdComponents}
          >
            {limpar(parte.conteudo)}
          </ReactMarkdown>
        )
      })}
      {loading && (
        <span style={{display:'inline-block',width:'2px',height:'18px',background:'#3b82f6',animation:'blink 1s infinite'}}/>
      )}
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .katex-display{margin:20px 0!important;overflow-x:auto;text-align:center;padding:4px 0}
        .katex{font-size:1.05em}
        .resposta{font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.9;color:#374151;word-break:break-word}
      `}</style>
    </div>
  )
}
