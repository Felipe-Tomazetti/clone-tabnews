import casamentoIMG from './casamento.jpg'

function Home () {
    console.log('img', casamentoIMG)
    return <div>
        <h1>Flávia, Eu te amo mais que tudo meu amor. Se você me ama, dá uma risadinha. 😎</h1>
        <img src={casamentoIMG.src} width='850' height='600'/>
    </div>
}

export default Home;