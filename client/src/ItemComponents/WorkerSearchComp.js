import React from 'react';

import WorkerSearchMod1 from '../Modules/Worker/WorkerSearchMod1';
import WorkerSearchMod2 from '../Modules/Worker/WorkerSearchMod2';

const WorkerSearchComp = () => {
    return (
        <div className="container my-4">
            <h2 className="text-center mb-4 fw-bold">BÚSQUEDA POR TRABAJADOR</h2>
            <WorkerSearchMod1 />
            <hr />
            <WorkerSearchMod2 />
        </div>
    );
};

export default WorkerSearchComp;
