export function cleanNumbers(value: string): string {
  return value.replace(/\D/g, '')
}

export function getTwoWeeksDate() {
  const today = new Date()
  const dates = []

  const weekDays = [
    '(Dom)',
    '(Seg)',
    '(Ter)',
    '(Qua)',
    '(Qui)',
    '(Sex)',
    '(Sáb)'
  ]

  for (let i = 0; i <= 15; i++) {
    const data = new Date(today);
    data.setDate(today.getDate() + i);

    if (data.getDay() !== 0) {
      const day = String(data.getDate()).padStart(2, '0')
      const month = String(data.getMonth() + 1).padStart(2, '0')
      const weekDay = weekDays[data.getDay()]

      dates.push({
        data: `${day}/${month}`,
        weekDay
      })
    }
  }

  return dates;
}

export function CPFValidator(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '')
  if (cleanCPF.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cleanCPF.charAt(9))) return false

  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cleanCPF.charAt(10))) return false

  return true
}

export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export const formatToBRL = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const addCurrentYear = (date: string) => {
  const currentYear = new Date().getFullYear()
  return `${date}/${currentYear}`
}