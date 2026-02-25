import DefaultLayout from '../components/layout/DefaultLayout'
import ModalPlans from '../components/modal-plans/ModalPlans'

export const metadata = {
  title: "Vivo Fibra",
  keywords: ['Vivo Fibra', 'Internet Vivo Fibra']
}

export default function Home() {
  return (
    <DefaultLayout>
      <ModalPlans />
    </DefaultLayout>
  )
}
