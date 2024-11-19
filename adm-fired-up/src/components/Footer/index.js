import './index.scss'
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
    const teste = [
        { titulos: ["Unidades", "Instituição", "Redes Sociais"] },
        {
            dados: [
                "São Paulo",
                "Senac",
                {
                    info: [
                        { icone: <InstagramIcon className='icon'/>, link: "https://www.instagram.com/senacsaopaulo" },
                        { icone: <FacebookIcon className='icon'/>, link: "https://www.facebook.com/senacsaopaulo" },
                        { icone: <LinkedInIcon className='icon'/>, link: "https://www.linkedin.com/company/senac/" }
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
                    {index < 2 ? (
                        // Exibe "São Paulo" e "Senac" diretamente
                        <h2 className='info'> {teste[1].dados[index]}</h2>
                    ) : (
                        // Mapeia as redes sociais
                        <div className='info'>
                            {teste[1].dados[2].info.map((rede, i) => (
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

