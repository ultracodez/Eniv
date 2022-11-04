import { Center } from "@mantine/core";
import { useEffect, useRef } from "react";
import useElementOnScreen, {defaultOptions as defaultIoOptions }from "./useElementOnScreen";



export default function VideoPlayOnVisible({id}:{id:any}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isOnScreen = useElementOnScreen(defaultIoOptions,containerRef);

    useEffect(()=>{
        if(isOnScreen) //containerRef.current?.scrollIntoView({behavior:"smooth",block: "end", inline: "nearest"});
        {
            if(containerRef !== undefined) {
                const eleY = (containerRef && containerRef?.current?.getBoundingClientRect()?.top) ;
                if(eleY) {
                    const y = eleY + window.scrollY;
                    window.scroll({
                    top: y,
                    behavior: 'smooth'
                });
                }
            }
        }
    },[isOnScreen])

    return <Center><div style={{height:"90vh", width:"50%",background:isOnScreen? "red" : "green", border:"medium dashed green"}} ref={containerRef}>{id}</div></Center>
}