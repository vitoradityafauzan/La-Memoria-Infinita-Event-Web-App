import { ReactNode } from "react";

interface ILandingWrapProps {
    children: ReactNode 
    additional?: string;
}

export const LandingWrap: React.FC<ILandingWrapProps> = ({children, additional}) => {
    return (
        <div className={`flex flex-col ${additional}`}>
            {children}
        </div>
    )
}