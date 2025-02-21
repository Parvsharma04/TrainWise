export default function LeaderboardItem({rank, name, score}) {
    return (
        <li className="flex justify-between mb-2">
                <div>
                <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-semibold rounded-full">
                      {rank}
                </span>
                <span className="ml-3">{name}</span>
                </div>
                <span>{score}</span>
        </li>
    )
}