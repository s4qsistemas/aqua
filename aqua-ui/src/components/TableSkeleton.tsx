export const TableSkeleton = () => {
    // Generamos 4 filas falsas para rellenar la pantalla
    const skeletonRows = [1, 2, 3, 4];

    return (
        <>
            {skeletonRows.map((row) => (
                <tr key={row} className="animate-pulse border-b border-gray-100 last:border-0">
                    {/* Columna: Nombre Comunidad */}
                    <td className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2 mt-2"></div>
                    </td>
                    {/* Columna: Estado */}
                    <td className="p-4">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    </td>
                    {/* Columna: Plan */}
                    <td className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    {/* Columna: Fecha */}
                    <td className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    {/* Columna: Acciones */}
                    <td className="p-4">
                        <div className="flex gap-3">
                            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
};