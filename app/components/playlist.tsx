import { List, SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";



const Playlist = ({ channels, setSelectedVideo } : { channels: any[], setSelectedVideo: (video: any) => void }) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [filtered, setFiltered] = useState(channels);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, video: any) => {
        setSelectedVideo(video);
        e.preventDefault();
    };

    const handleTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
        setSearchQuery((e.target as HTMLInputElement).value);
        setFiltered(channels.filter(video => video.title.toLowerCase().includes(searchTerm.toLowerCase())));
    }

    useEffect(() => {
        const apiUrl = `/api/videos?q=${searchQuery}`; 

        fetch(apiUrl)
            .then(response => {
                // FIX 2: Check if the response is ok
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // FIX 3: Use .json() method, which returns a Promise
                return response.json(); 
            })
            .then(data => {
                return data.data; // This will now be your JSON object
            })
            .then(channels => {
                setFiltered(channels);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, [searchQuery]);


    return (
        <div className="max-h-full w-full shrink-0 overflow-hidden">
            <div className="px-2 py-4">
                <InputGroup>
                    <InputGroupInput className="rounded-full" onKeyDown={handleTyping} placeholder="Search..." />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton type="submit">Search</InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            </div>

            <div className="w-full max-h-[600px] overflow-y-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 hidden xl:block shadow-2xl">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2 sticky top-0 bg-black/0 backdrop-blur-xl pb-2 border-b border-white/5">
                <List size={18} /> Next Up
                </h4>
                <div className="space-y-3">
                {filtered.map((video, idx) => (
                    <a key={idx} onClick={(e) => { handleClick(e, video); }} className="flex gap-3 items-center group cursor-pointer p-2 hover:bg-white/5 rounded-xl transition-colors">
                        <div className={`w-16 h-10 rounded-lg shrink-0 relative overflow-hidden`}>
                            <div className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-black" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate group-hover:text-orange-400 transition-colors">{video.title}</p>
                            {/* <p className="text-xs text-zinc-500 truncate">{video.title}</p> */}
                        </div>
                    </a>
                ))}
                </div>
            </div>
        </div>
    )
}

export { Playlist };