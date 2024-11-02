import { useTheme } from "next-themes";
import Image from "next/image"

export const SideBarLogo=()=>
{ 
    return <Image width={35} alt="" className="w-12 mx-3.5 min-h-fit" height={35} src='/DZ-logos_black.png'/>
}