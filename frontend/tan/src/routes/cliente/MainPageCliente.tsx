import './MainPageCliente.css';

const MainPageCliente: React.FC = () => {
    return (
        <div className="mainPageClienteContainer">
            <div id="mainPageClienteContent">
                <h1 className="titulo">Portal del Cliente</h1>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    fontSize: '24px',
                    color: '#1f2937',
                    fontWeight: '500'
                }}>
                    ✅ Esta es la MainPage del Cliente
                </div>
            </div>
        </div>
    );
};

export default MainPageCliente;

