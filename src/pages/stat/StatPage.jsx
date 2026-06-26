import { useEffect, useState } from 'react';
import { api, REFRESH_TIME_ASSETS } from '../utils/api'; // Importamos tu configuración y la constante de tiempo

const StatPage = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAssets = async () => {
        try {
            // Hacemos el pedido al endpoint /assets
            const response = await api.get('/assets');
            setAssets(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al traer los activos:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets(); // Primera carga

        // Configuración del intervalo de refresco (3 minutos = 180000 ms)
        const interval = setInterval(fetchAssets, REFRESH_TIME_ASSETS);

        return () => clearInterval(interval); // Limpiamos el intervalo al salir
    }, []);

    if (loading) return <p>Cargando datos del mercado...</p>;

    return (
        <div>
            <h1>Mercado de Activos</h1>
            <ul>
                {assets.map((asset) => (
                    <li key={asset.id}>
                        {asset.name}: ${asset.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StatPage;