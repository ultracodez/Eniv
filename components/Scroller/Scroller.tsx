import VideoPlayOnVisible from "./VideoPlayOnVisible"

export default function VideoScroller() {
    const a = [{},{},{}]
    return <div>{a.map(()=>{
        return <VideoPlayOnVisible id={"nah"}/>
    })}</div>
}