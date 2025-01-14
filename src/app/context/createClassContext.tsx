import React, { createContext, useContext } from "react";

interface CreateClassContextProps {
    name: string;
    grade: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    setGrade: React.Dispatch<React.SetStateAction<string>>;
}

const CreateClassContext = createContext<CreateClassContextProps | undefined>(undefined);

const useCreateClassContext = () => {
    const context = useContext(CreateClassContext);
    if(!context) {
        throw new Error('createClassContext must be used within CreateClassProvider')
    }
    return context;
}

export const CreateClassProvider = ({children}: {children: React.ReactNode}) => {
    return (
        <CreateClassProvider>
            {children}
        </CreateClassProvider>
    )
}

