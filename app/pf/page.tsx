import HeroTop from '../../components/hero/HeroTop'
import NormalPlans from '../../components/menu-plans/NormalPlans'
import Benefits from '../../components/benefits/Benefits'

async function Index() {
  return (
    <div>
      <HeroTop />

      <div className='container m-auto px-4'>
        <h1 className='mt-8 mb-4 text-3xl max-w-160 font-light'>Vivo Controle é o plano com valor fixo todo mês</h1>
        <p className='max-w-210 mb-12 opacity-75'>Pague sempre o mesmo valor mensal para falar muito e ter vários Giga, além de poder escolher um plano com seu app favorito incluso. Vem ser Controle!</p>

        <NormalPlans/>
      </div>

      <div className='container m-auto px-4 mb-12'>
        <div className='my-8 mt-18'>
          <p className='uppercase font-bold'>Vantagens</p>
          <h3 className='text-3xl max-w-160 font-light'>Confira todos os benefícios dos planos Vivo Controle</h3>
        </div>

        <Benefits />
      </div>
      
    </div>
  )
}

export default Index
