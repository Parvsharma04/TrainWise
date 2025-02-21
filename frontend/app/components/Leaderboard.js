import LeaderboardItem from "./LeaderboardItem"

export default function Leaderboard() {
    const players = [
        { id: 1, name: "Alex Johnson", score: 2800, avatar: "/placeholder.svg?height=40&width=40" },
        { id: 2, name: "Sam Lee", score: 2750, avatar: "/placeholder.svg?height=40&width=40" },
        { id: 3, name: "Taylor Swift", score: 2700, avatar: "/placeholder.svg?height=40&width=40" },
        { id: 4, name: "Jamie Smith", score: 2650, avatar: "/placeholder.svg?height=40&width=40" },
        { id: 5, name: "Morgan Freeman", score: 2600, avatar: "/placeholder.svg?height=40&width=40" },
      ]
      
      
   
    return (
        <div className="p-3 m-3 outline outline-1 font-['general'] rounded bg-[#0056F1] text-white">
            <h3 className="text-xl font-['robert-medium'] text-center">Leaderboard</h3>
            <ul>
            <li className="flex justify-between mb-2">
                <div>
                <span>
                      Rank
                </span>
                <span className="ml-3">Name</span>
                </div>
                <span>Score</span>
        </li>
                {players.map(el=>{
                    return <LeaderboardItem key={el.id} rank={el.id} name={el.name} score={el.score} />
                })}
            </ul>
        </div>
    )
}