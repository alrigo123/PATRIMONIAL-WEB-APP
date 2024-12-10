import React from "react";

import DependencySearchMod1 from "../Modules/Dependency/DependencySearchMod1";
import DependencySearchMod2 from "../Modules/Dependency/DependencySearchMod2";

const DependencySearchComp = () => {
    return (
        <div className="container my-4">
            <h2 className="text-center mb-4 fw-bold">BÚSQUEDA POR DEPENDENCIA</h2>
            <DependencySearchMod1/>
            <hr/>   
            <DependencySearchMod2/>
        </div>
    );
};

export default DependencySearchComp;
