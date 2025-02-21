export default function LeaderboardItem({rank, name, score}) {
    return (
        <li className="flex justify-between mb-2">
                <div>
                <span className="inline-flex items-center justify-center text-sm font-semibold">
                      {rank}
                </span>
                <span className="ml-3">{name}</span>
                </div>
                <span>{score}</span>
        </li>
    )
}