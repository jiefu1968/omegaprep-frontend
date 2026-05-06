export const GRUPOS = [
  {
    id: 'aeronautica', nome: 'Aeronáutica', cor: 'blue',
    instituicoes: [
      { sigla:'EPCAR', nome:'Prep. Cadetes do Ar', fases:1, discs:['Matemática','Português','Inglês','Redação'] },
      { sigla:'AFA',   nome:'Academia da Força Aérea', fases:1, discs:['Matemática','Física','Português','Inglês','Redação'] },
      { sigla:'ITA',   nome:'Inst. Tecnológico Aeronáutica', fases:2, discs:['Matemática','Física','Química','Português','Inglês','Redação'] },
      { sigla:'EEAr',  nome:'Especialistas de Aeronáutica', fases:1, discs:['Matemática','Física','Português','Inglês'] },
    ]
  },
  {
    id: 'exercito', nome: 'Exército', cor: 'green',
    instituicoes: [
      { sigla:'ESPCEx', nome:'Prep. Cadetes do Exército', fases:1, discs:['Matemática','Física','Química','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'IME',    nome:'Inst. Militar de Engenharia', fases:2, discs:['Matemática','Física','Química','Português','Inglês','Redação'] },
      { sigla:'ESA',    nome:'Sargento das Armas', fases:1, discs:['Matemática','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'CM',     nome:'Colégio Militar', fases:1, discs:['Matemática','Português'] },
    ]
  },
  {
    id: 'marinha', nome: 'Marinha', cor: 'teal',
    instituicoes: [
      { sigla:'CN',    nome:'Colégio Naval', fases:1, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'EN',    nome:'Escola Naval', fases:1, discs:['Matemática','Física','Português','Inglês','Redação'] },
      { sigla:'EFOMM', nome:'Of. Marinha Mercante', fases:1, discs:['Matemática','Física','Português','Inglês','Redação'] },
      { sigla:'EAM',   nome:'Aprendiz Marinheiro', fases:1, discs:['Matemática','Física','Química','Português','Inglês'] },
      { sigla:'FN',    nome:'Fuzileiros Navais', fases:1, discs:['Matemática','Português'] },
    ]
  },
  {
    id: 'federais', nome: 'Federais / ENEM', cor: 'amber',
    instituicoes: [
      { sigla:'ENEM',   nome:'Exame Nacional Ensino Médio', fases:1, discs:['Matemática','Ciências da Natureza','Linguagens','Ciências Humanas','Redação'] },
      { sigla:'UFRJ',   nome:'Univ. Federal Rio de Janeiro', fases:2, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'UERJ',   nome:'Univ. Estadual Rio de Janeiro', fases:2, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'UFMG',   nome:'Univ. Federal Minas Gerais', fases:1, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'UFRGS',  nome:'Univ. Federal Rio Grande Sul', fases:2, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'UNB',      nome:'Universidade de Brasília',      fases:2, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'UNIFESP',  nome:'Univ. Federal São Paulo',       fases:1, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
    ]
  },
  {
    id: 'estaduais', nome: 'Estaduais', cor: 'coral',
    instituicoes: [
      { sigla:'FUVEST',  nome:'USP — Fundação Universitária', fases:2, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'UNICAMP', nome:'Univ. Estadual Campinas', fases:2, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'VUNESP',  nome:'UNESP — Vunesp', fases:2, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
    ]
  },
  {
    id: 'vestibulinhos', nome: 'Vestibulinhos', cor: 'pink',
    instituicoes: [
      { sigla:'EMBRAER', nome:'Embraer — Processo Seletivo',    fases:1, discs:['Português','Matemática','Ciências Humanas','Ciências Naturais','Redação'] },
      { sigla:'ETEC',    nome:'Escola Técnica Estadual (ETEC)', fases:1, discs:['Língua Portuguesa','Matemática','Ciências Naturais','Ciências Humanas'] },
      { sigla:'IFSC',    nome:'Instituto Federal SC',           fases:1, discs:['Língua Portuguesa','Matemática','Ciências Naturais','Ciências Humanas'] },
      { sigla:'IFSP',    nome:'Instituto Federal SP',           fases:1, discs:['Português','Matemática'] },
      { sigla:'COTEL',   nome:'Col. Técnico de Lorena',         fases:1, discs:['Língua Portuguesa','Inglês','Matemática','Química','Biologia','Física','História','Geografia'] },
      { sigla:'IFRJ',    nome:'Instituto Federal RJ',           fases:1, discs:['Língua Portuguesa','Matemática','Ciências Naturais','Ciências Humanas'] },
      { sigla:'IF',      nome:'IF Geral',                       fases:1, discs:['Língua Portuguesa','Matemática','Ciências Naturais','Ciências Humanas'] },
    ]
  },
  {
    id: 'particulares', nome: 'Particulares', cor: 'purple',
    instituicoes: [
      { sigla:'PUC-RJ', nome:'PUC Rio de Janeiro', fases:1, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'PUC-SP', nome:'PUC São Paulo', fases:1, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'PUC-RS', nome:'PUC Rio Grande Sul', fases:1, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'MACK',   nome:'Universidade Mackenzie', fases:1, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'UNITAU',     nome:'Universidade de Taubaté',  fases:1, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'ANHANGUERA', nome:'Anhanguera',                 fases:1, discs:['Matemática','Português','Redação'] },
      { sigla:'UNIP',       nome:'Univ. Paulista (UNIP)',      fases:1, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'UNIVAP',     nome:'Univ. Vale do Paraíba',      fases:1, discs:['Matemática','Física','Química','Biologia','Português','Inglês','História','Geografia','Redação'] },
      { sigla:'HUMANITAS',  nome:'Humanitas',                  fases:1, discs:['Matemática','Português','Redação'] },
    ]
  },
]

export const CORES = {
  blue:   { bg:'bg-blue-50',   border:'border-blue-200',   titulo:'text-blue-800',  pill:'bg-blue-100 text-blue-800',   ativo:'bg-blue-600 text-white border-blue-600',   dot:'bg-blue-500' },
  green:  { bg:'bg-green-50',  border:'border-green-200',  titulo:'text-green-800', pill:'bg-green-100 text-green-800', ativo:'bg-green-600 text-white border-green-600',  dot:'bg-green-500' },
  teal:   { bg:'bg-teal-50',   border:'border-teal-200',   titulo:'text-teal-800',  pill:'bg-teal-100 text-teal-800',   ativo:'bg-teal-600 text-white border-teal-600',    dot:'bg-teal-500' },
  amber:  { bg:'bg-amber-50',  border:'border-amber-200',  titulo:'text-amber-800', pill:'bg-amber-100 text-amber-800', ativo:'bg-amber-600 text-white border-amber-600',  dot:'bg-amber-500' },
  coral:  { bg:'bg-orange-50', border:'border-orange-200', titulo:'text-orange-800',pill:'bg-orange-100 text-orange-800',ativo:'bg-orange-600 text-white border-orange-600',dot:'bg-orange-500' },
  purple: { bg:'bg-purple-50', border:'border-purple-200', titulo:'text-purple-800',pill:'bg-purple-100 text-purple-800',ativo:'bg-purple-600 text-white border-purple-600',dot:'bg-purple-500' },
  pink:   { bg:'bg-pink-50',   border:'border-pink-200',   titulo:'text-pink-800',  pill:'bg-pink-100 text-pink-800',   ativo:'bg-pink-600 text-white border-pink-600',   dot:'bg-pink-500' },
}
// EMBRAER adicionado
