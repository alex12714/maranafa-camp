const staffMembers = [
  {
    name: "Alex Podbrezsky",
    role: "Директор",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alex_director_avatar-VgNA4wgtoNjzTpreidBqBHD22tiQc6.webp",
  },
  { name: "Abels Griņuks", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Agita Grinyk", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Aleksandr Gubko", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Aleksandra Butanova", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Aleksandra Mirecka", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Alex Polupanov",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alex-polupanov.jpg-rz2mgaBgAI4NISG5cMCz8M22w7cBgW.jpeg",
  },
  { name: "Alina Machneva", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Amelia Yoc",
    role: "Сотрудник",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/amelia-yoc.jpg-ZRfoKqaOONREPvJwzTkYZ98366yXgG.jpeg",
  },
  {
    name: "Anastasija Valdmane",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anastasija-valdmane.jpg-vbhbd2VVCNgiq7QwFOZNS0Mx0nqUxu.jpeg",
  },
  { name: "Anna Lendele", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Anna Solyanik", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Darja Koreshuk",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/darja-koreshuk.jpg-hd3K24KZDKH4acfP4IxT3dCSLQdKnL.jpeg",
  },
  { name: "Dasha Koreshuk", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Denis Samchuk", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Deniss Snetkovs", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Edgar Kalnins", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Elena Golubeva", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Elisabeth Kalnicka", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Estere Ozolina",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/estere-ozolina.jpg-HFl4S9axhVAIdf4V7uVADnzqNcgbPv.jpeg",
  },
  {
    name: "Fedor Kalninsh",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fjodor-kalnins.jpg-bDJklMkfN2oc2FbvLt7CECyLQdYmxa.jpeg",
  },
  { name: "Florint Yunac", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Ginta Vanaga",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ginta-vanaga.jpg-HASCzKtlsyzixGuiQG4AYNUBzRYoio.jpeg",
  },
  {
    name: "Ilona Drobilenko",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ilona-drobilenko.jpg-rKpQtIedmpB44HIRCHk8nG9fQkE4Tq.jpeg",
  },
  { name: "Inga Lokšinska", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Ineta Mozeiko",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ineta-mozeiko.jpg-lOnJ8SMxfElzcPc0GAir7YHF6jX4sj.jpeg",
  },
  { name: "Irina Novik", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Irina Yoc",
    role: "Сотрудник",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/irina-yoc.jpg-YF0yOqxQhl1dFhfvh4TFGS1ggPebPC.jpeg",
  },
  {
    name: "Jana Silina",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jana-silina.jpg-uS5qsI6HNSIjEtoSrmHolWUyHPctSk.jpeg",
  },
  {
    name: "Jelena Gubko",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jelena-gubko.jpg-pE7joQXVYoxZjgByXEUGpOVadJgC06.jpeg",
  },
  { name: "John Kubilus", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Julia Mitjukova", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Julia Stangelini", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Kamila Januskeviciuene", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Kate Podbrezska",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kate-podbrezska.jpg-PhdxOx2euqfYK5x8Ogv7vwskHAp6S4.jpeg",
  },
  {
    name: "Larisa Juganova",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/larisa-juganova.jpg-JgVEH8rZVHQL3HSsCRgxHroBDDs0sC.jpeg",
  },
  {
    name: "Lilija Meshanova (Jr)",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lilja-meshanova.jpg-P6XI2AonCUUlWRk2Uu0QxaNhqPz8zS.jpeg",
  },
  { name: "Linas Januskevicius", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Lubovj Timonirova",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ljubovj-tihomirova.jpg-uS6p6gsasTMzVrI4vetqOzt9sqpEwW.jpeg",
  },
  {
    name: "Marije Ozolina",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/marite-ozolina.jpg-CGvYBakRzfVEhmV6sSgkIVdbbpsYpf.jpeg",
  },
  {
    name: "Mira Selukanjeva",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mira-sejtkalijeva.jpg-AgK8fbhg1Xi3El3TvUUqwdWBo2ZlKY.jpeg",
  },
  { name: "Nikolaj Yoc", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Oleg Drobilenko",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/oleg-drobilenko.jpg-gf0HbMgZjIQonsIzHl9wruxOecuaRC.jpeg",
  },
  { name: "Oleg Mihailov", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Olga Klochko",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/olga-klochko.jpg-6ngd3y6ek4kAA5bxMi5xhKUXOKlfQs.jpeg",
  },
  {
    name: "Roman Locans",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/roman-locans.jpg-Hmr5Evjyfb7NKh6AHfCmLTqdRli573.jpeg",
  },
  {
    name: "Timofei Koreshuk",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/timofei-koreshuk.jpg-eYYjKU28Zcl77F6qncYd1Jky2va2qp.jpeg",
  },
  {
    name: "Valerij Seitkaliev",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/valeri-sejtkalijev.jpg-GlX37c10NSbafAZWwXatGGnbc06Yvh.jpeg",
  },
  { name: "Valery Kazan", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  { name: "Veronika Davidova", role: "Сотрудник", image: "/placeholder.svg?height=96&width=96" },
  {
    name: "Yuri Skripnik",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/yuri-skripnik.jpg-9s8BvZxdshF16p9Q95JPJRzWlYsRRG.jpeg",
  },
  {
    name: "Alena Chumachenko",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/alena-chumachenko.jpg-4xRVTSV99iy58gMO2ghyxKQrZFILFw.jpeg",
  },
  {
    name: "Larisa Sedova",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/larisa-sedova.jpg-L6dSC9ccZFVxHbVBFyko7roHYzTtmm.jpeg",
  },
  {
    name: "Viktor Lisov",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/viktor-lisov.jpg-svOBsyv7xyAk9hepvVSFHP08IIRGtI.jpeg",
  },
  {
    name: "Ludmila Lozovska",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ludmila-lozovska.jpg-fGxkYAzUA7G211iLVp8UKkN5fhawjD.jpeg",
  },
  {
    name: "Sergej Shur",
    role: "Сотрудник",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sergej-shur.jpg-mQx073UPRHGZMtWsYj6iIKjqvAH4ru.jpeg",
  },
]

export default function StaffSection() {
  return null
}
