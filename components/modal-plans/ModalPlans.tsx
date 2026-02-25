import Link from "next/link"
import { Button } from "../ui/button"
import DefaultModal from '../../components/default-modal/DefaultModal'

function Index() {
	return (
		<DefaultModal bg={true}>
			<div className="bg-white p-6 rounded-sm shadow-md text-center w-full min-w-80 max-w-140">
				<p className="py-2 font-light">Escolha seu perfil</p>
				<h1 className="text-2xl font-bold text-default-purple sm:text-3xl">Buscar planos para:</h1>

				<div className="grid grid-cols-1 my-6 gap-2 sm:gap-4 sm:grid-cols-2">
					<Button
						variant={'vivo'}
						className="text-white py-8 text-xl"
						asChild>
						<Link href={'/pf'}>
							Minha Casa
						</Link>
					</Button>

					<Button
						variant={'vivo'}
						className="text-white py-8 text-xl"
						asChild>
						<Link href={'/pj'}>
							Minha Empresa
						</Link>
					</Button>
				</div>

				<span className="opacity-50 text-sm">Selecione uma opção para continuar</span>
			</div>
		</DefaultModal>
	)
}

export default Index