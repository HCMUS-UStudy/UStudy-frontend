// import { createContext, useContext} from "react";

// interface SliderContextProps {
//     nextStep: () => void;
//     prevStep: () => void;
//     maxPage: number;
//     curr: number;
// }

// export const SliderContext = createContext<SliderContextProps | null>(null);

// export const useSliderContext = () => {
//     const context = useContext(SliderContext);
//     if(!context) {
//         throw new Error('SliderContext used incorrectly');
//     }
//     return context;
// }