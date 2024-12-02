import './index.scss'
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
    const teste = [
        { titulos: ["Unidades", "Instituição", "Termos", "Redes Sociais"] },
        {
            dados: [
                "São Paulo", 
                "Senac",
                [
                    { nome: "Termos de Uso", link: "/TermoDeUso" }, 
                    { nome: "Termo de Privacidade", link: "/TermoDePrivacidade" } 
                ],
                {
                    info: [
                        { icone: <InstagramIcon className='icon' />, link: "https://www.instagram.com/senacsaopaulo" },
                        { icone: <FacebookIcon className='icon' />, link: "https://www.facebook.com/senacsaopaulo" },
                        { icone: <LinkedInIcon className='icon' />, link: "https://www.linkedin.com/company/senac/" }
                    ]
                }
            ]
        }
    ];

    return (
        <footer className='footer'>
            {teste[0].titulos.map((titulo, index) => (
                <div key={index} className='footerChildren'>
                    <h1>{titulo}</h1>
                    {index === 0 ? (
                        <h2 className='info'> {teste[1].dados[0]}</h2> 
                    ) : index === 1 ? (
                        <h2 className='info'> {teste[1].dados[1]}</h2> 
                    ) : index === 2 ? (
                        <div className='info'>
                            {teste[1].dados[2].map((termo, i) => ( 
                                <a key={i} href={termo.link} className='termoLink'>
                                    {termo.nome}
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className='info'>
                            {teste[1].dados[3].info.map((rede, i) => (
                                <a key={i} href={rede.link} target="_blank" rel="noopener noreferrer">
                                    {rede.icone}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </footer>
    );
}